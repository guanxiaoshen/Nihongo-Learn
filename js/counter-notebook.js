(function () {
  "use strict";

  var data = window.NIHONGO_DATA && window.NIHONGO_DATA.counters;
  var engine = window.NihongoCounterEngine;
  var shell = document.getElementById("app-shell");
  var query = new URLSearchParams(window.location.search);
  var initialPath = query.get("path");
  var validPath = data.paths.some(function (path) { return path.id === initialPath; });
  var state = {
    view: query.get("view") === "practice" ? "practice" : "rules",
    path: validPath ? initialPath : data.paths[0].id,
    counter: data.counterGroups[0].id,
    monthMode: "calendar",
    daysMode: "date",
    results: {},
    answers: {}
  };

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function ruby(text, reading) {
    return "<ruby>" + escapeHtml(text) + "<rt>" + escapeHtml(reading) + "</rt></ruby>";
  }

  function currentPath() {
    return data.paths.find(function (path) { return path.id === state.path; }) || data.paths[0];
  }

  function currentCounter() {
    return data.counterGroups.find(function (group) { return group.id === state.counter; }) || data.counterGroups[0];
  }

  function clearResults() {
    state.results = {};
    state.answers = {};
  }

  function renderTheme() {
    var options = window.NihongoTheme.themes.map(function (id) {
      var label = window.NihongoTheme.labels[id] || id;
      var swatch = window.NihongoTheme.swatches[id] || "#b9655b";
      return "<button type=\"button\" class=\"theme-option\" role=\"menuitemradio\" data-action=\"theme-select\" data-theme-id=\"" + id + "\" aria-pressed=\"" + (window.NihongoTheme.current() === id) + "\"><span class=\"theme-swatch\" style=\"background: " + swatch + "\"></span>" + escapeHtml(label) + "</button>";
    }).join("");
    return "<span class=\"edition-note\">和風 · 数字七号</span><div class=\"theme-switcher\"><button type=\"button\" class=\"theme-switcher-button\" data-action=\"theme-toggle\" aria-expanded=\"false\" aria-haspopup=\"true\"><span class=\"theme-swatch\" style=\"background: var(--vermilion)\"></span>主题</button><div class=\"theme-panel\" role=\"menu\" aria-label=\"选择主题配色\">" + options + "</div></div>";
  }

  function renderHeader() {
    return "<header class=\"app-header\"><a class=\"brand brand-link\" href=\"index.html\" aria-label=\"返回日语学习印谱方格首页\"><div class=\"seal\" aria-hidden=\"true\">数</div><div><h2>数词ノート</h2><p>印谱方格 · 量词、时刻与日期规则</p></div></a>" + renderTheme() + "</header>";
  }

  function renderTabs() {
    return "<nav class=\"tabs\" role=\"tablist\" aria-label=\"主要区域\"><button type=\"button\" class=\"main-tab\" aria-selected=\"" + (state.view === "rules") + "\" data-view=\"rules\">规则讲解</button><button type=\"button\" class=\"main-tab\" aria-selected=\"" + (state.view === "practice") + "\" data-view=\"practice\">综合练习</button></nav>";
  }

  function renderSteps(steps) {
    return "<div class=\"rule-path\" aria-label=\"规则路径\">" + steps.map(function (step) {
      return "<div class=\"path-step\"><span class=\"step-label\">" + escapeHtml(step.label) + "</span><span>" + escapeHtml(step.text) + "</span></div>";
    }).join("") + "</div>";
  }

  function renderExample(example) {
    return "<article class=\"example-box\"><div><div class=\"example-label\">代表形式</div><div class=\"example-form\">" + ruby(example.form, example.reading) + "</div></div><div><p class=\"example-japanese\">" + ruby(example.sentence, example.sentenceReading) + "</p><p class=\"example-meaning\">" + escapeHtml(example.meaning) + "</p></div></article>";
  }

  function renderBoundary(contrast, limit) {
    return "<div class=\"contrast-grid\"><article class=\"contrast-card\"><h4>最小对比</h4><p>" + escapeHtml(contrast) + "</p></article><article class=\"boundary-card\"><h4>易错与边界</h4><p>" + escapeHtml(limit) + "</p></article></div>";
  }

  function renderAfterTen(afterTen) {
    if (!afterTen) return "";
    return "<section class=\"after-ten\"><p class=\"eyebrow\">超过十个时</p><h3>" + escapeHtml(afterTen.title) + "</h3><p class=\"memory-line\">" + escapeHtml(afterTen.memory) + "</p><p><b>语义角色：</b>" + escapeHtml(afterTen.role) + "</p><p><b>句中位置：</b>" + escapeHtml(afterTen.position) + "</p><p class=\"formula\">" + escapeHtml(afterTen.formula) + "</p>" + renderExample(afterTen.example) + renderBoundary(afterTen.contrast, afterTen.limit) + "</section>" + renderFormsTable(afterTen.forms, afterTen.title + "查询", ["数量", "形式", "读法", "备注"]);
  }

  function renderFormsTable(forms, title, headings) {
    return "<details class=\"reference\"><summary>展开" + escapeHtml(title) + "</summary><div class=\"table-wrap\"><table><thead><tr><th>数量</th><th>形式</th><th>读法</th><th>备注</th></tr></thead><tbody>" + forms.map(function (item) {
      var reading = item.variants && item.variants.length ? escapeHtml(item.reading) + "<br><small>可接受：" + item.variants.map(escapeHtml).join("／") + "</small>" : escapeHtml(item.reading);
      return "<tr><th>" + escapeHtml(item.number) + "</th><td>" + ruby(item.form, item.reading) + "</td><td>" + reading + "</td><td>" + escapeHtml(item.note || "") + "</td></tr>";
    }).join("") + "</tbody></table></div></details>";
  }

  function renderReadingItems(items) {
    return items.map(function (item) {
      return "<div class=\"reading-item\"><strong>" + escapeHtml(item.form) + "</strong><span>" + ruby(item.form, item.reading) + "</span><small>" + escapeHtml(item.note || "") + "</small></div>";
    }).join("");
  }

  function renderCounterTabs() {
    return "<div class=\"counter-tabs\" role=\"tablist\" aria-label=\"量词类别\">" + data.counterGroups.map(function (group) {
      return "<button type=\"button\" aria-selected=\"" + (group.id === state.counter) + "\" data-counter=\"" + group.id + "\"><strong>" + escapeHtml(group.label) + "</strong><small>数字 + " + escapeHtml(group.counter) + "（" + escapeHtml(group.badge) + "）</small></button>";
    }).join("") + "</div>";
  }

  function renderQuantity() {
    var group = currentCounter();
    return "<section class=\"detail\"><div class=\"section-heading\"><div><p class=\"eyebrow\">当前详细路径</p><h2>" + escapeHtml(group.label) + " · 数字 + " + escapeHtml(group.counter) + "</h2></div><p class=\"hint\">先看对象类别，再读数量形式；量词不是可以随意替换的词尾。</p></div>" + renderCounterTabs() + "<article class=\"detail-card\"><h3>量词：" + escapeHtml(group.counter) + "（" + escapeHtml(group.reading) + "）</h3><p class=\"memory-line\">" + escapeHtml(group.memory) + "</p><p><b>语义角色：</b>" + escapeHtml(group.role) + "</p><p><b>句中位置：</b>" + escapeHtml(group.position) + "</p><p class=\"formula\">判断对象 → 选择「" + escapeHtml(group.counter) + "」→ 数量放在谓语前</p>" + renderSteps(group.steps) + renderExample(group.example) + renderBoundary(group.contrast, group.limit) + "</article>" + renderAfterTen(group.afterTen) + renderRecall(group.recall, "counter", "当前量词，马上回忆") + renderFormsTable(group.forms, group.label + "的 1～10 查询", ["数量", "形式", "读法", "备注"]) + "</section>";
  }

  function renderClock() {
    var clock = data.clock;
    return "<section class=\"detail\"><div class=\"section-heading\"><div><p class=\"eyebrow\">当前详细路径</p><h2>时刻、分钟与持续时间</h2></div><p class=\"hint\">单位不同，读法也不同：时刻用時／分，持续长度用時間。</p></div><article class=\"detail-card\"><p class=\"memory-line\">" + escapeHtml(clock.memory) + "</p><p class=\"formula\">" + escapeHtml(currentPath().formula) + "</p>" + renderSteps(clock.steps) + renderExample(clock.example) + renderBoundary(clock.contrast, clock.limit) + "</article><section class=\"reading-band\"><h3>小时：数字 + 時</h3><div class=\"reading-grid\">" + renderReadingItems(clock.hours) + "</div></section><section class=\"reading-band\"><h3>分钟：先记音变位置</h3><div class=\"reading-grid\">" + renderReadingItems(clock.minuteExamples) + "</div><p class=\"path-caption\">分钟可以组合成 21 分＝にじゅういっぷん、45 分＝よんじゅうごふん；30 分也常说半（はん）。</p></section><section class=\"reading-band\"><h3>持续时间：時間 + かん</h3><div class=\"duration-grid\">" + clock.durationExamples.map(function (item) { return "<div class=\"duration-item\"><strong>" + ruby(item.form, item.reading) + "</strong><span>" + escapeHtml(item.meaning) + "</span></div>"; }).join("") + "</div></section><details class=\"reference\"><summary>展开 0～59 分完整查询</summary><div class=\"table-wrap\"><table><thead><tr><th>分钟</th><th>读法</th><th>记忆提示</th></tr></thead><tbody>" + engine.minuteRows(clock).map(function (item) { return "<tr><th>" + escapeHtml(item.form) + "</th><td>" + escapeHtml(item.reading) + "</td><td>" + ([1, 3, 4, 6, 8, 10, 30].indexOf(item.number) >= 0 ? "音变重点" : "") + "</td></tr>"; }).join("") + "</tbody></table></div></details></section>";
  }

  function renderMonth() {
    var months = data.months;
    var rows = state.monthMode === "calendar" ? months.calendar : months.duration;
    var title = state.monthMode === "calendar" ? "日历月份" : "持续月数";
    return "<section class=\"detail\"><div class=\"section-heading\"><div><p class=\"eyebrow\">当前详细路径</p><h2>月份：日历标签还是持续长度</h2></div><p class=\"hint\">四月、七月、九月的月份读法，要和四个月、七个月分开记。</p></div><article class=\"detail-card\"><p class=\"memory-line\">" + escapeHtml(months.memory) + "</p><p class=\"formula\">" + escapeHtml(currentPath().formula) + "</p>" + renderSteps(months.steps) + renderExample(months.example) + renderBoundary(months.contrast, months.limit) + "</article><div class=\"sub-tabs\" role=\"tablist\" aria-label=\"月份类型\"><button type=\"button\" aria-selected=\"" + (state.monthMode === "calendar") + "\" data-month-mode=\"calendar\">日历月份<small>数字 + 月（がつ）</small></button><button type=\"button\" aria-selected=\"" + (state.monthMode === "duration") + "\" data-month-mode=\"duration\">持续月数<small>数字 + か月（かげつ）</small></button></div><section class=\"reading-band\"><h3>" + title + "</h3><div class=\"reading-grid\">" + renderReadingItems(rows) + "</div></section>" + renderFormsTable(rows, title + "完整查询", ["数量", "形式", "读法", "备注"]) + "</section>";
  }

  function renderDays() {
    var days = data.days;
    var rows = state.daysMode === "date" ? days.dateForms : engine.dayDurationRows(days);
    var title = state.daysMode === "date" ? "日历日期" : "持续天数";
    var weekday = days.weekdays.map(function (item) { return "<div class=\"weekday-item\"><strong>" + escapeHtml(item.form) + "</strong><span>" + ruby(item.form, item.reading) + "</span><small>" + escapeHtml(item.meaning) + "</small></div>"; }).join("");
    return "<section class=\"detail\"><div class=\"section-heading\"><div><p class=\"eyebrow\">当前详细路径</p><h2>日期与天数：先看语义</h2></div><p class=\"hint\">一日最容易混淆：每月 1 日是ついたち，持续一天是いちにち。</p></div><article class=\"detail-card\"><p class=\"memory-line\">" + escapeHtml(days.memory) + "</p><p class=\"formula\">" + escapeHtml(currentPath().formula) + "</p>" + renderSteps(days.steps) + renderExample(days.example) + renderBoundary(days.contrast, days.limit) + "</article><div class=\"sub-tabs\" role=\"tablist\" aria-label=\"日期与天数类型\"><button type=\"button\" aria-selected=\"" + (state.daysMode === "date") + "\" data-days-mode=\"date\">日历日期<small>第几日</small></button><button type=\"button\" aria-selected=\"" + (state.daysMode === "duration") + "\" data-days-mode=\"duration\">持续天数<small>几天</small></button></div><section class=\"reading-band\"><h3>" + title + "</h3><div class=\"reading-grid\">" + renderReadingItems(rows.slice(0, state.daysMode === "date" ? 12 : 10)) + "</div><p class=\"path-caption\">完整 1～31 项请展开下方查询；特殊读法仍靠语义和日期位置一起判断。</p></section>" + (state.daysMode === "date" ? "<section class=\"weekday-band\"><h3>星期的读法</h3><div class=\"weekday-grid\">" + weekday + "</div></section>" : "") + renderFormsTable(rows, title + " 1～31 完整查询", ["数量", "形式", "读法", "备注"]) + "</section>";
  }

  function renderPathContent() {
    if (state.path === "quantity") return renderQuantity();
    if (state.path === "clock") return renderClock();
    if (state.path === "month") return renderMonth();
    return renderDays();
  }

  function renderPathTabs() {
    return "<div class=\"path-tabs\" role=\"tablist\" aria-label=\"量词与时间规则路径\">" + data.paths.map(function (path) {
      return "<button type=\"button\" aria-selected=\"" + (path.id === state.path) + "\" data-path=\"" + path.id + "\"><strong>" + escapeHtml(path.label) + "</strong><small>" + escapeHtml(path.description) + "</small></button>";
    }).join("") + "</div>";
  }

  function itemsForScope(scope) {
    if (scope === "counter") return currentCounter().recall;
    if (scope === "practice") {
      return ["quantity", "clock", "month", "days"].reduce(function (all, pathId) {
        return all.concat(data.practice[pathId]);
      }, []);
    }
    return data.practice[state.path];
  }

  function resultFor(scope, id) {
    var result = state.results[scope];
    return result && result.items ? result.items[id] : null;
  }

  function renderRecall(items, scope, heading) {
    var result = state.results[scope];
    var correctCount = result ? Object.keys(result.items).filter(function (id) { return result.items[id].ok; }).length : 0;
    var feedback = result ? "<p class=\"status-line\" aria-live=\"polite\">" + correctCount + " / " + items.length + " 题正确。" + (correctCount === items.length ? "规则已经记住，可以继续查完整表。" : "错题下方显示了正确读法和原因。") + "</p>" : "<p class=\"status-line\" aria-live=\"polite\"></p>";
    return "<section class=\"practice recall-practice\"><h2>" + escapeHtml(heading) + "</h2><p>先自己读出来，再检查答案；反馈会指出是对象类别、单位还是特殊读法出了问题。</p>" + items.map(function (item, index) {
      var itemResult = resultFor(scope, item.id);
      var value = itemResult ? itemResult.value : (state.answers[scope + ":" + item.id] || "");
      var className = itemResult ? (itemResult.ok ? "correct" : "wrong") : "";
      var detail = itemResult ? "<span class=\"question-feedback\"><b>参考答案：</b>" + escapeHtml(item.answer) + "。" + escapeHtml(item.why) + "</span>" : "";
      return "<label class=\"practice-question " + className + "\"><span class=\"question-text\"><b>" + (index + 1) + "．</b>" + escapeHtml(item.prompt) + detail + "</span><input type=\"text\" data-recall-input=\"true\" data-scope=\"" + scope + "\" data-question-id=\"" + item.id + "\" value=\"" + escapeHtml(value) + "\" maxlength=\"40\" autocomplete=\"off\" aria-label=\"第" + (index + 1) + "题答案\"></label>";
    }).join("") + "<button type=\"button\" class=\"primary\" data-action=\"check-recall\" data-scope=\"" + scope + "\">检查答案</button>" + feedback + "</section>";
  }

  function renderRules() {
    var path = currentPath();
    var recall = state.path === "quantity" ? "" : renderRecall(data.practice[state.path], "rules", "刚才的规则，试着回忆");
    return "<section class=\"memory\"><div class=\"section-heading\"><div><p class=\"eyebrow\">一眼记忆</p><h2>先判断“数什么”</h2></div><p class=\"hint\">量词先看对象；时间先看单位；月份与日数先看是在定位日期还是表达时长。</p></div><div class=\"formula-strip\">数什么 → 数字 + 量词 → 读法　｜　时刻：時／分　｜　月份：月／か月　｜　日期：日付／日数</div>" + renderPathTabs() + "<p class=\"path-caption\">当前路径：<b>" + escapeHtml(path.label) + "</b> · " + escapeHtml(path.description) + "</p></section>" + renderPathContent() + recall;
  }

  function renderPractice() {
    return "<section class=\"memory\"><div class=\"section-heading\"><div><p class=\"eyebrow\">规则后的回忆</p><h2>量词、时刻与日期综合练习</h2></div><p class=\"hint\">题目覆盖四条路径；先读语境，再写假名或量词。</p></div><div class=\"formula-strip\">对象类别决定量词；单位决定读法；特殊形式要和语义一起记。</div></section>" + renderRecall(itemsForScope("practice"), "practice", "综合回忆题");
  }

  function render() {
    shell.innerHTML = renderHeader() + renderTabs() + (state.view === "rules" ? renderRules() : renderPractice());
    window.NihongoTheme.updateSwitcher();
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest("[data-action], [data-path], [data-counter], [data-month-mode], [data-days-mode], [data-view]");
    if (!target) return;
    if (target.dataset.action === "theme-toggle") {
      var box = target.parentElement;
      var open = !box.classList.contains("is-open");
      box.classList.toggle("is-open", open);
      target.setAttribute("aria-expanded", String(open));
      return;
    }
    if (target.dataset.action === "theme-select") {
      window.NihongoTheme.apply(target.dataset.themeId);
      render();
      return;
    }
    if (target.dataset.view) {
      state.view = target.dataset.view;
      clearResults();
      render();
      return;
    }
    if (target.dataset.path) {
      state.path = target.dataset.path;
      clearResults();
      render();
      return;
    }
    if (target.dataset.counter) {
      state.counter = target.dataset.counter;
      state.results.counter = null;
      state.answers = {};
      render();
      return;
    }
    if (target.dataset.monthMode) {
      state.monthMode = target.dataset.monthMode;
      render();
      return;
    }
    if (target.dataset.daysMode) {
      state.daysMode = target.dataset.daysMode;
      render();
      return;
    }
    if (target.dataset.action === "check-recall") {
      var scope = target.dataset.scope;
      var items = itemsForScope(scope);
      var checked = {};
      items.forEach(function (item) {
        var input = shell.querySelector('[data-recall-input="true"][data-scope="' + scope + '"][data-question-id="' + item.id + '"]');
        var value = input ? input.value.trim() : "";
        state.answers[scope + ":" + item.id] = value;
        checked[item.id] = { ok: engine.acceptsAnswer(value, item), value: value };
      });
      state.results[scope] = { items: checked };
      render();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    document.querySelectorAll(".theme-switcher.is-open").forEach(function (element) {
      element.classList.remove("is-open");
    });
    document.querySelectorAll('.theme-switcher-button[aria-expanded="true"]').forEach(function (button) {
      button.setAttribute("aria-expanded", "false");
    });
  });

  window.NihongoCounterApp = {
    data: data,
    state: state,
    render: render,
    currentPath: currentPath,
    currentCounter: currentCounter
  };
  render();
})();
