import { createHabit, getHabit, updateHabit } from './habits.js';
import { esc } from './util.js';

const COLORS = ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#1abc9c', '#3498db', '#9b59b6', '#fd79a8'];

export function mountHabitForm(root, { show, params }) {
  const habit = params.habitId ? getHabit(params.habitId) : null;
  const name = habit ? habit.name : '';
  const color = habit ? habit.color : COLORS[3];
  const backToCalendar = Boolean(habit) && params.backTo === 'calendar';

  const done = () => {
    if (backToCalendar) show('calendar', { habitId: habit.id, month: params.month });
    else show('today');
  };

  root.innerHTML = `
    <header class="topbar">
      <button class="topbar__back" data-nav="cancel" aria-label="Назад">←</button>
      <h1 class="topbar__title">${habit ? 'Редактирование' : 'Новая привычка'}</h1>
    </header>
    <form class="form" data-form>
      <label class="field">
        <span class="field__label">Название</span>
        <input class="field__input" name="name" maxlength="40"
               placeholder="Например: Вода 2 л" value="${esc(name)}" required autofocus>
      </label>
      <div class="field">
        <span class="field__label">Цвет</span>
        <div class="swatches">
          ${COLORS.map((c) => `
            <button type="button" class="swatch ${c === color ? 'is-selected' : ''}"
                    data-color="${c}" style="--habit:${c}" aria-label="Цвет ${c}"></button>`).join('')}
        </div>
      </div>
      <div class="form__buttons">
        <button type="button" class="btn btn--ghost" data-nav="cancel">Отмена</button>
        <button type="submit" class="btn">Сохранить</button>
      </div>
    </form>`;

  let selected = color;
  root.querySelectorAll('[data-color]').forEach((el) => {
    el.addEventListener('click', () => {
      selected = el.dataset.color;
      root.querySelectorAll('.swatch').forEach((s) => s.classList.toggle('is-selected', s === el));
    });
  });

  root.querySelector('[data-nav="cancel"]').addEventListener('click', done);

  root.querySelector('[data-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    const nextName = String(new FormData(e.target).get('name') || '').trim();
    if (!nextName) return;
    if (habit) updateHabit(habit.id, { name: nextName, color: selected });
    else createHabit({ name: nextName, color: selected });
    done();
  });
}