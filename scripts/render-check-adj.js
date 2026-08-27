// 形容词/名词模块渲染回归（jsdom）—— 规则 + 练习全流程
// 运行：NODE_PATH=<managed workspace node_modules> node scripts/render-check-adj.js
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { JSDOM } = require('jsdom');
const ROOT = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'adj-noun-stamp.html'), 'utf8');

const dom = new JSDOM(html, {
  url: pathToFileURL(path.join(ROOT, 'adj-noun-stamp.html')).href + '?view=rules',
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
dom.window.addEventListener('error', function (e) { errors.push('页面错误: ' + e.message); });
const origError = dom.window.console.error;
dom.window.console.error = function () {
  errors.push('console.error: ' + Array.prototype.slice.call(arguments).join(' '));
  origError.apply(dom.window.console, arguments);
};

function assert(name, cond) {
  console.log((cond ? '  ✓ ' : '  ✗ ') + name);
  if (!cond) process.exitCode = 1;
}

dom.window.addEventListener('load', function () {
  setTimeout(function () {
    try {
      const doc = dom.window.document;
      const shell = doc.getElementById('app-shell');

      console.log('--- 规则视图 ---');
      assert('规则表格存在', shell.innerHTML.includes('rule-table'));
      assert('3 类词列', ['い形容词', 'な形容词', '名词'].every(function (s) { return shell.innerHTML.includes(s); }));
      assert('规则卡片 6形×3类=18 张', doc.querySelectorAll('.rule-card').length === 18);
      assert('卡片背面含 ruby 注音', doc.querySelectorAll('.card-example-result ruby').length > 0);
      assert('卡片背面含分解', doc.querySelectorAll('.breakdown').length > 0);
      assert('活用形首列使用层级化标记', doc.querySelectorAll('.form-cell-content').length === 6);
      assert('活用形首列显示序号', doc.querySelector('.form-index').textContent.trim() === '01');
      assert('变形速查表存在', shell.innerHTML.includes('三类变形速查'));
      assert('变形速查表头与数据列对齐', doc.querySelectorAll('.sound-table thead th').length === 7
        && doc.querySelectorAll('.sound-table tbody tr:first-child > *').length === 7);
      assert('句中用法区存在', shell.innerHTML.includes('usage-reference'));
      assert('句中用法卡片存在', doc.querySelectorAll('.usage-card').length === 6);
      assert('无 base/derived 分组 tab', doc.querySelectorAll('.conjugation-tab').length === 0);

      assert('品牌标题 形・名詞ノート', shell.innerHTML.includes('形・名詞ノート'));

      console.log('--- 练习视图 ---');
      doc.querySelector('[data-view="practice"]').click();
      assert('词类筛选 chips ×3', doc.querySelectorAll('.type-chip[data-action="toggle-practice-type"]').length === 3);
      assert('无形范围 chips', doc.querySelectorAll('[data-action="set-practice-scope"]').length === 0);
      assert('题数选择器存在', doc.querySelector('[data-action="set-practice-count"]') !== null);
      const countSelect = doc.querySelector('[data-action="set-practice-count"]');
      countSelect.value = "3";
      countSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
      assert('3 题选项可正确更新状态', dom.window.eval('state.practiceCount') === 3);
      doc.querySelector('[data-action="set-practice-count"]').value = "6";
      doc.querySelector('[data-action="set-practice-count"]').dispatchEvent(new dom.window.Event('change', { bubbles: true }));
      assert('恢复 6 题设置', dom.window.eval('state.practiceCount') === 6);

      console.log('--- 开始新练习 ---');
      doc.querySelector('[data-action="start-practice"]').click();
      assert('出现练习词', shell.innerHTML.includes('practice-word'));
      assert('6 题（全部活用形）', doc.querySelectorAll('.practice-row').length === 6);
      assert('简易模式有选项', doc.querySelectorAll('input[type="radio"]').length >= 6 * 4);

      console.log('--- 作答并检查 ---');
      const rows = doc.querySelectorAll('.practice-row');
      rows.forEach(function (row) {
        const first = row.querySelector('input[type="radio"]');
        first.checked = true;
        first.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
      });
      doc.querySelector('[data-action="check-practice"]').click();
      assert('结果摘要出现', shell.innerHTML.includes('result-summary'));

      console.log('--- 统计落盘 ---');
      const statsRaw = dom.window.localStorage.getItem('adj-noun-practice-stats-v1');
      const stats = statsRaw ? JSON.parse(statsRaw) : null;
      assert('adj localStorage 写入统计', !!stats && typeof stats.byForm === 'object');
      if (stats) {
        const total = Object.values(stats.byForm).reduce(function (s, x) { return s + x.t; }, 0);
        assert('统计题数 = 6', total === 6);
      }

      console.log('--- 标准模式 + ではない 等价 ---');
      doc.querySelectorAll('[data-action="set-mode"]')[1].click();
      const ev = dom.window.eval;
      const verb = ev('state.currentVerb');
      const data = ev('window.NIHONGO_DATA["adj-conjugator"].conjugate(state.currentVerb)');
      doc.querySelectorAll('.practice-row').forEach(function (row) {
        const formId = row.dataset.formId;
        const input = row.querySelector('.answer-field');
        // 否定形用 ではない 变体验证 A4 等价；其余用规范形
        input.value = (formId === 'hitei') ? data.stem.kanji + 'ではない'
          : (formId === 'kakoHitei') ? data.stem.kanji + 'ではなかった'
          : data.forms[formId];
        input.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
      });
      doc.querySelector('[data-action="check-practice"]').click();
      let allOk = ev('Object.values(state.result.items).every(i => i.correct)');
      assert('标准模式全对（含 ではない 等价写法）', allOk);

      // 校验例外词：いい 的常用肯定形式 よい
      ev('state.currentVerb = lexicon.find(v => v.dictionary === "いい")');
      ev('state.currentForms = ["kotei"]');
      ev('state.practiceMode = "standard"');
      ev('state.answers = {}');
      ev('state.result = null');
      ev('state.lastCheckedSignature = null');
      ev('renderApp()');
      const iiInput = doc.querySelector('.answer-field');
      iiInput.value = 'よい';
      iiInput.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
      doc.querySelector('[data-action="check-practice"]').click();
      assert('いい 的常用肯定形式 よい 可接受',
        ev('state.result.items.kotei.correct') === true);

      console.log('--- 渐进式练习题型 ---');
      doc.querySelector('[data-view="practice"]').click();
      doc.querySelector('[data-action="set-mode"][data-mode="simple"]').click();
      doc.querySelector('[data-action="set-practice-kind"][data-kind="mixed"]').click();
      doc.querySelector('[data-action="start-practice"]').click();
      assert('混合词条生成题目', doc.querySelectorAll('.progressive-row').length === 6);
      const mixedIds = Array.prototype.map.call(
        doc.querySelectorAll('.progressive-row'), (row) => row.dataset.questionId
      );
      assert('混合题目 ID 唯一', new Set(mixedIds).size === mixedIds.length);
      doc.querySelector('[data-action="set-practice-kind"][data-kind="sentence"]').click();
      doc.querySelector('[data-action="start-practice"]').click();
      assert('句子填空生成语境', doc.querySelectorAll('.sentence-prompt').length === 6);
      doc.querySelector('[data-action="set-practice-kind"][data-kind="classify"]').click();
      doc.querySelector('[data-action="start-practice"]').click();
      assert('词类判断生成类型选项', doc.querySelectorAll('.type-choice-grid').length === 6);
      doc.querySelector('[data-action="set-practice-kind"][data-kind="polite"]').click();
      doc.querySelector('[data-action="start-practice"]').click();
      assert('普通／礼貌体题型生成转换提示', doc.querySelectorAll('.conversion-prompt').length === 6);
      doc.querySelector('[data-action="set-mode"][data-mode="standard"]').click();
      const politeItems = ev('getPracticeItems()');
      doc.querySelectorAll('.progressive-row').forEach(function (row, index) {
        const input = row.querySelector('.answer-field');
        input.value = politeItems[index].accepted[0];
        input.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
      });
      doc.querySelector('[data-action="check-practice"]').click();
      assert('普通／礼貌体标准答案可判定',
        ev('Object.values(state.result.items).every(item => item.correct)'));

      console.log('--- 规则页回归 ---');
      doc.querySelector('[data-view="rules"]').click();
      assert('规则页可正常渲染', shell.innerHTML.includes('rule-table'));

      console.log('页面运行时错误: ' + (errors.length === 0 ? '无' : errors.join(' | ')));
      assert('无运行时错误', errors.length === 0);
    } catch (e) {
      console.log('检查脚本异常: ' + e.message + '\n' + (e.stack || ''));
      process.exitCode = 1;
    }
    process.exit(process.exitCode || 0);
  }, 800);
});
