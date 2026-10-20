import { loadProfile, saveProfile, saveLog } from './firebase.js';

{
  // 今日の日付を表示
  const today = new Date();
  const todayEl = document.querySelector('#today');
  if (todayEl) {
    todayEl.textContent = `${today.getMonth() + 1}月${today.getDate()}日`;
  }
  // 日付文字列の取得
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;
  const lastSavedDate = localStorage.getItem('lastSavedDate');

  // ローカルストレージからの取得
  let todos = [];
  try {
    const loaded = localStorage.getItem('todos');
    todos = loaded ? JSON.parse(loaded) : [];
    if (!Array.isArray(todos)) todos = [];
  } catch (e) {
    todos = [];
  }

  // 日付が変わっていたら、前回の入力内容・完了状態を初期化する
  if (lastSavedDate && lastSavedDate !== todayStr) {
    todos = [];
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  // ローカルストレージへの保存
  const saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('lastSavedDate', todayStr);
  };

  // ===== 消費カロリー =====
  // 計算式：消費カロリー(kcal) = METs × 体重(kg) × 時間(h) × 1.05

  const STRENGTH_METS = 5.0;      // 筋トレ（中〜高強度）
  const MINUTES_PER_SET = 2;      // 筋トレ1セットにかかる時間（休憩込み）の目安

  // 有酸素運動の種目ごとのMETs（リストにない種目は DEFAULT_CARDIO_METS）
  const CARDIO_METS = {
    'ウォーキング': 3.5,
    'エアロバイク': 6.8,
    'クロストレーナー': 5.0,
  };
  const DEFAULT_CARDIO_METS = 5.0;

  // 体重（Firestore から読み込む。未入力のときは 0）
  let bodyWeight = 0;
  const getBodyWeight = () => bodyWeight;

  // 有酸素運動のMETs（ランニングは速度から求める：時速8km → 約8METs）
  const getCardioMets = (title, distance, minutes) => {
    if (title === 'ランニング') {
      const speed = minutes > 0 ? distance / (minutes / 60) : 0; // km/h
      return Math.min(Math.max(speed, 6), 16);
    }
    return CARDIO_METS[title] ?? DEFAULT_CARDIO_METS;
  };

  // 完了したセットから今日の消費カロリーを計算（体重が未入力なら 0）
  const calcCalories = () => {
    const weight = getBodyWeight();
    if (weight === 0) return 0;
    let kcal = 0;
    todos.forEach((todo) => {
      (todo.sets || []).forEach((set) => {
        if (!set.isCompleted) return;
        if (todo.type === 'cardio') {
          const distance = set.distance ?? set.val1 ?? 0;
          const minutes = set.minutes ?? set.val2 ?? 0;
          kcal += getCardioMets(todo.title, distance, minutes) * weight * (minutes / 60) * 1.05;
        } else {
          kcal += STRENGTH_METS * weight * (MINUTES_PER_SET / 60) * 1.05;
        }
      });
    });
    return Math.round(kcal);
  };

  // 体重が未入力なら案内を出す
  const updateWeightMsg = () => {
    const msg = document.querySelector('#weight-msg');
    if (msg) msg.hidden = getBodyWeight() > 0;
  };

  // 体重の入力欄
  const bodyWeightInput = document.querySelector('#body-weight');
  if (bodyWeightInput) {
    // 入力中は画面の表示だけ更新する
    bodyWeightInput.addEventListener('input', () => {
      const w = Number(bodyWeightInput.value);
      bodyWeight = w > 0 ? w : 0;
      updateWeightMsg();
    });
    // 入力が終わったら（欄から離れたら）Firestore に保存
    bodyWeightInput.addEventListener('change', () => {
      saveProfile({ bodyWeight }).catch((e) => console.error('体重の保存に失敗しました', e));
    });
  }

  // 保存してある体重を読み込んで入力欄に入れる
  loadProfile()
    .then((profile) => {
      // 読み込み中にすでに入力されていたら、そちらを優先する
      if (bodyWeight > 0) return;
      const w = Number(profile.bodyWeight);
      bodyWeight = w > 0 ? w : 0;
      if (bodyWeightInput) bodyWeightInput.value = bodyWeight > 0 ? bodyWeight : '';
      updateWeightMsg();
    })
    .catch((e) => {
      console.error('体重の読み込みに失敗しました', e);
      updateWeightMsg();
    });

  localStorage.setItem('lastSavedDate', todayStr);

  // スピンボタン
  const createStepperCell = (initialValue, stepLarge, stepSmall, unit, onChange) => {
    const td = document.createElement('td');
    const container = document.createElement('div');
    container.className = 'stepper-container';

    // 数値入力インプット
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    if (stepSmall < 1) input.step = String(stepSmall);
    input.value = initialValue;
    input.className = 'stepper-input';

    // スピンボタンコンテナ
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'stepper-buttons';

    // プラスボタン
    const topRow = document.createElement('div');
    topRow.className = 'stepper-row';

    const btnPlusLarge = document.createElement('button');
    btnPlusLarge.type = 'button';
    btnPlusLarge.className = 'btn-step btn-step-large';
    btnPlusLarge.textContent = `+${stepLarge}`;

    topRow.appendChild(btnPlusLarge);

    // マイナスボタン
    const bottomRow = document.createElement('div');
    bottomRow.className = 'stepper-row';

    const btnMinusLarge = document.createElement('button');
    btnMinusLarge.type = 'button';
    btnMinusLarge.className = 'btn-step btn-step-large';
    btnMinusLarge.textContent = `-${stepLarge}`;

    bottomRow.appendChild(btnMinusLarge);

    buttonsContainer.appendChild(topRow);
    buttonsContainer.appendChild(bottomRow);

    const updateVal = (newVal) => {
      let val = Math.max(0, newVal);
      val = Math.round(val * 10) / 10;
      input.value = val;
      onChange(val);
    };

    btnMinusLarge.addEventListener('click', () => updateVal(Number(input.value) - stepLarge));
    btnPlusLarge.addEventListener('click', () => updateVal(Number(input.value) + stepLarge));

    input.addEventListener('input', (e) => {
      let val = Number(e.target.value);
      if (val < 0 || isNaN(val)) {
        val = 0;
        e.target.value = 0;
      }
      onChange(val);
    });

    container.appendChild(input);
    container.appendChild(buttonsContainer);

    td.appendChild(container);
    return td;
  };

  //種目カード
  const renderTodo = (todo) => {
    const li = document.createElement('li');

    // 種目名（タイトル）
    const label = document.createElement('label');
    const title = document.createElement('h2');
    title.textContent = todo.title;
    label.appendChild(title);
    li.appendChild(label);

    // テーブル
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    const isCardio = todo.type === 'cardio';
    const theadTitles = isCardio
      ? ['セット', 'km', '分', '完了']
      : ['セット', 'kg', '回', '完了'];
    theadTitles.forEach((text) => {
      const td = document.createElement('td');
      td.textContent = text;
      tr.appendChild(td);
    });
    thead.appendChild(tr);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');

    // セット
    const renderSets = () => {
      tbody.innerHTML = '';
      (todo.sets || []).forEach((set, index) => {
        const row = document.createElement('tr');

        // セット番号
        const tdSet = document.createElement('td');
        tdSet.textContent = index + 1;

        // km, kg入力
        const step1Large = isCardio ? 1 : 5;
        const step1Small = isCardio ? 0.1 : 1;
        const unit1 = isCardio ? 'km' : 'kg';
        const val1 = set.weight ?? set.distance ?? (isCardio ? 3 : 50);
        const tdVal1 = createStepperCell(val1, step1Large, step1Small, unit1, (newVal) => {
          if (isCardio) {
            set.distance = newVal;
          } else {
            set.weight = newVal;
          }
          set.val1 = newVal;
          saveTodos();
        });

        // 分, 回数入力
        const step2Large = 5;
        const step2Small = 1;
        const val2 = set.reps ?? set.minutes ?? (isCardio ? 20 : 10);
        const unit2 = isCardio ? '分' : '回';
        const tdVal2 = createStepperCell(val2, step2Large, step2Small, unit2, (newVal) => {
          if (isCardio) {
            set.minutes = newVal;
          } else {
            set.reps = newVal;
          }
          set.val2 = newVal;
          saveTodos();
        });

        // 完了チェックボックス
        const tdCompleted = document.createElement('td');
        const inputCompleted = document.createElement('input');
        inputCompleted.type = 'checkbox';
        inputCompleted.checked = set.isCompleted;
        inputCompleted.addEventListener('change', (e) => {
          set.isCompleted = e.target.checked;
          saveTodos();
        });
        tdCompleted.appendChild(inputCompleted);

        row.appendChild(tdSet);
        row.appendChild(tdVal1);
        row.appendChild(tdVal2);
        row.appendChild(tdCompleted);
        tbody.appendChild(row);
      });
    };
    renderSets();
    table.appendChild(tbody);
    li.appendChild(table);

    // セット削除ボタン
    const deleteSetBtn = document.createElement('button');
    deleteSetBtn.textContent = 'ー セット削除';
    deleteSetBtn.addEventListener('click', () => {
      if (todo.sets && todo.sets.length > 0) {
        todo.sets.pop();
        saveTodos();
        renderSets();
      }
    });

    // セット追加ボタン
    const addSetBtn = document.createElement('button');
    addSetBtn.textContent = '＋ セット追加';
    addSetBtn.addEventListener('click', () => {
      const lastSet = todo.sets[todo.sets.length - 1];
      const defaultVal1 = lastSet ? (lastSet.val1 ?? lastSet.weight ?? lastSet.distance) : (isCardio ? 3 : 50);
      const defaultVal2 = lastSet ? (lastSet.val2 ?? lastSet.reps ?? lastSet.minutes) : (isCardio ? 20 : 10);

      todo.sets.push({
        val1: defaultVal1,
        val2: defaultVal2,
        weight: defaultVal1,
        reps: defaultVal2,
        distance: defaultVal1,
        minutes: defaultVal2,
        isCompleted: false
      });
      saveTodos();
      renderSets();
    });

    // 種目削除ボタン
    const deleteTodoBtn = document.createElement('button');
    deleteTodoBtn.textContent = '× 種目を削除';
    deleteTodoBtn.style.marginLeft = '10px';
    deleteTodoBtn.addEventListener('click', () => {
      if (!confirm('この種目を削除しますか？')) return;
      li.remove();
      todos = todos.filter((item) => item.id !== todo.id);
      saveTodos();
    });


    const cardActions = document.createElement('div');
    cardActions.className = 'card-actions';
    cardActions.appendChild(deleteSetBtn);
    cardActions.appendChild(addSetBtn);
    cardActions.appendChild(deleteTodoBtn);
    li.appendChild(cardActions);

    document.querySelector('#todos').appendChild(li);
  };

  // 一覧表示
  const renderTodos = () => {
    const todoList = document.querySelector('#todos');
    if (!todoList) return;
    todoList.innerHTML = '';
    todos.forEach((todo) => {
      renderTodo(todo);
    });
  };

  // ===== 種目の追加 =====

  const CARDIO_CATEGORY = '有酸素';

  // 同時に複数追加してもIDが重ならないようにする
  let idSeed = Date.now();
  const nextId = () => ++idSeed;

  // 種目選択画面で選んだ種目を、今日のワークアウトのカードにする
  const createTodo = (exercise) => {
    const isCardio = exercise.category === CARDIO_CATEGORY;
    const weight = exercise.bw ? 0 : 50;
    return {
      id: nextId(),
      type: isCardio ? 'cardio' : 'strength',
      title: exercise.name,
      sets: [
        isCardio
          ? { val1: 3, val2: 20, distance: 3, minutes: 20, isCompleted: false }
          : { val1: weight, val2: 10, weight: weight, reps: 10, isCompleted: false }
      ]
    };
  };

  // 種目選択画面から渡された種目を受け取る
  const applyPendingExercises = () => {
    let pending = [];
    try {
      pending = JSON.parse(sessionStorage.getItem('pendingExercises') || '[]');
    } catch (e) {
      pending = [];
    }
    sessionStorage.removeItem('pendingExercises');
    if (!Array.isArray(pending) || pending.length === 0) return;

    const firstNewIndex = todos.length;
    pending.forEach((exercise) => {
      const todo = createTodo(exercise);
      todos.push(todo);
      renderTodo(todo);
    });
    saveTodos();

    // 追加した最初のカードまでスクロール
    document.querySelectorAll('#todos > li')[firstNewIndex]
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // 種目追加ボタン
  document.querySelector('#add-btn')?.addEventListener('click', () => {
    sessionStorage.setItem('fromWorkout', '1');
    window.location.href = 'exercises.html';
  });

  renderTodos();

  // 初めて開いたとき・種目選択画面から戻ってきたとき
  window.addEventListener('pageshow', applyPendingExercises);

  // ===== 今日のワークアウトのまとめカード =====
  const summaryDialog = document.querySelector('#summary-dialog');

  const showSummary = (entry) => {
    if (!summaryDialog) {
      window.location.href = 'index.html';
      return;
    }

    document.querySelector('#summary-date').textContent =
      `${today.getMonth() + 1}月${today.getDate()}日のワークアウト`;
    document.querySelector('#summary-weight').textContent = entry.totalWeight.toLocaleString();
    document.querySelector('#summary-distance').textContent = entry.distance;
    document.querySelector('#summary-minutes').textContent = entry.minutes;
    document.querySelector('#summary-calories').textContent = entry.calories.toLocaleString();

    // 体重が未入力ならカロリーは 0 のまま案内を出す
    document.querySelector('#summary-weight-msg').hidden = getBodyWeight() > 0;

    // やった種目の一覧
    const list = document.querySelector('#summary-exercises');
    list.innerHTML = '';
    if (entry.exercises.length === 0) {
      const li = document.createElement('li');
      li.className = 'summary-empty';
      li.textContent = '完了したセットはありません';
      list.appendChild(li);
    }
    entry.exercises.forEach((ex) => {
      const li = document.createElement('li');
      const name = document.createElement('span');
      name.textContent = ex.title;
      const sets = document.createElement('span');
      sets.className = 'summary-sets';
      sets.textContent = `${ex.sets.length}セット`;
      li.appendChild(name);
      li.appendChild(sets);
      list.appendChild(li);
    });

    summaryDialog.showModal();
  };

  // まとめカードの「ホームへ戻る」
  document.querySelector('#summary-home-btn')?.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  // Escキーでまとめカードが閉じないようにする（記録は保存済みなのでホームへ）
  summaryDialog?.addEventListener('cancel', (e) => {
    e.preventDefault();
  });

  // ワークアウト完了ボタン
  document.getElementById('workout-complete')?.addEventListener('click', () => {
    if (!confirm('ワークアウトを完了しますか？')) return;

    // 最終保存日を記録
    localStorage.setItem('lastSavedDate', todayStr);

    //今日の総重量・有酸素
    let todayTotalWeight = 0;
    let todayDistance = 0;
    let todayMinutes = 0;
    todos.forEach(todo => {
      (todo.sets || []).forEach(set => {
        if (!set.isCompleted) return;
        if (todo.type === 'cardio') {
          todayDistance += set.distance ?? set.val1 ?? 0;
          todayMinutes += set.minutes ?? set.val2 ?? 0;
        } else {
          todayTotalWeight += (set.weight ?? set.val1 ?? 0) * (set.reps ?? set.val2 ?? 0);
        }
      });
    });
    todayDistance = Math.round(todayDistance * 10) / 10;

    const exercises = todos
      .map(todo => ({
        title: todo.title,
        type: todo.type,
        sets: (todo.sets || [])
          .filter(set => set.isCompleted)
          .map(set => todo.type === 'cardio'
            ? { distance: set.distance ?? set.val1 ?? 0, minutes: set.minutes ?? set.val2 ?? 0 }
            : { weight: set.weight ?? set.val1 ?? 0, reps: set.reps ?? set.val2 ?? 0 })
      }))
      .filter(ex => ex.sets.length > 0);

    const entry = {
      date: todayStr,
      totalWeight: todayTotalWeight,
      distance: todayDistance,
      minutes: todayMinutes,
      calories: calcCalories(),
      exercises
    };

    // Firestore に保存（同じ日なら上書き）
    // オフラインでも端末に保存され、つながったときに自動で送られるので完了を待たない
    saveLog(entry).catch((e) => {
      console.error('記録の保存に失敗しました', e);
      alert('記録を保存できませんでした。通信状況を確認してもう一度「ワークアウト完了」を押してください。');
    });

    // まとめカードを表示
    showSummary(entry);
  });
}