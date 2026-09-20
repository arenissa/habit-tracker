import { getHabit, setArchived } from './habits.js';
import { markSetByHabit, toggleMark } from './marks.js';
import { currentStreak, bestStreak } from './streak.js';
import { monthGrid, monthLabel, shiftMonth, todayMonth, todayLocal } from './dates.js';
import { esc } from './util.js';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function mountCalendar(root, { show, params }) {
  const habit = params.habitId ? getHabit(params.habitId) : null;
  if (!habit) {
    show('today');
    return;
  }

  const month = params.month || todayMonth();
  const today = todayLocal();
  const set = markSetByHabit(habit.id);
  const dates = [...set].sort();
  const cells = monthGrid(month);

  root.innerHTML = `
    <header class="topbar">
      <button class="topbar__back" data-nav="back" aria-label="Назад">←</button>
      <h1 class="topbar__title">${esc(habit.name)}</h1>
    </header>
    ${habit.archived ? '<div class="banner">Привычка в архиве: скрыта с экрана «Сегодня», история сохранена.</div>' : ''}
    <section class="stats">
      <div class="stat"><span class="stat__num">🔥 ${currentStreak(set, today)}</span><span class="stat__label">текущая</span></div>
      <div class="stat"><span class="stat__num">🏆 ${bestStreak(dates)}</span><span class="stat__label">рекорд</span></div>
      <div class="stat"><span class="stat__num">${dates.length}</span><span class="stat__label">всего</span></div>
    </section>
    <section class="calendar">
      <div class="calendar__nav">
        <button class="calendar__btn" data-nav="prev" aria-label="Предыдущий месяц">‹</button>
        <span class="calendar__month">${monthLabel(month)}</span>
        <button class="calendar__btn" data-nav="next" aria-label="Следующий месяц">›</button>
      </div>
      <div class="calendar__weekdays">${WEEKDAYS.map((w) => `<span>${w}</span>`).join('')}</div>
      <div class="calendar__grid">
        ${cells.map((cell) => dayCell(cell, set, today, habit.color)).join('')}
      </div>
      <p class="calendar__hint">Повторный тап по дню снимает отметку.</p>
    </section>
    <section class="actions">
      <button class="btn btn--ghost" data-nav="edit">Редактировать</button>
      ${habit.archived
        ? '<button class="btn" data-nav="restore">Восстановить</button>'
        : '<button class="btn btn--ghost" data-nav="archive">В архив</button>'}
    </section>`;

  const on = (nav, handler) => {
    const el = root.querySelector(`[data-nav="${nav}"]`);
    if (el) el.addEventListener('click', handler);
  };

  on('back', () => show('today'));
  on('prev', () => show('calendar', { ...params, month: shiftMonth(month, -1) }));
  on('next', () => show('calendar', { ...params, month: shiftMonth(month, 1) }));
  on('edit', () => show('form', { habitId: habit.id, backTo: 'calendar', month }));
  on('archive', () => {
    setArchived(habit.id, true);
    show('today');
  });
  on('restore', () => {
    setArchived(habit.id, false);
    show('calendar', { ...params, month });
  });

  root.querySelectorAll('[data-day]').forEach((el) => {
    el.addEventListener('click', () => {
      toggleMark(habit.id, el.dataset.day);
      show('calendar', { ...params, month });
    });
  });
}

function dayCell({ dateStr, inMonth }, set, today, color) {
  const marked = set.has(dateStr);
  const future = dateStr > today;
  const classes = [
    'day',
    inMonth ? '' : 'day--out',
    marked ? 'day--marked' : '',
    dateStr === today ? 'day--today' : '',
    future ? 'day--future' : '',
  ].filter(Boolean).join(' ');
  return `<button class="${classes}" data-day="${dateStr}" style="--habit:${color}"
          ${future ? 'disabled' : ''} aria-label="${dateStr}">${Number(dateStr.slice(8))}</button>`;
}