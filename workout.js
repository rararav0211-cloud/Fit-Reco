'use strict';
{
  // 今日の日付を表示
  const today = new Date();
  const todayEl = document.querySelector('#today');
  if (todayEl) {
    todayEl.textContent = `${today.getMonth() + 1}月${today.getDate()}日`;
  }

  // ローカルストレージからの取得（安全対策込み）
  let todos = [];
  try {
    const loaded = localStorage.getItem('todos');
    todos = loaded ? JSON.parse(loaded) : [];
    if (!Array.isArray(todos)) todos = [];
  } catch (e) {
    todos = [];
  }

  // ローカルストレージへの保存
  const saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
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
        const tdKg = document.createElement('td');
        const inputKg = document.createElement('input');
        inputKg.type = 'number';
        inputKg.min = '0'; 
        if (isCardio) inputKg.step = '0.1'; 
        inputKg.value = set.weight;
        inputKg.addEventListener('input', (e) => {
          let val = Number(e.target.value);
          if (val < 0) {
            val = 0;
            e.target.value = 0; // 手入力でマイナスが入った場合も0にリセット
          }
          set.weight = val;
          saveTodos();
        });
        tdKg.appendChild(inputKg);

        // 分, 回数入力
        const tdReps = document.createElement('td');
        const inputReps = document.createElement('input');
        inputReps.type = 'number';
        inputReps.min = '0';
        inputReps.value = set.reps;
        inputReps.addEventListener('input', (e) => {
          let val = Number(e.target.value);
          if (val < 0) {
            val = 0;
            e.target.value = 0;
          }
          set.reps = val;
          saveTodos();
        });
        tdReps.appendChild(inputReps);

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
        row.appendChild(tdKg);
        row.appendChild(tdReps);
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

      // 有酸素運動のカードが消された場合はチェックボックスの同期を取る
      if (isCardio) {
        const cardioCheckbox = document.querySelector('#cardio');
        if (cardioCheckbox) cardioCheckbox.checked = false;
      }
    });


    li.appendChild(deleteSetBtn);
    li.appendChild(addSetBtn);
    li.appendChild(deleteTodoBtn);

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

    // 既に有酸素運動がリストにあればチェックボックスをONにする
    const cardioCheckbox = document.querySelector('#cardio');
    if (cardioCheckbox) {
      cardioCheckbox.checked = todos.some((todo) => todo.type === 'cardio');
    }
  };

  // フォーム追加
  const addForm = document.querySelector('#add-form');
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = addForm.querySelector('input');
      if (!input.value.trim()) return;

      const todo = {
        id: Date.now(),
        type: 'strength',
        title: input.value,
        sets: [
          { val1: 50, val2: 10, weight: 50, reps: 10, isCompleted: false }
        ]
      };

      todos.push(todo);
      saveTodos();
      renderTodo(todo);

      input.value = '';
      input.focus();
    });
  }

  // 有酸素運動のチェックボックス連動
  const cardio = document.querySelector('#cardio');
  if (cardio) {
    cardio.addEventListener('change', (e) => {
      if (e.target.checked) {
        // すでに有酸素運動のカードがなければ追加する
        const exists = todos.some((todo) => todo.type === 'cardio');
        if (!exists) {
          const cardioTodo = {
            id: Date.now(),
            type: 'cardio',
            title: '有酸素運動',
            sets: [
              { val1: 3, val2: 20, distance: 3, minutes: 20, isCompleted: false }
            ]
          };
          todos.push(cardioTodo);
          saveTodos();
          renderTodo(cardioTodo);
        }
      } else {
        // チェックを外したら有酸素運動のカードを削除する
        const cardioTodo = todos.find((todo) => todo.type === 'cardio');
        if (cardioTodo) {
          todos = todos.filter((todo) => todo.type !== 'cardio');
          saveTodos();
          renderTodos();
        }
      }
    });
  }

  renderTodos();

  // ワークアウト完了ボタン
  document.getElementById('workout-complete')?.addEventListener('click', () => {
    if (confirm('ワークアウトを完了しますか？')) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;

      //日付を保存
      const dates = JSON.parse(localStorage.getItem('workoutDates') || '[]');
      if (!dates.includes(todayStr)) {
        dates.push(todayStr);
        localStorage.setItem('workoutDates', JSON.stringify(dates));
      }

      //今日の総重量
      let todayTotalWeight = 0;
      todos.forEach(todo => {
        (todo.sets || []).forEach(set => {
          if (set.isCompleted) {
            todayTotalWeight += (set.weight || 0) * (set.reps || 0);
          }
        });
      });

      const logs = JSON.parse(localStorage.getItem('workoutLogs') || '[]');
      const existingIndex = logs.findIndex(log => log.date === todayStr);
      if (existingIndex >= 0) {
        logs[existingIndex].totalWeight = todayTotalWeight;
      } else {
        logs.push({ date: todayStr, totalWeight: todayTotalWeight });
      }
      localStorage.setItem('workoutLogs', JSON.stringify(logs));

      window.location.href = 'index.html';
    }
  });
}