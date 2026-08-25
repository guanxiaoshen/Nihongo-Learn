// 主题系统回归：切换 + 持久化 + 三页一致性（jsdom）
// 运行：NODE_PATH=<managed workspace node_modules> node scripts/theme-check.js
const fs = require('fs');
const { JSDOM } = require('jsdom');
const ROOT = 'E:/01_Projects/Nihongo-Learn/';

let failed = 0;
function assert(name, cond) {
  console.log((cond ? '  ✓ ' : '  ✗ ') + name);
  if (!cond) failed++;
}

function makeDom(page, preStoredTheme) {
  const html = fs.readFileSync(ROOT + page, 'utf8');
  return new JSDOM(html, {
    url: 'file:///E:/01_Projects/Nihongo-Learn/' + page,
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    beforeParse(window) {
      const store = {};
      if (preStoredTheme) store['nihongo-learn-theme'] = preStoredTheme;
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
}

function openAndRun(page, preStoredTheme, fn) {
  return new Promise(function (resolve) {
    const dom = makeDom(page, preStoredTheme);
    const errors = [];
    dom.window.addEventListener('error', function (e) { errors.push(e.message); });
    dom.window.addEventListener('load', function () {
      setTimeout(function () {
        try { fn(dom, errors); } catch (e) { console.log('  异常: ' + e.message); failed++; }
        resolve();
      }, 700);
    });
  });
}

async function main() {
  console.log('--- verb 页：默认主题 + 切换 ---');
  await openAndRun('verb-conjugation-stamp.html', null, function (dom, errors) {
    const doc = dom.window.document;
    assert('默认主题 aka', doc.documentElement.getAttribute('data-theme') === 'aka');
    assert('主题按钮存在', doc.querySelector('.theme-switcher-button') !== null);
    assert('面板含 5 个主题选项', doc.querySelectorAll('.theme-option').length === 5);
    assert('面板初始收起', !doc.querySelector('.theme-switcher').classList.contains('is-open'));
    assert('默认标题含 印谱方格', doc.querySelector('.page-heading h1').textContent.includes('印谱方格'));
    assert('默认描述含 朱红', doc.querySelector('.page-heading p').textContent.includes('朱红'));
    doc.querySelector('.theme-switcher-button').click();
    assert('点击按钮展开面板', doc.querySelector('.theme-switcher').classList.contains('is-open'));
    const sumi = doc.querySelector('.theme-option[data-theme-id="sumi"]');
    sumi.click();
    assert('切换后 html data-theme=sumi', doc.documentElement.getAttribute('data-theme') === 'sumi');
    assert('localStorage 写入 sumi', dom.window.localStorage.getItem('nihongo-learn-theme') === 'sumi');
    assert('面板收起', !doc.querySelector('.theme-switcher').classList.contains('is-open'));
    assert('选中态更新', sumi.getAttribute('aria-pressed') === 'true');
    // 顶部说明区文案随主题
    assert('标题随主题 → 墨流ノート', doc.querySelector('.page-heading h1').textContent.includes('墨流ノート'));
    assert('描述随主题 → 墨青语境', doc.querySelector('.page-heading p').textContent.includes('墨青'));
    assert('版次注记随主题 → 墨流六号', doc.querySelector('.edition-note').textContent.includes('墨流'));
    // P3：ESC 关闭面板
    doc.querySelector('.theme-switcher-button').click();
    dom.window.document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape' }));
    assert('ESC 关闭面板', !doc.querySelector('.theme-switcher').classList.contains('is-open'));
    assert('无运行时错误', errors.length === 0);
  });

  console.log('--- adj 页：跨页持久化生效（预置 sumi） ---');
  await openAndRun('adj-noun-stamp.html', 'sumi', function (dom, errors) {
    const doc = dom.window.document;
    assert('adj 页继承 sumi', doc.documentElement.getAttribute('data-theme') === 'sumi');
    assert('adj 主题面板选中 sumi', doc.querySelector('.theme-option[data-theme-id="sumi"]').getAttribute('aria-pressed') === 'true');
    assert('adj 标题随主题 → 墨流ノート', doc.querySelector('.page-heading h1').textContent.includes('墨流ノート'));
    assert('adj 描述含 い形容词语境', doc.querySelector('.page-heading p').textContent.includes('い形容词'));
    assert('adj 无运行时错误', errors.length === 0);
  });

  console.log('--- index 页：静态页切换 ---');
  await openAndRun('index.html', null, function (dom, errors) {
    const doc = dom.window.document;
    assert('index 默认 aka', doc.documentElement.getAttribute('data-theme') === 'aka');
    assert('index 默认标题 印谱方格', doc.querySelector('.page-heading h1').textContent.includes('印谱方格'));
    doc.querySelector('.theme-option[data-theme-id="fuji"]').click();
    assert('index 切换 fuji', doc.documentElement.getAttribute('data-theme') === 'fuji');
    assert('index localStorage=fuji', dom.window.localStorage.getItem('nihongo-learn-theme') === 'fuji');
    assert('index 标题随主题 → 藤棚ノート', doc.querySelector('.page-heading h1').textContent.includes('藤棚ノート'));
    assert('index eyebrow 随主题 → 藤棚', doc.querySelector('.page-heading .eyebrow').textContent.includes('藤棚'));
    assert('index 描述随主题 → 藤棚语境', doc.querySelector('.page-heading p').textContent.includes('藤棚花影'));
    assert('index 无运行时错误', errors.length === 0);
  });

  console.log(failed === 0 ? '\n主题系统回归：全部通过' : '\n主题系统回归：' + failed + ' 项失败');
  process.exit(failed > 0 ? 1 : 0);
}

main();
