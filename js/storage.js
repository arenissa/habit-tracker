const HABITS_KEY = 'habits';
const MARKS_KEY = 'marks';

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    const value = raw ? JSON.parse(raw) : null;
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadHabits() {
  return load(HABITS_KEY, []);
}

export function saveHabits(habits) {
  save(HABITS_KEY, habits);
}

export function loadMarks() {
  return load(MARKS_KEY, []);
}

export function saveMarks(marks) {
  save(MARKS_KEY, marks);
}