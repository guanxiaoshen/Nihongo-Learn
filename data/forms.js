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
    { id: "kateikei", label: "假定形", jp: "かていけい", note: "五段改为え段；作为接续形时再接 ば，形成ば形。" },
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
    { id: "ba", label: "ば形", jp: "ばけい", note: "假定条件表达：假定形接 ば；与 たら、なら 的使用条件不同。" },
    { id: "tara", label: "たら形", jp: "たらけい", note: "表示条件或先后关系：た形接 ら，常用于具体条件。" },
    { id: "kanou", label: "可能形", jp: "かのうけい", note: "表示能力或可能；注意可能形与被动形的语义不同。" },
    { id: "ukemi", label: "被动形", jp: "うけみけい", note: "表示受到动作影响：接 れる／られる。" },
    { id: "shieki", label: "使役形", jp: "しえきけい", note: "表示使某人做或允许某人做：接 せる／させる。" },
    { id: "shiekiUkemi", label: "使役被动形", jp: "しえきうけみけい", note: "表示被迫做某事：接 せられる／させられる，口语有缩约形式。" },
    { id: "kinshi", label: "禁止形", jp: "きんしけい", note: "表示禁止：终止形接 な。" },
    { id: "nara", label: "なら条件", jp: "ならじょうけん", note: "以终止形为基础的条件或话题表达；不等同于 ば形。" },
    { id: "suiryou", label: "意志／推量形", jp: "いし・すいりょうけい", note: "う／よう主要表示意志或提议；现代日语推量常用 だろう／でしょう。" },
    { id: "sonkei", label: "尊敬表达（句型）", jp: "そんけいひょうげん", note: "敬语句型示例，不是所有动词都能机械套用；固定尊敬语需单独记忆。" },
    { id: "kenjou", label: "谦让表达（句型）", jp: "けんじょうひょうげん", note: "敬语句型示例，用于降低说话人一方；固定谦让语需按场景学习。" }
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
    kateikei: { godan: "词尾改为「え」段", ichidan: "词干＋れ", kuru: "来れ（くれ）", suru: "すれ" },
    meireikei: { godan: "词尾改为「え」段", ichidan: "词干＋ろ", kuru: "くる → こい", suru: "する → しろ／せよ" },
    nai: { godan: "未然形＋ない", ichidan: "词干＋ない", kuru: "来（こ）＋ない", suru: "し＋ない" },
    nakute: { godan: "未然形＋なくて", ichidan: "词干＋なくて", kuru: "来（こ）＋なくて", suru: "し＋なくて" },
    naide: { godan: "未然形＋ないで", ichidan: "词干＋ないで", kuru: "来（こ）＋ないで", suru: "し＋ないで" },
    masu: { godan: "连用形＋ます", ichidan: "词干＋ます", kuru: "来（き）＋ます", suru: "し＋ます" },
    te: { godan: "按词尾发生音便＋て", ichidan: "词干＋て", kuru: "来（き）＋て", suru: "し＋て" },
    ta: { godan: "按词尾发生音便＋た", ichidan: "词干＋た", kuru: "来（き）＋た", suru: "し＋た" },
    tai: { godan: "连用形＋たい", ichidan: "词干＋たい", kuru: "来（き）＋たい", suru: "し＋たい" },
    ishi: { godan: "词尾改为「お」段＋う", ichidan: "词干＋よう", kuru: "来（こ）＋よう", suru: "し＋よう" },
    ba: { godan: "假定形＋ば", ichidan: "词干＋れ＋ば", kuru: "来れ（くれ）＋ば", suru: "すれ＋ば" },
    tara: { godan: "た形＋ら", ichidan: "た形＋ら", kuru: "来た＋ら", suru: "した＋ら" },
    kanou: { godan: "词尾改为「え」段＋る", ichidan: "词干＋られる", kuru: "来られる", suru: "できる" },
    ukemi: { godan: "未然形＋れる", ichidan: "词干＋られる", kuru: "来られる", suru: "される" },
    shieki: { godan: "未然形＋せる", ichidan: "词干＋させる", kuru: "来させる", suru: "させる" },
    shiekiUkemi: { godan: "未然形＋せられる", ichidan: "词干＋させられる", kuru: "来させられる", suru: "させられる" },
    kinshi: { godan: "终止形＋な", ichidan: "终止形＋な", kuru: "来る＋な", suru: "する＋な" },
    nara: { godan: "终止形＋なら", ichidan: "终止形＋なら", kuru: "来る＋なら", suru: "する＋なら" },
    suiryou: { godan: "意志／推量：お段＋う", ichidan: "意志／推量：词干＋よう", kuru: "来よう（意志／推量）", suru: "しよう（意志／推量）" },
    sonkei: { godan: "敬语句型：お＋连用形＋になる", ichidan: "敬语句型：お＋词干＋になる", kuru: "固定表达：おいでになる", suru: "固定表达：なさる；另有お～になる" },
    kenjou: { godan: "敬语句型：お＋连用形＋する", ichidan: "敬语句型：お＋词干＋する", kuru: "固定表达：参る", suru: "固定表达：いたす" }
  };

  var usageExamples = [
    { formId: "nai", sentence: "今日は本を読まない。", translation: "今天不读书。", note: "普通体否定：未然形＋ない。" },
    { formId: "nakute", sentence: "時間がなくて、行けない。", translation: "因为没有时间，去不了。", note: "表示原因或并列；不要和 ないで 混淆。" },
    { formId: "naide", sentence: "朝ご飯を食べないで出かけた。", translation: "没吃早饭就出门了。", note: "表示不做前项就进行后项。" },
    { formId: "masu", sentence: "毎朝、日本語を勉強します。", translation: "每天早上学习日语。", note: "礼貌体现在时；连用形＋ます。" },
    { formId: "te", sentence: "本を読んで、寝ます。", translation: "读完书后睡觉。", note: "连接动作，也可用于请求和 ている。" },
    { formId: "ta", sentence: "昨日、映画を見た。", translation: "昨天看了电影。", note: "普通体过去或完成。" },
    { formId: "tai", sentence: "日本へ行きたい。", translation: "想去日本。", note: "愿望：连用形＋たい。" },
    { formId: "ba", sentence: "時間があれば、勉強します。", translation: "如果有时间，就学习。", note: "假定条件：假定形＋ば。" },
    { formId: "tara", sentence: "家に帰ったら、電話します。", translation: "回家后（如果回家了），会打电话。", note: "具体条件或先后关系：た形＋ら。" },
    { formId: "nara", sentence: "日本へ行くなら、春がいいです。", translation: "如果要去日本，春天比较好。", note: "以话题或前提为条件：终止形＋なら。" },
    { formId: "kanou", sentence: "日本語が話せます。", translation: "会说日语。", note: "表示能力；与被动形的受事关系不同。" },
    { formId: "ukemi", sentence: "先生に褒められた。", translation: "被老师表扬了。", note: "主语受到他人动作影响。" },
    { formId: "shieki", sentence: "先生は学生に本を読ませた。", translation: "老师让学生读书。", note: "表示使某人做或允许某人做。" },
    { formId: "shiekiUkemi", sentence: "私は母に野菜を食べさせられた。", translation: "我被妈妈强迫吃蔬菜。", note: "表示被迫做某事；口语有缩约形式。" }
  ];

  var contrastExamples = [
    {
      title: "ないで vs なくて",
      note: "前者强调“不做前项”，后者常表示原因、状态或并列。",
      rows: [
        { label: "ないで", sentence: "朝ご飯を食べないで出かけた。", translation: "没吃早饭就出门了。" },
        { label: "なくて", sentence: "時間がなくて、困っている。", translation: "因为没有时间而烦恼。" }
      ]
    },
    {
      title: "たら vs なら vs ば",
      note: "三者都能表达条件，但前提来源和语气不同。",
      rows: [
        { label: "たら", sentence: "駅に着いたら、連絡してください。", translation: "到了车站后，请联系我。" },
        { label: "なら", sentence: "行くなら、早く出ましょう。", translation: "如果要去，就早点出发吧。" },
        { label: "ば", sentence: "安ければ、買います。", translation: "如果便宜就买。" }
      ]
    },
    {
      title: "可能形 vs 被动形",
      note: "可能形表示“能做”，被动形表示“受到动作影响”。",
      rows: [
        { label: "可能", sentence: "漢字が読めます。", translation: "能读汉字。" },
        { label: "被动", sentence: "友達に笑われた。", translation: "被朋友嘲笑了。" }
      ]
    }
  ];

  var sentenceTemplates = [
    { formId: "nai", prefix: "今日は", suffix: "。", translation: "今天不做这个动作。", note: "普通体否定。" },
    { formId: "masu", prefix: "毎朝、", suffix: "。", translation: "每天早上做这个动作。", note: "礼貌体现在时。" },
    { formId: "te", prefix: "毎日、", suffix: "います。", translation: "每天正在进行或持续做这个动作。", note: "て形连接 いる。" },
    { formId: "ta", prefix: "昨日、", suffix: "。", translation: "昨天做了这个动作。", note: "普通体过去。" },
    { formId: "tai", prefix: "日本で", suffix: "。", translation: "想在日本做这个动作。", note: "愿望表达。" },
    { formId: "ba", prefix: "", suffix: "、上手になります。", translation: "如果做这个动作，就会变得熟练。", note: "假定条件。" },
    { formId: "tara", prefix: "", suffix: "、休みましょう。", translation: "做完这个动作后休息吧。", note: "具体条件或先后关系。" },
    { formId: "nara", prefix: "", suffix: "、早く始めましょう。", translation: "如果要做这个动作，就早点开始吧。", note: "以话题或前提为条件。" },
    { formId: "kanou", prefix: "私はこの動作が", suffix: "。", translation: "我能做这个动作。", note: "能力表达；注意不要和被动混淆。" }
  ];

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
    soundRows: soundRows,
    usageExamples: usageExamples,
    contrastExamples: contrastExamples,
    sentenceTemplates: sentenceTemplates
  };
})();
