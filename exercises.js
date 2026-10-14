'use strict';
{
  // ===== 種目リスト =====

  const CARDIO_CATEGORY = '有酸素';
  const CATEGORIES = ['胸', '背中', '脚', '肩', '腕', '腹', CARDIO_CATEGORY];

  // 初めから用意しておく種目（bw: true は自重種目なので初期重量 0kg）
  const DEFAULT_EXERCISES = [
    { name: 'ベンチプレス', category: '胸' },
    { name: 'ダンベルプレス', category: '胸' },
    { name: 'チェストプレス（マシン）', category: '胸' },
    { name: 'ペックフライ（マシン）', category: '胸' },
    { name: '腕立て伏せ', category: '胸', bw: true },
    { name: 'ラットプルダウン', category: '背中' },
    { name: 'シーテッドロー', category: '背中' },
    { name: 'ワンハンドローイング', category: '背中' },
    { name: 'デッドリフト', category: '背中' },
    { name: '懸垂', category: '背中', bw: true },
    { name: 'スクワット', category: '脚' },
    { name: 'レッグプレス', category: '脚' },
    { name: 'レッグエクステンション', category: '脚' },
    { name: 'レッグカール', category: '脚' },
    { name: 'ランジ', category: '脚', bw: true },
    { name: 'ショルダープレス', category: '肩' },
    { name: 'サイドレイズ', category: '肩' },
    { name: 'フロントレイズ', category: '肩' },
    { name: 'リアレイズ', category: '肩' },
    { name: 'アームカール', category: '腕' },
    { name: 'ハンマーカール', category: '腕' },
    { name: 'トライセプスプッシュダウン', category: '腕' },
    { name: 'フレンチプレス', category: '腕' },
    { name: 'クランチ', category: '腹', bw: true },
    { name: 'レッグレイズ', category: '腹', bw: true },
    { name: 'アブローラー', category: '腹', bw: true },
    { name: 'ランニング', category: CARDIO_CATEGORY },
    { name: 'ウォーキング', category: CARDIO_CATEGORY },
    { name: 'エアロバイク', category: CARDIO_CATEGORY },
    { name: 'クロストレーナー', category: CARDIO_CATEGORY },
  ];

  // ローカルストレージから配列を安全に読み込む
  const loadArray = (key) => {
    try {
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  };

  // 自分で追加した種目
  let customExercises = loadArray('customExercises');
  const saveCustomExercises = () => {
    localStorage.setItem('customExercises', JSON.stringify(customExercises));
  };

  const getAllExercises = () => [
    ...DEFAULT_EXERCISES,
    ...customExercises.map((ex) => ({ ...ex, custom: true })),
  ];

  // 今日すでにワークアウトに入っている種目名
  const todayTitles = loadArray('todos').map((todo) => todo.title);

  // ===== 画面の状態 =====
  const tabsEl = document.querySelector('#category-tabs');
  const listEl = document.querySelector('#exercise-list');
  const customForm = document.querySelector('#custom-form');
  const customName = document.querySelector('#custom-name');
  const customCategory = document.querySelector('#custom-category');
  const addBtn = document.querySelector('#add-selected-btn');

  let currentCategory = CATEGORIES[0];
  const selected = []; // 選んだ順に種目名を入れる

  // 部位タブ（選択中の数も表示）
  const renderTabs = () => {
    tabsEl.innerHTML = '';
    CATEGORIES.forEach((cat) => {
      const count = getAllExercises()
        .filter((ex) => ex.category === cat && selected.includes(ex.name)).length;

      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'category-tab';
      tab.textContent = count > 0 ? `${cat} ${count}` : cat;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(cat === currentCategory));
      tab.addEventListener('click', () => {
        currentCategory = cat;
        customCategory.value = cat;
        renderTabs();
        renderExerciseList();
        window.scrollTo({ top: 0 });
      });
      tabsEl.appendChild(tab);
    });
  };

  // 種目一覧（タップで選択／解除）
  const renderExerciseList = () => {
    listEl.innerHTML = '';

    getAllExercises()
      .filter((ex) => ex.category === currentCategory)
      .forEach((ex) => {
        const li = document.createElement('li');
        li.className = 'exercise-item';

        const label = document.createElement('label');
        label.className = 'exercise-select';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = selected.includes(ex.name);
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            selected.push(ex.name);
          } else {
            selected.splice(selected.indexOf(ex.name), 1);
          }
          renderTabs();
          updateAddButton();
        });

        const name = document.createElement('span');
        name.className = 'exercise-name';
        name.textContent = ex.name;

        label.appendChild(checkbox);
        label.appendChild(name);

        if (todayTitles.includes(ex.name)) {
          const badge = document.createElement('span');
          badge.className = 'exercise-badge';
          badge.textContent = '追加済み';
          label.appendChild(badge);
        }
        li.appendChild(label);

        // 自分で追加した種目だけリストから削除できる
        if (ex.custom) {
          const removeBtn = document.createElement('button');
          removeBtn.type = 'button';
          removeBtn.className = 'exercise-remove';
          removeBtn.textContent = '×';
          removeBtn.setAttribute('aria-label', `${ex.name}をリストから削除`);
          removeBtn.addEventListener('click', () => {
            if (!confirm(`「${ex.name}」をリストから削除しますか？\n（これまでの記録は消えません）`)) return;
            customExercises = customExercises.filter((c) => c.name !== ex.name);
            saveCustomExercises();
            const index = selected.indexOf(ex.name);
            if (index >= 0) selected.splice(index, 1);
            renderTabs();
            renderExerciseList();
            updateAddButton();
          });
          li.appendChild(removeBtn);
        }

        listEl.appendChild(li);
      });
  };

  // 追加ボタンの表示切り替え
  const updateAddButton = () => {
    addBtn.disabled = selected.length === 0;
    addBtn.textContent = selected.length === 0
      ? '種目を選んでください'
      : `${selected.length}種目を追加する`;
  };

  // 部位のセレクトボックス
  CATEGORIES.forEach((cat) => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    customCategory.appendChild(option);
  });

  // リストにない種目を追加 → リストに保存して、選択済みにする
  customForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = customName.value.trim();
    if (!name) {
      customName.focus();
      return;
    }

    let exercise = getAllExercises().find((ex) => ex.name === name);
    if (!exercise) {
      exercise = { name, category: customCategory.value };
      customExercises.push(exercise);
      saveCustomExercises();
    }
    if (!selected.includes(exercise.name)) selected.push(exercise.name);

    customName.value = '';
    currentCategory = exercise.category;
    customCategory.value = currentCategory;
    renderTabs();
    renderExerciseList();
    updateAddButton();
  });

  // ワークアウト画面に戻る（ワークアウト画面から来たときは履歴を戻る）
  const backToWorkout = () => {
    if (sessionStorage.getItem('fromWorkout') === '1' && history.length > 1) {
      sessionStorage.removeItem('fromWorkout');
      history.back();
    } else {
      location.replace('workout.html');
    }
  };

  document.querySelector('#back-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    backToWorkout();
  });

  // 選んだ種目をワークアウト画面に渡して戻る
  addBtn.addEventListener('click', () => {
    if (selected.length === 0) return;
    const all = getAllExercises();
    const pending = selected
      .map((name) => all.find((ex) => ex.name === name))
      .filter(Boolean)
      .map((ex) => ({ name: ex.name, category: ex.category, bw: !!ex.bw }));

    sessionStorage.setItem('pendingExercises', JSON.stringify(pending));
    backToWorkout();
  });

  // 初期表示
  customCategory.value = currentCategory;
  renderTabs();
  renderExerciseList();
  updateAddButton();
}