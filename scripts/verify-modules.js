/* Nihongo-Learn · 首页模块目录校验 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const dataPath = path.join(__dirname, "..", "data", "modules.js");
const source = fs.readFileSync(dataPath, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: dataPath });

const modules = sandbox.window.NIHONGO_DATA && sandbox.window.NIHONGO_DATA.modules;
if (!Array.isArray(modules) || modules.length === 0) {
  throw new Error("模块目录必须是非空数组。");
}

const ids = new Set();
const statuses = new Set(["ready", "coming-soon"]);
modules.forEach((module) => {
  if (!module || typeof module !== "object") {
    throw new Error("模块目录包含无效条目。");
  }
  ["id", "page", "status", "statusLabel", "description", "footerLabel", "seal"].forEach((field) => {
    if (typeof module[field] !== "string" || !module[field].trim()) {
      throw new Error(`${module.id || "未知模块"} 缺少 ${field}。`);
    }
  });
  if (ids.has(module.id)) {
    throw new Error(`模块 id 重复：${module.id}。`);
  }
  ids.add(module.id);
  if (!statuses.has(module.status)) {
    throw new Error(`${module.id} 使用了未知状态：${module.status}。`);
  }
  if (!Array.isArray(module.titleLines) || module.titleLines.length !== 2
    || module.titleLines.some((line) => typeof line !== "string" || !line.trim())) {
    throw new Error(`${module.id} 的 titleLines 必须包含两行非空标题。`);
  }
  if (module.status === "ready") {
    if (module.initialView !== "rules") {
      throw new Error(`${module.id} 的可用模块必须默认进入 rules 视图。`);
    }
    if (!fs.existsSync(path.join(__dirname, "..", module.page))) {
      throw new Error(`${module.id} 的目标页面不存在：${module.page}。`);
    }
  }
});

console.log(`PASS: ${modules.length} 个首页模块通过目录契约校验。`);
