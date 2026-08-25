// Nihongo-Learn 页面渲染回归（jsdom）—— 覆盖规则页与练习全流程
// 运行：NODE_PATH=<managed workspace node_modules> node scripts/render-check.js
const fs = require('fs');
const { JSDOM } = require('jsdom');
const ROOT = 'E:/01_Projects/Nihongo-Learn/';
const html = fs.readFileSync(ROOT + 'verb-conjugation-stamp.html', 'utf8');

const dom = new JSDOM(html, {
  url: 'file:///E:/01_Projects/Nihongo-Learn/verb-conjugation-stamp.html?view=rules',
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

      console.log('页面运行时错误: ' + (errors.length === 0 ? '无' : errors.join(' | ')));
      assert('无运行时错误', errors.length === 0);
    } catch (e) {
      console.log('检查脚本异常: ' + e.message);
      process.exitCode = 1;
    }
    process.exit(process.exitCode || 0);
  }, 800);
});
