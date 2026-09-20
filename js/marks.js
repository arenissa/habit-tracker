import { loadMarks, saveMarks } from './storage.js';
import { todayLocal } from './dates.js';

export function markSetByHabit(habitId) {
  const set = new Set();
  for (const mark of loadMarks()) {
    if (mark.habitId === habitId) set.add(mark.date);
  }
  return set;
}

export function toggleMark(habitId, dateStr) {
  if (dateStr > todayLocal()) return false;
  const marks = loadMarks();
  const index = marks.findIndex((m) => m.habitId === habitId && m.date === dateStr);
  if (index >= 0) {
    marks.splice(index, 1);
    saveMarks(marks);
    return false;
  }
  marks.push({ habitId, date: dateStr });
  saveMarks(marks);
  return true;
}