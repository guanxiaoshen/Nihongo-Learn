/* Nihongo-Learn · 动词词库与示例数据（纯数据，无逻辑）
 * 通过 <script> 顺序引入，挂载到 window.NIHONGO_DATA.verbs
 * - typeExamples：规则页固定展示的 4 个示例词（预计算，保持既有行为）
 * - lexicon：练习词库（每形由前端变形引擎实时生成，见 js/conjugator.js）
 *   注意：か変动词在日语中仅「来る」一个，故词库为 19 词（五段6 + 一段6 + か変1 + さ変6）。
 */
(function () {
  "use strict";

  /* 规则页示例词：与旧版内联数据完全一致 */
  var typeExamples = {
    godan: {
      dictionary: "書く",
      kana: "かく",
      meaning: "书写；写",
      forms: {
        mizenkei: "書か", renyoukei: "書き", shuushikei: "書く", rentaikei: "書く",
        kateikei: "書け", meireikei: "書け", nai: "書かない", nakute: "書かなくて",
        naide: "書かないで", masu: "書きます", te: "書いて", ta: "書いた",
        tai: "書きたい", ishi: "書こう", ba: "書けば", tara: "書いたら",
        kanou: "書ける", ukemi: "書かれる", shieki: "書かせる",
        shiekiUkemi: "書かせられる", kinshi: "書くな", nara: "書くなら",
        suiryou: "書こう", sonkei: "お書きになる", kenjou: "お書きする"
      }
    },
    ichidan: {
      dictionary: "食べる",
      kana: "たべる",
      meaning: "吃",
      forms: {
        mizenkei: "食べ", renyoukei: "食べ", shuushikei: "食べる", rentaikei: "食べる",
        kateikei: "食べれ", meireikei: "食べろ", nai: "食べない", nakute: "食べなくて",
        naide: "食べないで", masu: "食べます", te: "食べて", ta: "食べた",
        tai: "食べたい", ishi: "食べよう", ba: "食べれば", tara: "食べたら",
        kanou: "食べられる", ukemi: "食べられる", shieki: "食べさせる",
        shiekiUkemi: "食べさせられる", kinshi: "食べるな", nara: "食べるなら",
        suiryou: "食べよう", sonkei: "お食べになる", kenjou: "お食べする"
      }
    },
    kuru: {
      dictionary: "来る",
      kana: "くる",
      meaning: "来",
      forms: {
        mizenkei: "来（こ）", renyoukei: "来（き）", shuushikei: "来る（くる）",
        rentaikei: "来る（くる）", kateikei: "来れ（くれ）", meireikei: "来い（こい）",
        nai: "来ない", nakute: "来なくて", naide: "来ないで", masu: "来ます",
        te: "来て", ta: "来た", tai: "来たい", ishi: "来よう", ba: "来れば",
        tara: "来たら", kanou: "来られる", ukemi: "来られる", shieki: "来させる",
        shiekiUkemi: "来させられる", kinshi: "来るな", nara: "来るなら",
        suiryou: "来よう", sonkei: "おいでになる", kenjou: "お越しする"
      }
    },
    suru: {
      dictionary: "する",
      kana: "する",
      meaning: "做",
      forms: {
        mizenkei: "し", renyoukei: "し", shuushikei: "する", rentaikei: "する",
        kateikei: "すれ", meireikei: "しろ／せよ", nai: "しない", nakute: "しなくて",
        naide: "しないで", masu: "します", te: "して", ta: "した", tai: "したい",
        ishi: "しよう", ba: "すれば", tara: "したら", kanou: "できる",
        ukemi: "される", shieki: "させる", shiekiUkemi: "させられる",
        kinshi: "するな", nara: "するなら", suiryou: "しよう", sonkei: "なさる",
        kenjou: "いたす"
      }
    }
  };

  /* 练习词库：每类 6 个（か変仅「来る」1 个）
   * 五段 6 词覆盖 6 种词尾音便：く(い音便) / す(し音便) / う(促音便) / つ(促音便) / む(拨音便) / ぐ(浊音便)
   * exceptions：不规则て/た形覆盖（如 行く → 行って）
   */
  var lexicon = [
    { dictionary: "書く", kana: "かく", meaning: "书写；写", type: "godan" },
    { dictionary: "話す", kana: "はなす", meaning: "说；谈话", type: "godan" },
    { dictionary: "買う", kana: "かう", meaning: "买", type: "godan" },
    { dictionary: "待つ", kana: "まつ", meaning: "等待", type: "godan" },
    { dictionary: "飲む", kana: "のむ", meaning: "喝；饮", type: "godan" },
    { dictionary: "泳ぐ", kana: "およぐ", meaning: "游泳", type: "godan" },

    { dictionary: "食べる", kana: "たべる", meaning: "吃", type: "ichidan" },
    { dictionary: "見る", kana: "みる", meaning: "看", type: "ichidan" },
    { dictionary: "起きる", kana: "おきる", meaning: "起床；发生", type: "ichidan" },
    { dictionary: "寝る", kana: "ねる", meaning: "睡觉", type: "ichidan" },
    { dictionary: "開ける", kana: "あける", meaning: "打开", type: "ichidan" },
    { dictionary: "着る", kana: "きる", meaning: "穿（衣服）", type: "ichidan" },

    { dictionary: "来る", kana: "くる", meaning: "来", type: "kuru" },

    { dictionary: "する", kana: "する", meaning: "做", type: "suru" },
    { dictionary: "勉強する", kana: "べんきょうする", meaning: "学习", type: "suru" },
    { dictionary: "散歩する", kana: "さんぽする", meaning: "散步", type: "suru" },
    { dictionary: "運転する", kana: "うんてんする", meaning: "驾驶", type: "suru" },
    { dictionary: "洗濯する", kana: "せんたくする", meaning: "洗衣服", type: "suru" },
    { dictionary: "旅行する", kana: "りょこうする", meaning: "旅行", type: "suru" }
  ];

  window.NIHONGO_DATA = window.NIHONGO_DATA || {};
  window.NIHONGO_DATA.verbs = {
    typeExamples: typeExamples,
    lexicon: lexicon
  };
})();
