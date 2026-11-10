import { createBodyMap, MUSCLE_NAMES } from './body-map.js';

// ===== 種目の説明 =====
// 種目を選ぶ画面とワークアウト画面の両方で使う。
// 重量は初心者が始めるときの目安（男性・女性の両方を、幅ではなく1つの数字で表示する）。

// type: 'weight'（重量あり）/ 'bw'（自重）/ 'cardio'（有酸素）
// main: 主に使う筋肉（筋肉の図で薄い青にする。名前は body-map.js の MUSCLE_NAMES を参照）
// sub: 補助で使う筋肉（図では色を付けず、名前だけ表示する）
// extra: 筋肉のほかに鍛えられるもの（有酸素の心肺機能など）
// equipment: 使う器具
const EXERCISE_INFO = {
  // ----- 胸 -----
  'ベンチプレス': {
    type: 'weight',
    main: ['chest-middle', 'chest-lower'],
    sub: ['delt-front', 'triceps'],
    equipment: 'バーベル、ベンチ',
    male: '20kg',
    female: '10kg',
    reps: '10回 × 3セット',
    points: [
      '肩甲骨を寄せて胸を張り、背中に少しアーチを作る',
      'バーは胸の真ん中（乳首のあたり）に下ろす',
      '慣れるまでは補助してくれる人がいるか、セーフティバーを使う',
    ],
  },
  'ダンベルプレス': {
    type: 'weight',
    main: ['chest-middle', 'chest-lower'],
    sub: ['delt-front', 'triceps'],
    equipment: 'ダンベル、ベンチ',
    male: '片手 8kg',
    female: '片手 3kg',
    reps: '10回 × 3セット',
    points: [
      '肩甲骨を寄せて胸を張ったまま行う',
      '下ろすときは胸が伸びるのを感じながらゆっくり',
      'ダンベルは手首の真上に来るように持つ',
    ],
  },
  'チェストプレス（マシン）': {
    type: 'weight',
    main: ['chest-middle'],
    sub: ['delt-front', 'triceps'],
    equipment: 'チェストプレスマシン',
    male: '25kg',
    female: '10kg',
    reps: '10〜12回 × 3セット',
    points: [
      'グリップが胸の高さに来るようにシートを調整する',
      '背中をシートにつけ、肩がすくまないようにする',
      '押し切ったときにひじを伸ばしきらない',
    ],
  },
  'ペックフライ（マシン）': {
    type: 'weight',
    main: ['chest-middle'],
    sub: ['delt-front'],
    equipment: 'ペックフライマシン',
    male: '20kg',
    female: '10kg',
    reps: '12回 × 3セット',
    points: [
      'ひじを軽く曲げた形のまま、腕で円を描くように閉じる',
      '閉じたところで胸を寄せる意識を持つ',
      '戻すときもゆっくり、胸が伸びるのを感じる',
    ],
  },
  '腕立て伏せ': {
    type: 'bw',
    main: ['chest-middle', 'chest-lower'],
    sub: ['delt-front', 'triceps'],
    equipment: 'なし',
    reps: '10回 × 3セット（きつければひざをついて行う）',
    points: [
      '頭からかかとまで一直線にし、お尻を上げたり下げたりしない',
      '手は肩幅より少し広めにつく',
      '胸が床に近づくまで下ろす',
    ],
  },

  // ----- 背中 -----
  'ラットプルダウン': {
    type: 'weight',
    main: ['lats'],
    sub: ['traps-lower', 'biceps'],
    equipment: 'ラットプルダウンマシン',
    male: '30kg',
    female: '15kg',
    reps: '10〜12回 × 3セット',
    points: [
      '胸を張り、バーを鎖骨のあたりに向かって引く',
      '腕ではなく、ひじを下に引くイメージで背中を使う',
      '体を後ろに倒しすぎない',
    ],
  },
  'シーテッドロー': {
    type: 'weight',
    main: ['lats', 'traps-middle'],
    sub: ['delt-rear', 'biceps'],
    equipment: 'シーテッドローマシン',
    male: '30kg',
    female: '15kg',
    reps: '10〜12回 × 3セット',
    points: [
      '背すじを伸ばしたまま、お腹に向かって引く',
      '引ききったところで肩甲骨を寄せる',
      '体を前後に揺らして反動を使わない',
    ],
  },
  'ワンハンドローイング': {
    type: 'weight',
    main: ['lats'],
    sub: ['traps-middle', 'delt-rear', 'biceps'],
    equipment: 'ダンベル、ベンチ',
    male: '片手 10kg',
    female: '片手 4kg',
    reps: '左右 10回 × 3セット',
    points: [
      'ベンチに片手・片ひざをつき、背中をまっすぐに保つ',
      'ダンベルは腰に向かって引き上げる',
      '体をひねって持ち上げない',
    ],
  },
  'デッドリフト': {
    type: 'weight',
    main: ['erector', 'glute-max', 'hamstrings'],
    sub: ['traps-upper', 'quads', 'forearm'],
    equipment: 'バーベル',
    male: '40kg',
    female: '20kg',
    reps: '8回 × 3セット',
    points: [
      '背中を丸めず、まっすぐに保ったまま持ち上げる',
      'バーはすねや太ももに沿わせて体の近くを通す',
      'フォームが崩れやすいので、軽い重さから始める',
    ],
  },
  '懸垂': {
    type: 'bw',
    main: ['lats'],
    sub: ['traps-lower', 'biceps'],
    equipment: '懸垂バー',
    reps: 'できる回数 × 3セット（できなければ斜め懸垂やアシストマシンで行う）',
    points: [
      '胸を張り、あごがバーを越えるまで体を引き上げる',
      '足を振って反動を使わない',
      '下ろすときもゆっくり下ろす',
    ],
  },

  // ----- 脚 -----
  'スクワット': {
    type: 'weight',
    main: ['quads', 'glute-max'],
    sub: ['hamstrings', 'adductors', 'erector'],
    equipment: 'バーベル、スクワットラック（パワーラック）',
    male: '30kg',
    female: '20kg',
    reps: '10回 × 3セット',
    points: [
      '足は肩幅くらいに開き、つま先とひざを同じ向きにする',
      'いすに座るように、お尻を後ろに引きながらしゃがむ',
      '太ももが床と平行になるくらいまで下ろす',
    ],
  },
  'レッグプレス': {
    type: 'weight',
    main: ['quads', 'glute-max'],
    sub: ['hamstrings', 'adductors'],
    equipment: 'レッグプレスマシン',
    male: '60kg',
    female: '30kg',
    reps: '10〜12回 × 3セット',
    points: [
      '腰とお尻をシートから浮かさない',
      '押し切ったときにひざを伸ばしきらない',
      'ひざが内側に入らないようにする',
    ],
  },
  'レッグエクステンション': {
    type: 'weight',
    main: ['quads'],
    sub: [],
    equipment: 'レッグエクステンションマシン',
    male: '20kg',
    female: '10kg',
    reps: '12回 × 3セット',
    points: [
      'ひざの位置がマシンの回転軸に合うようにシートを調整する',
      '上げきったところで1秒止める',
      '下ろすときもゆっくり',
    ],
  },
  'レッグカール': {
    type: 'weight',
    main: ['hamstrings'],
    sub: ['calves'],
    equipment: 'レッグカールマシン',
    male: '15kg',
    female: '10kg',
    reps: '12回 × 3セット',
    points: [
      'ひざの位置がマシンの回転軸に合うようにシートを調整する',
      '腰が浮かないようにする',
      '反動を使わず、ゆっくり曲げ伸ばしする',
    ],
  },
  'ランジ': {
    type: 'bw',
    main: ['quads', 'glute-max'],
    sub: ['hamstrings', 'glute-med', 'adductors'],
    equipment: 'なし',
    reps: '左右 10回 × 3セット',
    points: [
      '片足を大きく前に踏み出し、上半身はまっすぐに保つ',
      '前のひざがつま先より前に出すぎないようにする',
      '後ろのひざが床につく手前まで下ろす',
    ],
  },

  // ----- 肩 -----
  'ショルダープレス': {
    type: 'weight',
    main: ['delt-front', 'delt-side'],
    sub: ['triceps', 'traps-upper'],
    equipment: 'ダンベル、ベンチ（背もたれを立てる）',
    male: '片手 6kg',
    female: '片手 2kg',
    reps: '10回 × 3セット',
    points: [
      'ダンベルを耳の横から頭の上に押し上げる',
      '腰を反らしすぎない',
      '肩がすくまないようにする',
    ],
  },
  'サイドレイズ': {
    type: 'weight',
    main: ['delt-side'],
    sub: ['traps-upper'],
    equipment: 'ダンベル',
    male: '片手 3kg',
    female: '片手 1kg',
    reps: '12〜15回 × 3セット',
    points: [
      'ひじを軽く曲げ、肩の高さまで横に上げる',
      '肩がすくまないようにする',
      '軽い重さでも効くので、反動を使わない',
    ],
  },
  'フロントレイズ': {
    type: 'weight',
    main: ['delt-front'],
    sub: ['chest-upper'],
    equipment: 'ダンベル',
    male: '片手 3kg',
    female: '片手 1kg',
    reps: '12回 × 3セット',
    points: [
      '腕を前に、肩の高さまで上げる',
      '体を後ろに反らして反動を使わない',
      '下ろすときもゆっくり',
    ],
  },
  'リアレイズ': {
    type: 'weight',
    main: ['delt-rear'],
    sub: ['traps-middle'],
    equipment: 'ダンベル',
    male: '片手 3kg',
    female: '片手 1kg',
    reps: '12〜15回 × 3セット',
    points: [
      '上半身を前に倒し、背中をまっすぐに保つ',
      'ひじを軽く曲げ、横に開くように上げる',
      '肩甲骨を寄せすぎず、肩の後ろを意識する',
    ],
  },

  // ----- 腕 -----
  'アームカール': {
    type: 'weight',
    main: ['biceps'],
    sub: ['forearm'],
    equipment: 'ダンベル',
    male: '片手 6kg',
    female: '片手 2kg',
    reps: '10〜12回 × 3セット',
    points: [
      'ひじを体の横に固定して動かさない',
      '体を揺らして反動を使わない',
      '下ろすときもゆっくり',
    ],
  },
  'ハンマーカール': {
    type: 'weight',
    main: ['biceps', 'forearm'],
    sub: [],
    equipment: 'ダンベル',
    male: '片手 6kg',
    female: '片手 2kg',
    reps: '10〜12回 × 3セット',
    points: [
      '手のひらを内側に向けたまま（縦に持って）上げる',
      'ひじを体の横に固定して動かさない',
      '反動を使わない',
    ],
  },
  'トライセプスプッシュダウン': {
    type: 'weight',
    main: ['triceps'],
    sub: [],
    equipment: 'ケーブルマシン（ロープまたはバーを付ける）',
    male: '15kg',
    female: '5kg',
    reps: '12回 × 3セット',
    points: [
      'ひじを体の横に固定し、ひじから先だけを動かす',
      '下まで押し切ったところで二の腕の裏を意識する',
      '上半身を前に倒しすぎない',
    ],
  },
  'フレンチプレス': {
    type: 'weight',
    main: ['triceps'],
    sub: [],
    equipment: 'ダンベル、ベンチ',
    male: '8kg（両手で1つ）',
    female: '3kg（両手で1つ）',
    reps: '10〜12回 × 3セット',
    points: [
      'ダンベルを両手で持ち、頭の後ろに下ろす',
      'ひじが外に開かないようにする',
      '腰を反らしすぎない',
    ],
  },

  // ----- 腹 -----
  'クランチ': {
    type: 'bw',
    main: ['abs-upper'],
    sub: ['abs-lower', 'obliques'],
    equipment: 'なし（マットがあるとよい）',
    reps: '15回 × 3セット',
    points: [
      'おへそをのぞき込むように背中を丸める',
      '首の力で起き上がらない',
      '肩甲骨が床から離れるくらいまでで十分',
    ],
  },
  'レッグレイズ': {
    type: 'bw',
    main: ['abs-lower'],
    sub: ['abs-upper'],
    equipment: 'なし（マットがあるとよい）',
    reps: '10回 × 3セット',
    points: [
      '腰が床から浮かないようにする',
      'きつければひざを曲げて行う',
      '足を下ろすときもゆっくり',
    ],
  },
  'アブローラー': {
    type: 'bw',
    main: ['abs-upper', 'abs-lower'],
    sub: ['obliques', 'lats'],
    equipment: 'アブローラー、マット',
    reps: 'ひざをついて 5〜10回 × 3セット',
    points: [
      '最初はひざをついて、転がす距離を短めにする',
      '腰を反らさず、背中を少し丸めたまま行う',
      'お腹の力で戻ってくる',
    ],
  },

  // ----- 有酸素 -----
  'ランニング': {
    type: 'cardio',
    main: ['quads', 'hamstrings', 'calves'],
    sub: ['glute-max', 'tibialis'],
    extra: '心肺機能',
    equipment: 'なし（ランニングマシンでもよい）',
    reps: '20〜30分（3〜5km）',
    points: [
      '会話ができるくらいのペースで走る',
      '最初は走るのと歩くのを交互にしてもよい',
      '前後にストレッチをする',
    ],
  },
  'ウォーキング': {
    type: 'cardio',
    main: ['quads', 'hamstrings', 'calves'],
    sub: ['glute-max', 'tibialis'],
    extra: '心肺機能',
    equipment: 'なし（ランニングマシンでもよい）',
    reps: '30〜60分（3〜5km）',
    points: [
      '背すじを伸ばし、少し大股で歩く',
      '腕を前後にしっかり振る',
      '少し息が上がるくらいの速さを目指す',
    ],
  },
  'エアロバイク': {
    type: 'cardio',
    main: ['quads'],
    sub: ['glute-max', 'hamstrings', 'calves'],
    extra: '心肺機能',
    equipment: 'エアロバイク',
    reps: '20〜30分',
    points: [
      'ペダルが一番下に来たとき、ひざが少し曲がる高さにサドルを合わせる',
      '会話ができるくらいの負荷にする',
      '背すじを伸ばしてこぐ',
    ],
  },
  'クロストレーナー': {
    type: 'cardio',
    main: ['quads', 'glute-max'],
    sub: ['hamstrings', 'calves'],
    extra: '心肺機能',
    equipment: 'クロストレーナー',
    reps: '20〜30分',
    points: [
      '腕と脚を一緒に動かし、全身を使う',
      '背すじを伸ばし、前かがみにならない',
      '会話ができるくらいの負荷にする',
    ],
  },
};

export const getExerciseInfo = (name) => EXERCISE_INFO[name] || null;

// ===== 説明のモーダル =====

let overlay = null;
let lastFocused = null;

const closeModal = () => {
  if (!overlay || overlay.hidden) return;
  overlay.hidden = true;
  document.body.classList.remove('info-modal-open');
  if (lastFocused) lastFocused.focus();
};

const createModal = () => {
  overlay = document.createElement('div');
  overlay.className = 'info-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="info-modal" role="dialog" aria-modal="true" aria-labelledby="info-modal-title">
      <div class="info-modal-header">
        <h2 id="info-modal-title" class="info-modal-title"></h2>
        <button type="button" class="info-modal-close" aria-label="閉じる">×</button>
      </div>
      <div class="info-modal-body"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  // 背景（モーダルの外）をタップしたら閉じる
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  overlay.querySelector('.info-modal-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
};

// 見出しと本文の要素を作る
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const buildBody = (info) => {
  const body = document.createDocumentFragment();

  if (!info) {
    body.appendChild(el('p', 'info-empty', '自分で追加した種目のため、説明はありません。'));
    return body;
  }

  body.appendChild(el('h3', 'info-heading', '鍛えられる部位'));
  body.appendChild(createBodyMap(info.main));

  const muscleList = el('dl', 'info-muscles');
  const addMuscles = (label, keys, isMain) => {
    if (keys.length === 0) return;
    const dt = el('dt', isMain ? 'is-main' : '', label);
    muscleList.appendChild(dt);
    const dd = el('dd');
    keys.forEach((key) => dd.appendChild(el('span', 'info-muscle-name', MUSCLE_NAMES[key] || key)));
    muscleList.appendChild(dd);
  };
  addMuscles('主に使う筋肉', info.main, true);
  addMuscles('補助で使う筋肉', info.sub, false);
  if (info.extra) {
    muscleList.appendChild(el('dt', '', 'そのほか'));
    muscleList.appendChild(el('dd', '', info.extra));
  }
  body.appendChild(muscleList);

  body.appendChild(el('h3', 'info-heading', '使う器具'));
  body.appendChild(el('p', 'info-text', info.equipment));

  body.appendChild(el('h3', 'info-heading', '初心者の目安'));
  const dl = el('dl', 'info-guide');
  const addRow = (label, value) => {
    dl.appendChild(el('dt', '', label));
    dl.appendChild(el('dd', '', value));
  };
  if (info.type === 'weight') {
    addRow('重量（男性）', info.male);
    addRow('重量（女性）', info.female);
    addRow('回数・セット', info.reps);
  } else if (info.type === 'bw') {
    addRow('回数・セット', info.reps);
  } else {
    addRow('時間・距離', info.reps);
  }
  body.appendChild(dl);

  body.appendChild(el('h3', 'info-heading', '意識するポイント'));
  const ul = el('ul', 'info-points');
  info.points.forEach((point) => ul.appendChild(el('li', '', point)));
  body.appendChild(ul);

  const NOTES = {
    weight: '※ 重量・回数は初心者向けの目安です。まずはこの重さから始め、フォームが崩れずにできるようになったら少しずつ増やしてください。',
    bw: '※ 回数は初心者向けの目安です。フォームが崩れない範囲で、無理のない回数にしてください。',
    cardio: '※ 時間・距離は初心者向けの目安です。体調に合わせて、無理のない範囲で行ってください。',
  };
  body.appendChild(el('p', 'info-note', NOTES[info.type]));
  return body;
};

export const openExerciseInfo = (name) => {
  if (!overlay) createModal();
  lastFocused = document.activeElement;

  overlay.querySelector('.info-modal-title').textContent = name;
  const bodyEl = overlay.querySelector('.info-modal-body');
  bodyEl.innerHTML = '';
  bodyEl.appendChild(buildBody(getExerciseInfo(name)));
  bodyEl.scrollTop = 0;

  overlay.hidden = false;
  document.body.classList.add('info-modal-open');
  overlay.querySelector('.info-modal-close').focus();
};

// 説明を開くⓘボタン（どちらの画面でも同じ見た目にする）
export const createInfoButton = (name) => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'info-btn';
  btn.textContent = 'i';
  btn.setAttribute('aria-label', `${name}の説明を見る`);
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openExerciseInfo(name);
  });
  return btn;
};
