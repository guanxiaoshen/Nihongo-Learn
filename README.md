# Nihongo-Learn

一个面向中文学习者的日语活用学习页。项目保持纯静态、零框架、零后端，双击 `index.html` 或部署到 GitHub Pages 即可使用。

## 学习模块

| 页面 | 内容 |
|---|---|
| `index.html` | 首页导航与五套和风主题 |
| `verb-conjugation-stamp.html` | 动词 25 个活用/接续形、五段音变、句子辨析与练习 |
| `adj-noun-stamp.html` | い形容词、な形容词、名词的六种变化与练习 |

规则卡片可以翻面查看代表词、`ruby` 振假名和词干/接续分解。规则页同时提供短句，帮助从“记形式”过渡到“理解用法”。动词页的五段音变表还在每个词尾结果格中给出代表例子，例如 `書く → 書いて／書いた`、`泳ぐ → 泳いで／泳いだ`，并单独标出 `行く → 行って／行った` 例外。

## 练习方式

练习交互方式：

- **简易模式**：四选一；
- **标准模式**：输入答案；
- 汉字、假名、去括号注音和词条配置的常用变体可按规则判定。

练习题型：

- **同词多形**：一个词连续练多个活用形，适合刚学完规则；
- **混合词条**：每题随机更换词条和活用形，练习迁移；
- **句子填空**：根据句子和中文提示填写变形；
- **词类判断**：先判断五段/一段/か变/さ变，或い形容词/な形容词/名词；
- **普通／礼貌体**：练习动词词典形与ます形、形容词/名词普通谓语与です体之间的转换。

提示设置可以分别隐藏假名和中文。完成答题后会保存本次结果；同一答案重复检查不会重复计数。

## 词库与变形引擎

数据和逻辑已拆分，页面通过 `<script>` 顺序加载，因而不依赖 `fetch`，可在 `file://` 环境运行。

- `data/forms.js`：动词活用形、规则、句子和辨析数据；
- `data/verbs.js`：动词示例、练习词库和例外配置；
- `data/adj-noun.js`：形容词/名词规则、句子和词库；
- `js/conjugator.js`：五段、一段、来る、する/复合する引擎；
- `js/adj-conjugator.js`：い形容词、な形容词和名词引擎。

词库优先收录高频词、例外词和易混词，例如：

- `行く → 行って／行った`；
- `ある → ない`；
- `切る` 与 `着る`；
- `いい → よくない／よかった`。

## 统计与复习

- `sessionStorage` 保存当前页面的练习会话；
- `localStorage` 保存各词、各活用形的正确率和错题队列；
- 错题按“词条 + 活用形”去重；
- 记录错误次数、连续答对次数、最近答题时间和下次复习时间；
- 错题连续答对 3 次后移出复习队列；
- 支持错题再练和清空统计。

## 本地运行

直接打开 `index.html` 即可。若使用本地静态服务器，也可以从仓库根目录启动任意现有的静态文件服务器。

项目没有 `package.json`，运行页面本身不需要安装依赖。页面回归脚本使用 `jsdom`，需要临时验证时可执行：

```powershell
npm install --no-save --no-package-lock jsdom
node scripts/verify-engine.js
node scripts/verify-adj-engine.js
node scripts/render-check.js
node scripts/render-check-adj.js
node scripts/verify-answers.js
node scripts/theme-check.js
Remove-Item -LiteralPath node_modules -Recurse -Force
```

## 文档

- `docs/需求澄清问题清单.md`：需求基线、数据规模和功能里程碑；
- `docs/ui-review.md`：视觉、可读性、无障碍和响应式审查；
- `.github/workflows/pages.yml`：GitHub Pages 自动部署配置。
