/* Nihongo-Learn · 首页模块卡片渲染（目录数据与页面行为分离） */
(function () {
  "use strict";

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getModuleHref(module) {
    if (!module.page || !module.initialView) {
      return "";
    }
    return `${module.page}?view=${encodeURIComponent(module.initialView)}`;
  }

  function renderModuleCard(module) {
    const isReady = module.status === "ready" && Boolean(getModuleHref(module));
    const tagName = isReady ? "a" : "article";
    const href = isReady ? ` href="${escapeHtml(getModuleHref(module))}"` : "";
    const statusClass = module.status === "ready" ? "is-ready" : "";
    const titleLines = Array.isArray(module.titleLines) ? module.titleLines : [module.id];
    const title = titleLines.map((line) => escapeHtml(line)).join("<br>");
    const footerTail = isReady
      ? '<span aria-hidden="true">→</span>'
      : '<span aria-hidden="true">·</span>';
    return `
      <${tagName} class="module-card ${isReady ? "" : "is-coming-soon"}"${href}>
        <div class="module-card-top">
          <span class="module-seal" aria-hidden="true">${escapeHtml(module.seal)}</span>
          <span class="module-status ${statusClass}">${escapeHtml(module.statusLabel)}</span>
        </div>
        <div>
          <h3>${title}</h3>
          <p>${escapeHtml(module.description)}</p>
        </div>
        <div class="module-card-footer">
          <span>${escapeHtml(module.footerLabel)}</span>
          ${footerTail}
        </div>
      </${tagName}>
    `;
  }

  function renderModuleCatalog() {
    const target = document.querySelector("[data-module-grid]");
    const modules = window.NIHONGO_DATA && window.NIHONGO_DATA.modules;
    if (!target || !Array.isArray(modules)) {
      return;
    }
    target.innerHTML = modules.map(renderModuleCard).join("");
  }

  window.NihongoModuleCatalog = {
    render: renderModuleCatalog
  };

  renderModuleCatalog();
})();
