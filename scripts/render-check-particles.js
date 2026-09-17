// Nihongo-Learn 助词页渲染回归（jsdom）
// 运行：node scripts/render-check-particles.js
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { JSDOM } = require("jsdom");

const root = path.resolve(__dirname, "..");
const pagePath = path.join(root, "particles-stamp.html");
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
    const shell = document.getElementById("app-shell");

    console.log("--- 助词规则视图 ---");
    assert("应用壳正常渲染", shell !== null && shell.innerHTML.length > 0);
    assert("共享主题面板含 5 个中文选项", document.querySelectorAll(".theme-option").length === 5
      && ["印谱・朱红", "墨流・墨青", "苔庭・苔绿", "蓝染・绀蓝", "藤棚・藤紫"].every((label) => shell.textContent.includes(label)));
    assert("核心关系分组存在", shell.textContent.includes("核心关系")
      && document.querySelectorAll('.memory-card[data-group]').length >= 4);
    assert("助词详细路径存在", shell.textContent.includes("语义角色")
      && shell.textContent.includes("句中位置")
      && shell.textContent.includes("最小对比")
      && shell.textContent.includes("限制与易错"));
    assert("完整助词查询层默认存在", document.querySelector("details.reference") !== null
      && document.querySelector("details.reference table") !== null);

    console.log("--- 规则交互 ---");
    const extendedToggle = document.querySelector('[data-action="toggle-extended"]');
    assert("扩展关系可展开", extendedToggle !== null);
    if (extendedToggle) {
      extendedToggle.click();
    }
    assert("扩展关系展开后显示扩展分组", shell.textContent.includes("追加与强调")
      && shell.textContent.includes("共同、引用与所属"));
    const objectGroup = document.querySelector('[data-group="object"]');
    if (objectGroup) {
      objectGroup.click();
    }
    assert("切换语义分组会同步动作对象", shell.textContent.includes("动作对象")
      && shell.textContent.includes("助词：を"));
    const spaceTimeGroup = document.querySelector('[data-group="space-time"]');
    if (spaceTimeGroup) {
      spaceTimeGroup.click();
    }
    const particleNi = document.querySelector('[data-particle="に"]');
    if (particleNi) {
      particleNi.click();
    }
    assert("切换助词会同步详细内容", shell.textContent.includes("助词：に")
      && shell.textContent.includes("时间、地点与方向"));

    console.log("--- 主题与练习 ---");
    const sumiOption = document.querySelector('[data-action="theme-select"][data-theme-id="sumi"]');
    if (sumiOption) {
      sumiOption.click();
    }
    assert("助词页主题切换仍可用", document.documentElement.getAttribute("data-theme") === "sumi"
      && document.querySelector('.theme-option[aria-pressed="true"]').getAttribute("data-theme-id") === "sumi");
    const practiceTab = document.querySelector('[data-view="practice"]');
    if (practiceTab) {
      practiceTab.click();
    }
    assert("即时判断视图存在", shell.textContent.includes("即时判断：根据语义选择助词")
      && document.querySelectorAll(".practice-question").length > 0);

    assert("页面运行时错误为零", errors.length === 0);
    dom.window.close();
  }, 0);
});
