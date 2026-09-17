/* Nihongo-Learn · 首页模块目录（纯数据，无渲染逻辑）
 * 页面通过 <script> 顺序引入，挂载到 window.NIHONGO_DATA.modules。
 */
(function () {
  "use strict";

  window.NIHONGO_DATA = window.NIHONGO_DATA || {};
  window.NIHONGO_DATA.modules = [
    {
      id: "verbs",
      page: "verb-conjugation-stamp.html",
      initialView: "rules",
      titleLines: ["日语动词变形表", "· 印谱方格"],
      seal: "動",
      status: "ready",
      statusLabel: "现在可学",
      description: "掌握五段、一段、か变和さ变的基础六形与派生表达，并通过规则卡片和练习巩固。",
      footerLabel: "规则讲解 · 练习"
    },
    {
      id: "adjectives-nouns",
      page: "adj-noun-stamp.html",
      initialView: "rules",
      titleLines: ["日语形容词与名词", "变形表 · 印谱方格"],
      seal: "形",
      status: "ready",
      statusLabel: "现在可学",
      description: "掌握い形容词、な形容词和名词的肯定、否定、过去、过去否定、て形与条件表达。",
      footerLabel: "规则讲解 · 练习"
    },
    {
      id: "particles",
      page: "particles-stamp.html",
      initialView: "rules",
      titleLines: ["日语助词用法", "· 印谱方格"],
      seal: "助",
      status: "ready",
      statusLabel: "现在可学",
      description: "按语义角色理解は、が、を、に、で等助词，比较句中位置、用法边界并即时判断。",
      footerLabel: "规则讲解 · 判断"
    },
    {
      id: "counters",
      page: "counter-stamp.html",
      initialView: "rules",
      titleLines: ["日语量词与时间读法", "· 印谱方格"],
      seal: "数",
      status: "ready",
      statusLabel: "现在可学",
      description: "从对象类别理解量词，掌握时刻、月份、日期与天数的读法和特殊边界。",
      footerLabel: "规则讲解 · 判断"
    }
  ];
})();
