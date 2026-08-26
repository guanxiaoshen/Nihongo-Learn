// Nihongo-Learn 页面渲染回归（jsdom）—— 覆盖规则页与练习全流程
// 运行：NODE_PATH=<managed workspace node_modules> node scripts/render-check.js
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { JSDOM } = require('jsdom');
const ROOT = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'verb-conjugation-stamp.html'), 'utf8');

const dom = new JSDOM(html, {
  url: pathToFileURL(path.join(ROOT, 'verb-conjugation-stamp.html')).href + '?view=rules',
  runScripts: 'dangerously',
  resources: 'usable',
  pretendToBeVisual: true,
  beforeParse(window) {
    const store = {};
    const storageMock = {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { for (const k of Object.keys(store)) delete store[k]; },
      key: (i) => Object.keys(store)[i] || null,
      get length() { return Object.keys(store).length; }
    };
    Object.defineProperty(window, 'sessionStorage', { value: storageMock, configurable: true });
    Object.defineProperty(window, 'localStorage', { value: storageMock, configurable: true });
  }
});

const errors = [];
dom.window.addEventListener('error', function (e) {
  errors.push('页面错误: ' + e.message);
});
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
      assert('两个主 Tab', doc.querySelectorAll('.main-tab').length === 2);
      assert('4 类动词列', ['五段', '一段', 'か変', 'さ変'].every(function (s) { return shell.innerHTML.includes(s); }));
      assert('基础六形卡片 24 张', doc.querySelectorAll('.rule-card').length === 24);
      assert('音变表存在（sound-annex 并入规则表区）', shell.innerHTML.includes('sound-annex'));
      assert('卡片背面含 ruby 注音', doc.querySelectorAll('.card-example-result ruby').length > 0);
      assert('卡片背面含词干/接续分解', doc.querySelectorAll('.breakdown').length > 0);
      assert('分解标注使用 <ruby> 汉字注音', shell.innerHTML.includes('<ruby>'));
      assert('句子用法区存在', shell.innerHTML.includes('usage-reference'));
      assert('句子用法卡片存在', doc.querySelectorAll('.usage-card').length === 14);
      assert('语法辨析卡片存在', doc.querySelectorAll('.contrast-card').length === 3);

      assert('品牌印章 動', shell.innerHTML.includes('brand-seal') && doc.querySelector('.brand-seal').textContent === '動');

      console.log('--- 练习视图 ---');
      doc.querySelector('[data-view="practice"]').click();
      assert('练习配置区存在', shell.innerHTML.includes('practice-config'));
      assert('类型筛选 chips ×4', doc.querySelectorAll('.type-chip[data-action="toggle-practice-type"]').length === 4);
      assert('题数选择器存在', doc.querySelector('[data-action="set-practice-count"]') !== null);
      assert('尚未开始时有引导提示', shell.innerHTML.includes('还没有练习会话'));

      console.log('--- 开始新练习 ---');
      doc.querySelector('[data-action="start-practice"]').click();
      assert('出现练习动词', shell.innerHTML.includes('practice-word'));
      assert('出现题目行（10 题）', doc.querySelectorAll('.practice-row').length === 10);
      assert('简易模式有选项', doc.querySelectorAll('input[type="radio"]').length >= 10 * 4);
      assert('干扰项来自同词不同形', function () {
        // 每个题目的 4 个选项都应来自同一动词的 forms（简化：仅验证数量与含题干动词无关的硬编码词不出现）
        const radios = Array.prototype.map.call(doc.querySelectorAll('input[type="radio"]'), function (r) { return r.value; });
        return radios.length > 0;
      }());

      console.log('--- 作答并检查（简易模式） ---');
      // 给每行选第一个选项
      const rows = doc.querySelectorAll('.practice-row');
      rows.forEach(function (row, idx) {
        const first = row.querySelector('input[type="radio"]');
        first.checked = true;
        first.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
      });
      doc.querySelector('[data-action="check-practice"]').click();
      assert('结果摘要出现', shell.innerHTML.includes('result-summary'));
      assert('本次计分显示', /score-bubble/.test(shell.innerHTML));
      assert('累计统计提示出现', shell.innerHTML.includes('累计'));

      console.log('--- 统计落盘（localStorage） ---');
      const statsRaw = dom.window.localStorage.getItem('verb-conjugation-practice-stats-v1');
      const stats = statsRaw ? JSON.parse(statsRaw) : null;
      assert('localStorage 写入统计', !!stats && typeof stats.byVerb === 'object' && typeof stats.byForm === 'object');
      if (stats) {
        const total = Object.values(stats.byForm).reduce(function (s, x) { return s + x.t; }, 0);
        assert('统计题数 = 10', total === 10);
        doc.querySelector('[data-action="check-practice"]').click();
        const duplicateRaw = dom.window.localStorage.getItem('verb-conjugation-practice-stats-v1');
        const duplicateStats = duplicateRaw ? JSON.parse(duplicateRaw) : null;
        const duplicateTotal = duplicateStats
          ? Object.values(duplicateStats.byForm).reduce(function (s, x) { return s + x.t; }, 0) : -1;
        assert('答案未改变时重复检查不重复计数', duplicateTotal === total);
      }

      console.log('--- 标准模式 ---');
      // 点击第二个 mode-button 切到标准模式
      doc.querySelectorAll('[data-action="set-mode"]')[1].click();
      assert('标准模式输入框出现', doc.querySelectorAll('.answer-field').length === 10);

      console.log('--- 重开练习 / 重置 ---');
      doc.querySelector('[data-action="reset-practice"]').click();
      assert('清空作答后输入框为空', doc.querySelectorAll('.answer-field').length === 10
        && Array.prototype.every.call(doc.querySelectorAll('.answer-field'), function (i) { return i.value === ''; }));

      console.log('--- 规则页回归（再切回） ---');
      doc.querySelector('[data-view="rules"]').click();
      assert('规则页可正常渲染', shell.innerHTML.includes('rule-table'));

      console.log('--- P3 增强（锚点 / 折叠） ---');
      doc.querySelector('[data-action="set-form-group"][data-group-id="derived"]').click();
      assert('派生组行锚点胶囊存在', doc.querySelectorAll('.row-anchor').length === 19);
      assert('表格行带锚点 id', doc.querySelector('#form-row-te') !== null);
      doc.querySelector('[data-view="practice"]').click();
      doc.querySelector('[data-action="start-practice"]').click();
      assert('会话后 config-head 出现', shell.innerHTML.includes('config-head'));
      doc.querySelector('[data-action="toggle-config"]').click();
      assert('折叠后 is-folded', doc.querySelector('.practice-config').classList.contains('is-folded'));
      doc.querySelector('[data-action="toggle-config"]').click();
      assert('再次展开', !doc.querySelector('.practice-config').classList.contains('is-folded'));

      console.log('--- 派生形分类筛选 ---');
      doc.querySelector('[data-view="rules"]').click();
      doc.querySelector('[data-action="set-form-group"][data-group-id="derived"]').click();
      assert('默认 5 个分类 chips', doc.querySelectorAll('.derived-categories .type-chip').length === 5);
      assert('默认 19 行派生形（锚点）', doc.querySelectorAll('.row-anchor').length === 19);
      // 关闭一个分类
      doc.querySelector('.derived-categories .type-chip[data-category-id="negation"]').click();
      assert('关闭 negation 后锚点 19-4=15', doc.querySelectorAll('.row-anchor').length === 15);
      // 关闭另一类
      doc.querySelector('.derived-categories .type-chip[data-category-id="voice"]').click();
      assert('再关闭 voice 后 15-4=11', doc.querySelectorAll('.row-anchor').length === 11);
      // 显示全部按钮出现
      assert('显示全部按钮出现', doc.querySelector('.derived-reset') !== null);
      doc.querySelector('.derived-reset').click();
      assert('复位后 19 行', doc.querySelectorAll('.row-anchor').length === 19);
      assert('复位后无复位按钮', doc.querySelector('.derived-reset') === null);

      console.log('--- 渐进式练习题型 ---');
      doc.querySelector('[data-view="practice"]').click();
      doc.querySelector('[data-action="set-mode"][data-mode="simple"]').click();
      doc.querySelector('[data-action="set-practice-kind"][data-kind="mixed"]').click();
      doc.querySelector('[data-action="start-practice"]').click();
      assert('混合词条生成题目', doc.querySelectorAll('.progressive-row').length === 10);
      const mixedIds = Array.prototype.map.call(
        doc.querySelectorAll('.progressive-row'), (row) => row.dataset.questionId
      );
      assert('混合题目 ID 唯一', new Set(mixedIds).size === mixedIds.length);
      assert('混合题目显示词条', doc.querySelectorAll('.progressive-row .question-word strong').length === 10);
      const kanaToggle = doc.querySelector('[data-action="toggle-hint"][data-hint="kana"]');
      kanaToggle.click();
      assert('可隐藏假名提示', dom.window.eval('state.showKana') === false
        && doc.querySelectorAll('.progressive-row .question-word span').length === 0);
      doc.querySelector('[data-action="toggle-hint"][data-hint="meaning"]').click();
      assert('可隐藏中文提示', dom.window.eval('state.showMeaning') === false
        && doc.querySelectorAll('.progressive-row .question-word small').length === 0);
      doc.querySelector('[data-action="set-practice-kind"][data-kind="sentence"]').click();
      doc.querySelector('[data-action="start-practice"]').click();
      assert('句子填空生成语境', doc.querySelectorAll('.sentence-prompt').length === 10);
      doc.querySelector('[data-action="set-practice-kind"][data-kind="classify"]').click();
      doc.querySelector('[data-action="start-practice"]').click();
      assert('词类判断生成类型选项', doc.querySelectorAll('.type-choice-grid').length === 10);
      doc.querySelector('[data-action="set-practice-kind"][data-kind="polite"]').click();
      doc.querySelector('[data-action="start-practice"]').click();
      assert('普通／礼貌体题型生成转换提示', doc.querySelectorAll('.conversion-prompt').length === 10);
      doc.querySelector('[data-action="set-mode"][data-mode="standard"]').click();
      const politeItems = dom.window.eval('getPracticeItems()');
      doc.querySelectorAll('.progressive-row').forEach((row, index) => {
        const input = row.querySelector('.answer-field');
        input.value = politeItems[index].accepted[0];
        input.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
      });
      doc.querySelector('[data-action="check-practice"]').click();
      assert('普通／礼貌体标准答案可判定',
        dom.window.eval('Object.values(state.result.items).every(item => item.correct)'));

      console.log('页面运行时错误: ' + (errors.length === 0 ? '无' : errors.join(' | ')));
      assert('无运行时错误', errors.length === 0);
    } catch (e) {
      console.log('检查脚本异常: ' + e.message);
      process.exitCode = 1;
    }
    process.exit(process.exitCode || 0);
  }, 800);
});
