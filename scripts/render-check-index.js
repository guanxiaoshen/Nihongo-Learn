// Nihongo-Learn 首页渲染回归（jsdom）
// 运行：node scripts/render-check-index.js
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { JSDOM } = require("jsdom");

const root = path.resolve(__dirname, "..");
const pagePath = path.join(root, "index.html");
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

dom.window.addEventListener("load", () => {
  setTimeout(() => {
    const document = dom.window.document;
    const cards = document.querySelectorAll(".module-card");
    const links = Array.prototype.map.call(document.querySelectorAll("a.module-card"), (card) => card.getAttribute("href"));
    const expectedLinks = [
      "verb-conjugation-stamp.html?view=rules",
      "adj-noun-stamp.html?view=rules",
      "particles-stamp.html?view=rules",
      "counter-stamp.html?view=rules"
    ];

    console.log("--- 首页模块目录 ---");
    assert("模块目录挂载点存在", document.querySelector("[data-module-grid]") !== null);
    assert("四张模块卡片由目录生成", cards.length === 4);
    assert("四个模块均有默认规则入口", expectedLinks.every((href) => links.includes(href)));
    assert("模块标题完整显示", ["日语动词变形表", "日语形容词与名词", "日语助词用法", "日语量词与时间读法"].every((title) => document.body.textContent.includes(title)));
    assert("模块状态来自可用目录", document.querySelectorAll(".module-status.is-ready").length === 4);
    assert("模块能力提示完整", document.querySelectorAll(".module-card-footer").length === 4);

    console.log("--- 首页主题交互 ---");
    const fujiOption = document.querySelector('[data-action="select-theme"][data-theme-id="fuji"]');
    assert("主题选项存在", fujiOption !== null);
    if (fujiOption) {
      fujiOption.click();
    }
    assert("主题切换仍可用", document.documentElement.getAttribute("data-theme") === "fuji");
    assert("主题切换同步首页标题", document.querySelector(".page-heading h1").textContent.includes("藤棚方格"));
    assert("主题切换同步模块卡片状态", document.querySelectorAll('.theme-option[aria-pressed="true"]').length === 1
      && document.querySelector('.theme-option[aria-pressed="true"]').getAttribute("data-theme-id") === "fuji");

    assert("页面运行时错误为零", errors.length === 0);
    dom.window.close();
  }, 0);
});
