import { initTodoApp } from "./app.js";
import { getTodoElements, setThemeButtonState } from "./ui.js";

function resolveCurrentTheme() {
  const theme = document.documentElement.getAttribute("data-theme");
  return theme === "light" ? "light" : "dark";
}

function applyTheme(theme, elements) {
  document.documentElement.setAttribute("data-theme", theme);
  setThemeButtonState(elements, theme);
}

function setupThemeToggles(elements) {
  const toggleTheme = () => {
    const currentTheme = resolveCurrentTheme();
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(nextTheme, elements);

    try {
      localStorage.setItem("theme", nextTheme);
    } catch (error) {
      return;
    }
  };

  [elements.headerThemeToggle, elements.dashboardThemeToggle].forEach((button) => {
    button.addEventListener("click", toggleTheme);
  });

  applyTheme(resolveCurrentTheme(), elements);
}

function initTodoPage() {
  const elements = getTodoElements();
  if (!elements) {
    return;
  }

  setupThemeToggles(elements);
  initTodoApp(elements);
}

initTodoPage();
