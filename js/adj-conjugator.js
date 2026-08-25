/* Nihongo-Learn · 形容词/名词变形引擎（前端按规则实时变形）
 * 通过 <script> 顺序引入，挂载到 window.NIHONGO_DATA["adj-conjugator"]
 * 输入：{ dictionary, kana, meaning, type: "i-adj"|"na-adj"|"noun", exceptions? }
 * 输出：conjugate(entry) → { forms, kanaForms, stem }，6 个活用形
 * 规则：い形容词 词干＋くない/かった/くて/ければ；な形容词/名词 词干＋だ/じゃない/だった/で/なら
 * 例外：exceptions 可覆盖（如 いい → よくない/よかった）
 */
(function () {
  "use strict";

  var FORM_IDS = ["kotei", "hitei", "kako", "kakoHitei", "te", "jouken"];

  function assert(condition, message) {
    if (!condition) {
      throw new Error("形容词/名词引擎：" + message);
    }
  }

  /* い形容词：词干（去 い）＋ 后缀 */
  function buildIAdj(entry) {
    var dict = entry.dictionary;
    var kana = entry.kana;
    assert(kana.slice(-1) === "い", "い形容词词尾须为「い」：" + dict);
    var stemKana = kana.slice(0, -1);
    var stemDict = dict.slice(0, -1);
    var ex = entry.exceptions || {};
    var forms = {
      kotei: dict,
      hitei: ex.hitei || stemDict + "くない",
      kako: ex.kako || stemDict + "かった",
      kakoHitei: ex.kakoHitei || stemDict + "くなかった",
      te: ex.te || stemDict + "くて",
      jouken: ex.jouken || stemDict + "ければ"
    };
    var kanaForms = {};
    FORM_IDS.forEach(function (id) {
      // 例外词（如 いい）本身为假名，kana 形式即自身
      kanaForms[id] = ex.hitei ? forms[id] : forms[id].replace(stemDict, stemKana);
    });
    return {
      forms: forms,
      kanaForms: kanaForms,
      stem: { kanji: stemDict, kana: stemKana }
    };
  }

  /* な形容词/名词：词干 ＋ だ系后缀 */
  function buildNaAdjNoun(entry) {
    var dict = entry.dictionary;
    var kana = entry.kana;
    var forms = {
      kotei: dict + "だ",
      hitei: dict + "じゃない",
      kako: dict + "だった",
      kakoHitei: dict + "じゃなかった",
      te: dict + "で",
      jouken: dict + "なら"
    };
    var kanaForms = {};
    FORM_IDS.forEach(function (id) {
      kanaForms[id] = kana + forms[id].slice(dict.length);
    });
    return {
      forms: forms,
      kanaForms: kanaForms,
      stem: { kanji: dict, kana: kana }
    };
  }

  function conjugate(entry) {
    if (!entry || !entry.type || !entry.dictionary || !entry.kana) {
      throw new Error("形容词/名词引擎：词条缺少 type/dictionary/kana");
    }
    switch (entry.type) {
      case "i-adj": return buildIAdj(entry);
      case "na-adj": return buildNaAdjNoun(entry);
      case "noun": return buildNaAdjNoun(entry);
      default: throw new Error("未知类型：" + entry.type);
    }
  }

  window.NIHONGO_DATA = window.NIHONGO_DATA || {};
  window.NIHONGO_DATA["adj-conjugator"] = {
    conjugate: conjugate,
    formIds: FORM_IDS
  };
})();
