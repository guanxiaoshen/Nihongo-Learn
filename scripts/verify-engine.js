// Nihongo-Learn 引擎回归验证（临时脚本）
const path = require('path');
global.window = global;
const ROOT = path.resolve(__dirname, '..');
require(path.join(ROOT, 'data/forms.js'));
require(path.join(ROOT, 'data/verbs.js'));
require(path.join(ROOT, 'js/conjugator.js'));

const verbs = window.NIHONGO_DATA.verbs;
const conj = window.NIHONGO_DATA.conjugator;
let pass = 0, fail = 0;

// 1) 示例词：引擎生成 vs 预计算（必须完全一致）
for (const typeId of ['godan', 'ichidan', 'kuru', 'suru']) {
  const ex = verbs.typeExamples[typeId];
  const verb = { dictionary: ex.dictionary, kana: ex.kana, meaning: ex.meaning, type: typeId, exceptions: ex.exceptions };
  const result = conj.conjugate(verb);
  for (const [formId, expected] of Object.entries(ex.forms)) {
    const got = result.forms[formId];
    if (got === expected) { pass++; }
    else {
      fail++;
      console.log('MISMATCH ' + typeId + '.' + formId + ': engine=' + got + ' expected=' + expected);
    }
  }
}
console.log('示例词对比: ' + pass + ' 一致, ' + fail + ' 不一致');

// 2) 词库全部可变形，kanaForms 无残留汉字
for (const v of verbs.lexicon) {
  try {
    const r = conj.conjugate(v);
    for (const id of conj.formIds) {
      if (!r.forms[id]) throw new Error('缺少 ' + v.dictionary + '.' + id);
    }
    if (v.type === 'godan' || v.type === 'ichidan') {
      for (const id of conj.formIds) {
        if (/[^\u3040-\u309F\u30FC\uFF0F]/.test(r.kanaForms[id])) {
          throw new Error('kanaForms 非纯假名 ' + v.dictionary + '.' + id + '=' + r.kanaForms[id]);
        }
      }
    }
  } catch (e) {
    fail++;
    console.log('词库失败 ' + v.dictionary + ': ' + e.message);
  }
}
console.log('词库 ' + verbs.lexicon.length + ' 词变形: ' + (fail === 0 ? '全部通过' : '有失败 ' + fail + ' 项'));

// 3) 高频例外与易混词
const iku = verbs.lexicon.find(v => v.dictionary === '行く');
const aru = verbs.lexicon.find(v => v.dictionary === 'ある');
const kiri = verbs.lexicon.find(v => v.dictionary === '切る');
if (iku && conj.conjugate(iku).forms.te === '行って') {
  console.log('行く て形例外: 通过');
} else {
  fail++;
  console.log('行く て形例外: 失败');
}
if (aru && conj.conjugate(aru).forms.nai === 'ない') {
  console.log('ある 否定形例外: 通过');
} else {
  fail++;
  console.log('ある 否定形例外: 失败');
}
if (kiri && kiri.type === 'godan' && conj.conjugate(kiri).forms.te === '切って') {
  console.log('切る／着る 易混词区分: 通过');
} else {
  fail++;
  console.log('切る／着る 易混词区分: 失败');
}

// 4) 抽样展示几个词的变形供人工核对
const samples = [verbs.lexicon[0], verbs.lexicon[2], verbs.lexicon[5], verbs.lexicon[6], verbs.lexicon[12], verbs.lexicon[13], verbs.lexicon[14]];
for (const v of samples) {
  const r = conj.conjugate(v);
  console.log('\n[' + v.dictionary + ' (' + v.kana + ')] ' + v.type);
  ['mizenkei', 'te', 'ta', 'ishi', 'kanou', 'sonkei', 'kenjou'].forEach(function (id) {
    console.log('  ' + id + ': ' + r.forms[id] + '  (kana: ' + r.kanaForms[id] + ')');
  });
}

process.exitCode = fail > 0 ? 1 : 0;
