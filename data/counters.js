(function () {
  "use strict";

  window.NIHONGO_DATA = window.NIHONGO_DATA || {};
  window.NIHONGO_DATA.counters = {
    paths: [
      {
        id: "quantity",
        level: "core",
        label: "数什么",
        shortLabel: "数数",
        description: "先判断对象的类别，再选择对应量词和读法。",
        formula: "数什么 → 数字 + 量词 → 读法",
        counterGroups: ["general", "people", "long", "flat", "machines", "books", "animals", "age"]
      },
      {
        id: "clock",
        level: "core",
        label: "读时刻",
        shortLabel: "时间",
        description: "先读小时，再判断分钟；四、七、九时要单独记。",
        formula: "午前／午後 + 小时 + 分（半）",
        counterGroups: []
      },
      {
        id: "month",
        level: "core",
        label: "读月份",
        shortLabel: "月份",
        description: "日历上的月份和持续几个月不是同一条读法。",
        formula: "日历：数字 + 月；时长：数字 + か月",
        counterGroups: []
      },
      {
        id: "days",
        level: "core",
        label: "日期与天数",
        shortLabel: "日与天",
        description: "先判断是在说哪一天，还是持续几天。",
        formula: "日期／天数都写 + 日，但起点和读法不同",
        counterGroups: []
      }
    ],
    counterGroups: [
      {
        id: "general",
        label: "一般物品",
        counter: "つ",
        reading: "つ",
        badge: "通用",
        memory: "一つ到十个的独立读法：ひとつ → とお",
        role: "类别暂时不强调的具体物品、事情或数量（主要限 1～10）",
        position: "名词 + を + 数量 + ください／あります",
        steps: [
          { label: "起点", text: "要数的是具体项目，但当前不需要说明它属于哪一类。" },
          { label: "选择", text: "1～10 使用一つ到十的独立读法，不能把阿拉伯数字直接按音读套上去。" },
          { label: "接续", text: "数量放在动词前：りんごを三つください。" },
          { label: "用途", text: "用于一般物品或事项的快速计数；超过 10 个时改用更具体的量词或数字。" }
        ],
        example: {
          form: "三つ",
          reading: "みっつ",
          sentence: "りんごを三つください。",
          sentenceReading: "りんごを みっつ ください。",
          meaning: "请给我三个苹果。"
        },
        contrast: "三つ只说明“三个”，三枚则说明是三张薄片；对象类别改变，量词也要改变。",
        limit: "つ的独立读法主要到十：十个是十（とお），不能继续用“十一つ”来替代具体量词。",
        afterTen: {
          title: "十以后：切换为 個（こ）",
          memory: "十：とお（也可说十個＝じゅっこ）；十一以上：数字 + 個（こ）",
          role: "数量超过十，且对象没有更具体量词时，用個来数一般小物品。",
          position: "名词 + を + 数量 + 個 + ください／あります",
          formula: "十一以上 → 数字 + 個（こ）",
          example: {
            form: "十一個",
            reading: "じゅういっこ",
            sentence: "りんごを十一個ください。",
            sentenceReading: "りんごを じゅういっこ ください。",
            meaning: "请给我十一个苹果。"
          },
          contrast: "× 十一つ　／　○ 十一個（じゅういっこ）。つ的独立读法不继续接到十一。",
          limit: "個适合一般小物品，但不是所有物品的万能量词；有专用量词时，超过十也继续使用本、枚、冊等。",
          forms: [
            { number: 10, form: "十個", reading: "じゅっこ／じっこ", note: "一般计数也可说十（とお）" },
            { number: 11, form: "十一個", reading: "じゅういっこ" },
            { number: 12, form: "十二個", reading: "じゅうにこ" },
            { number: 13, form: "十三個", reading: "じゅうさんこ" },
            { number: 14, form: "十四個", reading: "じゅうよんこ" },
            { number: 15, form: "十五個", reading: "じゅうごこ" },
            { number: 16, form: "十六個", reading: "じゅうろっこ" },
            { number: 17, form: "十七個", reading: "じゅうななこ" },
            { number: 18, form: "十八個", reading: "じゅうはっこ" },
            { number: 19, form: "十九個", reading: "じゅうきゅうこ" },
            { number: 20, form: "二十個", reading: "にじゅっこ／にじっこ" }
          ]
        },
        forms: [
          { number: 1, form: "一つ", reading: "ひとつ" },
          { number: 2, form: "二つ", reading: "ふたつ" },
          { number: 3, form: "三つ", reading: "みっつ" },
          { number: 4, form: "四つ", reading: "よっつ" },
          { number: 5, form: "五つ", reading: "いつつ" },
          { number: 6, form: "六つ", reading: "むっつ" },
          { number: 7, form: "七つ", reading: "ななつ" },
          { number: 8, form: "八つ", reading: "やっつ" },
          { number: 9, form: "九つ", reading: "ここのつ" },
          { number: 10, form: "十", reading: "とお" }
        ],
        recall: [
          { id: "general-one", prompt: "「一つ」的读法是：", answer: "ひとつ", why: "つ在 1～10 中使用独立的和语读法。" },
          { id: "general-eight", prompt: "「八つ」的读法是：", answer: "やっつ", why: "八つ读作 やっつ，不是按八的音读直接拼接。" }
        ]
      },
      {
        id: "people",
        label: "人数",
        counter: "人",
        reading: "にん",
        badge: "人",
        memory: "一人ひとり、二人ふたり；三人起通常是数字 + にん",
        role: "数人，表示参与者、居民、学生等人的数量",
        position: "名词 + が／を + 数量 + います／集めます",
        steps: [
          { label: "起点", text: "先确认对象是人，而不是一般物品或动物。" },
          { label: "选择", text: "1人和2人保留特殊读法ひとり、ふたり；3人以后大多接にん。" },
          { label: "接续", text: "数量放在存在或动作前：学生が三人います。" },
          { label: "用途", text: "用于人数、成员数和参与人数；询问人数读何人（なんにん）。" }
        ],
        example: {
          form: "三人",
          reading: "さんにん",
          sentence: "学生が三人います。",
          sentenceReading: "がくせいが さんにん います。",
          meaning: "有三名学生。"
        },
        contrast: "三人是人数；三匹是小动物数量。都写成“数字 + 量词”，但对象类别决定量词。",
        limit: "四人读よにん，不读よんにん；一人、二人必须记作ひとり、ふたり。",
        forms: [
          { number: 1, form: "一人", reading: "ひとり" },
          { number: 2, form: "二人", reading: "ふたり" },
          { number: 3, form: "三人", reading: "さんにん" },
          { number: 4, form: "四人", reading: "よにん" },
          { number: 5, form: "五人", reading: "ごにん" },
          { number: 6, form: "六人", reading: "ろくにん" },
          { number: 7, form: "七人", reading: "ななにん" },
          { number: 8, form: "八人", reading: "はちにん" },
          { number: 9, form: "九人", reading: "きゅうにん" },
          { number: 10, form: "十人", reading: "じゅうにん" }
        ],
        recall: [
          { id: "people-two", prompt: "「二人」的读法是：", answer: "ふたり", why: "人数的 1、2 人是ひとり、ふたり这组特殊读法。" },
          { id: "people-four", prompt: "「四人」的读法是：", answer: "よにん", why: "四人固定读よにん，不能照四的常见读法读成よんにん。" }
        ]
      },
      {
        id: "long",
        label: "细长物",
        counter: "本",
        reading: "ほん",
        badge: "长物",
        memory: "本会发生音变：いっぽん／さんぼん／ろっぽん／はっぽん",
        role: "数笔、瓶、伞、树等细长或圆柱形物体",
        position: "名词 + を + 数量 + 买／使用／有",
        steps: [
          { label: "起点", text: "先看物体是否具有细长、条状或圆柱形的外形。" },
          { label: "选择", text: "量词写本；1、3、6、8、10等位置出现促音或半浊音变化。" },
          { label: "接续", text: "数量放在动词前：ペンを二本買います。" },
          { label: "用途", text: "可数笔、瓶、伞、树等；询问数量读何本（なんぼん）。" }
        ],
        example: {
          form: "三本",
          reading: "さんぼん",
          sentence: "ペンを三本買います。",
          sentenceReading: "ペンを さんぼん かいます。",
          meaning: "买三支笔。"
        },
        contrast: "三本强调细长形状；三枚强调平面薄片；同一个“物品”不能只看名称，要看这里数的是哪种形态。",
        limit: "本的音变不能省略：三本是さんぼん、六本是ろっぽん、八本是はっぽん。何本读なんぼん。",
        forms: [
          { number: 1, form: "一本", reading: "いっぽん" },
          { number: 2, form: "二本", reading: "にほん" },
          { number: 3, form: "三本", reading: "さんぼん" },
          { number: 4, form: "四本", reading: "よんほん" },
          { number: 5, form: "五本", reading: "ごほん" },
          { number: 6, form: "六本", reading: "ろっぽん" },
          { number: 7, form: "七本", reading: "ななほん" },
          { number: 8, form: "八本", reading: "はっぽん" },
          { number: 9, form: "九本", reading: "きゅうほん" },
          { number: 10, form: "十本", reading: "じゅっぽん／じっぽん", variants: ["じゅっぽん", "じっぽん"] }
        ],
        recall: [
          { id: "long-three", prompt: "「三本」的读法是：", answer: "さんぼん", why: "本在 3 的位置发生半浊音变化，ほん变成ぼん。" },
          { id: "long-six", prompt: "「六本」的读法是：", answer: "ろっぽん", why: "六本同时出现促音和半浊音。" }
        ]
      },
      {
        id: "flat",
        label: "薄片物",
        counter: "枚",
        reading: "まい",
        badge: "薄片",
        memory: "枚接数字较稳定：一枚いちまい、三枚さんまい",
        role: "数纸、票、衣服、盘子等平面、薄片或片状物品",
        position: "名词 + を + 数量 + 使う／買う／渡す",
        steps: [
          { label: "起点", text: "先判断对象是平面、薄片或一件一件摊开的物品。" },
          { label: "选择", text: "量词用枚，读作まい；和本、人不同，1～10基本没有大幅音变。" },
          { label: "接续", text: "数量放在动作前：紙を三枚使います。" },
          { label: "用途", text: "用于纸张、票、衬衫、盘子等；询问数量读何枚（なんまい）。" }
        ],
        example: {
          form: "三枚",
          reading: "さんまい",
          sentence: "紙を三枚使います。",
          sentenceReading: "かみを さんまい つかいます。",
          meaning: "使用三张纸。"
        },
        contrast: "纸张按张数用枚；纸卷成细长条并按卷计数时，关注的形态已经不同，不能机械换成本。",
        limit: "枚的读法较规则，但量词选择仍取决于物体的平面形态；不要因为数字相同就和本互换。",
        forms: [
          { number: 1, form: "一枚", reading: "いちまい" },
          { number: 2, form: "二枚", reading: "にまい" },
          { number: 3, form: "三枚", reading: "さんまい" },
          { number: 4, form: "四枚", reading: "よんまい" },
          { number: 5, form: "五枚", reading: "ごまい" },
          { number: 6, form: "六枚", reading: "ろくまい" },
          { number: 7, form: "七枚", reading: "ななまい" },
          { number: 8, form: "八枚", reading: "はちまい" },
          { number: 9, form: "九枚", reading: "きゅうまい" },
          { number: 10, form: "十枚", reading: "じゅうまい" }
        ],
        recall: [
          { id: "flat-three", prompt: "「三枚」的读法是：", answer: "さんまい", why: "枚读まい，三枚不发生本、匹那样的半浊音变化。" },
          { id: "flat-what", prompt: "「何枚」的读法是：", answer: "なんまい", why: "询问薄片物的数量时，何接まい读なんまい。" }
        ]
      },
      {
        id: "machines",
        label: "机器与车辆",
        counter: "台",
        reading: "だい",
        badge: "设备",
        memory: "车辆、机器、设备 → 数字 + 台（だい）",
        role: "数汽车、电脑、机器等有台座或设备性质的对象",
        position: "名词 + が／を + 数量 + あります／置きます",
        steps: [
          { label: "起点", text: "先确认对象是机器、车辆或设备，而不是普通小物品。" },
          { label: "选择", text: "量词用台，读作だい；数字和だい直接连接，读法相对稳定。" },
          { label: "接续", text: "数量放在存在或配置动作前：車が二台あります。" },
          { label: "用途", text: "用于车辆、电脑、打印机等设备；询问数量读何台（なんだい）。" }
        ],
        example: {
          form: "二台",
          reading: "にだい",
          sentence: "車が二台あります。",
          sentenceReading: "くるまが にだい あります。",
          meaning: "有两辆车。"
        },
        contrast: "车按设备/车辆用台；人用人，动物用匹。量词表达的是分类视角，不只是数字。",
        limit: "台不是所有大件物品都能用；它主要对应机器、车辆和设备。",
        forms: [
          { number: 1, form: "一台", reading: "いちだい" },
          { number: 2, form: "二台", reading: "にだい" },
          { number: 3, form: "三台", reading: "さんだい" },
          { number: 4, form: "四台", reading: "よんだい" },
          { number: 5, form: "五台", reading: "ごだい" },
          { number: 6, form: "六台", reading: "ろくだい" },
          { number: 7, form: "七台", reading: "ななだい" },
          { number: 8, form: "八台", reading: "はちだい" },
          { number: 9, form: "九台", reading: "きゅうだい" },
          { number: 10, form: "十台", reading: "じゅうだい" }
        ],
        recall: [
          { id: "machines-two", prompt: "「二台」的读法是：", answer: "にだい", why: "机器和车辆使用台，二台直接读にだい。" },
          { id: "machines-what", prompt: "「何台」的读法是：", answer: "なんだい", why: "询问设备或车辆数量时，何台读なんだい。" }
        ]
      },
      {
        id: "books",
        label: "书与成册物",
        counter: "冊",
        reading: "さつ",
        badge: "成册",
        memory: "冊会在 1、8、10 等位置缩成促音：いっさつ／はっさつ",
        role: "数书、杂志、册装资料等成册的物品",
        position: "名词 + を + 数量 + 読む／買う",
        steps: [
          { label: "起点", text: "先判断对象是装订成册、可以一本一本翻阅的资料。" },
          { label: "选择", text: "量词用冊；1、8、10常见促音变化，さ行清音仍要读清楚。" },
          { label: "接续", text: "数量放在动作前：本を三冊読みました。" },
          { label: "用途", text: "用于书、杂志、册装文件；询问数量读何冊（なんさつ）。" }
        ],
        example: {
          form: "三冊",
          reading: "さんさつ",
          sentence: "本を三冊読みました。",
          sentenceReading: "ほんを さんさつ よみました。",
          meaning: "读了三本书。"
        },
        contrast: "书是成册物用冊；同样的纸张如果按单张数则用枚，按类别和对象的单位来选。",
        limit: "一冊读いっさつ，八冊读はっさつ，十冊常读じゅっさつ或じっさつ；何冊是なんさつ。",
        forms: [
          { number: 1, form: "一冊", reading: "いっさつ" },
          { number: 2, form: "二冊", reading: "にさつ" },
          { number: 3, form: "三冊", reading: "さんさつ" },
          { number: 4, form: "四冊", reading: "よんさつ" },
          { number: 5, form: "五冊", reading: "ごさつ" },
          { number: 6, form: "六冊", reading: "ろくさつ" },
          { number: 7, form: "七冊", reading: "ななさつ" },
          { number: 8, form: "八冊", reading: "はっさつ" },
          { number: 9, form: "九冊", reading: "きゅうさつ" },
          { number: 10, form: "十冊", reading: "じゅっさつ／じっさつ", variants: ["じゅっさつ", "じっさつ"] }
        ],
        recall: [
          { id: "books-one", prompt: "「一冊」的读法是：", answer: "いっさつ", why: "冊在 1 的位置发生促音变化。" },
          { id: "books-eight", prompt: "「八冊」的读法是：", answer: "はっさつ", why: "八冊读はっさつ，八的尾音和冊连接时产生促音。" }
        ]
      },
      {
        id: "animals",
        label: "小动物",
        counter: "匹",
        reading: "ひき",
        badge: "动物",
        memory: "匹的 h 音会变：いっぴき／さんびき／ろっぴき",
        role: "数猫、狗、鱼、昆虫等通常按小只计数的动物",
        position: "名词 + が + 数量 + います／飼っています",
        steps: [
          { label: "起点", text: "先判断动物体型和计数习惯；小动物通常使用匹。" },
          { label: "选择", text: "量词用匹；1、3、6、8、10等位置出现促音或半浊音变化。" },
          { label: "接续", text: "数量放在存在或饲养动作前：猫が二匹います。" },
          { label: "用途", text: "用于猫狗、鱼、昆虫等；大型动物常改用頭，鸟类常用羽。" }
        ],
        example: {
          form: "二匹",
          reading: "にひき",
          sentence: "猫が二匹います。",
          sentenceReading: "ねこが にひき います。",
          meaning: "有两只猫。"
        },
        contrast: "小猫用匹；大象等大型动物常用頭；鸟类通常用羽。体型和类别会改变量词。",
        limit: "匹的音变不能按“数字 + ひき”机械拼读：三匹是さんびき，八匹是はっぴき，何匹是なんびき。",
        forms: [
          { number: 1, form: "一匹", reading: "いっぴき" },
          { number: 2, form: "二匹", reading: "にひき" },
          { number: 3, form: "三匹", reading: "さんびき" },
          { number: 4, form: "四匹", reading: "よんひき" },
          { number: 5, form: "五匹", reading: "ごひき" },
          { number: 6, form: "六匹", reading: "ろっぴき" },
          { number: 7, form: "七匹", reading: "ななひき" },
          { number: 8, form: "八匹", reading: "はっぴき" },
          { number: 9, form: "九匹", reading: "きゅうひき" },
          { number: 10, form: "十匹", reading: "じゅっぴき／じっぴき", variants: ["じゅっぴき", "じっぴき"] }
        ],
        recall: [
          { id: "animals-three", prompt: "「三匹」的读法是：", answer: "さんびき", why: "匹在 3 的位置由ひき变为びき。" },
          { id: "animals-limit", prompt: "小猫两只应使用哪个量词：", answer: "匹", why: "通常按小只计数的猫狗使用匹；这里不是人数或一般物品。" }
        ]
      },
      {
        id: "age",
        label: "年龄",
        counter: "歳",
        reading: "さい",
        badge: "年龄",
        memory: "年龄：数字 + 歳；二十岁不是にじゅっさい，而是はたち",
        role: "表示人的年龄或事物存在的年数",
        position: "名词 + は + 数量 + 歳 + です",
        steps: [
          { label: "起点", text: "先确认是在说年龄，而不是普通物品数量或持续时间。" },
          { label: "选择", text: "通常接歳（さい）；1、8、10等有促音变化，20岁保留特殊读法はたち。" },
          { label: "接续", text: "年龄放在です前：私は二十歳です。" },
          { label: "用途", text: "用于询问或说明年龄；何歳读なんさい，较礼貌地也会说おいくつ。" }
        ],
        example: {
          form: "二十歳",
          reading: "はたち",
          sentence: "私は二十歳です。",
          sentenceReading: "わたしは はたちです。",
          meaning: "我二十岁。"
        },
        contrast: "二十歳是年龄的固定读法はたち；二十分钟是二十分（にじゅっぷん），二十天是二十日（はつか），单位不同不能互换。",
        limit: "二十岁要记はたち；一歳、八歳、十歳常见いっさい、はっさい、じゅっさい／じっさい。",
        forms: [
          { number: 1, form: "一歳", reading: "いっさい" },
          { number: 2, form: "二歳", reading: "にさい" },
          { number: 3, form: "三歳", reading: "さんさい" },
          { number: 4, form: "四歳", reading: "よんさい" },
          { number: 5, form: "五歳", reading: "ごさい" },
          { number: 6, form: "六歳", reading: "ろくさい" },
          { number: 7, form: "七歳", reading: "ななさい" },
          { number: 8, form: "八歳", reading: "はっさい" },
          { number: 9, form: "九歳", reading: "きゅうさい" },
          { number: 10, form: "十歳", reading: "じゅっさい／じっさい", variants: ["じゅっさい", "じっさい"] },
          { number: 20, form: "二十歳", reading: "はたち", note: "特殊读法" }
        ],
        recall: [
          { id: "age-twenty", prompt: "「二十歳」的读法是：", answer: "はたち", why: "年龄的二十岁保留特殊读法はたち。" },
          { id: "age-eight", prompt: "「八歳」的读法是：", answer: "はっさい", why: "歳在八的后面形成促音：はっさい。" }
        ]
      }
    ],
    clock: {
      memory: "先读小时，再读分钟；四時よじ、七時しちじ、九時くじ要单独记。",
      steps: [
        { label: "起点", text: "先判断是在报时刻，还是在说持续多久；时刻使用時、分，持续时间使用相应时长表达。" },
        { label: "小时", text: "数字 + 時；四时读よじ，七时读しちじ，九时读くじ。" },
        { label: "分钟", text: "数字 + 分；1、3、4、6、8、10等会出现ぷん／ふん和促音变化。" },
        { label: "接续", text: "午前／午後 + 小时 + 分；30分也常读半：午後七時半です。" }
      ],
      example: {
        form: "午後七時半",
        reading: "ごご しちじはん",
        sentence: "会議は午後七時半です。",
        sentenceReading: "かいぎは ごご しちじはんです。",
        meaning: "会议在晚上七点半。"
      },
      contrast: "四時是よじ，但四月是しがつ；七時是しちじ，但七月是しちがつ。先看后面的单位。",
      limit: "本模块按基础标准读法收录四時よじ、七時しちじ、九時くじ；分钟的口语变体不替代基本规则。",
      hours: [
        { number: 1, form: "一時", reading: "いちじ" },
        { number: 2, form: "二時", reading: "にじ" },
        { number: 3, form: "三時", reading: "さんじ" },
        { number: 4, form: "四時", reading: "よじ", note: "特殊" },
        { number: 5, form: "五時", reading: "ごじ" },
        { number: 6, form: "六時", reading: "ろくじ" },
        { number: 7, form: "七時", reading: "しちじ", note: "特殊" },
        { number: 8, form: "八時", reading: "はちじ" },
        { number: 9, form: "九時", reading: "くじ", note: "特殊" },
        { number: 10, form: "十時", reading: "じゅうじ" },
        { number: 11, form: "十一時", reading: "じゅういちじ" },
        { number: 12, form: "十二時", reading: "じゅうにじ" }
      ],
      minuteUnits: {
        0: "れいふん",
        1: "いっぷん",
        2: "にふん",
        3: "さんぷん",
        4: "よんぷん",
        5: "ごふん",
        6: "ろっぷん",
        7: "ななふん",
        8: "はっぷん",
        9: "きゅうふん"
      },
      minutePrefixes: {
        10: "じゅう",
        20: "にじゅう",
        30: "さんじゅう",
        40: "よんじゅう",
        50: "ごじゅう"
      },
      minuteTens: {
        10: "じゅっぷん／じっぷん",
        20: "にじゅっぷん",
        30: "さんじゅっぷん",
        40: "よんじゅっぷん",
        50: "ごじゅっぷん"
      },
      minuteExamples: [
        { number: 0, form: "〇分", reading: "れいふん", note: "也可听到ゼロ分" },
        { number: 1, form: "一分", reading: "いっぷん" },
        { number: 3, form: "三分", reading: "さんぷん" },
        { number: 4, form: "四分", reading: "よんぷん" },
        { number: 6, form: "六分", reading: "ろっぷん" },
        { number: 8, form: "八分", reading: "はっぷん" },
        { number: 10, form: "十分", reading: "じゅっぷん／じっぷん" },
        { number: 15, form: "十五分", reading: "じゅうごふん" },
        { number: 30, form: "三十分", reading: "さんじゅっぷん／はん" },
        { number: 45, form: "四十五分", reading: "よんじゅうごふん" }
      ],
      durationExamples: [
        { form: "一時間", reading: "いちじかん", meaning: "一小时" },
        { form: "三時間", reading: "さんじかん", meaning: "三小时" },
        { form: "二時間半", reading: "にじかんはん", meaning: "两个半小时" }
      ]
    },
    months: {
      memory: "日历月份读数字 + 月；四月しがつ、七月しちがつ、九月くがつ是关键。",
      steps: [
        { label: "起点", text: "先判断是在说日历上的第几个月，还是一段持续的月数。" },
        { label: "日历月份", text: "月份单位读がつ；4、7、9月分别读しがつ、しちがつ、くがつ。" },
        { label: "持续月数", text: "持续时间使用か月／ヶ月，4个月是よんかげつ，6个月是ろっかげつ。" },
        { label: "接续", text: "日期常用 月 + に + 动作；持续时间直接修饰持续表达：三か月勉強します。" }
      ],
      example: {
        form: "七月",
        reading: "しちがつ",
        sentence: "七月に日本へ行きます。",
        sentenceReading: "しちがつに にほんへ いきます。",
        meaning: "七月去日本。"
      },
      contrast: "四月是しがつ，四个月是よんかげつ；前者是日历标签，后者是持续长度。",
      limit: "月份的月读がつ，月数的か月读かげつ；不要把“四月”的しがつ套进“四个月”。",
      calendar: [
        { number: 1, form: "一月", reading: "いちがつ" },
        { number: 2, form: "二月", reading: "にがつ" },
        { number: 3, form: "三月", reading: "さんがつ" },
        { number: 4, form: "四月", reading: "しがつ", note: "特殊" },
        { number: 5, form: "五月", reading: "ごがつ" },
        { number: 6, form: "六月", reading: "ろくがつ" },
        { number: 7, form: "七月", reading: "しちがつ", note: "特殊" },
        { number: 8, form: "八月", reading: "はちがつ" },
        { number: 9, form: "九月", reading: "くがつ", note: "特殊" },
        { number: 10, form: "十月", reading: "じゅうがつ" },
        { number: 11, form: "十一月", reading: "じゅういちがつ" },
        { number: 12, form: "十二月", reading: "じゅうにがつ" }
      ],
      duration: [
        { number: 1, form: "一か月", reading: "いっかげつ", variants: ["一ヶ月"] },
        { number: 2, form: "二か月", reading: "にかげつ", variants: ["二ヶ月"] },
        { number: 3, form: "三か月", reading: "さんかげつ", variants: ["三ヶ月"] },
        { number: 4, form: "四か月", reading: "よんかげつ", variants: ["四ヶ月"] },
        { number: 5, form: "五か月", reading: "ごかげつ", variants: ["五ヶ月"] },
        { number: 6, form: "六か月", reading: "ろっかげつ", variants: ["六ヶ月"] },
        { number: 7, form: "七か月", reading: "ななかげつ", variants: ["七ヶ月"] },
        { number: 8, form: "八か月", reading: "はちかげつ", variants: ["八ヶ月"] },
        { number: 9, form: "九か月", reading: "きゅうかげつ", variants: ["九ヶ月"] },
        { number: 10, form: "十か月", reading: "じゅっかげつ／じっかげつ", variants: ["十ヶ月", "じゅっかげつ", "じっかげつ"] },
        { number: 11, form: "十一か月", reading: "じゅういっかげつ", variants: ["十一ヶ月"] },
        { number: 12, form: "十二か月", reading: "じゅうにかげつ", variants: ["十二ヶ月"] }
      ]
    },
    days: {
      memory: "日期和天数都写“数字 + 日”，但一日先判断：ついたち是每月1日，いちにちは一天。",
      steps: [
        { label: "起点", text: "先判断是在日历上定位某一天，还是在计算持续了几天。" },
        { label: "日期", text: "1～10日和14日、20日、24日有独立读法；其他日期多按数字 + にち。" },
        { label: "天数", text: "1～10天保留一日いちにち、二日ふつか等；14天、20天、24天也常保留特殊读法。" },
        { label: "接续", text: "日期常接に：七月二十四日に会います；天数直接和休む、かかる等表达连接。" }
      ],
      example: {
        form: "二十四日",
        reading: "にじゅうよっか",
        sentence: "七月二十四日に会います。",
        sentenceReading: "しちがつ にじゅうよっかに あいます。",
        meaning: "七月二十四日见面。"
      },
      contrast: "一日作为日期读ついたち；一日作为持续一天读いちにち。相同汉字必须先看语义。",
      limit: "14日、20日、24日不能只按数字 + にち机械拼读；日期和天数都要把语境一起记住。",
      dateForms: [
        { number: 1, form: "一日", reading: "ついたち" },
        { number: 2, form: "二日", reading: "ふつか" },
        { number: 3, form: "三日", reading: "みっか" },
        { number: 4, form: "四日", reading: "よっか" },
        { number: 5, form: "五日", reading: "いつか" },
        { number: 6, form: "六日", reading: "むいか" },
        { number: 7, form: "七日", reading: "なのか" },
        { number: 8, form: "八日", reading: "ようか" },
        { number: 9, form: "九日", reading: "ここのか" },
        { number: 10, form: "十日", reading: "とおか" },
        { number: 11, form: "十一日", reading: "じゅういちにち" },
        { number: 12, form: "十二日", reading: "じゅうににち" },
        { number: 13, form: "十三日", reading: "じゅうさんにち" },
        { number: 14, form: "十四日", reading: "じゅうよっか" },
        { number: 15, form: "十五日", reading: "じゅうごにち" },
        { number: 16, form: "十六日", reading: "じゅうろくにち" },
        { number: 17, form: "十七日", reading: "じゅうしちにち", variants: ["じゅうななにち"] },
        { number: 18, form: "十八日", reading: "じゅうはちにち" },
        { number: 19, form: "十九日", reading: "じゅうくにち", variants: ["じゅうきゅうにち"] },
        { number: 20, form: "二十日", reading: "はつか" },
        { number: 21, form: "二十一日", reading: "にじゅういちにち" },
        { number: 22, form: "二十二日", reading: "にじゅうににち" },
        { number: 23, form: "二十三日", reading: "にじゅうさんにち" },
        { number: 24, form: "二十四日", reading: "にじゅうよっか" },
        { number: 25, form: "二十五日", reading: "にじゅうごにち" },
        { number: 26, form: "二十六日", reading: "にじゅうろくにち" },
        { number: 27, form: "二十七日", reading: "にじゅうしちにち", variants: ["にじゅうななにち"] },
        { number: 28, form: "二十八日", reading: "にじゅうはちにち" },
        { number: 29, form: "二十九日", reading: "にじゅうくにち", variants: ["にじゅうきゅうにち"] },
        { number: 30, form: "三十日", reading: "さんじゅうにち" },
        { number: 31, form: "三十一日", reading: "さんじゅういちにち" }
      ],
      durationSpecials: {
        1: "いちにち",
        2: "ふつか",
        3: "みっか",
        4: "よっか",
        5: "いつか",
        6: "むいか",
        7: "なのか",
        8: "ようか",
        9: "ここのか",
        10: "とおか",
        14: "じゅうよっか",
        20: "はつか",
        24: "にじゅうよっか"
      },
      numberReadings: {
        11: "じゅういち",
        12: "じゅうに",
        13: "じゅうさん",
        15: "じゅうご",
        16: "じゅうろく",
        17: "じゅうなな",
        18: "じゅうはち",
        19: "じゅうきゅう",
        21: "にじゅういち",
        22: "にじゅうに",
        23: "にじゅうさん",
        25: "にじゅうご",
        26: "にじゅうろく",
        27: "にじゅうなな",
        28: "にじゅうはち",
        29: "にじゅうきゅう",
        30: "さんじゅう",
        31: "さんじゅういち"
      },
      weekdays: [
        { form: "月曜日", reading: "げつようび", meaning: "星期一" },
        { form: "火曜日", reading: "かようび", meaning: "星期二" },
        { form: "水曜日", reading: "すいようび", meaning: "星期三" },
        { form: "木曜日", reading: "もくようび", meaning: "星期四" },
        { form: "金曜日", reading: "きんようび", meaning: "星期五" },
        { form: "土曜日", reading: "どようび", meaning: "星期六" },
        { form: "日曜日", reading: "にちようび", meaning: "星期日" }
      ]
    },
    practice: {
      quantity: [
        { id: "practice-quantity-one", prompt: "「一人」的读法是：", answer: "ひとり", why: "人数的 1 人是ひとり这一特殊读法。" },
        { id: "practice-quantity-three", prompt: "「三匹」的读法是：", answer: "さんびき", why: "小动物使用匹，三匹发生半浊音变化。" },
        { id: "practice-quantity-twenty", prompt: "「二十歳」的读法是：", answer: "はたち", why: "年龄的 20 岁是固定读法はたち。" }
      ],
      clock: [
        { id: "practice-clock-four", prompt: "「四時」的读法是：", answer: "よじ", why: "时间的四时读よじ。" },
        { id: "practice-clock-seven-thirty", prompt: "「午後七時半」的读法是：", answer: "ごごしちじはん", accepted: ["ごご しちじはん"], why: "先读午后，再读七时半；七时在本模块按しちじ记。" },
        { id: "practice-clock-ten", prompt: "「十分」作为时间的十分钟，读作：", answer: "じゅっぷん", accepted: ["じっぷん"], why: "分在十的后面常读じゅっぷん，也可听到じっぷん。" }
      ],
      month: [
        { id: "practice-month-april", prompt: "日历上的「四月」读作：", answer: "しがつ", why: "月份的月读がつ，四月固定读しがつ。" },
        { id: "practice-month-four-duration", prompt: "「四か月」读作：", answer: "よんかげつ", why: "持续月数使用かげつ，四个月读よんかげつ。" },
        { id: "practice-month-september", prompt: "日历上的「九月」读作：", answer: "くがつ", why: "九月固定读くがつ，不沿用九的きゅう。" }
      ],
      days: [
        { id: "practice-days-first-date", prompt: "每月 1 日的「一日」读作：", answer: "ついたち", why: "这是日历日期，不是持续一天。" },
        { id: "practice-days-one-duration", prompt: "「一天」的「一日」读作：", answer: "いちにち", why: "表示持续时长时，一日读いちにち。" },
        { id: "practice-days-twenty-four", prompt: "「二十四日」的读法是：", answer: "にじゅうよっか", why: "24 日保留よっか这一特殊日数读法。" }
      ]
    }
  };
})();
