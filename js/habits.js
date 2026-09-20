import { loadHabits, saveHabits } from './storage.js';
import { todayLocal } from './dates.js';

export function getHabits() {
  return loadHabits();
}

export function getActiveHabits() {
  return getHabits().filter((h) => !h.archived);
}

export function getHabit(id) {
  return getHabits().find((h) => h.id === id) || null;
}

export function createHabit({ name, color }) {
  const habit = {
    id: uid(),
    name,
    color,
    createdAt: todayLocal(),
    archived: false,
  };
  saveHabits([...getHabits(), habit]);
  return habit;
}

export function updateHabit(id, patch) {
  saveHabits(getHabits().map((h) => (h.id === id ? { ...h, ...patch } : h)));
}

export function setArchived(id, archived) {
  updateHabit(id, { archived });
}

function uid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return 'h-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}