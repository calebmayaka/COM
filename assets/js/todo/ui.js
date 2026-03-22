import { getTodayDateKey, isTaskDueToday, isTaskOverdue } from "./utils.js";

const priorityLabelMap = Object.freeze({
  high: "High",
  medium: "Medium",
  low: "Low"
});

const friendlyDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric"
});

function escapeHtml(value) {
  return `${value || ""}`
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDisplayDate(dateKey) {
  if (!dateKey) {
    return "";
  }

  const parsed = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return dateKey;
  }

  return friendlyDateFormatter.format(parsed);
}

function getDueBadge(task, todayDateKey) {
  if (!task.dueDate) {
    return "";
  }

  if (isTaskOverdue(task, todayDateKey)) {
    return `<span class="todo-badge todo-badge--due-overdue">Overdue</span>`;
  }

  if (isTaskDueToday(task, todayDateKey)) {
    return `<span class="todo-badge todo-badge--due-today">Due today</span>`;
  }

  return `<span class="todo-badge">Due ${escapeHtml(formatDisplayDate(task.dueDate))}</span>`;
}

function renderTaskReadView(task, todayDateKey) {
  const priorityBadge = `<span class="todo-badge todo-badge--priority-${task.priority}">${priorityLabelMap[task.priority] || "Medium"}</span>`;
  const categoryBadge = task.category ? `<span class="todo-badge">${escapeHtml(task.category)}</span>` : "";
  const dueBadge = getDueBadge(task, todayDateKey);
  const notesMarkup = task.notes ? `<p class="todo-task__notes">${escapeHtml(task.notes)}</p>` : "";
  const completionButtonLabel = task.completed ? "Undo" : "Complete";
  const completionButtonClass = task.completed ? "todo-task__btn todo-task__btn--success" : "todo-task__btn";

  return `
    <div class="todo-task__top">
      <h3 class="todo-task__title">${escapeHtml(task.title)}</h3>
      <div class="todo-task__badges">
        ${priorityBadge}
        ${dueBadge}
        ${categoryBadge}
      </div>
    </div>
    ${notesMarkup}
    <div class="todo-task__actions">
      <button class="${completionButtonClass}" data-task-action="toggle" data-task-id="${escapeHtml(task.id)}" type="button">${completionButtonLabel}</button>
      <button class="todo-task__btn" data-task-action="edit" data-task-id="${escapeHtml(task.id)}" type="button">Edit</button>
      <button class="todo-task__btn todo-task__btn--danger" data-task-action="delete" data-task-id="${escapeHtml(task.id)}" type="button">Delete</button>
    </div>
  `;
}

function renderTaskEditView(task) {
  const selectedHigh = task.priority === "high" ? "selected" : "";
  const selectedMedium = task.priority === "medium" ? "selected" : "";
  const selectedLow = task.priority === "low" ? "selected" : "";

  return `
    <form class="todo-task__edit-form" data-task-edit-form="true" data-task-id="${escapeHtml(task.id)}">
      <label for="edit-title-${escapeHtml(task.id)}">
        <span>Title</span>
        <input id="edit-title-${escapeHtml(task.id)}" maxlength="140" name="title" required type="text" value="${escapeHtml(task.title)}" />
      </label>
      <div class="todo-task__edit-grid">
        <label for="edit-priority-${escapeHtml(task.id)}">
          <span>Priority</span>
          <select id="edit-priority-${escapeHtml(task.id)}" name="priority">
            <option ${selectedHigh} value="high">High</option>
            <option ${selectedMedium} value="medium">Medium</option>
            <option ${selectedLow} value="low">Low</option>
          </select>
        </label>
        <label for="edit-due-${escapeHtml(task.id)}">
          <span>Due date</span>
          <input id="edit-due-${escapeHtml(task.id)}" name="dueDate" type="date" value="${escapeHtml(task.dueDate)}" />
        </label>
        <label for="edit-category-${escapeHtml(task.id)}">
          <span>Category</span>
          <input id="edit-category-${escapeHtml(task.id)}" maxlength="60" name="category" type="text" value="${escapeHtml(task.category)}" />
        </label>
      </div>
      <label for="edit-notes-${escapeHtml(task.id)}">
        <span>Notes</span>
        <textarea id="edit-notes-${escapeHtml(task.id)}" maxlength="500" name="notes" rows="3">${escapeHtml(task.notes)}</textarea>
      </label>
      <div class="todo-task__actions">
        <button class="todo-task__btn todo-task__btn--success" data-task-action="save-edit" data-task-id="${escapeHtml(task.id)}" type="submit">Save</button>
        <button class="todo-task__btn" data-task-action="cancel-edit" data-task-id="${escapeHtml(task.id)}" type="button">Cancel</button>
      </div>
    </form>
  `;
}

function renderTaskItem(task, viewState) {
  const editing = task.id === viewState.editingTaskId;
  const classes = ["todo-task"];
  if (task.completed) {
    classes.push("is-completed");
  }
  if (task.id === viewState.recentCompletedTaskId) {
    classes.push("is-just-completed");
  }

  return `
    <li class="${classes.join(" ")}" data-task-row="${escapeHtml(task.id)}">
      ${editing ? renderTaskEditView(task) : renderTaskReadView(task, viewState.todayDateKey)}
    </li>
  `;
}

function updateFilterButtons(filterButtons, activeFilter) {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.todoFilter === activeFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function formatLastCompleted(lastCompletedDate) {
  return lastCompletedDate ? formatDisplayDate(lastCompletedDate) : "-";
}

export function getTodoElements() {
  const elements = {
    form: document.getElementById("todo-add-form"),
    titleInput: document.getElementById("todo-title-input"),
    priorityInput: document.getElementById("todo-priority-input"),
    dueDateInput: document.getElementById("todo-due-date-input"),
    categoryInput: document.getElementById("todo-category-input"),
    notesInput: document.getElementById("todo-notes-input"),
    advancedToggle: document.getElementById("todo-advanced-toggle"),
    advancedPanel: document.getElementById("todo-advanced-panel"),
    searchInput: document.getElementById("todo-search-input"),
    filterButtons: Array.from(document.querySelectorAll("[data-todo-filter]")),
    taskList: document.getElementById("todo-list"),
    emptyNode: document.getElementById("todo-empty"),
    statusNode: document.getElementById("todo-status"),
    dueTodayCount: document.getElementById("todo-due-today-count"),
    overdueCount: document.getElementById("todo-overdue-count"),
    highPriorityCount: document.getElementById("todo-high-priority-count"),
    progressText: document.getElementById("todo-progress-text"),
    progressFill: document.getElementById("todo-progress-fill"),
    currentStreak: document.getElementById("todo-current-streak"),
    bestStreak: document.getElementById("todo-best-streak"),
    lastCompleted: document.getElementById("todo-last-completed"),
    headerThemeToggle: document.getElementById("theme-toggle"),
    dashboardThemeToggle: document.getElementById("todo-theme-toggle")
  };

  const requiredNodes = [
    elements.form,
    elements.titleInput,
    elements.priorityInput,
    elements.dueDateInput,
    elements.categoryInput,
    elements.notesInput,
    elements.advancedToggle,
    elements.advancedPanel,
    elements.searchInput,
    elements.taskList,
    elements.emptyNode,
    elements.statusNode,
    elements.dueTodayCount,
    elements.overdueCount,
    elements.highPriorityCount,
    elements.progressText,
    elements.progressFill,
    elements.currentStreak,
    elements.bestStreak,
    elements.lastCompleted,
    elements.headerThemeToggle,
    elements.dashboardThemeToggle
  ];

  if (requiredNodes.some((node) => !node) || !elements.filterButtons.length) {
    return null;
  }

  return elements;
}

export function setThemeButtonState(elements, theme) {
  const isLight = theme === "light";
  const label = isLight ? "Dark mode" : "Light mode";

  elements.headerThemeToggle.setAttribute("aria-pressed", isLight ? "true" : "false");
  elements.headerThemeToggle.setAttribute("title", isLight ? "Switch to dark mode" : "Switch to light mode");

  elements.dashboardThemeToggle.setAttribute("aria-pressed", isLight ? "true" : "false");
  elements.dashboardThemeToggle.textContent = label;
}

export function setStatus(elements, message, type = "") {
  elements.statusNode.textContent = message;
  elements.statusNode.classList.remove("is-error", "is-success");
  if (type) {
    elements.statusNode.classList.add(`is-${type}`);
  }
}

export function readAddTaskDraft(elements) {
  return {
    title: elements.titleInput.value,
    priority: elements.priorityInput.value,
    dueDate: elements.dueDateInput.value,
    category: elements.categoryInput.value,
    notes: elements.notesInput.value
  };
}

export function readEditTaskDraft(formNode) {
  const formData = new FormData(formNode);
  return {
    title: `${formData.get("title") || ""}`,
    priority: `${formData.get("priority") || ""}`,
    dueDate: `${formData.get("dueDate") || ""}`,
    category: `${formData.get("category") || ""}`,
    notes: `${formData.get("notes") || ""}`
  };
}

export function resetAddTaskForm(elements, defaultPriority) {
  elements.titleInput.value = "";
  elements.categoryInput.value = "";
  elements.notesInput.value = "";
  elements.dueDateInput.value = "";
  elements.priorityInput.value = defaultPriority;
}

export function renderTodo(elements, model) {
  elements.dueTodayCount.textContent = `${model.dashboard.dueTodayCount}`;
  elements.overdueCount.textContent = `${model.dashboard.overdueCount}`;
  elements.highPriorityCount.textContent = `${model.dashboard.highPriorityCount}`;

  elements.currentStreak.textContent = `${model.streak.currentStreak}`;
  elements.bestStreak.textContent = `${model.streak.bestStreak}`;
  elements.lastCompleted.textContent = formatLastCompleted(model.streak.lastCompletedDate);

  elements.progressText.textContent = `${model.progress.completedToday} / ${model.progress.totalToday} completed (${model.progress.completionPercentage}%)`;
  elements.progressFill.style.width = `${model.progress.completionPercentage}%`;

  updateFilterButtons(elements.filterButtons, model.prefs.activeFilter);
  if (elements.searchInput.value !== model.prefs.searchQuery) {
    elements.searchInput.value = model.prefs.searchQuery;
  }

  elements.advancedPanel.hidden = !model.prefs.showAdvancedInput;
  elements.advancedToggle.setAttribute("aria-expanded", model.prefs.showAdvancedInput ? "true" : "false");
  elements.advancedToggle.textContent = model.prefs.showAdvancedInput ? "Hide advanced options" : "Show advanced options";

  if (elements.priorityInput.value !== model.prefs.defaultPriority) {
    elements.priorityInput.value = model.prefs.defaultPriority;
  }

  const todayDateKey = model.todayDateKey || getTodayDateKey();
  const taskMarkup = model.visibleTasks
    .map((task) =>
      renderTaskItem(task, {
        editingTaskId: model.editingTaskId,
        recentCompletedTaskId: model.recentCompletedTaskId,
        todayDateKey
      })
    )
    .join("");

  elements.taskList.innerHTML = taskMarkup;
  elements.emptyNode.hidden = model.visibleTasks.length > 0;
}
