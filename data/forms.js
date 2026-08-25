/* Nihongo-Learn · 活用形与规则数据（纯数据，无逻辑）
 * 通过 <script> 顺序引入，挂载到 window.NIHONGO_DATA.forms
 * 说明：本文件为应用唯一数据源，verb-conjugation-stamp.html 从此读取。
 */
(function () {
  "use strict";

  var baseForms = [
    { id: "mizenkei", label: "未然形", jp: "みぜんけい", note: "接续否定、意志、使役、被动等助动词。" },
    { id: "renyoukei", label: "连用形", jp: "れんようけい", note: "连接 ます、て、た、たい等表达，也可作词干。" },
    { id: "shuushikei", label: "终止形", jp: "しゅうしけい", note: "用于句末叙述；现代日语中通常与连体形同形。" },
    { id: "rentaikei", label: "连体形", jp: "れんたいけい", note: "放在名词前作定语；现代日语中通常与终止形同形。" },
    { id: "kateikei", label: "假定形", jp: "かていけい", note: "五段改为え段并接 ば；表示假设条件。" },
    { id: "meireikei", label: "命令形", jp: "めいれいけい", note: "表达直接命令；实际使用时需注意语气和场合。" }
  ];

  var derivedForms = [
    { id: "nai", label: "ない形", jp: "ないけい", note: "否定表达：接 ない。" },
    { id: "nakute", label: "なくて形", jp: "なくてけい", note: "否定连接：接 なくて。" },
    { id: "naide", label: "ないで形", jp: "ないでけい", note: "不做某事：接 ないで。" },
    { id: "masu", label: "ます形", jp: "ますけい", note: "礼貌表达：连用形接 ます。" },
    { id: "te", label: "て形", jp: "てけい", note: "连接动作、请求和进行等表达。" },
    { id: "ta", label: "た形", jp: "たけい", note: "表示过去或完成。" },
    { id: "tai", label: "たい形", jp: "たいけい", note: "表示愿望：连用形接 たい。" },
    { id: "ishi", label: "意志形", jp: "いしけい", note: "表示意志或提议：う／よう。" },
    { id: "ba", label: "ば形", jp: "ばけい", note: "表示假设条件：接 ば。" },
    { id: "tara", label: "たら形", jp: "たらけい", note: "表示条件或先后关系：た形接 ら。" },
    { id: "kanou", label: "可能形", jp: "かのうけい", note: "表示能力或可能：标准教学形式。" },
    { id: "ukemi", label: "被动形", jp: "うけみけい", note: "表示被动：接 れる／られる。" },
    { id: "shieki", label: "使役形", jp: "しえきけい", note: "表示使役：接 せる／させる。" },
    { id: "shiekiUkemi", label: "使役被动形", jp: "しえきうけみけい", note: "表示被迫：接 せられる／させられる。" },
    { id: "kinshi", label: "禁止形", jp: "きんしけい", note: "表示禁止：终止形接 な。" },
    { id: "nara", label: "なら条件", jp: "ならじょうけん", note: "以终止形为基础的条件表达。" },
    { id: "suiryou", label: "推量表达", jp: "すいりょうひょうげん", note: "使用 う／よう等表达推量或意志。" },
    { id: "sonkei", label: "尊敬表达", jp: "そんけいひょうげん", note: "示例：お＋连用形＋になる。" },
    { id: "kenjou", label: "谦让表达", jp: "けんじょうひょうげん", note: "示例：お＋连用形＋する。" }
  ];

  var typeColumns = [
    { id: "godan", label: "第 I 类／五段" },
    { id: "ichidan", label: "第 II 类／一段" },
    { id: "kuru", label: "第 III 类／か変" },
    { id: "suru", label: "第 III 类／さ変" }
  ];

  /* 25 形 × 4 类：规则讲解卡片正面的规则文本 */
  var formRules = {
    mizenkei: { godan: "词尾改为「あ」段", ichidan: "去掉「る」得词干", kuru: "くる → こ", suru: "する → し" },
    renyoukei: { godan: "词尾改为「い」段", ichidan: "去掉「る」得词干", kuru: "くる → き", suru: "する → し" },
    shuushikei: { godan: "保留「う」段词尾", ichidan: "保留词典形", kuru: "保留「る」", suru: "保留「する」" },
    rentaikei: { godan: "保留「う」段词尾", ichidan: "保留词典形", kuru: "保留「る」", suru: "保留「する」" },
    kateikei: { godan: "词尾改为「え」段", ichidan: "词干＋れば", kuru: "来れ（くれ）ば", suru: "すれ＋ば" },
    meireikei: { godan: "词尾改为「え」段", ichidan: "词干＋ろ", kuru: "くる → こい", suru: "する → しろ／せよ" },
    nai: { godan: "未然形＋ない", ichidan: "词干＋ない", kuru: "来（こ）＋ない", suru: "し＋ない" },
    nakute: { godan: "未然形＋なくて", ichidan: "词干＋なくて", kuru: "来（こ）＋なくて", suru: "し＋なくて" },
    naide: { godan: "未然形＋ないで", ichidan: "词干＋ないで", kuru: "来（こ）＋ないで", suru: "し＋ないで" },
    masu: { godan: "连用形＋ます", ichidan: "词干＋ます", kuru: "来（き）＋ます", suru: "し＋ます" },
    te: { godan: "按词尾发生音便＋て", ichidan: "词干＋て", kuru: "来（き）＋て", suru: "し＋て" },
    ta: { godan: "按词尾发生音便＋た", ichidan: "词干＋た", kuru: "来（き）＋た", suru: "し＋た" },
    tai: { godan: "连用形＋たい", ichidan: "词干＋たい", kuru: "来（き）＋たい", suru: "し＋たい" },
    ishi: { godan: "词尾改为「お」段＋う", ichidan: "词干＋よう", kuru: "来（こ）＋よう", suru: "し＋よう" },
    ba: { godan: "词尾改为「え」段＋ば", ichidan: "词干＋れば", kuru: "来れ（くれ）＋ば", suru: "すれ＋ば" },
    tara: { godan: "た形＋ら", ichidan: "た形＋ら", kuru: "来た＋ら", suru: "した＋ら" },
    kanou: { godan: "词尾改为「え」段＋る", ichidan: "词干＋られる", kuru: "来られる", suru: "できる" },
    ukemi: { godan: "未然形＋れる", ichidan: "词干＋られる", kuru: "来られる", suru: "される" },
    shieki: { godan: "未然形＋せる", ichidan: "词干＋させる", kuru: "来させる", suru: "させる" },
    shiekiUkemi: { godan: "未然形＋せられる", ichidan: "词干＋させられる", kuru: "来させられる", suru: "させられる" },
    kinshi: { godan: "终止形＋な", ichidan: "终止形＋な", kuru: "来る＋な", suru: "する＋な" },
    nara: { godan: "终止形＋なら", ichidan: "终止形＋なら", kuru: "来る＋なら", suru: "する＋なら" },
    suiryou: { godan: "お段＋う（与意志形同形）", ichidan: "词干＋よう", kuru: "来よう", suru: "しよう" },
    sonkei: { godan: "お＋连用形＋になる", ichidan: "お＋词干＋になる", kuru: "おいでになる", suru: "なさる／お～になる" },
    kenjou: { godan: "お＋连用形＋する", ichidan: "お＋词干＋する", kuru: "お越しする", suru: "いたす" }
  };

  /* 五段词尾音变对照（あ・い・う・え・え + て／た 音便） */
  var soundRows = [
    ["う", "わ", "い", "う", "え", "え", "って／った"],
    ["く", "か", "き", "く", "け", "け", "いて／いた"],
    ["ぐ", "が", "ぎ", "ぐ", "げ", "げ", "いで／いだ"],
    ["す", "さ", "し", "す", "せ", "せ", "して／した"],
    ["つ", "た", "ち", "つ", "て", "て", "って／った"],
    ["ぬ", "な", "に", "ぬ", "ね", "ね", "んで／んだ"],
    ["ぶ", "ば", "び", "ぶ", "べ", "べ", "んで／んだ"],
    ["む", "ま", "み", "む", "め", "め", "んで／んだ"],
    ["る", "ら", "り", "る", "れ", "れ", "って／った"]
  ];

  window.NIHONGO_DATA = window.NIHONGO_DATA || {};
  window.NIHONGO_DATA.forms = {
    baseForms: baseForms,
    derivedForms: derivedForms,
    typeColumns: typeColumns,
    formRules: formRules,
    soundRows: soundRows
  };
})();
