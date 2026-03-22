import {
  DEFAULT_PREFERENCES,
  DEFAULT_STREAK,
  normalizePreferences,
  normalizeStreak,
  normalizeTasks
} from "./utils.js";

export const STORAGE_KEYS = Object.freeze({
  tasks: "smartTodo.tasks.v1",
  streak: "smartTodo.streak.v1",
  prefs: "smartTodo.prefs.v1"
});

function safeReadJson(key, fallbackValue) {
  try {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) {
      return fallbackValue;
    }

    return JSON.parse(rawValue);
  } catch (error) {
    return fallbackValue;
  }
}

function safeWriteJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

export function loadTasks() {
  const rawTasks = safeReadJson(STORAGE_KEYS.tasks, []);
  return normalizeTasks(rawTasks);
}

export function saveTasks(tasks) {
  return safeWriteJson(STORAGE_KEYS.tasks, tasks);
}

export function loadStreak() {
  const rawStreak = safeReadJson(STORAGE_KEYS.streak, DEFAULT_STREAK);
  return normalizeStreak(rawStreak);
}

export function saveStreak(streakData) {
  return safeWriteJson(STORAGE_KEYS.streak, streakData);
}

export function loadPrefs() {
  const rawPrefs = safeReadJson(STORAGE_KEYS.prefs, DEFAULT_PREFERENCES);
  return normalizePreferences(rawPrefs);
}

export function savePrefs(preferences) {
  return safeWriteJson(STORAGE_KEYS.prefs, preferences);
}
