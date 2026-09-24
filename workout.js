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

  const renderTodo = (todo) => {
    const li = document.createElement('li');

    // 種目名（タイトル）
    const label = document.createElement('label');
    const title = document.createElement('h2');
    title.textContent = todo.title;
    label.appendChild(title);
    li.appendChild(label);

    // テーブル（セット一覧）
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    const theadTitles = ['セット', 'kg', '回', '完了'];
    theadTitles.forEach((text) => {
      const td = document.createElement('td');
      td.textContent = text;
      tr.appendChild(td);
    });
    thead.appendChild(tr);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');

    // セット描画
    const renderSets = () => {
      tbody.innerHTML = '';
      (todo.sets || []).forEach((set, index) => {
        const row = document.createElement('tr');

        // セット番号
        const tdSet = document.createElement('td');
        tdSet.textContent = index + 1;

        // kg 入力
        const tdKg = document.createElement('td');
        const inputKg = document.createElement('input');
        inputKg.type = 'number';
        inputKg.value = set.weight;
        inputKg.addEventListener('input', (e) => {
          set.weight = Number(e.target.value);
          saveTodos();
        });
        tdKg.appendChild(inputKg);

        // 回数 入力
        const tdReps = document.createElement('td');
        const inputReps = document.createElement('input');
        inputReps.type = 'number';
        inputReps.value = set.reps;
        inputReps.addEventListener('input', (e) => {
          set.reps = Number(e.target.value);
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
      const newWeight = lastSet ? lastSet.weight : 50;
      const newReps = lastSet ? lastSet.reps : 10;

      todo.sets.push({ weight: newWeight, reps: newReps, isCompleted: false });
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
  };

  // フォーム追加処理
  const addForm = document.querySelector('#add-form');
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = addForm.querySelector('input');
      if (!input.value.trim()) return;

      const todo = {
        id: Date.now(),
        title: input.value,
        sets: [
          { weight: 50, reps: 10, isCompleted: false }
        ]
      };

      todos.push(todo);
      saveTodos();
      renderTodo(todo);

      input.value = '';
      input.focus();
    });
  }

  // 初期描画のみ実行
  renderTodos();

  // ワークアウト完了ボタン
  document.getElementById('workout-complete')?.addEventListener('click', () => {
    if (confirm('ワークアウトを完了しますか？')) {
      // ★ エラーを修正して YYYY-MM-DD 形式で保存
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