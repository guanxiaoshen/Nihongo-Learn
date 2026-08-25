// 形容词/名词引擎回归验证（临时验证，先跑通再集成）
const ROOT = 'E:/01_Projects/Nihongo-Learn/';
global.window = global;
require(ROOT + 'data/adj-noun.js');
require(ROOT + 'js/adj-conjugator.js');

const D = window.NIHONGO_DATA;
const adj = D['adj-conjugator'];
let pass = 0, fail = 0;

// 1) 示例词：引擎生成 vs 预计算
for (const typeId of ['i-adj', 'na-adj', 'noun']) {
  const ex = D.adjNoun.examples[typeId];
  const entry = { dictionary: ex.dictionary, kana: ex.kana, meaning: ex.meaning, type: typeId };
  const r = adj.conjugate(entry);
  for (const [formId, expected] of Object.entries(ex.forms)) {
    const got = r.forms[formId];
    if (got === expected) pass++;
    else { fail++; console.log('MISMATCH ' + typeId + '.' + formId + ': ' + got + ' != ' + expected); }
  }
}
console.log('示例词对比: ' + pass + ' 一致, ' + fail + ' 不一致');

// 2) 词库 18 词全部可变形 + kanaForms 纯假名
for (const v of D.adjNoun.lexicon) {
  try {
    const r = adj.conjugate(v);
    for (const id of adj.formIds) {
      if (!r.forms[id]) throw new Error('缺少 ' + v.dictionary + '.' + id);
      if (/[^\u3040-\u309F\u30FC\u3005]/.test(r.kanaForms[id])) {
        throw new Error('kanaForms 非纯假名 ' + v.dictionary + '.' + id + '=' + r.kanaForms[id]);
      }
    }
  } catch (e) { fail++; console.log('词库失败 ' + v.dictionary + ': ' + e.message); }
}
console.log('词库 18 词变形: ' + (fail === 0 ? '全部通过' : '有失败'));

// 3) 抽样展示
for (const dict of ['高い', 'きれい', '猫']) {
  const v = D.adjNoun.lexicon.find(x => x.dictionary === dict);
  const r = adj.conjugate(v);
  console.log('\n[' + v.dictionary + ' (' + v.kana + ')] ' + v.type);
  adj.formIds.forEach(id => console.log('  ' + id + ': ' + r.forms[id] + '  (kana: ' + r.kanaForms[id] + ')'));
}
