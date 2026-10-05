'use strict';

{
  //メイン画面

  const today = new Date();
  const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  let year = today.getFullYear();
  let month = today.getMonth();

  //ワークアウト開始ボタンを押した日付がローカルストレージに保存される
  function getWorkoutDates() {
    return JSON.parse(localStorage.getItem('workoutDates') || '[]');
  }

  function getTodayString() {
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }

  function saveWorkoutDate(dateString) {
    const dates = getWorkoutDates();
    if (!dates.includes(dateString)) {
      dates.push(dateString);
      localStorage.setItem('workoutDates', JSON.stringify(dates));
    }
  }

  function getCalendarHead() {
    const dates = [];
    const d = new Date(year, month, 0).getDate();
    const n = new Date(year, month, 1).getDay();

    for (let i = 0; i < n; i++) {
      dates.push({
        date: d - n + i + 1,
        isToday: false,
        isDisabled: true,
      });
    }
    return dates;
  }

  function getCalendarBody() {
    const dates = [];
    const lastDate = new Date(year, month + 1, 0).getDate();
    const workoutDates = getWorkoutDates();

    for (let i = 1; i <= lastDate; i++) {
      const targetDate = new Date(year, month, i);
      const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isToday = targetDate.getTime() === todayZero.getTime();
      const isFuture = targetDate.getTime() > todayZero.getTime();

      dates.push({
        date: i,
        isToday: isToday,
        isDisabled: isFuture,
        isWorkedOut: workoutDates.includes(fullDate),
        fullDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }

    return dates;
  }

  function getCalendarTail() {
    const dates = [];
    const lastDay = new Date(year, month + 1, 0).getDay();

    for (let i = 1; i < 7 - lastDay; i++) {
      dates.push({
        date: i,
        isToday: false,
        isDisabled: true,
      });
    }

    return dates;
  }

  function clearCalendar() {
    const tbody = document.querySelector('tbody');
    const weekRow = document.getElementById('week');

    // 日付の削除
    while (tbody?.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    // 曜日の削除（重複防止）
    while (weekRow?.firstChild) {
      weekRow.removeChild(weekRow.firstChild);
    }
  }

  function renderTitle() {
    const title = `${year}/${String(month + 1).padStart(2, '0')}`;
    const titleEl = document.getElementById('title');
    if (titleEl) titleEl.textContent = title;
  }

  function createWeek() {
    const weekRow = document.getElementById('week');
    if (!weekRow) return;

    const week = ['日', '月', '火', '水', '木', '金', '土'];
    week.forEach(day => {
      const th = document.createElement('th');
      th.textContent = day;
      weekRow.appendChild(th);
    });
  }

  function renderWeeks() {
    const dates = [
      ...getCalendarHead(),
      ...getCalendarBody(),
      ...getCalendarTail(),
    ];
    const weeks = [];
    const weeksCount = dates.length / 7;

    for (let i = 0; i < weeksCount; i++) {
      weeks.push(dates.splice(0, 7));
    }

    weeks.forEach(week => {
      const tr = document.createElement('tr');
      week.forEach(date => {
        const td = document.createElement('td');

        td.textContent = date.date;
        if (date.isToday) {
          td.classList.add('today');
        }

        if (date.isWorkedOut) {
          td.classList.add('worked-out');
        }

        if (date.isDisabled) {
          td.classList.add('disabled');
        } else {
          td.style.cursor = 'pointer';
          td.addEventListener('click', () => {
            handleDateClick(date.fullDate);
          });
        }

        tr.appendChild(td);
      });
      document.querySelector('tbody')?.appendChild(tr);
    });
  }

  //今月の総重量
  function getMonthStats(y, m) {
    const logs = JSON.parse(localStorage.getItem('workoutLogs') || '[]');
    const prefix = `${y}-${String(m + 1).padStart(2, '0')}`;
    return logs
      .filter(log => log.date && log.date.startsWith(prefix))
      .reduce((s, log) => ({
        weight: s.weight + (log.totalWeight || 0),
        distance: s.distance + (log.distance || 0),
        minutes: s.minutes + (log.minutes || 0),
      }), { weight: 0, distance: 0, minutes: 0 });
  }

  function diffText(cur, prev, unit) {
    const d = Math.round((cur - prev) * 10) / 10;
    return `${d > 0 ? '+' : ''}${d.toLocaleString()}${unit}`;
  }

  function renderMonthStats() {
    const cur = getMonthStats(year, month);
    const prev = getMonthStats(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1);
    const dist = Math.round(cur.distance * 10) / 10;

    const total = document.getElementById('month-total');
    if (total) total.innerHTML = `${cur.weight.toLocaleString()}<small>kg</small>`;
    const running = document.getElementById('month-running');
    if (running) running.innerHTML = `${dist}<small>km</small> ${cur.minutes}<small>分</small>`;

    const totalDiff = document.getElementById('total-diff');
    if (totalDiff) {
      totalDiff.textContent = `前月比 ${diffText(cur.weight, prev.weight, 'kg')}`;
    }
    const runningDiff = document.getElementById('running-diff');
    if (runningDiff) {
      runningDiff.textContent =
        `前月比 ${diffText(cur.distance, prev.distance, 'km')} ${diffText(cur.minutes, prev.minutes, '分')}`;
    }
  }

  // nextボタンの有効化／グレーアウト切り替え
  function toggleNextButton() {
    const nextBtn = document.getElementById('next');
    if (!nextBtn) return;

    // 表示中の年月が「今月」または「未来」の場合はグレーアウト
    const isCurrentOrFutureMonth =
      year > today.getFullYear() ||
      (year === today.getFullYear() && month >= today.getMonth());

    if (isCurrentOrFutureMonth) {
      nextBtn.classList.add('disabled');
    } else {
      nextBtn.classList.remove('disabled');
    }
  }

  function handleDateClick(formattedDate) {
    console.log(`選択された日付: ${formattedDate}`);
  }

  function createCalendar() {
    clearCalendar();
    renderTitle();
    createWeek();
    renderWeeks();
    toggleNextButton();
    renderMonthStats();
    renderDailyLogs();
  }

  // イベントリスナー
  document.getElementById('prev')?.addEventListener('click', () => {
    month--;
    if (month < 0) {
      year--;
      month = 11;
    }
    createCalendar();
  });

  document.getElementById('next')?.addEventListener('click', () => {
    const isCurrentOrFutureMonth =
      year > today.getFullYear() ||
      (year === today.getFullYear() && month >= today.getMonth());

    // 今月以降はクリックしても移動させない
    if (isCurrentOrFutureMonth) {
      return;
    }

    month++;
    if (month > 11) {
      year++;
      month = 0;
    }
    createCalendar();
  });

  document.getElementById('today')?.addEventListener('click', () => {
    year = today.getFullYear();
    month = today.getMonth();
    createCalendar();
  });

  // 初期表示
  createCalendar();

  // ワークアウト開始ボタン
  document.getElementById('start-workout-btn')?.addEventListener('click', () => {
    window.location.href = 'workout.html';
  });

  //トレーニング記録
  const monthTotal = document.getElementById('month-total');
  const monthCalories = document.getElementById('month-calories');

  // その日のワークアウト詳細を組み立てる
  function buildLogDetail(log) {
    const wrap = document.createElement('div');
    const exercises = log.exercises || [];

    // 詳細を保存する前の古い記録は合計値のみ表示
    if (exercises.length === 0) {
      const p = document.createElement('p');
      p.className = 'no-log-msg';
      p.textContent = log.distance
        ? `有酸素 ${log.distance}km / ${log.minutes || 0}分`
        : '種目の詳細は記録されていません';
      wrap.appendChild(p);
      return wrap;
    }

    exercises.forEach(ex => {
      const block = document.createElement('div');
      block.className = 'detail-exercise';

      const title = document.createElement('div');
      title.className = 'detail-exercise-title';
      title.textContent = ex.title;
      block.appendChild(title);

      const ol = document.createElement('ol');
      ol.className = 'detail-set-list';
      ex.sets.forEach(set => {
        const item = document.createElement('li');
        item.textContent = ex.type === 'cardio'
          ? `${set.distance}km / ${set.minutes}分`
          : `${set.weight}kg × ${set.reps}回`;
        ol.appendChild(item);
      });
      block.appendChild(ol);
      wrap.appendChild(block);
    });
    return wrap;
  }

  // 今月の表示されているログを日付ごとに一覧表示する関数
  function renderDailyLogs() {
    const container = document.getElementById('daily-logs-container');
    if (!container) return;

    const logs = JSON.parse(localStorage.getItem('workoutLogs') || '[]');
    const targetMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

    // 表示中の月の日付ログをフィルタリングして昇順に並び替え
    const currentMonthLogs = logs
      .filter(log => log.date && log.date.startsWith(targetMonthPrefix))
      .sort((a, b) => a.date.localeCompare(b.date));

    container.innerHTML = '';

    if (currentMonthLogs.length === 0) {
      container.innerHTML = 'この月のワークアウト記録はありません';
      return;
    }
    const ul = document.createElement('ul');
    ul.className = 'daily-log-list';

    currentMonthLogs.forEach(log => {
      // 日付の表示フォーマット（例: "2026-09-28" -> "9月28日"）
      const [, m, d] = log.date.split('-');
      const formattedDate = `${parseInt(m, 10)}月${parseInt(d, 10)}日`;

      const li = document.createElement('li');
      li.className = 'daily-log-item';
      const header = document.createElement('div');
      header.className = 'daily-log-header';
      header.innerHTML = `
        <span class="daily-log-date">${formattedDate}</span>
        <span class="daily-log-weight">総重量: <strong>${(log.totalWeight || 0).toLocaleString()}</strong>kg</span>
      `;

      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'daily-log-toggle';
      toggleBtn.textContent = '+';
      toggleBtn.setAttribute('aria-label', `${formattedDate}のワークアウト詳細を開く`);
      toggleBtn.setAttribute('aria-expanded', 'false');
      header.appendChild(toggleBtn);

      // 詳細エリア（初期は非表示）
      const detail = document.createElement('div');
      detail.className = 'daily-log-detail';
      detail.hidden = true;
      detail.appendChild(buildLogDetail(log));

      toggleBtn.addEventListener('click', () => {
        const open = detail.hidden;
        detail.hidden = !open;
        li.classList.toggle('open', open);
        toggleBtn.setAttribute('aria-expanded', String(open));
        toggleBtn.setAttribute('aria-label', `${formattedDate}のワークアウト詳細を${open ? '閉じる' : '開く'}`);
      });

      li.appendChild(header);
      li.appendChild(detail);
      ul.appendChild(li);
    });

    container.appendChild(ul);
  }
}