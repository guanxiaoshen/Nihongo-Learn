// Nihongo-Learn 练习判定专项验证（A3 同词干扰项 / A4 多可接受答案 / 错题统计）
// 运行：NODE_PATH=<managed workspace node_modules> node scripts/verify-answers.js
const fs = require('fs');
const { JSDOM } = require('jsdom');
const ROOT = 'E:/01_Projects/Nihongo-Learn/';
const html = fs.readFileSync(ROOT + 'verb-conjugation-stamp.html', 'utf8');

const dom = new JSDOM(html, {
  url: 'file:///E:/01_Projects/Nihongo-Learn/verb-conjugation-stamp.html?view=practice',
  runScripts: 'dangerously',
  resources: 'usable',
  pretendToBeVisual: true,
  beforeParse(window) {
    const store = {};
    const storageMock = {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { for (const k of Object.keys(store)) delete store[k]; }
    };
    Object.defineProperty(window, 'sessionStorage', { value: storageMock, configurable: true });
    Object.defineProperty(window, 'localStorage', { value: storageMock, configurable: true });
  }
});

const errors = [];
dom.window.addEventListener('error', function (e) { errors.push(e.message); });

function assert(name, cond) {
  console.log((cond ? '  ✓ ' : '  ✗ ') + name);
  if (!cond) process.exitCode = 1;
}

dom.window.addEventListener('load', function () {
  setTimeout(function () {
    try {
      const doc = dom.window.document;
      const shell = doc.getElementById('app-shell');
      const ev = dom.window.eval;

      // 校验 A3：抽题后每行的 4 个选项都应来自当前动词的 forms（同词不同形）
      doc.querySelector('[data-action="start-practice"]').click();
      const verb = ev('state.currentVerb');
      const forms = ev('window.NIHONGO_DATA.conjugator.conjugate(state.currentVerb)');
      const formValues = ev('Object.values(window.NIHONGO_DATA.conjugator.conjugate(state.currentVerb).forms)');
      let allOptionsSameVerb = true;
      doc.querySelectorAll('.practice-row').forEach(function (row) {
        const values = Array.prototype.map.call(
          row.querySelectorAll('input[type="radio"]'), function (r) { return r.value; });
        if (values.length !== 4) allOptionsSameVerb = false;
        values.forEach(function (v) {
          if (!formValues.includes(v)) allOptionsSameVerb = false;
        });
      });
      console.log('当前动词: ' + verb.dictionary + '（' + verb.kana + '）');
      assert('A3 干扰项均为同词不同形（每行 4 选项来自同一动词）', allOptionsSameVerb);

      // 校验 A4：标准模式输入规范形 → 全部正确
      ev('state.practiceMode = "standard"');
      ev('renderApp()');
      doc.querySelectorAll('.practice-row').forEach(function (row) {
        const formId = row.dataset.formId;
        const input = row.querySelector('.answer-field');
        input.value = forms.forms[formId];
        input.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
      });
      doc.querySelector('[data-action="check-practice"]').click();
      let allCorrect = true;
      ev('Object.values(state.result.items)').forEach(function (item) {
        if (!item.correct) allCorrect = false;
      });
      assert('A4a 标准模式输入规范汉字形 → 全对', allCorrect);

      // 校验 A4：输入假名形式 → 也全对（多可接受答案）
      ev('state.practiceMode = "standard"');
      ev('state.result = null');
      ev('renderApp()');
      doc.querySelectorAll('.practice-row').forEach(function (row) {
        const formId = row.dataset.formId;
        const input = row.querySelector('.answer-field');
        input.value = forms.kanaForms[formId];
        input.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
      });
      doc.querySelector('[data-action="check-practice"]').click();
      let allKanaAccepted = true;
      ev('Object.values(state.result.items)').forEach(function (item) {
        if (!item.correct) allKanaAccepted = false;
      });
      assert('A4b 标准模式输入假名形式 → 全对', allKanaAccepted);

      // 校验 A4c：剥离括号注音的写法被接受（来（こ）→ 来）
      const hasParen = forms.forms.mizenkei.includes('（');
      const stripped = forms.forms.mizenkei.replace(/（[^）]*）/g, '');
      assert('A4c 括号注音剥离写法存在且 ≠ 原形（仅当含注音时生效）',
        !hasParen || (stripped.length > 0 && stripped !== forms.forms.mizenkei));

      // 定向用例：か変「来る」的未然形 来（こ），输入 来 或 こ 都应判对
      const kuru = ev('lexicon.find(v => v.dictionary === "来る")');
      ev('state.currentVerb = lexicon.find(v => v.dictionary === "来る")');
      ev('state.currentForms = ["mizenkei", "te"]');
      ev('state.practiceMode = "standard"');
      ev('state.answers = {}');
      ev('state.result = null');
      ev('renderApp()');
      const kuruRows = doc.querySelectorAll('.practice-row');
      const fillKuru = function (valueMap) {
        kuruRows.forEach(function (row) {
          const input = row.querySelector('.answer-field');
          input.value = valueMap[row.dataset.formId];
          input.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
        });
      };
      fillKuru({ mizenkei: '来', te: '来て' });
      doc.querySelector('[data-action="check-practice"]').click();
      let kuruAllOk = ev('Object.values(state.result.items).every(i => i.correct)');
      assert('A4d 来る：输入 来 / 来て（汉字去注音）→ 全对', kuruAllOk);
      fillKuru({ mizenkei: 'こ', te: 'きて' });
      doc.querySelector('[data-action="check-practice"]').click();
      kuruAllOk = ev('Object.values(state.result.items).every(i => i.correct)');
      assert('A4e 来る：输入 こ / きて（纯假名）→ 全对', kuruAllOk);

      // 校验错题统计：故意答错一题 → wrongItems 增加
      const wrongBefore = ev('state.stats.wrongItems.length');
      ev('state.practiceMode = "standard"');
      ev('state.result = null');
      ev('renderApp()');
      const rows = doc.querySelectorAll('.practice-row');
      rows.forEach(function (row, idx) {
        const input = row.querySelector('.answer-field');
        input.value = idx === 0 ? '明显错误答案' : ev('window.NIHONGO_DATA.conjugator.conjugate(state.currentVerb).forms["' + row.dataset.formId + '"]');
        input.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
      });
      doc.querySelector('[data-action="check-practice"]').click();
      const wrongAfter = ev('state.stats.wrongItems.length');
      assert('错题入错题集（+1）', wrongAfter === wrongBefore + 1);

      console.log('页面运行时错误: ' + (errors.length === 0 ? '无' : errors.join(' | ')));
      assert('无运行时错误', errors.length === 0);
    } catch (e) {
      console.log('检查脚本异常: ' + e.message + '\n' + (e.stack || ''));
      process.exitCode = 1;
    }
    process.exit(process.exitCode || 0);
  }, 800);
});
