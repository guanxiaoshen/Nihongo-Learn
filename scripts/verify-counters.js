const fs = require("fs");
const path = require("path");
const vm = require("vm");

const dataPath = path.join(__dirname, "..", "data", "counters.js");
const source = fs.readFileSync(dataPath, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: dataPath });

const enginePath = path.join(__dirname, "..", "js", "counter-engine.js");
vm.runInNewContext(fs.readFileSync(enginePath, "utf8"), sandbox, { filename: enginePath });
const data = sandbox.window.NIHONGO_DATA && sandbox.window.NIHONGO_DATA.counters;
const engine = sandbox.window.NihongoCounterEngine;
function assert(name, condition) {
  console.log(`${condition ? "  ✓ " : "  ✗ "}${name}`);
  if (!condition) {
    process.exitCode = 1;
  }
}

assert("量词数据存在", !!data);
assert("四条一级规则路径可达", Array.isArray(data && data.paths) && data.paths.length === 4);
assert("四条路径 id 唯一", data && new Set(data.paths.map((item) => item.id)).size === 4);
assert("量词类别各有详细步骤", Array.isArray(data && data.counterGroups)
  && data.counterGroups.length === 8
  && data.counterGroups.every((group) => Array.isArray(group.steps) && group.steps.length >= 4));
assert("量词类别各有例句、对比和边界", data && data.counterGroups.every((group) => group.example
  && group.example.sentence && group.example.sentenceReading && group.contrast && group.limit));
assert("量词查询覆盖 1 到 10", data && data.counterGroups.every((group) => group.forms.length >= 10));
const general = data && data.counterGroups.find((group) => group.id === "general");
assert("一般物品十以后切换为個", general && general.afterTen
  && general.afterTen.formula === "十一以上 → 数字 + 個（こ）"
  && general.afterTen.example.form === "十一個"
  && general.afterTen.example.reading === "じゅういっこ"
  && general.afterTen.forms.some((item) => item.number === 20 && item.reading.includes("にじゅっこ")));
assert("小时查询覆盖 12 项", data && data.clock.hours.length === 12);
assert("分钟规则包含关键音变", data && [1, 3, 4, 6, 8, 10].every((number) => data.clock.minuteUnits[number] || data.clock.minuteTens[number]));
assert("分钟引擎组合 21、30、45 的读法", engine
  && engine.readMinute(21, data.clock) === "にじゅういっぷん"
  && engine.readMinute(30, data.clock) === "さんじゅっぷん"
  && engine.readMinute(45, data.clock) === "よんじゅうごふん");
assert("时刻和持续时间的单位路径同时存在", data && data.clock.hours.length === 12
  && data.clock.durationExamples.some((item) => item.form === "一時間" && item.reading === "いちじかん"));
assert("月份查询同时覆盖日历和持续月数", data && data.months.calendar.length === 12 && data.months.duration.length === 12);
assert("日期查询覆盖 1 到 31 日", data && data.days.dateForms.length === 31);
assert("天数保留一日、十四日、二十日、二十四日边界", data && [1, 14, 20, 24].every((number) => data.days.durationSpecials[number]));
assert("天数引擎区分日期一日与持续一天", engine
  && engine.readDayDuration(1, data.days) === "いちにち"
  && data.days.dateForms[0].reading === "ついたち"
  && engine.readDayDuration(24, data.days) === "にじゅうよっか");
assert("四类路径各有即时回忆题", data && ["quantity", "clock", "month", "days"].every((id) => data.practice[id].length >= 2));

if (!process.exitCode) {
  console.log("PASS: 量词模块数据通过规则路径与内容完整性校验。");
}
