import { mountToday } from './ui-today.js';
import { mountCalendar } from './ui-calendar.js';
import { mountHabitForm } from './ui-habit-form.js';

const screenEl = document.getElementById('screen');
const fab = document.getElementById('btn-add');

const routes = {
  today: mountToday,
  calendar: mountCalendar,
  form: mountHabitForm,
};

function show(name, params = {}) {
  const mount = routes[name];
  if (mount) mount(screenEl, { show, params });
  fab.hidden = name !== 'today';
}

fab.addEventListener('click', () => show('form'));

show('today');

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}