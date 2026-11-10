// ===== 筋肉の図（体の前と後ろ） =====
// 筋肉ごとに data-muscle の名前を付けてあり、主に使う筋肉だけ薄い青にする。
// 主に使う筋肉が上半身（首からお腹まで）だけのときは、その部分を拡大して表示する。

// 筋肉の名前（data-muscle）と、画面に出す名前
export const MUSCLE_NAMES = {
  'chest-upper': '大胸筋上部（胸の上側）',
  'chest-middle': '大胸筋中部（胸の真ん中）',
  'chest-lower': '大胸筋下部（胸の下側）',
  'delt-front': '三角筋前部（肩の前側）',
  'delt-side': '三角筋中部（肩の横）',
  'delt-rear': '三角筋後部（肩の後ろ側）',
  'biceps': '上腕二頭筋（力こぶ）',
  'triceps': '上腕三頭筋（二の腕の裏側）',
  'forearm': '前腕筋群（ひじから手首）',
  'serratus': '前鋸筋（わきの下の肋骨まわり）',
  'abs-upper': '腹直筋上部（お腹の上側）',
  'abs-lower': '腹直筋下部（お腹の下側）',
  'obliques': '腹斜筋（脇腹）',
  'traps-upper': '僧帽筋上部（首から肩）',
  'traps-middle': '僧帽筋中部（肩甲骨の間）',
  'traps-lower': '僧帽筋下部（肩甲骨の下）',
  'lats': '広背筋（背中の横・わきの下）',
  'erector': '脊柱起立筋（背骨に沿った腰まわり）',
  'glute-max': '大殿筋（お尻）',
  'glute-med': '中殿筋（お尻の横上）',
  'quads': '大腿四頭筋（太ももの前側）',
  'hamstrings': 'ハムストリングス（太ももの裏側）',
  'adductors': '内転筋群（内もも）',
  'tibialis': '前脛骨筋（すね）',
  'calves': '下腿三頭筋（ふくらはぎ）',
};

// 図の前と後ろに、それぞれどの筋肉が描かれているか
const FRONT_MUSCLES = [
  'abs-lower', 'abs-upper', 'adductors', 'biceps', 'chest-lower', 'chest-middle', 'chest-upper', 'delt-front', 'delt-side', 'forearm', 'obliques', 'quads', 'serratus', 'tibialis',
];
const BACK_MUSCLES = [
  'calves', 'delt-rear', 'delt-side', 'erector', 'forearm', 'glute-max', 'glute-med', 'hamstrings', 'lats', 'traps-lower', 'traps-middle', 'traps-upper', 'triceps',
];

// 首からお腹までに入る筋肉（これだけのときは拡大する）
const UPPER_MUSCLES = [
  'chest-upper', 'chest-middle', 'chest-lower', 'delt-front', 'delt-side', 'delt-rear',
  'biceps', 'triceps', 'serratus', 'abs-upper', 'abs-lower', 'obliques',
  'traps-upper', 'traps-middle', 'traps-lower', 'lats', 'erector',
];

const FULL_VIEWBOX = '0 0 200 400';
const UPPER_VIEWBOX = '40 44 120 154';

const FRONT_SVG = `
<ellipse class="bm-skin" cx="100" cy="30" rx="16" ry="20"/>
<path class="bm-skin" d="M92 46 L108 46 L109 62 L91 62 Z"/>
<ellipse class="bm-skin" cx="47" cy="220" rx="6" ry="11"/>
<ellipse class="bm-skin" cx="153" cy="220" rx="6" ry="11"/>
<ellipse class="bm-skin" cx="78.5" cy="307.5" rx="8" ry="6"/>
<ellipse class="bm-skin" cx="121.5" cy="307.5" rx="8" ry="6"/>
<ellipse class="bm-skin" cx="78" cy="382" rx="8" ry="6"/>
<ellipse class="bm-skin" cx="122" cy="382" rx="8" ry="6"/>
<path class="bm-skin" d="M74 187 L98.5 192 L98.5 206 L95 205 L74 196 Z"/>
<path class="bm-skin" d="M 126 187 L 101.5 192 L 101.5 206 L 105 205 L 126 196 Z"/>
<path class="bm-muscle" data-muscle="delt-side" d="M62 74 C52 78 47 92 49 108 L57 105 C57 92 60 82 66 75 Z"/>
<path class="bm-muscle" data-muscle="delt-side" d="M 138 74 C 148 78 153 92 151 108 L 143 105 C 143 92 140 82 134 75 Z"/>
<path class="bm-muscle" data-muscle="delt-front" d="M66 74 C61 82 58 92 58 105 L66 101 C70 90 74 81 80 74 Z"/>
<path class="bm-muscle" data-muscle="delt-front" d="M 134 74 C 139 82 142 92 142 105 L 134 101 C 130 90 126 81 120 74 Z"/>
<path class="bm-muscle" data-muscle="chest-upper" d="M68 90 C70 80 75 74 81 72 C89 70 96 71 98.5 73 L98.5 84 Z"/>
<path class="bm-muscle" data-muscle="chest-upper" d="M 132 90 C 130 80 125 74 119 72 C 111 70 104 71 101.5 73 L 101.5 84 Z"/>
<path class="bm-muscle" data-muscle="chest-middle" d="M68 90 L98.5 84 L98.5 98 Z"/>
<path class="bm-muscle" data-muscle="chest-middle" d="M 132 90 L 101.5 84 L 101.5 98 Z"/>
<path class="bm-muscle" data-muscle="chest-lower" d="M68 90 L98.5 98 L98.5 109 C88 114 75 112 67 102 C67 97 67 93 68 90 Z"/>
<path class="bm-muscle" data-muscle="chest-lower" d="M 132 90 L 101.5 98 L 101.5 109 C 112 114 125 112 133 102 C 133 97 133 93 132 90 Z"/>
<path class="bm-muscle" data-muscle="biceps" d="M49 112 C45 126 45 140 49 153 L59 153 C61 140 61 123 57 108 Z"/>
<path class="bm-muscle" data-muscle="biceps" d="M 151 112 C 155 126 155 140 151 153 L 141 153 C 139 140 139 123 143 108 Z"/>
<path class="bm-muscle" data-muscle="forearm" d="M49 157 C43 172 41 190 43 208 L51 208 C55 190 59 172 59 157 Z"/>
<path class="bm-muscle" data-muscle="forearm" d="M 151 157 C 157 172 159 190 157 208 L 149 208 C 145 190 141 172 141 157 Z"/>
<path class="bm-muscle" data-muscle="serratus" d="M68 105 L79 112 L81 118 L70 125 Z"/>
<path class="bm-muscle" data-muscle="serratus" d="M 132 105 L 121 112 L 119 118 L 130 125 Z"/>
<path class="bm-muscle" data-muscle="obliques" d="M84 117 L81 118 L70 125 C69 142 70 162 74 184 L84 186 Z"/>
<path class="bm-muscle" data-muscle="obliques" d="M 116 117 L 119 118 L 130 125 C 131 142 130 162 126 184 L 116 186 Z"/>
<path class="bm-muscle" data-muscle="abs-upper" d="M98.5 114 L86 116 L85.5 150 L98.5 150 Z"/>
<path class="bm-muscle" data-muscle="abs-upper" d="M 101.5 114 L 114 116 L 114.5 150 L 101.5 150 Z"/>
<path class="bm-muscle" data-muscle="abs-lower" d="M98.5 150 L85.5 150 L85 186 L98.5 191 Z"/>
<path class="bm-muscle" data-muscle="abs-lower" d="M 101.5 150 L 114.5 150 L 115 186 L 101.5 191 Z"/>
<path class="bm-muscle" data-muscle="quads" d="M74 197 C66 220 64 260 70 299 L85 301 C90 270 93 232 95 207 Z"/>
<path class="bm-muscle" data-muscle="quads" d="M 126 197 C 134 220 136 260 130 299 L 115 301 C 110 270 107 232 105 207 Z"/>
<path class="bm-muscle" data-muscle="adductors" d="M97 207 C93 232 91 262 88 292 C94 270 98 240 98.5 210 Z"/>
<path class="bm-muscle" data-muscle="adductors" d="M 103 207 C 107 232 109 262 112 292 C 106 270 102 240 101.5 210 Z"/>
<path class="bm-muscle" data-muscle="tibialis" d="M72 314 C67 330 69 354 74 372 L84 372 C87 350 87 330 85 314 Z"/>
<path class="bm-muscle" data-muscle="tibialis" d="M 128 314 C 133 330 131 354 126 372 L 116 372 C 113 350 113 330 115 314 Z"/>
<path class="bm-line" d="M85.5 133 L98.5 132"/>
<path class="bm-line" d="M 114.5 133 L 101.5 132"/>
<path class="bm-line" d="M85.3 168 L98.5 168"/>
<path class="bm-line" d="M 114.7 168 L 101.5 168"/>
`;

const BACK_SVG = `
<ellipse class="bm-skin" cx="100" cy="30" rx="16" ry="20"/>
<path class="bm-skin" d="M92 46 L108 46 L109 62 L91 62 Z"/>
<ellipse class="bm-skin" cx="47" cy="220" rx="6" ry="11"/>
<ellipse class="bm-skin" cx="153" cy="220" rx="6" ry="11"/>
<ellipse class="bm-skin" cx="78.5" cy="307.5" rx="8" ry="6"/>
<ellipse class="bm-skin" cx="121.5" cy="307.5" rx="8" ry="6"/>
<ellipse class="bm-skin" cx="78" cy="382" rx="8" ry="6"/>
<ellipse class="bm-skin" cx="122" cy="382" rx="8" ry="6"/>
<path class="bm-muscle" data-muscle="delt-side" d="M62 74 C52 78 47 92 49 108 L57 105 C57 92 60 82 66 75 Z"/>
<path class="bm-muscle" data-muscle="delt-side" d="M 138 74 C 148 78 153 92 151 108 L 143 105 C 143 92 140 82 134 75 Z"/>
<path class="bm-muscle" data-muscle="delt-rear" d="M66 74 C61 82 58 92 58 105 L66 101 C70 90 74 82 80 78 Z"/>
<path class="bm-muscle" data-muscle="delt-rear" d="M 134 74 C 139 82 142 92 142 105 L 134 101 C 130 90 126 82 120 78 Z"/>
<path class="bm-muscle" data-muscle="lats" d="M81 80 C74 94 70 110 70 130 C73 152 81 168 91 178 L94 146 C92 120 88 98 81 80 Z"/>
<path class="bm-muscle" data-muscle="lats" d="M 119 80 C 126 94 130 110 130 130 C 127 152 119 168 109 178 L 106 146 C 108 120 112 98 119 80 Z"/>
<path class="bm-muscle" data-muscle="traps-upper" d="M98.5 52 L92 56 C87 65 77 70 67 73 L81 78 L98.5 74 Z"/>
<path class="bm-muscle" data-muscle="traps-upper" d="M 101.5 52 L 108 56 C 113 65 123 70 133 73 L 119 78 L 101.5 74 Z"/>
<path class="bm-muscle" data-muscle="traps-middle" d="M98.5 74 L81 78 C84 85 87 92 89 98 L98.5 100 Z"/>
<path class="bm-muscle" data-muscle="traps-middle" d="M 101.5 74 L 119 78 C 116 85 113 92 111 98 L 101.5 100 Z"/>
<path class="bm-muscle" data-muscle="traps-lower" d="M98.5 100 L89 98 C92 108 95 120 98.5 132 Z"/>
<path class="bm-muscle" data-muscle="traps-lower" d="M 101.5 100 L 111 98 C 108 108 105 120 101.5 132 Z"/>
<path class="bm-muscle" data-muscle="triceps" d="M49 112 C45 126 45 140 49 153 L59 153 C61 140 61 123 57 108 Z"/>
<path class="bm-muscle" data-muscle="triceps" d="M 151 112 C 155 126 155 140 151 153 L 141 153 C 139 140 139 123 143 108 Z"/>
<path class="bm-muscle" data-muscle="forearm" d="M49 157 C43 172 41 190 43 208 L51 208 C55 190 59 172 59 157 Z"/>
<path class="bm-muscle" data-muscle="forearm" d="M 151 157 C 157 172 159 190 157 208 L 149 208 C 145 190 141 172 141 157 Z"/>
<path class="bm-muscle" data-muscle="erector" d="M98.5 136 L95 138 L93 186 L98.5 190 Z"/>
<path class="bm-muscle" data-muscle="erector" d="M 101.5 136 L 105 138 L 107 186 L 101.5 190 Z"/>
<path class="bm-muscle" data-muscle="glute-med" d="M80 189 C73 193 69 200 69 208 C76 204 82 200 88 196 Z"/>
<path class="bm-muscle" data-muscle="glute-med" d="M 120 189 C 127 193 131 200 131 208 C 124 204 118 200 112 196 Z"/>
<path class="bm-muscle" data-muscle="glute-max" d="M98.5 194 L88 196 C82 200 76 204 69 208 C68 216 69 224 72 230 C82 238 94 236 98.5 230 Z"/>
<path class="bm-muscle" data-muscle="glute-max" d="M 101.5 194 L 112 196 C 118 200 124 204 131 208 C 132 216 131 224 128 230 C 118 238 106 236 101.5 230 Z"/>
<path class="bm-muscle" data-muscle="hamstrings" d="M72 235 C68 260 70 284 74 301 L86 301 C90 280 94 257 96 237 Z"/>
<path class="bm-muscle" data-muscle="hamstrings" d="M 128 235 C 132 260 130 284 126 301 L 114 301 C 110 280 106 257 104 237 Z"/>
<path class="bm-muscle" data-muscle="calves" d="M72 314 C63 330 65 352 74 371 L84 371 C91 350 91 330 86 314 Z"/>
<path class="bm-muscle" data-muscle="calves" d="M 128 314 C 137 330 135 352 126 371 L 116 371 C 109 350 109 330 114 314 Z"/>
`;

const createView = (svgInner, label, viewBox, mainMuscles) => {
  const fig = document.createElement('figure');
  fig.className = 'body-map-view';
  fig.innerHTML = `<svg class="body-map" viewBox="${viewBox}" aria-hidden="true">${svgInner}</svg>`;
  fig.querySelectorAll('[data-muscle]').forEach((part) => {
    if (mainMuscles.includes(part.dataset.muscle)) part.classList.add('is-main');
  });
  const caption = document.createElement('figcaption');
  caption.textContent = label;
  fig.appendChild(caption);
  return fig;
};

export const createBodyMap = (mainMuscles = []) => {
  const isUpper = mainMuscles.length > 0 && mainMuscles.every((m) => UPPER_MUSCLES.includes(m));
  const viewBox = isUpper ? UPPER_VIEWBOX : FULL_VIEWBOX;

  // 主に使う筋肉が描かれている向き（前・後ろ）だけ表示する
  let showFront = mainMuscles.some((m) => FRONT_MUSCLES.includes(m));
  let showBack = mainMuscles.some((m) => BACK_MUSCLES.includes(m));
  if (!showFront && !showBack) {
    showFront = true;
    showBack = true;
  }

  const wrap = document.createElement('div');
  wrap.className = 'body-map-wrap';
  if (isUpper) wrap.classList.add('is-upper');
  if (showFront) wrap.appendChild(createView(FRONT_SVG, '前', viewBox, mainMuscles));
  if (showBack) wrap.appendChild(createView(BACK_SVG, '後ろ', viewBox, mainMuscles));
  return wrap;
};
