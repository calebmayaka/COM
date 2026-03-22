import {
  DEFAULT_STREAK,
  dateDiffInDays,
  getTodayDateKey,
  normalizeStreak,
  toLocalDateKey
} from "./utils.js";

function getCompletionDateKeys(tasks) {
  const completionDates = tasks
    .map((task) => {
      if (!task.completed || !task.completedAt) {
        return null;
      }

      return toLocalDateKey(task.completedAt);
    })
    .filter(Boolean);

  return Array.from(new Set(completionDates)).sort((left, right) => left.localeCompare(right));
}

function computeBestStreak(dateKeys) {
  if (!dateKeys.length) {
    return 0;
  }

  let best = 1;
  let running = 1;

  for (let index = 1; index < dateKeys.length; index += 1) {
    const previousDate = dateKeys[index - 1];
    const currentDate = dateKeys[index];
    if (dateDiffInDays(previousDate, currentDate) === 1) {
      running += 1;
    } else {
      running = 1;
    }

    if (running > best) {
      best = running;
    }
  }

  return best;
}

function computeCurrentStreak(dateKeys, todayDateKey) {
  if (!dateKeys.length) {
    return 0;
  }

  const lastCompletedDate = dateKeys[dateKeys.length - 1];
  const dayGap = dateDiffInDays(lastCompletedDate, todayDateKey);

  if (dayGap > 1) {
    return 0;
  }

  let streakCount = 1;
  for (let index = dateKeys.length - 1; index > 0; index -= 1) {
    const previousDate = dateKeys[index - 1];
    const currentDate = dateKeys[index];
    if (dateDiffInDays(previousDate, currentDate) === 1) {
      streakCount += 1;
    } else {
      break;
    }
  }

  return streakCount;
}

/**
 * @returns {import("./utils.js").StreakData}
 */
export function computeStreakFromTasks(tasks, todayDateKey = getTodayDateKey()) {
  const completionDateKeys = getCompletionDateKeys(tasks);
  const lastCompletedDate = completionDateKeys.length ? completionDateKeys[completionDateKeys.length - 1] : null;

  if (!lastCompletedDate) {
    return { ...DEFAULT_STREAK };
  }

  return normalizeStreak({
    currentStreak: computeCurrentStreak(completionDateKeys, todayDateKey),
    bestStreak: computeBestStreak(completionDateKeys),
    lastCompletedDate
  });
}

/**
 * @returns {import("./utils.js").StreakData}
 */
export function updateStreakOnCompletion(tasks, todayDateKey = getTodayDateKey()) {
  return computeStreakFromTasks(tasks, todayDateKey);
}
