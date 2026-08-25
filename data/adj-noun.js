/* Nihongo-Learn · 形容词/名词变形数据（纯数据，无逻辑）
 * 通过 <script> 顺序引入，挂载到 window.NIHONGO_DATA.adjNoun
 * 标准 6 行：肯定/否定/过去/过去否定/て形/条件 × 三类（い形容词/な形容词/名词）
 */
(function () {
  "use strict";

  var forms = [
    { id: "kotei", label: "肯定形", jp: "こうていけい", note: "现在肯定：い形容词保持原形；な形容词/名词接 だ。" },
    { id: "hitei", label: "否定形", jp: "ひていけい", note: "现在否定：い形容词词干＋くない；な形容词/名词接 じゃない。" },
    { id: "kako", label: "过去形", jp: "かこけい", note: "过去肯定：い形容词词干＋かった；な形容词/名词接 だった。" },
    { id: "kakoHitei", label: "过去否定", jp: "かこひていけい", note: "过去否定：い形容词词干＋くなかった；な形容词/名词接 じゃなかった。" },
    { id: "te", label: "て形", jp: "てけい", note: "连接表达：い形容词词干＋くて；な形容词/名词接 で。" },
    { id: "jouken", label: "条件形", jp: "じょうけんけい", note: "假设条件：い形容词词干＋ければ；な形容词/名词接 なら（ば）。" }
  ];

  var typeColumns = [
    { id: "i-adj", label: "い形容词" },
    { id: "na-adj", label: "な形容词" },
    { id: "noun", label: "名词" }
  ];

  var formRules = {
    kotei: { "i-adj": "词干＋い（原形）", "na-adj": "词干＋だ", noun: "词干＋だ" },
    hitei: { "i-adj": "词干＋くない", "na-adj": "词干＋じゃない", noun: "词干＋じゃない" },
    kako: { "i-adj": "词干＋かった", "na-adj": "词干＋だった", noun: "词干＋だった" },
    kakoHitei: { "i-adj": "词干＋くなかった", "na-adj": "词干＋じゃなかった", noun: "词干＋じゃなかった" },
    te: { "i-adj": "词干＋くて", "na-adj": "词干＋で", noun: "词干＋で" },
    jouken: { "i-adj": "词干＋ければ", "na-adj": "词干＋なら（ば）", noun: "词干＋なら（ば）" }
  };

  /* 规则页示例词（预计算，保持与动词模块一致的数据风格） */
  var examples = {
    "i-adj": {
      dictionary: "高い",
      kana: "たかい",
      meaning: "高的；贵的",
      forms: {
        kotei: "高い", hitei: "高くない", kako: "高かった",
        kakoHitei: "高くなかった", te: "高くて", jouken: "高ければ"
      }
    },
    "na-adj": {
      dictionary: "静か",
      kana: "しずか",
      meaning: "安静",
      forms: {
        kotei: "静かだ", hitei: "静かじゃない", kako: "静かだった",
        kakoHitei: "静かじゃなかった", te: "静かで", jouken: "静かなら"
      }
    },
    noun: {
      dictionary: "学生",
      kana: "がくせい",
      meaning: "学生",
      forms: {
        kotei: "学生だ", hitei: "学生じゃない", kako: "学生だった",
        kakoHitei: "学生じゃなかった", te: "学生で", jouken: "学生なら"
      }
    }
  };

  /* 练习词库：每类 6 个，共 18 个 */
  var lexicon = [
    { dictionary: "高い", kana: "たかい", meaning: "高的；贵的", type: "i-adj" },
    { dictionary: "大きい", kana: "おおきい", meaning: "大的", type: "i-adj" },
    { dictionary: "小さい", kana: "ちいさい", meaning: "小的", type: "i-adj" },
    { dictionary: "新しい", kana: "あたらしい", meaning: "新的", type: "i-adj" },
    { dictionary: "暑い", kana: "あつい", meaning: "（天气）热", type: "i-adj" },
    { dictionary: "楽しい", kana: "たのしい", meaning: "开心的", type: "i-adj" },

    { dictionary: "静か", kana: "しずか", meaning: "安静", type: "na-adj" },
    { dictionary: "きれい", kana: "きれい", meaning: "漂亮；干净", type: "na-adj" },
    { dictionary: "有名", kana: "ゆうめい", meaning: "有名", type: "na-adj" },
    { dictionary: "便利", kana: "べんり", meaning: "方便", type: "na-adj" },
    { dictionary: "元気", kana: "げんき", meaning: "精神；健康", type: "na-adj" },
    { dictionary: "大切", kana: "たいせつ", meaning: "重要", type: "na-adj" },

    { dictionary: "学生", kana: "がくせい", meaning: "学生", type: "noun" },
    { dictionary: "先生", kana: "せんせい", meaning: "老师", type: "noun" },
    { dictionary: "本", kana: "ほん", meaning: "书", type: "noun" },
    { dictionary: "雨", kana: "あめ", meaning: "雨", type: "noun" },
    { dictionary: "仕事", kana: "しごと", meaning: "工作", type: "noun" },
    { dictionary: "猫", kana: "ねこ", meaning: "猫", type: "noun" }
  ];

  /* 变形速查表（替代动词模块的五段音变表） */
  var summaryRows = [
    ["い形容词", "词干＋い", "くない", "かった", "くなかった", "くて", "ければ"],
    ["な形容词", "词干＋だ", "じゃない", "だった", "じゃなかった", "で", "なら"],
    ["名词", "词干＋だ", "じゃない", "だった", "じゃなかった", "で", "なら"]
  ];

  window.NIHONGO_DATA = window.NIHONGO_DATA || {};
  window.NIHONGO_DATA.adjNoun = {
    forms: forms,
    typeColumns: typeColumns,
    formRules: formRules,
    examples: examples,
    lexicon: lexicon,
    summaryRows: summaryRows
  };
})();
