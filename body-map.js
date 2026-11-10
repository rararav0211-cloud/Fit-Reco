// ===== 筋肉の図（体の前と後ろ） =====
// 筋肉ごとに data-muscle の名前を付けてあり、主に使う筋肉だけ色を変える。

// 使える筋肉の名前
// delt-front（肩の前）/ delt-side（肩の横）/ delt-rear（肩の後ろ）/ chest（胸）
// biceps（腕の前）/ triceps（二の腕の裏）/ forearm（前腕）/ abs（お腹）/ obliques（脇腹）
// traps（背中の上）/ lats（背中の横）/ lower-back（腰）/ glutes（お尻）
// quads（太ももの前）/ hamstrings（太ももの裏）/ adductors（内もも）/ calves（ふくらはぎ・すね）

const BODY_MAP_SVG = `
<svg class="body-map" viewBox="0 0 420 416" role="img" aria-hidden="true">
<g transform="translate(0 0)">
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
<path class="bm-muscle" data-muscle="chest" d="M81 72 C89 70 96 71 98.5 73 L98.5 109 C88 114 75 112 67 102 C70 88 75 78 81 72 Z"/>
<path class="bm-muscle" data-muscle="chest" d="M 119 72 C 111 70 104 71 101.5 73 L 101.5 109 C 112 114 125 112 133 102 C 130 88 125 78 119 72 Z"/>
<path class="bm-muscle" data-muscle="biceps" d="M49 112 C45 126 45 140 49 153 L59 153 C61 140 61 123 57 108 Z"/>
<path class="bm-muscle" data-muscle="biceps" d="M 151 112 C 155 126 155 140 151 153 L 141 153 C 139 140 139 123 143 108 Z"/>
<path class="bm-muscle" data-muscle="forearm" d="M49 157 C43 172 41 190 43 208 L51 208 C55 190 59 172 59 157 Z"/>
<path class="bm-muscle" data-muscle="forearm" d="M 151 157 C 157 172 159 190 157 208 L 149 208 C 145 190 141 172 141 157 Z"/>
<path class="bm-muscle" data-muscle="obliques" d="M84 117 L69 106 C67 130 69 160 74 184 L84 186 Z"/>
<path class="bm-muscle" data-muscle="obliques" d="M 116 117 L 131 106 C 133 130 131 160 126 184 L 116 186 Z"/>
<path class="bm-muscle" data-muscle="abs" d="M98.5 114 L86 116 L85 186 L98.5 191 Z"/>
<path class="bm-muscle" data-muscle="abs" d="M 101.5 114 L 114 116 L 115 186 L 101.5 191 Z"/>
<path class="bm-muscle" data-muscle="quads" d="M74 197 C66 220 64 260 70 299 L85 301 C90 270 93 232 95 207 Z"/>
<path class="bm-muscle" data-muscle="quads" d="M 126 197 C 134 220 136 260 130 299 L 115 301 C 110 270 107 232 105 207 Z"/>
<path class="bm-muscle" data-muscle="adductors" d="M97 207 C93 232 91 262 88 292 C94 270 98 240 98.5 210 Z"/>
<path class="bm-muscle" data-muscle="adductors" d="M 103 207 C 107 232 109 262 112 292 C 106 270 102 240 101.5 210 Z"/>
<path class="bm-muscle" data-muscle="calves" d="M72 314 C67 330 69 354 74 372 L84 372 C87 350 87 330 85 314 Z"/>
<path class="bm-muscle" data-muscle="calves" d="M 128 314 C 133 330 131 354 126 372 L 116 372 C 113 350 113 330 115 314 Z"/>
<path class="bm-line" d="M85.5 137 L98.5 136"/>
<path class="bm-line" d="M 114.5 137 L 101.5 136"/>
<path class="bm-line" d="M85 160 L98.5 159"/>
<path class="bm-line" d="M 115 160 L 101.5 159"/>
<text class="bm-label" x="100" y="408" text-anchor="middle">前</text>
</g>
<g transform="translate(220 0)">
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
<path class="bm-muscle" data-muscle="traps" d="M98.5 52 L92 56 C87 65 77 70 67 73 L81 78 C88 92 94 112 98.5 132 Z"/>
<path class="bm-muscle" data-muscle="traps" d="M 101.5 52 L 108 56 C 113 65 123 70 133 73 L 119 78 C 112 92 106 112 101.5 132 Z"/>
<path class="bm-muscle" data-muscle="triceps" d="M49 112 C45 126 45 140 49 153 L59 153 C61 140 61 123 57 108 Z"/>
<path class="bm-muscle" data-muscle="triceps" d="M 151 112 C 155 126 155 140 151 153 L 141 153 C 139 140 139 123 143 108 Z"/>
<path class="bm-muscle" data-muscle="forearm" d="M49 157 C43 172 41 190 43 208 L51 208 C55 190 59 172 59 157 Z"/>
<path class="bm-muscle" data-muscle="forearm" d="M 151 157 C 157 172 159 190 157 208 L 149 208 C 145 190 141 172 141 157 Z"/>
<path class="bm-muscle" data-muscle="lower-back" d="M98.5 136 L95 138 L93 186 L98.5 190 Z"/>
<path class="bm-muscle" data-muscle="lower-back" d="M 101.5 136 L 105 138 L 107 186 L 101.5 190 Z"/>
<path class="bm-muscle" data-muscle="glutes" d="M98.5 194 L80 189 C70 197 68 214 72 230 C82 238 94 236 98.5 230 Z"/>
<path class="bm-muscle" data-muscle="glutes" d="M 101.5 194 L 120 189 C 130 197 132 214 128 230 C 118 238 106 236 101.5 230 Z"/>
<path class="bm-muscle" data-muscle="hamstrings" d="M72 235 C68 260 70 284 74 301 L86 301 C90 280 94 257 96 237 Z"/>
<path class="bm-muscle" data-muscle="hamstrings" d="M 128 235 C 132 260 130 284 126 301 L 114 301 C 110 280 106 257 104 237 Z"/>
<path class="bm-muscle" data-muscle="calves" d="M72 314 C63 330 65 352 74 371 L84 371 C91 350 91 330 86 314 Z"/>
<path class="bm-muscle" data-muscle="calves" d="M 128 314 C 137 330 135 352 126 371 L 116 371 C 109 350 109 330 114 314 Z"/>
<text class="bm-label" x="100" y="408" text-anchor="middle">後ろ</text>
</g>
</svg>
`;

export const createBodyMap = (mainMuscles = []) => {
  const wrap = document.createElement('div');
  wrap.className = 'body-map-wrap';
  wrap.innerHTML = BODY_MAP_SVG;
  wrap.querySelectorAll('[data-muscle]').forEach((part) => {
    if (mainMuscles.includes(part.dataset.muscle)) part.classList.add('is-main');
  });
  return wrap;
};
