const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { JSDOM } = require("jsdom");

const root = path.resolve(__dirname, "..");
const pagePath = path.join(root, "counter-stamp.html");
const html = fs.readFileSync(pagePath, "utf8");
const dom = new JSDOM(html, {
  url: `${pathToFileURL(pagePath).href}?view=rules`,
  runScripts: "dangerously",
  resources: "usable",
  pretendToBeVisual: true,
  beforeParse(window) {
    const store = {};
    const storageMock = {
      getItem: (key) => (key in store ? store[key] : null),
      setItem: (key, value) => { store[key] = String(value); },
      removeItem: (key) => { delete store[key]; },
      clear: () => { Object.keys(store).forEach((key) => delete store[key]); },
      key: (index) => Object.keys(store)[index] || null,
      get length() { return Object.keys(store).length; }
    };
    Object.defineProperty(window, "localStorage", { value: storageMock, configurable: true });
  }
});

const errors = [];
dom.window.addEventListener("error", (event) => {
  errors.push(`页面错误: ${event.message}`);
});
const originalError = dom.window.console.error;
dom.window.console.error = function () {
  errors.push(`console.error: ${Array.prototype.slice.call(arguments).join(" ")}`);
  originalError.apply(dom.window.console, arguments);
};

function assert(name, condition) {
  console.log(`${condition ? "  ✓ " : "  ✗ "}${name}`);
  if (!condition) {
    process.exitCode = 1;
  }
}

function click(selector) {
  const element = dom.window.document.querySelector(selector);
  if (element) element.click();
  return element;
}

function answerScope(scope, items) {
  items.forEach((item) => {
    const input = dom.window.document.querySelector(`[data-recall-input="true"][data-scope="${scope}"][data-question-id="${item.id}"]`);
    if (input) {
      input.value = item.answer;
      input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    }
  });
  click(`[data-action="check-recall"][data-scope="${scope}"]`);
}

dom.window.addEventListener("load", () => {
  setTimeout(() => {
    const document = dom.window.document;
    const shell = document.getElementById("app-shell");
    const app = dom.window.NihongoCounterApp;
    const data = app.data;

    console.log("--- 量词规则视图 ---");
    assert("应用壳正常渲染", shell !== null && shell.innerHTML.length > 0);
    assert("四条一级路径可达", document.querySelectorAll(".path-tabs [data-path]").length === 4);
    assert("首屏公式存在", shell.textContent.includes("数什么") && shell.textContent.includes("月份：月／か月"));
    assert("八类量词标签可见", document.querySelectorAll(".counter-tabs [data-counter]").length === 8);
    assert("一般物品详细路径存在", shell.textContent.includes("一般物品")
      && shell.textContent.includes("代表形式")
      && shell.textContent.includes("最小对比")
      && shell.textContent.includes("易错与边界"));
    assert("一般物品十以后规则可见", shell.textContent.includes("十以后：切换为 個")
      && shell.textContent.includes("十一個")
      && shell.textContent.includes("じゅういっこ")
      && shell.textContent.includes("二十個"));
    assert("量词查询层可展开", document.querySelector("details.reference table") !== null);

    click('[data-counter="people"]');
    assert("切换人数同步读法和例句", shell.textContent.includes("二人") && shell.textContent.includes("ふたり")
      && shell.textContent.includes("学生が三人います"));
    click('[data-counter="long"]');
    assert("切换细长物同步音变规则", shell.textContent.includes("三本") && shell.textContent.includes("さんぼん")
      && shell.textContent.includes("何本读なんぼん"));
    answerScope("counter", data.counterGroups.find((group) => group.id === "long").recall);
    assert("当前量词回忆题可以判定", shell.textContent.includes("2 / 2 题正确"));

    console.log("--- 时间、月份和日期路径 ---");
    click('[data-path="clock"]');
    assert("时刻路径显示小时特殊读法", shell.textContent.includes("四時") && shell.textContent.includes("よじ")
      && shell.textContent.includes("午後七時半"));
    assert("分钟完整查询由引擎生成", shell.textContent.includes("にじゅういっぷん")
      && shell.textContent.includes("よんじゅうごふん")
      && document.querySelectorAll(".reference table tbody tr").length === 60);
    click('[data-path="month"]');
    assert("月份路径默认显示日历月份", shell.textContent.includes("四月") && shell.textContent.includes("しがつ"));
    click('[data-month-mode="duration"]');
    assert("月份子路径同步到持续月数", shell.textContent.includes("四か月") && shell.textContent.includes("よんかげつ"));
    click('[data-path="days"]');
    assert("日期路径显示特殊日期", shell.textContent.includes("一日") && shell.textContent.includes("ついたち")
      && shell.textContent.includes("二十四日"));
    click('[data-days-mode="duration"]');
    assert("天数子路径区分持续一天", shell.textContent.includes("いちにち") && shell.textContent.includes("はつか"));
    answerScope("rules", data.practice.days);
    assert("日期与天数回忆题可以判定", shell.textContent.includes("3 / 3 题正确"));

    console.log("--- 主题与综合练习 ---");
    click('[data-action="theme-select"][data-theme-id="sumi"]');
    assert("主题切换仍可用", document.documentElement.getAttribute("data-theme") === "sumi"
      && document.querySelector('.theme-option[aria-pressed="true"]').getAttribute("data-theme-id") === "sumi");
    click('[data-view="practice"]');
    const allItems = ["quantity", "clock", "month", "days"].reduce((all, key) => all.concat(data.practice[key]), []);
    assert("综合练习覆盖四类路径", document.querySelectorAll('[data-recall-input][data-scope="practice"]').length === allItems.length
      && shell.textContent.includes("综合回忆题"));
    answerScope("practice", allItems);
    assert("综合练习答案可判定", shell.textContent.includes(`${allItems.length} / ${allItems.length} 题正确`));
    assert("页面运行时错误为零", errors.length === 0);
    dom.window.close();
  }, 0);
});
