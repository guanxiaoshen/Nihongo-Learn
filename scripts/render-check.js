// 用 jsdom 真实渲染 verb-conjugation-stamp.html，捕获运行时错误并检查关键元素
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
    // file:// 为 opaque origin，jsdom 不提供 storage，注入内存 mock
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
  errors.push('页面错误: ' + e.message + ' | ' + (e.error && e.error.stack ? e.error.stack.split('\n').slice(0, 3).join(' -> ') : ''));
});
dom.window.addEventListener('unhandledrejection', function (e) {
  errors.push('未处理的 Promise 拒绝: ' + (e.reason && e.reason.message));
});

// 捕获页面内 console.error
const origError = dom.window.console.error;
dom.window.console.error = function () {
  errors.push('console.error: ' + Array.prototype.slice.call(arguments).join(' '));
  origError.apply(dom.window.console, arguments);
};

dom.window.addEventListener('load', function () {
  setTimeout(function () {
    try {
      const doc = dom.window.document;
      const shell = doc.getElementById('app-shell');
      console.log('--- 规则视图断言 ---');
      console.log('app-shell 内容长度:', shell.innerHTML.length);
      console.log('规则表格 rule-table:', shell.innerHTML.includes('rule-table'));
      console.log('两个主 Tab:', doc.querySelectorAll('.main-tab').length === 2);
      console.log('4 类动词列:', ['五段', '一段', 'か変', 'さ変'].every(function (s) { return shell.innerHTML.includes(s); }));
      console.log('示例卡片 書かない:', shell.innerHTML.includes('書かない'));
      console.log('音变表 sound-reference:', shell.innerHTML.includes('sound-reference'));
      console.log('规则卡片数量(25形×4类=100):', doc.querySelectorAll('.rule-card').length);
      console.log('--- 切换练习视图 ---');
      // 模拟点击练习 Tab（data-view="practice"）
      const practiceTab = doc.querySelector('[data-view="practice"]');
      practiceTab.click();
      const shell2 = doc.getElementById('app-shell');
      console.log('练习面板存在:', shell2.innerHTML.includes('practice-panel'));
      console.log('简易模式选项(radio):', doc.querySelectorAll('input[type="radio"]').length > 0);
      console.log('练习动词为 書く:', shell2.innerHTML.includes('書く'));
      console.log('页面错误:', errors.length === 0 ? '无' : errors.join('\n'));
    } catch (e) {
      console.log('检查脚本异常: ' + e.message);
      process.exitCode = 1;
    }
    process.exit(errors.length > 0 ? 1 : 0);
  }, 800);
});
