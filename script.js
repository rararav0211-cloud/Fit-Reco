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
      dates.unshift({
        date: d - i,
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
  function renderMonthTotalWeight() {
    const monthTotalEl = document.getElementById('month-total');
    if (!monthTotalEl) return;

    const logs = JSON.parse(localStorage.getItem('workoutLogs') || '[]');
    const targetMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

    const totalWeight = logs
      .filter(log => log.date && log.date.startsWith(targetMonthPrefix))
      .reduce((sum, log) => sum + (log.totalWeight || 0), 0);

    monthTotalEl.innerHTML = `${totalWeight.toLocaleString()} kg`;
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
    renderMonthTotalWeight();
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
    saveWorkoutDate(getTodayString());
    window.location.href = 'workout.html';
  });

  //トレーニング記録
  const monthTotal = document.getElementById('month-total');
  const monthCalories = document.getElementById('month-calories');

}