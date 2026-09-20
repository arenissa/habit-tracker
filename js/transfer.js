import { loadHabits, saveHabits, loadMarks, saveMarks } from './storage.js';
import { todayLocal } from './dates.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function exportData() {
  const payload = {
    app: 'habit-tracker',
    version: 1,
    exportedAt: todayLocal(),
    habits: loadHabits(),
    marks: loadMarks(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `habit-tracker-${todayLocal()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function importData(file) {
  const data = JSON.parse(await file.text());
  const habits = validHabits(data && data.habits);
  const marks = validMarks(data && data.marks);
  if (habits.length === 0 && marks.length === 0) {
    throw new Error('no valid data');
  }
  const merged = [...loadHabits()];
  for (const habit of habits) {
    const index = merged.findIndex((h) => h.id === habit.id);
    if (index >= 0) merged[index] = habit;
    else merged.push(habit);
  }
  saveHabits(merged);
  const key = (m) => m.habitId + '|' + m.date;
  const existing = new Set(loadMarks().map(key));
  const fresh = marks.filter((m) => !existing.has(key(m)));
  saveMarks([...loadMarks(), ...fresh]);
  return { habits: habits.length, marks: fresh.length };
}

function validHabits(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((h) => h && typeof h.id === 'string' && typeof h.name === 'string' && h.name.trim())
    .map((h) => ({
      id: h.id,
      name: h.name.trim(),
      color: typeof h.color === 'string' && h.color[0] === '#' ? h.color : '#2ecc71',
      createdAt: typeof h.createdAt === 'string' && DATE_RE.test(h.createdAt) ? h.createdAt : todayLocal(),
      archived: Boolean(h.archived),
    }));
}

function validMarks(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((m) => m && typeof m.habitId === 'string' && typeof m.date === 'string' && DATE_RE.test(m.date))
    .map((m) => ({ habitId: m.habitId, date: m.date }));
}