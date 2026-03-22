import { loadPrefs, loadStreak, loadTasks, savePrefs, saveStreak, saveTasks } from "./storage.js";
import { computeStreakFromTasks, updateStreakOnCompletion } from "./streak.js";
import {
  applyDraftToTask,
  computeDashboardCounts,
  computeTodayProgress,
  createTaskFromDraft,
  filterTasks,
  getTodayDateKey,
  normalizeFilter,
  normalizePriority,
  sanitizeTaskText,
  sortTasks
} from "./utils.js";
import {
  readAddTaskDraft,
  readEditTaskDraft,
  renderTodo,
  resetAddTaskForm,
  setStatus
} from "./ui.js";

function buildViewModel(state) {
  const todayDateKey = getTodayDateKey();
  const sortedTasks = sortTasks(state.tasks, todayDateKey);
  const visibleTasks = filterTasks(sortedTasks, state.prefs.activeFilter, state.prefs.searchQuery, todayDateKey);

  return {
    todayDateKey,
    visibleTasks,
    dashboard: computeDashboardCounts(state.tasks, todayDateKey),
    progress: computeTodayProgress(state.tasks, todayDateKey),
    streak: state.streak,
    prefs: state.prefs,
    editingTaskId: state.ui.editingTaskId,
    recentCompletedTaskId: state.ui.recentCompletedTaskId
  };
}

function findTaskById(tasks, taskId) {
  return tasks.find((task) => task.id === taskId) || null;
}

export function initTodoApp(elements) {
  const state = {
    tasks: loadTasks(),
    streak: loadStreak(),
    prefs: loadPrefs(),
    ui: {
      editingTaskId: null,
      recentCompletedTaskId: null
    }
  };

  const persistTasks = () => {
    saveTasks(state.tasks);
  };

  const persistStreak = () => {
    saveStreak(state.streak);
  };

  const persistPreferences = () => {
    savePrefs(state.prefs);
  };

  const recomputeStreak = () => {
    state.streak = computeStreakFromTasks(state.tasks, getTodayDateKey());
    persistStreak();
  };

  const rerender = () => {
    renderTodo(elements, buildViewModel(state));
    state.ui.recentCompletedTaskId = null;
  };

  const rerenderWithStatus = (message, type = "") => {
    rerender();
    setStatus(elements, message, type);
  };

  recomputeStreak();
  rerender();
  setStatus(elements, "Ready to plan your day.");

  const addTask = () => {
    const draft = readAddTaskDraft(elements);
    const title = sanitizeTaskText(draft.title, 140);
    if (!title) {
      setStatus(elements, "Task title is required.", "error");
      elements.titleInput.focus();
      return;
    }

    const normalizedPriority = normalizePriority(draft.priority);
    const nextTask = createTaskFromDraft({
      ...draft,
      title,
      priority: normalizedPriority
    });

    state.tasks = [nextTask, ...state.tasks];
    state.prefs.defaultPriority = normalizedPriority;
    state.ui.editingTaskId = null;
    state.ui.recentCompletedTaskId = null;

    persistTasks();
    persistPreferences();
    resetAddTaskForm(elements, state.prefs.defaultPriority);
    rerenderWithStatus("Task added.", "success");
    elements.titleInput.focus();
  };

  const toggleTaskCompletion = (taskId) => {
    let toggledTask = null;

    state.tasks = state.tasks.map((task) => {
      if (task.id !== taskId) {
        return task;
      }

      const nextCompleted = !task.completed;
      toggledTask = {
        ...task,
        completed: nextCompleted,
        completedAt: nextCompleted ? new Date().toISOString() : null
      };
      return toggledTask;
    });

    if (!toggledTask) {
      return;
    }

    state.ui.editingTaskId = null;
    state.ui.recentCompletedTaskId = toggledTask.completed ? toggledTask.id : null;
    state.streak = updateStreakOnCompletion(state.tasks, getTodayDateKey());

    persistTasks();
    persistStreak();

    const statusMessage = toggledTask.completed ? "Task completed." : "Completion undone.";
    rerenderWithStatus(statusMessage, "success");
  };

  const deleteTask = (taskId) => {
    const task = findTaskById(state.tasks, taskId);
    if (!task) {
      return;
    }

    const confirmed = window.confirm(`Delete "${task.title}"?`);
    if (!confirmed) {
      return;
    }

    state.tasks = state.tasks.filter((entry) => entry.id !== taskId);
    state.ui.editingTaskId = state.ui.editingTaskId === taskId ? null : state.ui.editingTaskId;
    state.ui.recentCompletedTaskId = null;
    state.streak = updateStreakOnCompletion(state.tasks, getTodayDateKey());

    persistTasks();
    persistStreak();
    rerenderWithStatus("Task deleted.");
  };

  const beginEditingTask = (taskId) => {
    const task = findTaskById(state.tasks, taskId);
    if (!task) {
      return;
    }

    state.ui.editingTaskId = taskId;
    state.ui.recentCompletedTaskId = null;
    rerender();

    const editTitleInput = document.getElementById(`edit-title-${taskId}`);
    if (editTitleInput) {
      editTitleInput.focus();
      editTitleInput.select();
    }
  };

  const cancelEditingTask = (taskId) => {
    if (state.ui.editingTaskId !== taskId) {
      return;
    }

    state.ui.editingTaskId = null;
    rerenderWithStatus("Edit canceled.");
  };

  const updateTask = (taskId, formNode) => {
    const task = findTaskById(state.tasks, taskId);
    if (!task) {
      return;
    }

    const draft = readEditTaskDraft(formNode);
    const title = sanitizeTaskText(draft.title, 140);
    if (!title) {
      setStatus(elements, "Task title is required.", "error");
      const editTitleNode = formNode.querySelector('[name="title"]');
      if (editTitleNode) {
        editTitleNode.focus();
      }
      return;
    }

    const nextTask = applyDraftToTask(task, {
      ...draft,
      title
    });

    state.tasks = state.tasks.map((entry) => (entry.id === taskId ? nextTask : entry));
    state.ui.editingTaskId = null;
    state.ui.recentCompletedTaskId = null;
    state.prefs.defaultPriority = normalizePriority(nextTask.priority);

    persistTasks();
    persistPreferences();
    rerenderWithStatus("Task updated.", "success");
  };

  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    addTask();
  });

  elements.advancedToggle.addEventListener("click", () => {
    state.prefs.showAdvancedInput = !state.prefs.showAdvancedInput;
    persistPreferences();
    rerender();
  });

  elements.priorityInput.addEventListener("change", () => {
    state.prefs.defaultPriority = normalizePriority(elements.priorityInput.value);
    persistPreferences();
  });

  elements.searchInput.addEventListener("input", () => {
    setSearch(elements.searchInput.value);
  });

  const setFilter = (filterKey) => {
    state.prefs.activeFilter = normalizeFilter(filterKey);
    persistPreferences();
    state.ui.editingTaskId = null;
    rerender();
  };

  const setSearch = (searchQuery) => {
    state.prefs.searchQuery = sanitizeTaskText(searchQuery, 120);
    persistPreferences();
    rerender();
  };

  elements.filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setFilter(button.dataset.todoFilter || "");
    });
  });

  elements.taskList.addEventListener("click", (event) => {
    const actionNode = event.target.closest("[data-task-action]");
    if (!actionNode) {
      return;
    }

    const taskId = actionNode.dataset.taskId;
    const action = actionNode.dataset.taskAction;
    if (!taskId || !action) {
      return;
    }

    if (action === "toggle") {
      toggleTaskCompletion(taskId);
      return;
    }

    if (action === "edit") {
      beginEditingTask(taskId);
      return;
    }

    if (action === "cancel-edit") {
      cancelEditingTask(taskId);
      return;
    }

    if (action === "delete") {
      deleteTask(taskId);
    }
  });

  elements.taskList.addEventListener("submit", (event) => {
    const formNode = event.target.closest("[data-task-edit-form]");
    if (!formNode) {
      return;
    }

    event.preventDefault();
    const taskId = formNode.dataset.taskId;
    if (!taskId) {
      return;
    }

    updateTask(taskId, formNode);
  });

  const safeRefresh = () => {
    if (state.ui.editingTaskId) {
      return;
    }

    rerender();
  };

  window.setInterval(() => {
    safeRefresh();
  }, 60 * 1000);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      safeRefresh();
    }
  });

  return {
    addTask,
    updateTask,
    toggleTask: toggleTaskCompletion,
    deleteTask,
    setFilter,
    setSearch
  };
}
