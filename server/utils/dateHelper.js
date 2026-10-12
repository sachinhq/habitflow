/**
 * Standard date formatting and calculation utilities for HabitFlow
 */

export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTodayString = (offsetDays = 0) => {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  return formatDate(d);
};

export const parseDateString = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const getPastDates = (daysCount) => {
  const dates = [];
  for (let i = daysCount - 1; i >= 0; i--) {
    dates.push(getTodayString(-i));
  }
  return dates;
};

export const getWeekDates = (targetDateStr = getTodayString()) => {
  const targetDate = parseDateString(targetDateStr);
  const dayOfWeek = targetDate.getDay(); // 0 is Sun, 1 is Mon, ... 6 is Sat
  
  // Calculate distance from Monday (1)
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(targetDate);
  monday.setDate(targetDate.getDate() + diffToMonday);

  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(formatDate(d));
  }
  return week;
};

export const getMonthDates = (year, month) => {
  // month is 1-indexed (1 to 12)
  const daysInMonth = new Date(year, month, 0).getDate();
  const dates = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const mStr = String(month).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    dates.push(`${year}-${mStr}-${dStr}`);
  }
  return dates;
};

export const isHabitScheduledOnDate = (habit, dateStr) => {
  if (habit.startDate && dateStr < habit.startDate) {
    return false;
  }
  if (habit.endDate && dateStr > habit.endDate) {
    return false;
  }

  const date = parseDateString(dateStr);
  const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon ...

  switch (habit.frequency) {
    case 'daily':
      return true;
    case 'specific_days':
      return Array.isArray(habit.targetDays) && habit.targetDays.includes(dayOfWeek);
    case 'weekly':
      // Scheduled weekly - considered active any day, but primary check
      return true;
    case 'monthly':
      return true;
    default:
      return true;
  }
};
