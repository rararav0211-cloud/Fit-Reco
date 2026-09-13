'use strict';
{
  // ワークアウト

  // 今日の日付
  const today = new Date();
  document.querySelector('#today').textContent = `${today.getMonth() + 1}月${today.getDate()}日`;

  let todos;

  // ローカルストレージからの取得
  if (localStorage.getItem('todos') === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem('todos'));
  }

  // ローカルストレージへの保存
  const saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  const renderTodo = (todo) => {
    const li = document.createElement('li');

    //  種目名（タイトル）
    const label = document.createElement('label');
    const title = document.createElement('h2');
    title.textContent = todo.title;
    label.appendChild(title);
    li.appendChild(label);

    //  テーブル（セット一覧）
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
      todo.sets.forEach((set, index) => {
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

    //  セット操作ボタン
    const deleteSetBtn = document.createElement('button');
    deleteSetBtn.textContent = 'ー セット削除';
    deleteSetBtn.addEventListener('click', () => {
      if (todo.sets.length > 0) {
        todo.sets.pop(); // 最後のセットを削除
        saveTodos();
        renderSets();
      }
    });

    const addSetBtn = document.createElement('button');
    addSetBtn.textContent = '＋ セット追加';
    addSetBtn.addEventListener('click', () => {
      // 最後のセットの値（kg, 回数）を引き継いで追加、なければ初期値(50kg, 10回)
      const lastSet = todo.sets[todo.sets.length - 1];
      const newWeight = lastSet ? lastSet.weight : 50;
      const newReps = lastSet ? lastSet.reps : 10;

      todo.sets.push({ weight: newWeight, reps: newReps, isCompleted: false });
      saveTodos();
      renderSets();
    });

    //  種目自体の削除ボタン
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

  const renderTodos = () => {
    todos.forEach((todo) => {
      renderTodo(todo);
    });
  };

  document.querySelector('#add-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.querySelector('#add-form input');
    const todo = {
      id: Date.now(),
      title: input.value,
      sets: [
        { weight: 50, reps: 10, isCompleted: false }
      ]
    };

    renderTodo(todo);
    todos.push(todo);
    saveTodos();
    input.value = '';
    input.focus();
  });

  saveTodos();
  document.querySelectorAll('#todos li').forEach((li) => {
    li.remove();
  });
  renderTodos();


  renderTodos();

}