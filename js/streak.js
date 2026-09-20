import { addDays, daysBetween, todayLocal } from './dates.js';

export function currentStreak(markSet, today = todayLocal()) {
  let date = markSet.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (markSet.has(date)) {
    streak += 1;
    date = addDays(date, -1);
  }
  return streak;
}

export function bestStreak(sortedDates) {
  let best = 0;
  let run = 0;
  let prev = null;
  for (const date of sortedDates) {
    run = prev !== null && daysBetween(prev, date) === 1 ? run + 1 : 1;
    if (run > best) best = run;
    prev = date;
  }
  return best;
}