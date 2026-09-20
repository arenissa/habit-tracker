import { getHabits, getActiveHabits } from './habits.js';
import { markSetByHabit, toggleMark } from './marks.js';
import { currentStreak, bestStreak } from './streak.js';
import { todayLocal } from './dates.js';
import { esc } from './util.js';

export function mountToday(root, { show }) {
  const today = todayLocal();
  const active = getActiveHabits();
  const archived = getHabits().filter((h) => h.archived);

  root.innerHTML = header('Сегодня') + (active.length === 0
    ? `
      <div class="empty">
        <div class="empty__icon">🌿</div>
        <p class="empty__text">Пока нет привычек.</p>
        <p class="empty__hint">Нажмите «+», чтобы создать первую.</p>
      </div>`
    : `
      <ul class="habit-list">
        ${active.map((habit) => row(habit, today)).join('')}
      </ul>`) + (archived.length > 0 ? archiveBlock(archived, today) : '');

  root.querySelectorAll('[data-row]').forEach((el) => {
    const habitId = el.dataset.row;
    const check = el.querySelector('[data-check]');
    if (check) {
      check.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMark(habitId, today);
        show('today');
      });
    }
    el.addEventListener('click', () => show('calendar', { habitId }));
  });

  const toggle = root.querySelector('[data-archive]');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const list = root.querySelector('[data-archive-list]');
      const open = list.toggleAttribute('hidden');
      toggle.textContent = `Архив (${archived.length}) ${open ? '›' : '⌄'}`;
    });
  }
}

function archiveBlock(archived, today) {
  return `
    <section class="archive-block">
      <button class="archive-toggle" data-archive>Архив (${archived.length}) ›</button>
      <ul class="archive-list" data-archive-list hidden>
        ${archived.map((habit) => archivedRow(habit, today)).join('')}
      </ul>
    </section>`;
}

function archivedRow(habit, today) {
  const set = markSetByHabit(habit.id);
  return `
    <li class="archive-row" data-row="${habit.id}">
      <span class="archive-dot" style="--habit:${habit.color}"></span>
      <span class="archive-name">${esc(habit.name)}</span>
      <span class="archive-meta">🔥 ${currentStreak(set, today)} · 🏆 ${bestStreak([...set].sort())}</span>
      <span class="habit-arrow" aria-hidden="true">›</span>
    </li>`;
}

function header(title) {
  return `<header class="topbar"><h1 class="topbar__title">${title}</h1></header>`;
}

function row(habit, today) {
  const set = markSetByHabit(habit.id);
  const dates = [...set].sort();
  const marked = set.has(today);
  return `
    <li class="habit-row ${marked ? 'is-marked' : ''}" data-row="${habit.id}">
      <button class="habit-check" data-check style="--habit:${habit.color}"
              aria-label="Отметить «${esc(habit.name)}»">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor"
                stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="habit-main">
        <div class="habit-name">${esc(habit.name)}</div>
        <div class="habit-meta">
          <span>🔥 ${currentStreak(set, today)}</span>
          <span>🏆 ${bestStreak(dates)}</span>
        </div>
      </div>
      <span class="habit-arrow" aria-hidden="true">›</span>
    </li>`;
}