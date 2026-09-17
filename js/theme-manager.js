/* Nihongo-Learn · 共享主题管理器
 * 页面在 head 中同步加载，先设置主题再渲染正文，避免首屏闪烁。
 */
(function () {
  "use strict";

  var THEME_KEY = "nihongo-learn-theme";
  var DEFAULT_THEME = "aka";
  var THEMES = ["aka", "sumi", "koke", "kon", "fuji"];
  var THEME_LABELS = {
    aka: "印谱・朱红",
    sumi: "墨流・墨青",
    koke: "苔庭・苔绿",
    kon: "蓝染・绀蓝",
    fuji: "藤棚・藤紫"
  };
  var THEME_SWATCH_COLORS = {
    aka: "#b9655b",
    sumi: "#55617a",
    koke: "#5d7a52",
    kon: "#41689c",
    fuji: "#8a72ab"
  };

  function current() {
    try {
      var value = window.localStorage.getItem(THEME_KEY);
      return THEMES.indexOf(value) >= 0 ? value : DEFAULT_THEME;
    } catch (error) {
      return DEFAULT_THEME;
    }
  }

  function apply(themeId) {
    var id = THEMES.indexOf(themeId) >= 0 ? themeId : DEFAULT_THEME;
    document.documentElement.setAttribute("data-theme", id);
    try {
      window.localStorage.setItem(THEME_KEY, id);
    } catch (error) {
      /* 隐私模式等场景静默降级 */
    }
    return id;
  }

  function updateSwitcher() {
    var active = current();
    var options = document.querySelectorAll(".theme-option[data-theme-id]");
    for (var i = 0; i < options.length; i += 1) {
      options[i].setAttribute("aria-pressed", String(options[i].getAttribute("data-theme-id") === active));
    }
    var buttons = document.querySelectorAll(".theme-switcher-button");
    for (var j = 0; j < buttons.length; j += 1) {
      buttons[j].setAttribute("aria-label", "切换主题配色，当前：" + (THEME_LABELS[active] || active));
    }
  }

  window.NihongoTheme = {
    apply: apply,
    current: current,
    updateSwitcher: updateSwitcher,
    init: function () { apply(current()); },
    themes: THEMES,
    labels: THEME_LABELS,
    swatches: THEME_SWATCH_COLORS
  };

  window.NihongoTheme.init();
})();
