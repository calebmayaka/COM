const DAY_MS = 24 * 60 * 60 * 1000;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const PRIORITIES = Object.freeze(["high", "medium", "low"]);
export const FILTERS = Object.freeze(["all", "today", "completed", "overdue", "high"]);

export const DEFAULT_PREFERENCES = Object.freeze({
  activeFilter: "all",
  searchQuery: "",
  defaultPriority: "medium",
  showAdvancedInput: false
});

export const DEFAULT_STREAK = Object.freeze({
  currentStreak: 0,
  bestStreak: 0,
  lastCompletedDate: null
});

const PRIORITY_WEIGHT = Object.freeze({
  high: 0,
  medium: 1,
  low: 2
});

let fallbackIdCounter = 0;

function padDatePart(value) {
  return `${value}`.padStart(2, "0");
}

function toInteger(value) {
  const parsed = Number.parseInt(`${value}`, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function toUtcFromDateKey(dateKey) {
  if (!ISO_DATE_PATTERN.test(`${dateKey || ""}`)) {
    return null;
  }

  const [year, month, day] = `${dateKey}`.split("-").map((part) => Number.parseInt(part, 10));
  if (!year || !month || !day) {
    return null;
  }

  const utc = Date.UTC(year, month - 1, day);
  const check = new Date(utc);
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    return null;
  }

  return utc;
}

export function getTodayDateKey(referenceDate = new Date()) {
  return formatDateKey(referenceDate);
}

export function formatDateKey(value) {
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const year = parsed.getFullYear();
  const month = padDatePart(parsed.getMonth() + 1);
  const day = padDatePart(parsed.getDate());
  return `${year}-${month}-${day}`;
}

export function isValidDateKey(value) {
  return toUtcFromDateKey(value) !== null;
}

export function normalizeDateInput(value) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return isValidDateKey(trimmed) ? trimmed : "";
}

export function toLocalDateKey(value) {
  if (!value) {
    return null;
  }

  if (typeof value === "string" && isValidDateKey(value)) {
    return value;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return formatDateKey(parsed);
}

export function dateDiffInDays(fromDateKey, toDateKey) {
  const fromUtc = toUtcFromDateKey(fromDateKey);
  const toUtc = toUtcFromDateKey(toDateKey);
  if (fromUtc === null || toUtc === null) {
    return 0;
  }

  return Math.floor((toUtc - fromUtc) / DAY_MS);
}

export function normalizePriority(value) {
  return PRIORITIES.includes(value) ? value : DEFAULT_PREFERENCES.defaultPriority;
}

export function normalizeFilter(value) {
  return FILTERS.includes(value) ? value : DEFAULT_PREFERENCES.activeFilter;
}

export function sanitizeTaskText(value, maxLength = 140) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

export function buildTaskId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  fallbackIdCounter += 1;
  const randomPart = Math.random().toString(36).slice(2, 9);
  return `task-${Date.now().toString(36)}-${fallbackIdCounter}-${randomPart}`;
}

function toIsoTimestamp(value, fallback = "") {
  if (!value) {
    return fallback;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }

  return parsed.toISOString();
}

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {"high"|"medium"|"low"} priority
 * @property {string} dueDate
 * @property {string} category
 * @property {string} notes
 * @property {boolean} completed
 * @property {string} createdAt
 * @property {string|null} completedAt
 */

/**
 * @typedef {Object} StreakData
 * @property {number} currentStreak
 * @property {number} bestStreak
 * @property {string|null} lastCompletedDate
 */

/**
 * @typedef {Object} TodoPreferences
 * @property {"all"|"today"|"completed"|"overdue"|"high"} activeFilter
 * @property {string} searchQuery
 * @property {"high"|"medium"|"low"} defaultPriority
 * @property {boolean} showAdvancedInput
 */

export function normalizeTask(rawTask) {
  if (!rawTask || typeof rawTask !== "object") {
    return null;
  }

  const title = sanitizeTaskText(rawTask.title, 140);
  if (!title) {
    return null;
  }

  const completed = Boolean(rawTask.completed);
  const createdAt = toIsoTimestamp(rawTask.createdAt, new Date().toISOString());
  let completedAt = completed ? toIsoTimestamp(rawTask.completedAt) : null;

  if (completed && !completedAt) {
    completedAt = createdAt;
  }

  return {
    id: typeof rawTask.id === "string" && rawTask.id.trim() ? rawTask.id : buildTaskId(),
    title,
    priority: normalizePriority(rawTask.priority),
    dueDate: normalizeDateInput(rawTask.dueDate),
    category: sanitizeTaskText(rawTask.category, 60),
    notes: sanitizeTaskText(rawTask.notes, 500),
    completed,
    createdAt,
    completedAt: completedAt || null
  };
}

export function normalizeTasks(rawTasks) {
  if (!Array.isArray(rawTasks)) {
    return [];
  }

  return rawTasks.map(normalizeTask).filter(Boolean);
}

export function normalizePreferences(rawPrefs) {
  const prefs = rawPrefs && typeof rawPrefs === "object" ? rawPrefs : {};

  return {
    activeFilter: normalizeFilter(prefs.activeFilter),
    searchQuery: sanitizeTaskText(prefs.searchQuery, 120),
    defaultPriority: normalizePriority(prefs.defaultPriority),
    showAdvancedInput: Boolean(prefs.showAdvancedInput)
  };
}

export function normalizeStreak(rawStreak) {
  const streak = rawStreak && typeof rawStreak === "object" ? rawStreak : {};

  return {
    currentStreak: Math.max(0, toInteger(streak.currentStreak) || 0),
    bestStreak: Math.max(0, toInteger(streak.bestStreak) || 0),
    lastCompletedDate: isValidDateKey(streak.lastCompletedDate) ? streak.lastCompletedDate : null
  };
}

export function isTaskOverdue(task, todayDateKey = getTodayDateKey()) {
  if (!task || task.completed || !task.dueDate) {
    return false;
  }

  return task.dueDate < todayDateKey;
}

export function isTaskDueToday(task, todayDateKey = getTodayDateKey()) {
  return Boolean(task && task.dueDate && task.dueDate === todayDateKey);
}

function compareDueDate(leftDueDate, rightDueDate) {
  if (leftDueDate && rightDueDate) {
    return leftDueDate.localeCompare(rightDueDate);
  }

  if (leftDueDate) {
    return -1;
  }

  if (rightDueDate) {
    return 1;
  }

  return 0;
}

function taskSortScore(task, todayDateKey) {
  if (task.completed) {
    return {
      group: 10,
      priority: PRIORITY_WEIGHT[task.priority],
      dueRank: 4
    };
  }

  if (isTaskOverdue(task, todayDateKey)) {
    return {
      group: 0,
      priority: PRIORITY_WEIGHT[task.priority],
      dueRank: 0
    };
  }

  if (isTaskDueToday(task, todayDateKey)) {
    return {
      group: 1,
      priority: PRIORITY_WEIGHT[task.priority],
      dueRank: 1
    };
  }

  return {
    group: 2,
    priority: PRIORITY_WEIGHT[task.priority],
    dueRank: task.dueDate ? 2 : 3
  };
}

function compareTasks(leftTask, rightTask, todayDateKey) {
  const leftScore = taskSortScore(leftTask, todayDateKey);
  const rightScore = taskSortScore(rightTask, todayDateKey);

  if (leftScore.group !== rightScore.group) {
    return leftScore.group - rightScore.group;
  }

  if (!leftTask.completed && leftScore.priority !== rightScore.priority) {
    return leftScore.priority - rightScore.priority;
  }

  if (!leftTask.completed) {
    const dueDifference = compareDueDate(leftTask.dueDate, rightTask.dueDate);
    if (dueDifference !== 0) {
      return dueDifference;
    }
  }

  if (leftTask.completed && rightTask.completed) {
    const leftCompleted = toIsoTimestamp(leftTask.completedAt);
    const rightCompleted = toIsoTimestamp(rightTask.completedAt);
    if (leftCompleted !== rightCompleted) {
      return rightCompleted.localeCompare(leftCompleted);
    }
  }

  const leftCreated = toIsoTimestamp(leftTask.createdAt);
  const rightCreated = toIsoTimestamp(rightTask.createdAt);
  if (leftCreated !== rightCreated) {
    return rightCreated.localeCompare(leftCreated);
  }

  return 0;
}

export function sortTasks(tasks, todayDateKey = getTodayDateKey()) {
  return tasks
    .map((task, index) => ({ task, index }))
    .sort((left, right) => {
      const primary = compareTasks(left.task, right.task, todayDateKey);
      return primary !== 0 ? primary : left.index - right.index;
    })
    .map((entry) => entry.task);
}

function matchesFilter(task, filter, todayDateKey) {
  if (filter === "today") {
    return isTaskDueToday(task, todayDateKey);
  }

  if (filter === "completed") {
    return task.completed;
  }

  if (filter === "overdue") {
    return isTaskOverdue(task, todayDateKey);
  }

  if (filter === "high") {
    return !task.completed && task.priority === "high";
  }

  return true;
}

function matchesSearch(task, searchQuery) {
  if (!searchQuery) {
    return true;
  }

  const normalizedQuery = searchQuery.toLowerCase();
  return [task.title, task.category, task.notes].some((value) => `${value || ""}`.toLowerCase().includes(normalizedQuery));
}

export function filterTasks(tasks, filter, searchQuery, todayDateKey = getTodayDateKey()) {
  const normalizedFilter = normalizeFilter(filter);
  const normalizedQuery = sanitizeTaskText(searchQuery, 120).toLowerCase();

  return tasks.filter((task) => {
    return matchesFilter(task, normalizedFilter, todayDateKey) && matchesSearch(task, normalizedQuery);
  });
}

export function computeDashboardCounts(tasks, todayDateKey = getTodayDateKey()) {
  let dueTodayCount = 0;
  let overdueCount = 0;
  let highPriorityCount = 0;

  tasks.forEach((task) => {
    if (!task.completed && isTaskDueToday(task, todayDateKey)) {
      dueTodayCount += 1;
    }

    if (isTaskOverdue(task, todayDateKey)) {
      overdueCount += 1;
    }

    if (!task.completed && task.priority === "high") {
      highPriorityCount += 1;
    }
  });

  return {
    dueTodayCount,
    overdueCount,
    highPriorityCount
  };
}

export function computeTodayProgress(tasks, todayDateKey = getTodayDateKey()) {
  const tasksDueToday = tasks.filter((task) => task.dueDate === todayDateKey);
  const totalToday = tasksDueToday.length;
  const completedToday = tasksDueToday.filter((task) => task.completed).length;
  const completionPercentage = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  return {
    completedToday,
    totalToday,
    completionPercentage
  };
}

export function createTaskFromDraft(draft, now = new Date()) {
  const timestamp = now.toISOString();

  return {
    id: buildTaskId(),
    title: sanitizeTaskText(draft.title, 140),
    priority: normalizePriority(draft.priority),
    dueDate: normalizeDateInput(draft.dueDate),
    category: sanitizeTaskText(draft.category, 60),
    notes: sanitizeTaskText(draft.notes, 500),
    completed: false,
    createdAt: timestamp,
    completedAt: null
  };
}

export function applyDraftToTask(task, draft) {
  return {
    ...task,
    title: sanitizeTaskText(draft.title, 140),
    priority: normalizePriority(draft.priority),
    dueDate: normalizeDateInput(draft.dueDate),
    category: sanitizeTaskText(draft.category, 60),
    notes: sanitizeTaskText(draft.notes, 500)
  };
}
