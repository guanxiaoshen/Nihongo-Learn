/* Nihongo-Learn · 日语动词变形引擎（前端按规则实时变形）
 * 通过 <script> 顺序引入，挂载到 window.NIHONGO_DATA.conjugator
 * 输入：词库词条 { dictionary, kana, meaning, type, exceptions? }
 * 输出：conjugate(verb) → { forms: {字典形式}, kanaForms: {假名形式} }，25 个活用形
 * 规则覆盖：五段（含音便）、一段、か変（来る）、さ変（する 及 复合さ変）
 * 例外：exceptions.te / exceptions.ta 可覆盖不规则 て/た 形（如 行く → 行って）
 */
(function () {
  "use strict";

  var FORM_IDS = [
    "mizenkei", "renyoukei", "shuushikei", "rentaikei", "kateikei", "meireikei",
    "nai", "nakute", "naide", "masu", "te", "ta", "tai", "ishi", "ba", "tara",
    "kanou", "ukemi", "shieki", "shiekiUkemi", "kinshi", "nara", "suiryou",
    "sonkei", "kenjou"
  ];

  /* 五段：う段词尾 → あ/い/え/お 段（含浊音 ぐ） */
  var VOWEL_SHIFT = {
    "う": { a: "わ", i: "い", u: "う", e: "え", o: "お" },
    "く": { a: "か", i: "き", u: "く", e: "け", o: "こ" },
    "ぐ": { a: "が", i: "ぎ", u: "ぐ", e: "げ", o: "ご" },
    "す": { a: "さ", i: "し", u: "す", e: "せ", o: "そ" },
    "つ": { a: "た", i: "ち", u: "つ", e: "て", o: "と" },
    "ぬ": { a: "な", i: "に", u: "ぬ", e: "ね", o: "の" },
    "ふ": { a: "は", i: "ひ", u: "ふ", e: "へ", o: "ほ" },
    "ぶ": { a: "ば", i: "び", u: "ぶ", e: "べ", o: "ぼ" },
    "む": { a: "ま", i: "み", u: "む", e: "め", o: "も" },
    "ゆ": { a: "や", i: "ゆ", u: "ゆ", e: "ゆ", o: "よ" },
    "る": { a: "ら", i: "り", u: "る", e: "れ", o: "ろ" }
  };

  /* て/た 音便 */
  var SOUND_BIN = {
    "う": ["って", "った"],
    "つ": ["って", "った"],
    "る": ["って", "った"],
    "く": ["いて", "いた"],
    "ぐ": ["いで", "いだ"],
    "す": ["して", "した"],
    "ぬ": ["んで", "んだ"],
    "ぶ": ["んで", "んだ"],
    "む": ["んで", "んだ"]
  };

  /* か変「来る」完整模板（字典形式，含注音写法，与规则页示例一致） */
  var KURU_FORMS = {
    mizenkei: "来（こ）", renyoukei: "来（き）", shuushikei: "来る（くる）",
    rentaikei: "来る（くる）", kateikei: "来れ（くれ）", meireikei: "来い（こい）",
    nai: "来ない", nakute: "来なくて", naide: "来ないで", masu: "来ます",
    te: "来て", ta: "来た", tai: "来たい", ishi: "来よう", ba: "来れば",
    tara: "来たら", kanou: "来られる", ukemi: "来られる", shieki: "来させる",
    shiekiUkemi: "来させられる", kinshi: "来るな", nara: "来るなら",
    suiryou: "来よう", sonkei: "おいでになる",     kenjou: "参る"
  };

  /* か変「来る」假名形式（供练习判定、注音展示） */
  var KURU_KANA_FORMS = {
    mizenkei: "こ", renyoukei: "き", shuushikei: "くる", rentaikei: "くる",
    kateikei: "くれ", meireikei: "こい", nai: "こない", nakute: "こなくて",
    naide: "こないで", masu: "きます", te: "きて", ta: "きた", tai: "きたい",
    ishi: "こよう", ba: "くれば", tara: "きたら", kanou: "こられる",
    ukemi: "こられる", shieki: "こさせる", shiekiUkemi: "こさせられる",
    kinshi: "くるな", nara: "くるなら", suiryou: "こよう",
    sonkei: "おいでになる", kenjou: "まいる"
  };

  /* さ変后缀模板：复合さ変（勉強する）＝ 词干前缀 + 后缀 */
  var SURU_SUFFIXES = {
    mizenkei: "し", renyoukei: "し", shuushikei: "する", rentaikei: "する",
    kateikei: "すれ", meireikei: "しろ／せよ", nai: "しない", nakute: "しなくて",
    naide: "しないで", masu: "します", te: "して", ta: "した", tai: "したい",
    ishi: "しよう", ba: "すれば", tara: "したら", kanou: "できる", ukemi: "される",
    shieki: "させる", shiekiUkemi: "させられる", kinshi: "するな", nara: "するなら",
    suiryou: "しよう", sonkei: "なさる", kenjou: "いたす"
  };

  function assert(condition, message) {
    if (!condition) {
      throw new Error("变形引擎：" + message);
    }
  }

  function applyFormExceptions(forms, verb) {
    var exceptions = verb.exceptions || {};
    FORM_IDS.forEach(function (id) {
      if (Object.prototype.hasOwnProperty.call(exceptions, id)) {
        forms[id] = exceptions[id];
      }
    });
    return forms;
  }

  function buildKanaForms(forms, verb, stemDict, stemKana) {
    var exceptions = verb.exceptions || {};
    var kanaForms = {};
    FORM_IDS.forEach(function (id) {
      kanaForms[id] = exceptions.kanaForms && Object.prototype.hasOwnProperty.call(exceptions.kanaForms, id)
        ? exceptions.kanaForms[id] : forms[id].replace(stemDict, stemKana);
    });
    return kanaForms;
  }

  /* 五段：按词尾假名分段 + 音便 */
  function buildGodan(verb) {
    var kana = verb.kana;
    var dict = verb.dictionary;
    var tail = kana.slice(-1);
    var shift = VOWEL_SHIFT[tail];
    assert(shift, "五段动词词尾「" + tail + "」不在音便表内：" + dict);
    var stemKana = kana.slice(0, -1);
    var stemDict = dict.slice(0, -1);
    var bin = SOUND_BIN[tail] || ["て", "た"];
    var teForm = (verb.exceptions && verb.exceptions.te) || stemDict + bin[0];
    var taForm = (verb.exceptions && verb.exceptions.ta) || stemDict + bin[1];
    var forms = applyFormExceptions({
      mizenkei: stemDict + shift.a,
      renyoukei: stemDict + shift.i,
      shuushikei: dict,
      rentaikei: dict,
      kateikei: stemDict + shift.e,
      meireikei: stemDict + shift.e,
      nai: stemDict + shift.a + "ない",
      nakute: stemDict + shift.a + "なくて",
      naide: stemDict + shift.a + "ないで",
      masu: stemDict + shift.i + "ます",
      te: teForm,
      ta: taForm,
      tai: stemDict + shift.i + "たい",
      ishi: stemDict + shift.o + "う",
      ba: stemDict + shift.e + "ば",
      tara: taForm + "ら",
      kanou: stemDict + shift.e + "る",
      ukemi: stemDict + shift.a + "れる",
      shieki: stemDict + shift.a + "せる",
      shiekiUkemi: stemDict + shift.a + "せられる",
      kinshi: dict + "な",
      nara: dict + "なら",
      suiryou: stemDict + shift.o + "う",
      sonkei: "お" + stemDict + shift.i + "になる",
      kenjou: "お" + stemDict + shift.i + "する"
    }, verb);
    var kanaForms = buildKanaForms(forms, verb, stemDict, stemKana);
    return {
      forms: forms,
      kanaForms: kanaForms,
      stem: { kanji: stemDict, kana: stemKana }
    };
  }

  /* 一段：去「る」接后缀 */
  function buildIchidan(verb) {
    var kana = verb.kana;
    var dict = verb.dictionary;
    assert(kana.slice(-1) === "る", "一段动词词尾须为「る」：" + dict);
    var stemKana = kana.slice(0, -1);
    var stemDict = dict.slice(0, -1);
    var forms = applyFormExceptions({
      mizenkei: stemDict,
      renyoukei: stemDict,
      shuushikei: dict,
      rentaikei: dict,
      kateikei: stemDict + "れ",
      meireikei: stemDict + "ろ",
      nai: stemDict + "ない",
      nakute: stemDict + "なくて",
      naide: stemDict + "ないで",
      masu: stemDict + "ます",
      te: stemDict + "て",
      ta: stemDict + "た",
      tai: stemDict + "たい",
      ishi: stemDict + "よう",
      ba: stemDict + "れば",
      tara: stemDict + "たら",
      kanou: stemDict + "られる",
      ukemi: stemDict + "られる",
      shieki: stemDict + "させる",
      shiekiUkemi: stemDict + "させられる",
      kinshi: dict + "な",
      nara: dict + "なら",
      suiryou: stemDict + "よう",
      sonkei: "お" + stemDict + "になる",
      kenjou: "お" + stemDict + "する"
    }, verb);
    var kanaForms = buildKanaForms(forms, verb, stemDict, stemKana);
    return {
      forms: forms,
      kanaForms: kanaForms,
      stem: { kanji: stemDict, kana: stemKana }
    };
  }

  /* か変：来る 模板 */
  function buildKuru(verb) {
    assert(verb.dictionary === "来る", "か変仅支持「来る」：" + verb.dictionary);
    var forms = applyFormExceptions(Object.assign({}, KURU_FORMS), verb);
    var kanaForms = Object.assign({}, KURU_KANA_FORMS);
    var exceptions = verb.exceptions || {};
    if (exceptions.kanaForms) {
      FORM_IDS.forEach(function (id) {
        if (Object.prototype.hasOwnProperty.call(exceptions.kanaForms, id)) {
          kanaForms[id] = exceptions.kanaForms[id];
        }
      });
    }
    return { forms: forms, kanaForms: kanaForms, stem: null };
  }

  /* さ変：する / 复合さ変（勉强する）＝ 前缀 + 后缀 */
  function buildSuru(verb) {
    var dict = verb.dictionary;
    assert(dict.slice(-2) === "する", "さ変动词须以「する」结尾：" + dict);
    var prefix = dict.slice(0, -2);
    var prefixKana = verb.kana.slice(0, -2);
    var forms = {};
    var kanaForms = {};
    var exceptions = verb.exceptions || {};
    FORM_IDS.forEach(function (id) {
      forms[id] = prefix + SURU_SUFFIXES[id];
      kanaForms[id] = exceptions.kanaForms && Object.prototype.hasOwnProperty.call(exceptions.kanaForms, id)
        ? exceptions.kanaForms[id] : prefixKana + SURU_SUFFIXES[id];
    });
    return {
      forms: forms,
      kanaForms: kanaForms,
      stem: prefix ? { kanji: prefix, kana: prefixKana } : null
    };
  }

  function conjugate(verb) {
    if (!verb || !verb.type || !verb.dictionary || !verb.kana) {
      throw new Error("变形引擎：词条缺少 type/dictionary/kana");
    }
    switch (verb.type) {
      case "godan": return buildGodan(verb);
      case "ichidan": return buildIchidan(verb);
      case "kuru": return buildKuru(verb);
      case "suru": return buildSuru(verb);
      default: throw new Error("未知动词类型：" + verb.type);
    }
  }

  window.NIHONGO_DATA = window.NIHONGO_DATA || {};
  window.NIHONGO_DATA.conjugator = {
    conjugate: conjugate,
    formIds: FORM_IDS
  };
})();
