import { PASSPHRASE_WORDS } from "./passphrase-words.js";

const PASSWORD_CHAR_POOLS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}<>?/|~"
};

const PASSWORD_PRESETS = Object.freeze({
  balanced: {
    length: 16,
    minPerType: {
      lowercase: 1,
      uppercase: 1,
      numbers: 1,
      symbols: 1
    }
  },
  strong: {
    length: 24,
    minPerType: {
      lowercase: 2,
      uppercase: 2,
      numbers: 2,
      symbols: 2
    }
  },
  max: {
    length: 32,
    minPerType: {
      lowercase: 3,
      uppercase: 3,
      numbers: 3,
      symbols: 3
    }
  }
});

const AMBIGUOUS_CHARACTERS = new Set([
  "l",
  "I",
  "1",
  "O",
  "0",
  "|",
  "'",
  "\"",
  "`",
  ",",
  ".",
  ":",
  ";",
  "(",
  ")",
  "[",
  "]",
  "{",
  "}"
]);

const PASSPHRASE_SEPARATORS = Object.freeze({
  dash: "-",
  underscore: "_",
  space: " "
});

const TYPING_TEST_PASSAGES = {
  easy: [
    "I build clean software that helps teams work faster every day, and I focus on systems that stay stable when real users depend on them for daily tasks. Good planning, clear code, and careful testing help each release feel reliable from the first use.",
    "Good systems are simple to use, easy to fix, and stable over time. I like building tools that remove repetitive work, reduce confusion, and help people finish important tasks with less effort and fewer errors, even when the workload grows.",
    "Small updates done well can improve quality across an entire workflow. A single fix in navigation, validation, or automation can save hours each week, and those gains become more valuable as teams grow and projects become more complex.",
    "Clear communication and steady execution are key to strong delivery. I break work into practical steps, share progress often, and make sure each feature solves a real problem, so teams can move forward with confidence and fewer surprises."
  ],
  medium: [
    "Reliable software is built through clear structure, thoughtful testing, and practical iteration that keeps users at the center of every decision. The strongest products are not only feature rich, but also predictable, maintainable, and resilient under changing operational demands.",
    "Small improvements in workflow can remove daily friction and give teams more time to focus on meaningful work. When a process is streamlined with better tooling, sensible defaults, and clear ownership, productivity increases while stress and avoidable errors decline.",
    "Technical support and software development work best together when communication is clear and expectations are managed well. Product quality improves when feedback from real incidents is fed directly into architecture, deployment standards, and day-to-day implementation choices.",
    "Automation is most valuable when it reduces repetitive effort while keeping systems transparent and easy to troubleshoot. The goal is not complexity for its own sake, but dependable outcomes, faster execution, and smoother handoffs between people, tools, and processes."
  ],
  hard: [
    "Dependable engineering requires balancing performance, maintainability, and user expectations while shipping consistent value under real-world constraints. Teams that succeed repeatedly establish technical guardrails early, measure operational impact continuously, and refine decisions with evidence rather than instinct.",
    "A strong delivery culture combines precise scoping, disciplined execution, and feedback loops that convert uncertainty into measurable product progress. As priorities shift, resilient teams maintain momentum by clarifying trade-offs, documenting assumptions, and adapting architecture without eroding long-term stability.",
    "Scalable platforms emerge from thoughtful architecture, explicit trade-offs, and careful observability that prevents hidden issues from compounding over time. Robust systems are designed to fail safely, recover quickly, and expose clear signals that help engineers diagnose problems before they impact users.",
    "Complex technical work succeeds when teams align on outcomes, document assumptions clearly, and iterate without sacrificing quality or operational stability. The most effective implementations balance short-term delivery pressure with long-term maintainability, so each release strengthens rather than weakens the platform."
  ]
};

function setupThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  const root = document.documentElement;

  if (!toggle) {
    return;
  }

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    toggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    toggle.setAttribute("title", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
  };

  const initialTheme = root.getAttribute("data-theme") || "dark";
  applyTheme(initialTheme);

  toggle.addEventListener("click", () => {
    const nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch (error) {
      return;
    }
  });
}

function getCryptoApi() {
  const cryptoApi = window.crypto || window.msCrypto;
  if (!cryptoApi || typeof cryptoApi.getRandomValues !== "function") {
    return null;
  }

  return cryptoApi;
}

function getSecureRandomInt(maxExclusive, cryptoApi) {
  if (maxExclusive <= 0) {
    return 0;
  }

  if (!cryptoApi) {
    return null;
  }

  const buffer = new Uint32Array(1);
  const maxUintPlusOne = 0x100000000;
  const threshold = Math.floor(maxUintPlusOne / maxExclusive) * maxExclusive;
  let value = 0;

  do {
    cryptoApi.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= threshold);

  return value % maxExclusive;
}

function getCryptoRandomInt(maxExclusive) {
  if (maxExclusive <= 0) {
    return 0;
  }

  const secureValue = getSecureRandomInt(maxExclusive, getCryptoApi());
  if (secureValue !== null) {
    return secureValue;
  }

  return Math.floor(Math.random() * maxExclusive);
}

function pickRandomChar(pool, randomIntFn) {
  if (!pool || !pool.length) {
    return "";
  }

  const index = randomIntFn(pool.length);
  if (typeof index !== "number" || Number.isNaN(index)) {
    return "";
  }

  return pool.charAt(index);
}

function shuffleString(value, randomIntFn) {
  const chars = value.split("");
  for (let index = chars.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIntFn(index + 1);
    if (typeof swapIndex !== "number" || Number.isNaN(swapIndex)) {
      continue;
    }

    [chars[index], chars[swapIndex]] = [chars[swapIndex], chars[index]];
  }

  return chars.join("");
}

function buildPassword(length, pools, randomIntFn) {
  if (!length || !pools.length) {
    return "";
  }

  const requiredChars = pools.flatMap((entry) =>
    Array.from({ length: entry.min }, () => pickRandomChar(entry.pool, randomIntFn))
  );

  const combinedPool = pools.map((entry) => entry.pool).join("");
  const remainingLength = Math.max(0, length - requiredChars.length);
  let generated = "";

  for (let index = 0; index < remainingLength; index += 1) {
    generated += pickRandomChar(combinedPool, randomIntFn);
  }

  return shuffleString(`${requiredChars.join("")}${generated}`, randomIntFn).slice(0, length);
}

function buildPassphrase(wordCount, separator, randomIntFn) {
  if (!wordCount || wordCount < 1 || !PASSPHRASE_WORDS.length) {
    return "";
  }

  const words = Array.from({ length: wordCount }, () => {
    const index = randomIntFn(PASSPHRASE_WORDS.length);
    if (typeof index !== "number" || Number.isNaN(index)) {
      return "";
    }

    return PASSPHRASE_WORDS[index];
  }).filter(Boolean);

  return words.join(separator);
}

function clampNumber(value, minimum, maximum, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return Math.min(maximum, Math.max(minimum, parsed));
}

function getEntropyDetails(entropyBits) {
  if (!Number.isFinite(entropyBits) || entropyBits <= 0) {
    return {
      label: "-",
      guidance: "Adjust settings to improve strength and usability.",
      meterPercent: 0
    };
  }

  if (entropyBits < 40) {
    return {
      label: "Weak",
      guidance: "Best for low-risk use. Increase length or complexity for stronger protection.",
      meterPercent: 24
    };
  }

  if (entropyBits < 60) {
    return {
      label: "Fair",
      guidance: "Reasonable for general logins, but use stronger settings for critical accounts.",
      meterPercent: 48
    };
  }

  if (entropyBits < 80) {
    return {
      label: "Strong",
      guidance: "Good security level for most accounts and professional use cases.",
      meterPercent: 74
    };
  }

  return {
    label: "Very strong",
    guidance: "Excellent strength for high-value accounts and long-term credential safety.",
    meterPercent: 100
  };
}

function setupPasswordGenerator() {
  const cryptoApi = getCryptoApi();
  const modeButtons = Array.from(document.querySelectorAll("[data-password-mode]"));
  const presetButtons = Array.from(document.querySelectorAll("[data-password-preset]"));
  const randomPanel = document.getElementById("password-random-panel");
  const passphrasePanel = document.getElementById("password-passphrase-panel");
  const presetSection = document.getElementById("password-presets");
  const outputNode = document.getElementById("password-output");
  const lengthInput = document.getElementById("password-length");
  const lengthValueNode = document.getElementById("password-length-value");
  const passphraseWordCountNode = document.getElementById("passphrase-word-count");
  const passphraseWordCountValueNode = document.getElementById("passphrase-word-count-value");
  const passphraseSeparatorNode = document.getElementById("passphrase-separator");
  const generateButton = document.getElementById("password-generate");
  const copyButton = document.getElementById("password-copy");
  const strengthNode = document.getElementById("password-strength");
  const strengthBarNode = document.getElementById("password-strength-bar");
  const guidanceNode = document.getElementById("password-guidance");
  const statusNode = document.getElementById("password-status");
  const lowercaseNode = document.getElementById("password-lowercase");
  const minLowercaseNode = document.getElementById("password-min-lowercase");
  const uppercaseNode = document.getElementById("password-uppercase");
  const minUppercaseNode = document.getElementById("password-min-uppercase");
  const numbersNode = document.getElementById("password-numbers");
  const minNumbersNode = document.getElementById("password-min-numbers");
  const symbolsNode = document.getElementById("password-symbols");
  const minSymbolsNode = document.getElementById("password-min-symbols");
  const avoidAmbiguousNode = document.getElementById("password-avoid-ambiguous");
  const excludeCharsNode = document.getElementById("password-exclude-chars");

  if (
    !modeButtons.length ||
    !presetButtons.length ||
    !randomPanel ||
    !passphrasePanel ||
    !presetSection ||
    !outputNode ||
    !lengthInput ||
    !lengthValueNode ||
    !passphraseWordCountNode ||
    !passphraseWordCountValueNode ||
    !passphraseSeparatorNode ||
    !generateButton ||
    !copyButton ||
    !strengthNode ||
    !strengthBarNode ||
    !guidanceNode ||
    !statusNode ||
    !lowercaseNode ||
    !minLowercaseNode ||
    !uppercaseNode ||
    !minUppercaseNode ||
    !numbersNode ||
    !minNumbersNode ||
    !symbolsNode ||
    !minSymbolsNode ||
    !avoidAmbiguousNode ||
    !excludeCharsNode
  ) {
    return;
  }

  const optionEntries = [
    { label: "Lowercase", node: lowercaseNode, minNode: minLowercaseNode, poolKey: "lowercase" },
    { label: "Uppercase", node: uppercaseNode, minNode: minUppercaseNode, poolKey: "uppercase" },
    { label: "Numbers", node: numbersNode, minNode: minNumbersNode, poolKey: "numbers" },
    { label: "Symbols", node: symbolsNode, minNode: minSymbolsNode, poolKey: "symbols" }
  ];

  const state = {
    mode: "random"
  };

  const secureRandom = (maxExclusive) => getSecureRandomInt(maxExclusive, cryptoApi);

  const setStatus = (message, type = "") => {
    statusNode.textContent = message;
    statusNode.classList.remove("is-error", "is-success", "is-warning");
    if (type) {
      statusNode.classList.add(`is-${type}`);
    }
  };

  const setStrength = (entropyBits) => {
    const details = getEntropyDetails(entropyBits);
    if (details.label === "-") {
      strengthNode.textContent = "Strength: -";
    } else {
      strengthNode.textContent = `Strength: ${details.label} (${Math.round(entropyBits)} bits)`;
    }

    strengthBarNode.style.width = `${details.meterPercent}%`;
    guidanceNode.textContent = details.guidance;
  };

  const setActivePreset = (presetKey = "") => {
    presetButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.passwordPreset === presetKey);
    });
  };

  const updateLengthLabel = () => {
    lengthValueNode.textContent = `${lengthInput.value}`;
  };

  const updateWordCountLabel = () => {
    passphraseWordCountValueNode.textContent = `${passphraseWordCountNode.value}`;
  };

  const setMode = (mode) => {
    state.mode = mode;
    modeButtons.forEach((button) => {
      const isActive = button.dataset.passwordMode === mode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    const isRandomMode = mode === "random";
    randomPanel.hidden = !isRandomMode;
    presetSection.hidden = !isRandomMode;
    passphrasePanel.hidden = isRandomMode;
  };

  const syncMinimumInputs = () => {
    optionEntries.forEach((entry) => {
      const enabled = entry.node.checked;
      entry.minNode.disabled = !enabled;

      if (!enabled) {
        entry.minNode.value = "0";
        return;
      }

      entry.minNode.value = `${clampNumber(entry.minNode.value, 1, 48, 1)}`;
    });
  };

  const getRandomPasswordSettings = () => {
    const exclusions = new Set(Array.from(excludeCharsNode.value || ""));
    const avoidAmbiguous = avoidAmbiguousNode.checked;
    const length = clampNumber(lengthInput.value, 8, 48, 16);

    const selectedPools = optionEntries
      .filter((entry) => entry.node.checked)
      .map((entry) => {
        const basePool = PASSWORD_CHAR_POOLS[entry.poolKey];
        const filteredPool = Array.from(basePool)
          .filter((character) => !exclusions.has(character))
          .filter((character) => !avoidAmbiguous || !AMBIGUOUS_CHARACTERS.has(character))
          .join("");

        return {
          key: entry.poolKey,
          label: entry.label,
          pool: filteredPool,
          min: clampNumber(entry.minNode.value, 1, 48, 1)
        };
      });

    return {
      length,
      selectedPools
    };
  };

  const setSecurityUnavailableState = () => {
    generateButton.disabled = true;
    outputNode.value = "";
    copyButton.disabled = true;
    setStrength(0);
    setStatus("Secure randomness is unavailable in this browser. Generation is disabled for safety.", "warning");
  };

  const generateRandomPassword = () => {
    const { length, selectedPools } = getRandomPasswordSettings();

    if (!selectedPools.length) {
      outputNode.value = "";
      copyButton.disabled = true;
      setStrength(0);
      setStatus("Select at least one character type.", "error");
      return false;
    }

    const missingPool = selectedPools.find((entry) => !entry.pool.length);
    if (missingPool) {
      outputNode.value = "";
      copyButton.disabled = true;
      setStrength(0);
      setStatus(`${missingPool.label} pool is empty after exclusions. Adjust settings.`, "error");
      return false;
    }

    const requiredCount = selectedPools.reduce((total, entry) => total + entry.min, 0);
    if (requiredCount > length) {
      outputNode.value = "";
      copyButton.disabled = true;
      setStrength(0);
      setStatus("Minimum character requirements exceed selected length.", "error");
      return false;
    }

    const password = buildPassword(length, selectedPools, secureRandom);
    if (!password) {
      outputNode.value = "";
      copyButton.disabled = true;
      setStrength(0);
      setStatus("Unable to generate password with current settings.", "error");
      return false;
    }

    const effectivePoolSize = new Set(selectedPools.map((entry) => entry.pool).join("")).size;
    const entropyBits = effectivePoolSize > 1 ? length * Math.log2(effectivePoolSize) : 0;

    outputNode.value = password;
    copyButton.disabled = false;
    setStrength(entropyBits);
    setStatus("");
    return true;
  };

  const generatePassphrase = () => {
    const wordCount = clampNumber(passphraseWordCountNode.value, 3, 8, 4);
    const separator = PASSPHRASE_SEPARATORS[passphraseSeparatorNode.value] || "-";
    const passphrase = buildPassphrase(wordCount, separator, secureRandom);

    if (!passphrase) {
      outputNode.value = "";
      copyButton.disabled = true;
      setStrength(0);
      setStatus("Unable to generate passphrase. Try adjusting settings.", "error");
      return false;
    }

    const entropyBits = wordCount * Math.log2(PASSPHRASE_WORDS.length);
    outputNode.value = passphrase;
    copyButton.disabled = false;
    setStrength(entropyBits);
    setStatus("");
    return true;
  };

  const generatePassword = () => {
    if (!cryptoApi) {
      setSecurityUnavailableState();
      return;
    }

    generateButton.disabled = false;

    if (state.mode === "passphrase") {
      generatePassphrase();
      return;
    }

    generateRandomPassword();
  };

  const applyPreset = (presetKey) => {
    const preset = PASSWORD_PRESETS[presetKey];
    if (!preset) {
      return;
    }

    setMode("random");
    lengthInput.value = `${preset.length}`;
    updateLengthLabel();

    optionEntries.forEach((entry) => {
      entry.node.checked = true;
      entry.minNode.value = `${preset.minPerType[entry.poolKey] || 1}`;
    });

    avoidAmbiguousNode.checked = false;
    excludeCharsNode.value = "";
    syncMinimumInputs();
    setActivePreset(presetKey);
    generatePassword();
  };

  const copyPassword = async () => {
    const password = outputNode.value;
    if (!password) {
      setStatus("Generate a password first.", "error");
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(password);
      } else {
        outputNode.select();
        outputNode.setSelectionRange(0, password.length);
        const copied = document.execCommand("copy");
        if (!copied) {
          throw new Error("copy failed");
        }
      }

      setStatus("Password copied to clipboard.", "success");
    } catch (error) {
      setStatus("Copy failed. Please copy manually.", "error");
    }
  };

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.passwordMode;
      if (!mode || (mode !== "random" && mode !== "passphrase")) {
        return;
      }

      setActivePreset("");
      setMode(mode);
      generatePassword();
    });
  });

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const presetKey = button.dataset.passwordPreset;
      if (!presetKey) {
        return;
      }

      applyPreset(presetKey);
    });
  });

  lengthInput.addEventListener("input", () => {
    updateLengthLabel();
    setActivePreset("");
    generatePassword();
  });

  passphraseWordCountNode.addEventListener("input", () => {
    updateWordCountLabel();
    generatePassword();
  });

  passphraseSeparatorNode.addEventListener("change", generatePassword);
  generateButton.addEventListener("click", generatePassword);
  copyButton.addEventListener("click", copyPassword);

  optionEntries.forEach((entry) => {
    entry.node.addEventListener("change", () => {
      setActivePreset("");
      syncMinimumInputs();
      generatePassword();
    });

    entry.minNode.addEventListener("input", () => {
      if (!entry.node.checked) {
        return;
      }

      entry.minNode.value = `${clampNumber(entry.minNode.value, 1, 48, 1)}`;
      setActivePreset("");
      generatePassword();
    });
  });

  avoidAmbiguousNode.addEventListener("change", () => {
    setActivePreset("");
    generatePassword();
  });

  excludeCharsNode.addEventListener("input", () => {
    setActivePreset("");
    generatePassword();
  });

  updateLengthLabel();
  updateWordCountLabel();
  setMode("random");
  syncMinimumInputs();
  applyPreset("balanced");
}

function setupPomodoroTimer() {
  const phaseButtons = Array.from(document.querySelectorAll("[data-pomodoro-phase]"));
  const focusPresetButtons = Array.from(document.querySelectorAll("[data-pomodoro-focus-preset]"));
  const currentPhaseNode = document.getElementById("pomodoro-current-phase");
  const timeNode = document.getElementById("pomodoro-time");
  const progressCircleNode = document.getElementById("pomodoro-progress-circle");
  const completedFocusNode = document.getElementById("pomodoro-completed-focus");
  const cycleTargetNode = document.getElementById("pomodoro-cycle-target");
  const startButton = document.getElementById("pomodoro-start");
  const pauseButton = document.getElementById("pomodoro-pause");
  const resetButton = document.getElementById("pomodoro-reset");
  const skipButton = document.getElementById("pomodoro-skip");
  const focusMinutesNode = document.getElementById("pomodoro-focus-minutes");
  const shortMinutesNode = document.getElementById("pomodoro-short-minutes");
  const longMinutesNode = document.getElementById("pomodoro-long-minutes");
  const longIntervalNode = document.getElementById("pomodoro-long-interval");
  const autoStartNode = document.getElementById("pomodoro-auto-start");
  const statusNode = document.getElementById("pomodoro-status");

  if (
    !phaseButtons.length ||
    !currentPhaseNode ||
    !timeNode ||
    !progressCircleNode ||
    !completedFocusNode ||
    !cycleTargetNode ||
    !startButton ||
    !pauseButton ||
    !resetButton ||
    !skipButton ||
    !focusMinutesNode ||
    !shortMinutesNode ||
    !longMinutesNode ||
    !longIntervalNode ||
    !autoStartNode ||
    !statusNode
  ) {
    return;
  }

  const phaseLabels = {
    focus: "Focus session",
    short: "Short break",
    long: "Long break"
  };
  const circleRadius = Number.parseFloat(progressCircleNode.getAttribute("r")) || 52;
  const circleCircumference = 2 * Math.PI * circleRadius;

  const state = {
    phase: "focus",
    running: false,
    timerId: null,
    completedFocus: 0,
    longInterval: 4,
    autoStart: false,
    durations: {
      focus: 25,
      short: 5,
      long: 15
    },
    totalSeconds: 25 * 60,
    remainingSeconds: 25 * 60
  };

  progressCircleNode.style.strokeDasharray = `${circleCircumference}`;
  progressCircleNode.style.strokeDashoffset = `${circleCircumference}`;

  const clamp = (value, minimum, maximum, fallback) => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return fallback;
    }

    return Math.min(maximum, Math.max(minimum, parsed));
  };

  const formatTime = (totalSeconds) => {
    const safeSeconds = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const setStatus = (message, type = "") => {
    statusNode.textContent = message;
    statusNode.classList.remove("is-success", "is-warning");
    if (type) {
      statusNode.classList.add(`is-${type}`);
    }
  };

  const stopTimer = () => {
    if (!state.timerId) {
      return;
    }

    window.clearInterval(state.timerId);
    state.timerId = null;
  };

  const syncInputs = () => {
    focusMinutesNode.value = `${state.durations.focus}`;
    shortMinutesNode.value = `${state.durations.short}`;
    longMinutesNode.value = `${state.durations.long}`;
    longIntervalNode.value = `${state.longInterval}`;
    autoStartNode.checked = state.autoStart;
  };

  const setActivePhaseButton = () => {
    phaseButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.pomodoroPhase === state.phase);
    });
  };

  const setActiveFocusPreset = () => {
    const focusMinutes = state.durations.focus;
    focusPresetButtons.forEach((button) => {
      const presetMinutes = clamp(button.dataset.pomodoroFocusPreset, 5, 180, 25);
      button.classList.toggle("is-active", presetMinutes === focusMinutes);
    });
  };

  const updateDisplay = () => {
    currentPhaseNode.textContent = phaseLabels[state.phase] || "Focus session";
    timeNode.textContent = formatTime(state.remainingSeconds);
    completedFocusNode.textContent = `${state.completedFocus}`;
    cycleTargetNode.textContent = `${state.longInterval}`;

    const elapsedSeconds = Math.max(0, state.totalSeconds - state.remainingSeconds);
    const progressPercent = state.totalSeconds > 0 ? Math.min(100, (elapsedSeconds / state.totalSeconds) * 100) : 0;
    const progressOffset = circleCircumference - (progressPercent / 100) * circleCircumference;
    progressCircleNode.style.strokeDashoffset = `${progressOffset}`;

    startButton.disabled = state.running;
    pauseButton.disabled = !state.running;
    setActivePhaseButton();
    setActiveFocusPreset();
  };

  const setPhase = (phase) => {
    state.phase = phase;
    state.totalSeconds = state.durations[phase] * 60;
    state.remainingSeconds = state.totalSeconds;
    updateDisplay();
  };

  const getNextPhase = (countCompletion) => {
    if (state.phase !== "focus") {
      return "focus";
    }

    if (countCompletion) {
      state.completedFocus += 1;
      const shouldTakeLongBreak = state.completedFocus % state.longInterval === 0;
      return shouldTakeLongBreak ? "long" : "short";
    }

    return "short";
  };

  const completeCurrentPhase = (countCompletion) => {
    stopTimer();
    state.running = false;
    const nextPhase = getNextPhase(countCompletion);
    setPhase(nextPhase);

    if (countCompletion) {
      setStatus(`${phaseLabels[nextPhase]} ready. Great consistency.`, "success");
    } else {
      setStatus(`Switched to ${phaseLabels[nextPhase].toLowerCase()}.`, "warning");
    }

    if (state.autoStart) {
      startTimer();
    } else {
      updateDisplay();
    }
  };

  const startTimer = () => {
    if (state.running) {
      return;
    }

    if (state.remainingSeconds <= 0) {
      state.remainingSeconds = state.totalSeconds;
    }

    state.running = true;
    setStatus(`${phaseLabels[state.phase]} started.`);
    updateDisplay();

    state.timerId = window.setInterval(() => {
      state.remainingSeconds = Math.max(0, state.remainingSeconds - 1);
      updateDisplay();

      if (state.remainingSeconds <= 0) {
        completeCurrentPhase(true);
      }
    }, 1000);
  };

  const pauseTimer = () => {
    if (!state.running) {
      return;
    }

    stopTimer();
    state.running = false;
    setStatus("Timer paused.", "warning");
    updateDisplay();
  };

  const resetCurrentPhase = () => {
    stopTimer();
    state.running = false;
    state.remainingSeconds = state.totalSeconds;
    setStatus(`${phaseLabels[state.phase]} reset.`);
    updateDisplay();
  };

  const applySettings = () => {
    state.durations.focus = clamp(focusMinutesNode.value, 5, 180, 25);
    state.durations.short = clamp(shortMinutesNode.value, 1, 30, 5);
    state.durations.long = clamp(longMinutesNode.value, 5, 60, 15);
    state.longInterval = clamp(longIntervalNode.value, 2, 8, 4);
    state.autoStart = autoStartNode.checked;

    syncInputs();

    const nextTotalSeconds = state.durations[state.phase] * 60;
    state.totalSeconds = nextTotalSeconds;
    if (!state.running) {
      state.remainingSeconds = nextTotalSeconds;
    } else {
      state.remainingSeconds = Math.min(state.remainingSeconds, nextTotalSeconds);
    }

    updateDisplay();
  };

  phaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextPhase = button.dataset.pomodoroPhase;
      if (!nextPhase || !Object.prototype.hasOwnProperty.call(state.durations, nextPhase)) {
        return;
      }

      stopTimer();
      state.running = false;
      setPhase(nextPhase);
      setStatus(`Switched to ${phaseLabels[nextPhase].toLowerCase()}.`, "warning");
    });
  });

  focusPresetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const presetMinutes = clamp(button.dataset.pomodoroFocusPreset, 5, 180, 25);
      stopTimer();
      state.running = false;
      state.durations.focus = presetMinutes;
      syncInputs();
      setPhase("focus");
      setStatus(`Focus duration set to ${presetMinutes} minutes.`);
    });
  });

  [focusMinutesNode, shortMinutesNode, longMinutesNode, longIntervalNode].forEach((node) => {
    node.addEventListener("input", applySettings);
  });

  autoStartNode.addEventListener("change", () => {
    state.autoStart = autoStartNode.checked;
    setStatus(state.autoStart ? "Auto-start enabled." : "Auto-start disabled.");
    updateDisplay();
  });

  startButton.addEventListener("click", startTimer);
  pauseButton.addEventListener("click", pauseTimer);
  resetButton.addEventListener("click", resetCurrentPhase);
  skipButton.addEventListener("click", () => {
    completeCurrentPhase(false);
  });

  applySettings();
  setPhase("focus");
  setStatus("Ready to start your first focus session.");
}

function setupQrCodeGenerator() {
  const inputNode = document.getElementById("qr-input");
  const sizeInput = document.getElementById("qr-size");
  const sizeValueNode = document.getElementById("qr-size-value");
  const levelSelect = document.getElementById("qr-level");
  const generateButton = document.getElementById("qr-generate");
  const downloadButton = document.getElementById("qr-download");
  const clearButton = document.getElementById("qr-clear");
  const outputNode = document.getElementById("qr-output");
  const statusNode = document.getElementById("qr-status");

  if (
    !inputNode ||
    !sizeInput ||
    !sizeValueNode ||
    !levelSelect ||
    !generateButton ||
    !downloadButton ||
    !clearButton ||
    !outputNode ||
    !statusNode
  ) {
    return;
  }

  const qrcodeApi = window.QRCode;
  let regenerateTimer = 0;

  const setStatus = (message, type = "") => {
    statusNode.textContent = message;
    statusNode.classList.remove("is-error", "is-success", "is-warning");
    if (type) {
      statusNode.classList.add(`is-${type}`);
    }
  };

  const setDownloadEnabled = (enabled) => {
    downloadButton.disabled = !enabled;
  };

  const updateSizeLabel = () => {
    sizeValueNode.textContent = `${sizeInput.value}px`;
  };

  const clearQrOutput = () => {
    outputNode.innerHTML = "";
  };

  const getCorrectLevel = () => {
    if (!qrcodeApi || !qrcodeApi.CorrectLevel) {
      return null;
    }

    const levels = {
      L: qrcodeApi.CorrectLevel.L,
      M: qrcodeApi.CorrectLevel.M,
      Q: qrcodeApi.CorrectLevel.Q,
      H: qrcodeApi.CorrectLevel.H
    };

    return levels[levelSelect.value] || qrcodeApi.CorrectLevel.M;
  };

  const renderQrCode = () => {
    if (!qrcodeApi || !qrcodeApi.CorrectLevel) {
      generateButton.disabled = true;
      setDownloadEnabled(false);
      clearQrOutput();
      setStatus("QR library did not load. Refresh this page to try again.", "warning");
      return false;
    }

    const text = inputNode.value.trim();
    if (!text) {
      clearQrOutput();
      setDownloadEnabled(false);
      setStatus("Enter text or a URL to generate a QR code.", "error");
      return false;
    }

    const size = clampNumber(sizeInput.value, 128, 512, 256);
    const correctLevel = getCorrectLevel();

    clearQrOutput();

    try {
      new qrcodeApi(outputNode, {
        text,
        width: size,
        height: size,
        colorDark: "#111111",
        colorLight: "#ffffff",
        correctLevel
      });

      const hasGraphic = Boolean(outputNode.querySelector("canvas, img"));
      if (!hasGraphic) {
        throw new Error("QR render failed");
      }

      setDownloadEnabled(true);
      setStatus("QR code ready.", "success");
      return true;
    } catch (error) {
      clearQrOutput();
      setDownloadEnabled(false);
      setStatus("Unable to generate QR code with the current input.", "error");
      return false;
    }
  };

  const scheduleRender = () => {
    window.clearTimeout(regenerateTimer);
    regenerateTimer = window.setTimeout(() => {
      renderQrCode();
    }, 140);
  };

  const downloadQrCode = () => {
    const canvas = outputNode.querySelector("canvas");
    const image = outputNode.querySelector("img");
    let dataUrl = "";

    if (canvas && typeof canvas.toDataURL === "function") {
      dataUrl = canvas.toDataURL("image/png");
    } else if (image) {
      const source = image.getAttribute("src") || "";
      if (source.startsWith("data:image")) {
        dataUrl = source;
      }
    }

    if (!dataUrl) {
      setStatus("Generate a QR code before downloading.", "error");
      setDownloadEnabled(false);
      return;
    }

    const linkNode = document.createElement("a");
    linkNode.href = dataUrl;
    linkNode.download = "caleb-qr-code.png";
    document.body.appendChild(linkNode);
    linkNode.click();
    document.body.removeChild(linkNode);
    setStatus("QR code downloaded.", "success");
  };

  const clearInputs = () => {
    inputNode.value = "";
    clearQrOutput();
    setDownloadEnabled(false);
    setStatus("Cleared. Enter new text to generate another QR code.");
    inputNode.focus();
  };

  inputNode.addEventListener("input", () => {
    if (!inputNode.value.trim()) {
      clearQrOutput();
      setDownloadEnabled(false);
      setStatus("Enter text or a URL to generate a QR code.");
      return;
    }

    scheduleRender();
  });

  sizeInput.addEventListener("input", () => {
    updateSizeLabel();
    if (inputNode.value.trim()) {
      scheduleRender();
    }
  });

  levelSelect.addEventListener("change", () => {
    if (inputNode.value.trim()) {
      scheduleRender();
    }
  });

  generateButton.addEventListener("click", renderQrCode);
  downloadButton.addEventListener("click", downloadQrCode);
  clearButton.addEventListener("click", clearInputs);

  updateSizeLabel();
  setDownloadEnabled(false);

  if (!qrcodeApi || !qrcodeApi.CorrectLevel) {
    generateButton.disabled = true;
    setStatus("QR library did not load. Refresh this page to try again.", "warning");
    return;
  }

  renderQrCode();
}

function setupCalculator() {
  const displayNode = document.getElementById("calculator-display");
  const expressionNode = document.getElementById("calculator-expression");
  const statusNode = document.getElementById("calculator-status");
  const digitButtons = Array.from(document.querySelectorAll("[data-calc-digit]"));
  const operatorButtons = Array.from(document.querySelectorAll("[data-calc-operator]"));
  const actionButtons = Array.from(document.querySelectorAll("[data-calc-action]"));

  if (!displayNode || !expressionNode || !statusNode || !digitButtons.length || !operatorButtons.length || !actionButtons.length) {
    return;
  }

  const operatorLabels = {
    "+": "+",
    "-": "-",
    "*": "\u00D7",
    "/": "\u00F7"
  };

  const state = {
    displayValue: "0",
    expression: "",
    firstOperand: null,
    pendingOperator: null,
    waitingForSecondOperand: false,
    justEvaluated: false
  };

  const setStatus = (message, type = "") => {
    statusNode.textContent = message;
    statusNode.classList.remove("is-error", "is-success");
    if (type) {
      statusNode.classList.add(`is-${type}`);
    }
  };

  const formatNumber = (value) => {
    if (!Number.isFinite(value)) {
      return "0";
    }

    const rounded = Number.parseFloat(value.toFixed(12));
    if (Object.is(rounded, -0)) {
      return "0";
    }

    if (Math.abs(rounded) >= 1e12) {
      return rounded.toExponential(6);
    }

    return `${rounded}`;
  };

  const render = () => {
    displayNode.textContent = state.displayValue;
    expressionNode.textContent = state.expression;
  };

  const resetState = () => {
    state.displayValue = "0";
    state.expression = "";
    state.firstOperand = null;
    state.pendingOperator = null;
    state.waitingForSecondOperand = false;
    state.justEvaluated = false;
  };

  const getDisplayNumber = () => {
    const value = Number.parseFloat(state.displayValue);
    if (Number.isNaN(value)) {
      return 0;
    }

    return value;
  };

  const calculate = (leftValue, rightValue, operator) => {
    if (operator === "+") {
      return leftValue + rightValue;
    }

    if (operator === "-") {
      return leftValue - rightValue;
    }

    if (operator === "*") {
      return leftValue * rightValue;
    }

    if (operator === "/") {
      if (rightValue === 0) {
        return null;
      }
      return leftValue / rightValue;
    }

    return rightValue;
  };

  const applyDigit = (digit) => {
    if (!digit) {
      return;
    }

    if (state.justEvaluated) {
      resetState();
    }

    if (state.waitingForSecondOperand) {
      state.displayValue = digit;
      state.waitingForSecondOperand = false;
      render();
      return;
    }

    if (state.displayValue === "0") {
      state.displayValue = digit;
      render();
      return;
    }

    if (state.displayValue.length >= 16) {
      return;
    }

    state.displayValue += digit;
    render();
  };

  const applyDecimal = () => {
    if (state.justEvaluated) {
      resetState();
    }

    if (state.waitingForSecondOperand) {
      state.displayValue = "0.";
      state.waitingForSecondOperand = false;
      render();
      return;
    }

    if (!state.displayValue.includes(".")) {
      state.displayValue += ".";
      render();
    }
  };

  const applyOperator = (operator) => {
    if (!operator || !Object.prototype.hasOwnProperty.call(operatorLabels, operator)) {
      return;
    }

    const inputValue = getDisplayNumber();

    if (state.pendingOperator && state.waitingForSecondOperand) {
      state.pendingOperator = operator;
      state.expression = `${formatNumber(state.firstOperand || 0)} ${operatorLabels[operator]}`;
      render();
      return;
    }

    if (state.firstOperand === null || state.justEvaluated) {
      state.firstOperand = inputValue;
    } else if (state.pendingOperator) {
      const result = calculate(state.firstOperand, inputValue, state.pendingOperator);
      if (result === null) {
        resetState();
        setStatus("Cannot divide by zero.", "error");
        render();
        return;
      }

      state.firstOperand = result;
      state.displayValue = formatNumber(result);
    }

    state.pendingOperator = operator;
    state.waitingForSecondOperand = true;
    state.justEvaluated = false;
    state.expression = `${formatNumber(state.firstOperand || 0)} ${operatorLabels[operator]}`;
    setStatus("");
    render();
  };

  const applyEquals = () => {
    if (!state.pendingOperator || state.waitingForSecondOperand) {
      return;
    }

    const rightOperand = getDisplayNumber();
    const leftOperand = state.firstOperand || 0;
    const operator = state.pendingOperator;
    const result = calculate(leftOperand, rightOperand, operator);

    if (result === null) {
      resetState();
      setStatus("Cannot divide by zero.", "error");
      render();
      return;
    }

    state.displayValue = formatNumber(result);
    state.expression = `${formatNumber(leftOperand)} ${operatorLabels[operator]} ${formatNumber(rightOperand)} =`;
    state.firstOperand = null;
    state.pendingOperator = null;
    state.waitingForSecondOperand = false;
    state.justEvaluated = true;
    setStatus("Result ready.", "success");
    render();
  };

  const applyBackspace = () => {
    if (state.waitingForSecondOperand || state.justEvaluated) {
      return;
    }

    if (state.displayValue.length <= 1 || (state.displayValue.length === 2 && state.displayValue.startsWith("-"))) {
      state.displayValue = "0";
    } else {
      state.displayValue = state.displayValue.slice(0, -1);
    }

    render();
  };

  const applyPercent = () => {
    const current = getDisplayNumber();
    state.displayValue = formatNumber(current / 100);
    state.waitingForSecondOperand = false;
    state.justEvaluated = false;
    render();
  };

  const applyToggleSign = () => {
    if (state.displayValue === "0") {
      return;
    }

    state.displayValue = state.displayValue.startsWith("-")
      ? state.displayValue.slice(1)
      : `-${state.displayValue}`;
    render();
  };

  const clearAll = () => {
    resetState();
    setStatus("");
    render();
  };

  const handleAction = (action) => {
    if (!action) {
      return;
    }

    if (action === "clear") {
      clearAll();
      return;
    }

    if (action === "decimal") {
      applyDecimal();
      return;
    }

    if (action === "equals") {
      applyEquals();
      return;
    }

    if (action === "backspace") {
      applyBackspace();
      return;
    }

    if (action === "percent") {
      applyPercent();
      return;
    }

    if (action === "toggle-sign") {
      applyToggleSign();
      return;
    }
  };

  digitButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setStatus("");
      applyDigit(button.dataset.calcDigit || "");
    });
  });

  operatorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyOperator(button.dataset.calcOperator || "");
    });
  });

  actionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      handleAction(button.dataset.calcAction || "");
    });
  });

  window.addEventListener("keydown", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
      return;
    }

    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      setStatus("");
      applyDigit(event.key);
      return;
    }

    if (event.key === "." || event.key === ",") {
      event.preventDefault();
      handleAction("decimal");
      return;
    }

    if (event.key === "+" || event.key === "-" || event.key === "*" || event.key === "/") {
      event.preventDefault();
      applyOperator(event.key);
      return;
    }

    if (event.key === "Enter" || event.key === "=") {
      event.preventDefault();
      handleAction("equals");
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      handleAction("backspace");
      return;
    }

    if (event.key === "Escape" || event.key === "Delete") {
      event.preventDefault();
      handleAction("clear");
      return;
    }

    if (event.key === "%") {
      event.preventDefault();
      handleAction("percent");
    }
  });

  render();
}

function setupColorPaletteGenerator() {
  const swatchesNode = document.getElementById("palette-swatches");
  const sizeInput = document.getElementById("palette-size");
  const sizeValueNode = document.getElementById("palette-size-value");
  const modeSelect = document.getElementById("palette-mode");
  const generateButton = document.getElementById("palette-generate");
  const copyCssButton = document.getElementById("palette-copy-css");
  const copyJsonButton = document.getElementById("palette-copy-json");
  const statusNode = document.getElementById("palette-status");

  if (
    !swatchesNode ||
    !sizeInput ||
    !sizeValueNode ||
    !modeSelect ||
    !generateButton ||
    !copyCssButton ||
    !copyJsonButton ||
    !statusNode
  ) {
    return;
  }

  const state = {
    size: clampNumber(sizeInput.value, 3, 8, 5),
    mode: modeSelect.value || "random",
    baseHue: getCryptoRandomInt(360),
    swatches: []
  };

  const clamp = (value, minimum, maximum) => {
    return Math.min(maximum, Math.max(minimum, value));
  };

  const setStatus = (message, type = "") => {
    statusNode.textContent = message;
    statusNode.classList.remove("is-error", "is-success");
    if (type) {
      statusNode.classList.add(`is-${type}`);
    }
  };

  const updateSizeLabel = () => {
    sizeValueNode.textContent = `${state.size}`;
  };

  const normalizeHex = (value) => {
    const raw = `${value || ""}`.trim().replace(/^#/, "");
    if (!/^[0-9a-fA-F]{6}$/.test(raw)) {
      return "";
    }

    return `#${raw.toUpperCase()}`;
  };

  const hslToHex = (hue, saturation, lightness) => {
    const h = clamp(hue, 0, 359);
    const s = clamp(saturation, 0, 100) / 100;
    const l = clamp(lightness, 0, 100) / 100;
    const chroma = (1 - Math.abs(2 * l - 1)) * s;
    const hPrime = h / 60;
    const x = chroma * (1 - Math.abs((hPrime % 2) - 1));
    let red = 0;
    let green = 0;
    let blue = 0;

    if (hPrime >= 0 && hPrime < 1) {
      red = chroma;
      green = x;
    } else if (hPrime >= 1 && hPrime < 2) {
      red = x;
      green = chroma;
    } else if (hPrime >= 2 && hPrime < 3) {
      green = chroma;
      blue = x;
    } else if (hPrime >= 3 && hPrime < 4) {
      green = x;
      blue = chroma;
    } else if (hPrime >= 4 && hPrime < 5) {
      red = x;
      blue = chroma;
    } else {
      red = chroma;
      blue = x;
    }

    const offset = l - chroma / 2;
    const toHex = (value) => {
      const channel = Math.round((value + offset) * 255);
      return channel.toString(16).padStart(2, "0");
    };

    return `#${toHex(red)}${toHex(green)}${toHex(blue)}`.toUpperCase();
  };

  const randomBetween = (minimum, maximum) => {
    return minimum + getCryptoRandomInt(Math.max(1, maximum - minimum + 1));
  };

  const buildColor = (index, total) => {
    if (state.mode === "pastel") {
      return hslToHex(
        getCryptoRandomInt(360),
        randomBetween(42, 70),
        randomBetween(72, 88)
      );
    }

    if (state.mode === "vivid") {
      return hslToHex(
        getCryptoRandomInt(360),
        randomBetween(78, 98),
        randomBetween(38, 60)
      );
    }

    if (state.mode === "monochrome") {
      const spread = total > 1 ? index / (total - 1) : 0.5;
      const hue = (state.baseHue + randomBetween(-10, 10) + 360) % 360;
      const saturation = clamp(56 + randomBetween(-8, 8), 40, 72);
      const lightness = clamp(Math.round(28 + spread * 56 + randomBetween(-3, 3)), 18, 90);
      return hslToHex(hue, saturation, lightness);
    }

    return hslToHex(
      getCryptoRandomInt(360),
      randomBetween(44, 92),
      randomBetween(30, 72)
    );
  };

  const renderSwatches = () => {
    swatchesNode.innerHTML = state.swatches
      .map((swatch, index) => {
        const lockLabel = swatch.locked ? "Unlock" : "Lock";
        const lockClass = swatch.locked ? " is-locked" : "";
        return `
          <article class="palette-swatch">
            <div class="palette-swatch__preview" style="background:${swatch.hex}" aria-hidden="true"></div>
            <div class="palette-swatch__body">
              <label class="meta-label" for="palette-hex-${index + 1}">HEX</label>
              <input
                class="palette-swatch__input"
                data-palette-hex-index="${index}"
                id="palette-hex-${index + 1}"
                maxlength="7"
                spellcheck="false"
                type="text"
                value="${swatch.hex}"
              />
              <div class="palette-swatch__actions">
                <button class="palette-swatch__btn" data-palette-copy-index="${index}" type="button">Copy</button>
                <button
                  aria-pressed="${swatch.locked ? "true" : "false"}"
                  class="palette-swatch__btn${lockClass}"
                  data-palette-lock-index="${index}"
                  type="button"
                >
                  ${lockLabel}
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  };

  const copyText = async (value) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        return true;
      }

      const helper = document.createElement("textarea");
      helper.value = value;
      helper.setAttribute("readonly", "");
      helper.style.position = "absolute";
      helper.style.left = "-9999px";
      document.body.appendChild(helper);
      helper.select();
      helper.setSelectionRange(0, value.length);
      const copied = document.execCommand("copy");
      document.body.removeChild(helper);
      return copied;
    } catch (error) {
      return false;
    }
  };

  const generatePalette = () => {
    if (state.mode === "monochrome") {
      state.baseHue = getCryptoRandomInt(360);
    }

    state.swatches = Array.from({ length: state.size }, (_, index) => {
      const existing = state.swatches[index];
      if (existing && existing.locked) {
        return existing;
      }

      return {
        hex: buildColor(index, state.size),
        locked: false
      };
    });

    renderSwatches();
  };

  const setPaletteSize = (nextSizeValue) => {
    const nextSize = clampNumber(nextSizeValue, 3, 8, state.size);
    if (nextSize === state.size) {
      updateSizeLabel();
      return;
    }

    if (nextSize < state.size) {
      state.swatches = state.swatches.slice(0, nextSize);
    } else {
      const start = state.swatches.length;
      for (let index = start; index < nextSize; index += 1) {
        state.swatches.push({
          hex: buildColor(index, nextSize),
          locked: false
        });
      }
    }

    state.size = nextSize;
    updateSizeLabel();
    renderSwatches();
  };

  const copyCssPalette = async () => {
    const cssLines = state.swatches
      .map((swatch, index) => `  --palette-${index + 1}: ${swatch.hex};`)
      .join("\n");
    const payload = `:root {\n${cssLines}\n}`;
    const copied = await copyText(payload);

    if (!copied) {
      setStatus("Copy failed. Please try again.", "error");
      return;
    }

    setStatus("CSS palette copied.", "success");
  };

  const copyJsonPalette = async () => {
    const payload = JSON.stringify(state.swatches.map((swatch) => swatch.hex), null, 2);
    const copied = await copyText(payload);

    if (!copied) {
      setStatus("Copy failed. Please try again.", "error");
      return;
    }

    setStatus("JSON palette copied.", "success");
  };

  swatchesNode.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const copyButton = target.closest("[data-palette-copy-index]");
    if (copyButton instanceof HTMLButtonElement) {
      const index = clampNumber(copyButton.dataset.paletteCopyIndex, 0, state.swatches.length - 1, -1);
      if (index < 0 || !state.swatches[index]) {
        return;
      }

      const copied = await copyText(state.swatches[index].hex);
      if (!copied) {
        setStatus("Copy failed. Please try again.", "error");
        return;
      }

      setStatus(`${state.swatches[index].hex} copied.`, "success");
      return;
    }

    const lockButton = target.closest("[data-palette-lock-index]");
    if (lockButton instanceof HTMLButtonElement) {
      const index = clampNumber(lockButton.dataset.paletteLockIndex, 0, state.swatches.length - 1, -1);
      if (index < 0 || !state.swatches[index]) {
        return;
      }

      state.swatches[index].locked = !state.swatches[index].locked;
      renderSwatches();
      setStatus(state.swatches[index].locked ? "Swatch locked." : "Swatch unlocked.");
    }
  });

  swatchesNode.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const index = clampNumber(target.dataset.paletteHexIndex, 0, state.swatches.length - 1, -1);
    if (index < 0 || !state.swatches[index]) {
      return;
    }

    const normalized = normalizeHex(target.value);
    if (!normalized) {
      target.value = state.swatches[index].hex;
      setStatus("Use a valid 6-digit hex color, for example #1A2B3C.", "error");
      return;
    }

    state.swatches[index].hex = normalized;
    target.value = normalized;
    renderSwatches();
    setStatus("Swatch updated.", "success");
  });

  generateButton.addEventListener("click", () => {
    generatePalette();
    setStatus("New palette generated.", "success");
  });

  copyCssButton.addEventListener("click", copyCssPalette);
  copyJsonButton.addEventListener("click", copyJsonPalette);

  sizeInput.addEventListener("input", () => {
    setPaletteSize(sizeInput.value);
  });

  modeSelect.addEventListener("change", () => {
    state.mode = modeSelect.value || "random";
    generatePalette();
    setStatus("Palette mode updated.", "success");
  });

  window.addEventListener("keydown", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
      generatePalette();
      setStatus("New palette generated.", "success");
    }
  });

  updateSizeLabel();
  generatePalette();
  setStatus("Palette ready. Press Space to generate new colors.");
}

function setupSnakeGame() {
  const canvasNode = document.getElementById("snake-canvas");
  const scoreNode = document.getElementById("snake-score");
  const bestNode = document.getElementById("snake-best");
  const speedNode = document.getElementById("snake-speed");
  const startButton = document.getElementById("snake-start");
  const pauseButton = document.getElementById("snake-pause");
  const resetButton = document.getElementById("snake-reset");
  const statusNode = document.getElementById("snake-status");

  if (
    !canvasNode ||
    !scoreNode ||
    !bestNode ||
    !speedNode ||
    !startButton ||
    !pauseButton ||
    !resetButton ||
    !statusNode
  ) {
    return;
  }

  const context = canvasNode.getContext("2d");
  if (!context) {
    return;
  }

  const GRID_SIZE = 21;
  const CELL_SIZE = Math.floor(canvasNode.width / GRID_SIZE);
  const BEST_SCORE_KEY = "snakeBestScore";

  const state = {
    running: false,
    ended: false,
    timerId: null,
    score: 0,
    best: 0,
    intervalMs: clampNumber(speedNode.value, 80, 260, 130),
    snake: [],
    direction: { x: 1, y: 0 },
    queuedDirection: { x: 1, y: 0 },
    food: { x: 0, y: 0 }
  };

  const setStatus = (message, type = "") => {
    statusNode.textContent = message;
    statusNode.classList.remove("is-error", "is-success");
    if (type) {
      statusNode.classList.add(`is-${type}`);
    }
  };

  const updateMeta = () => {
    scoreNode.textContent = `${state.score}`;
    bestNode.textContent = `${state.best}`;
  };

  const updateControls = () => {
    startButton.disabled = state.running;
    pauseButton.disabled = !state.running;
  };

  const readBestScore = () => {
    try {
      const stored = localStorage.getItem(BEST_SCORE_KEY);
      const parsed = Number.parseInt(stored || "0", 10);
      return Number.isNaN(parsed) ? 0 : Math.max(0, parsed);
    } catch (error) {
      return 0;
    }
  };

  const persistBestScore = () => {
    if (state.score <= state.best) {
      return;
    }

    state.best = state.score;
    try {
      localStorage.setItem(BEST_SCORE_KEY, `${state.best}`);
    } catch (error) {
      return;
    }
  };

  const randomFoodPosition = () => {
    const occupied = new Set(state.snake.map((part) => `${part.x},${part.y}`));
    let x = 0;
    let y = 0;
    let attempts = 0;

    do {
      x = getCryptoRandomInt(GRID_SIZE);
      y = getCryptoRandomInt(GRID_SIZE);
      attempts += 1;
    } while (occupied.has(`${x},${y}`) && attempts < GRID_SIZE * GRID_SIZE);

    return { x, y };
  };

  const drawBoard = () => {
    const rootStyles = window.getComputedStyle(document.documentElement);
    const boardColor = rootStyles.getPropertyValue("--color-panel").trim() || "#1d2023";
    const gridColor = rootStyles.getPropertyValue("--color-line").trim() || "rgba(255,255,255,0.12)";
    const snakeColor = rootStyles.getPropertyValue("--color-text").trim() || "#f4f2ee";
    const accentColor = rootStyles.getPropertyValue("--color-accent").trim() || "#f08c8c";
    const foodColor = accentColor;

    context.clearRect(0, 0, canvasNode.width, canvasNode.height);
    context.fillStyle = boardColor;
    context.fillRect(0, 0, canvasNode.width, canvasNode.height);

    context.strokeStyle = gridColor;
    context.lineWidth = 1;
    for (let row = 0; row <= GRID_SIZE; row += 1) {
      const offset = row * CELL_SIZE + 0.5;
      context.beginPath();
      context.moveTo(offset, 0);
      context.lineTo(offset, GRID_SIZE * CELL_SIZE);
      context.stroke();

      context.beginPath();
      context.moveTo(0, offset);
      context.lineTo(GRID_SIZE * CELL_SIZE, offset);
      context.stroke();
    }

    context.fillStyle = foodColor;
    context.beginPath();
    const foodCenterX = state.food.x * CELL_SIZE + CELL_SIZE / 2;
    const foodCenterY = state.food.y * CELL_SIZE + CELL_SIZE / 2;
    context.arc(foodCenterX, foodCenterY, CELL_SIZE * 0.3, 0, Math.PI * 2);
    context.fill();

    state.snake.forEach((part, index) => {
      const inset = index === 0 ? 2 : 3;
      context.fillStyle = index === 0 ? accentColor : snakeColor;
      context.fillRect(
        part.x * CELL_SIZE + inset,
        part.y * CELL_SIZE + inset,
        CELL_SIZE - inset * 2,
        CELL_SIZE - inset * 2
      );
    });
  };

  const stopLoop = () => {
    if (!state.timerId) {
      return;
    }

    window.clearInterval(state.timerId);
    state.timerId = null;
  };

  const isOutOfBounds = (point) => {
    return point.x < 0 || point.y < 0 || point.x >= GRID_SIZE || point.y >= GRID_SIZE;
  };

  const hitsSelf = (head) => {
    return state.snake.some((part) => part.x === head.x && part.y === head.y);
  };

  const endGame = () => {
    stopLoop();
    state.running = false;
    state.ended = true;
    persistBestScore();
    updateMeta();
    updateControls();
    setStatus("Game over. Press Start to play again.", "error");
  };

  const tick = () => {
    state.direction = { ...state.queuedDirection };
    const nextHead = {
      x: state.snake[0].x + state.direction.x,
      y: state.snake[0].y + state.direction.y
    };

    if (isOutOfBounds(nextHead) || hitsSelf(nextHead)) {
      endGame();
      drawBoard();
      return;
    }

    state.snake.unshift(nextHead);

    if (nextHead.x === state.food.x && nextHead.y === state.food.y) {
      state.score += 1;
      persistBestScore();
      state.food = randomFoodPosition();
      updateMeta();
      setStatus("Nice move. Keep going!", "success");
    } else {
      state.snake.pop();
    }

    drawBoard();
  };

  const startLoop = () => {
    stopLoop();
    state.timerId = window.setInterval(tick, state.intervalMs);
  };

  const resetGameState = () => {
    stopLoop();
    state.running = false;
    state.ended = false;
    state.score = 0;
    state.direction = { x: 1, y: 0 };
    state.queuedDirection = { x: 1, y: 0 };
    state.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    state.food = randomFoodPosition();
    updateMeta();
    updateControls();
    drawBoard();
  };

  const startGame = () => {
    if (state.running) {
      return;
    }

    if (state.ended) {
      resetGameState();
    }

    state.running = true;
    startLoop();
    updateControls();
    setStatus("Game started. Use arrow keys or WASD.");
  };

  const pauseGame = () => {
    if (!state.running) {
      return;
    }

    stopLoop();
    state.running = false;
    updateControls();
    setStatus("Paused. Press Start or Space to continue.");
  };

  const resetGame = () => {
    resetGameState();
    setStatus("Ready. Press Start or Space to begin.");
  };

  const setDirection = (x, y) => {
    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      return;
    }

    if (x === 0 && y === 0) {
      return;
    }

    const activeDirection = state.running ? state.direction : state.queuedDirection;
    if (x === -activeDirection.x && y === -activeDirection.y) {
      return;
    }

    state.queuedDirection = { x, y };
  };

  const changeSpeed = () => {
    state.intervalMs = clampNumber(speedNode.value, 80, 260, 130);
    if (state.running) {
      startLoop();
    }
  };

  window.addEventListener("keydown", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
      return;
    }

    const key = event.key.toLowerCase();
    if (key === "arrowup" || key === "w") {
      event.preventDefault();
      setDirection(0, -1);
      return;
    }

    if (key === "arrowdown" || key === "s") {
      event.preventDefault();
      setDirection(0, 1);
      return;
    }

    if (key === "arrowleft" || key === "a") {
      event.preventDefault();
      setDirection(-1, 0);
      return;
    }

    if (key === "arrowright" || key === "d") {
      event.preventDefault();
      setDirection(1, 0);
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
      if (state.running) {
        pauseGame();
      } else {
        startGame();
      }
    }
  });

  startButton.addEventListener("click", startGame);
  pauseButton.addEventListener("click", pauseGame);
  resetButton.addEventListener("click", resetGame);
  speedNode.addEventListener("change", changeSpeed);

  state.best = readBestScore();
  resetGameState();
  setStatus("Ready. Press Start or Space to begin.");
}

function setupSudokuGame() {
  const boardNode = document.getElementById("sudoku-board");
  const filledNode = document.getElementById("sudoku-filled");
  const difficultyNode = document.getElementById("sudoku-difficulty");
  const newButton = document.getElementById("sudoku-new");
  const checkButton = document.getElementById("sudoku-check");
  const solveButton = document.getElementById("sudoku-solve");
  const resetButton = document.getElementById("sudoku-reset");
  const statusNode = document.getElementById("sudoku-status");

  if (
    !boardNode ||
    !filledNode ||
    !difficultyNode ||
    !newButton ||
    !checkButton ||
    !solveButton ||
    !resetButton ||
    !statusNode
  ) {
    return;
  }

  const SIZE = 9;
  const BLOCK_SIZE = 3;
  const HOLES_BY_DIFFICULTY = {
    easy: 40,
    medium: 50,
    hard: 56
  };

  const state = {
    difficulty: difficultyNode.value || "medium",
    solution: [],
    puzzle: [],
    current: [],
    cellRefs: []
  };

  const setStatus = (message, type = "") => {
    statusNode.textContent = message;
    statusNode.classList.remove("is-error", "is-success");
    if (type) {
      statusNode.classList.add(`is-${type}`);
    }
  };

  const createEmptyGrid = () => {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  };

  const copyGrid = (grid) => {
    return grid.map((row) => row.slice());
  };

  const updateFilledCount = () => {
    let filled = 0;
    state.current.forEach((row) => {
      row.forEach((value) => {
        if (value > 0) {
          filled += 1;
        }
      });
    });

    filledNode.textContent = `${filled}/81`;
  };

  const shuffleNumbers = () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let index = values.length - 1; index > 0; index -= 1) {
      const swapIndex = getCryptoRandomInt(index + 1);
      [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
    }
    return values;
  };

  const isValidPlacement = (grid, row, col, value) => {
    for (let index = 0; index < SIZE; index += 1) {
      if (grid[row][index] === value) {
        return false;
      }
      if (grid[index][col] === value) {
        return false;
      }
    }

    const blockRowStart = Math.floor(row / BLOCK_SIZE) * BLOCK_SIZE;
    const blockColStart = Math.floor(col / BLOCK_SIZE) * BLOCK_SIZE;
    for (let rowOffset = 0; rowOffset < BLOCK_SIZE; rowOffset += 1) {
      for (let colOffset = 0; colOffset < BLOCK_SIZE; colOffset += 1) {
        if (grid[blockRowStart + rowOffset][blockColStart + colOffset] === value) {
          return false;
        }
      }
    }

    return true;
  };

  const fillSolvedGrid = (grid) => {
    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        if (grid[row][col] !== 0) {
          continue;
        }

        const candidates = shuffleNumbers();
        for (const candidate of candidates) {
          if (!isValidPlacement(grid, row, col, candidate)) {
            continue;
          }

          grid[row][col] = candidate;
          if (fillSolvedGrid(grid)) {
            return true;
          }
          grid[row][col] = 0;
        }

        return false;
      }
    }

    return true;
  };

  const generateSolvedGrid = () => {
    const solved = createEmptyGrid();
    fillSolvedGrid(solved);
    return solved;
  };

  const generatePuzzleGrid = (solution, difficulty) => {
    const puzzle = copyGrid(solution);
    const targetHoles = HOLES_BY_DIFFICULTY[difficulty] || HOLES_BY_DIFFICULTY.medium;
    const positions = Array.from({ length: SIZE * SIZE }, (_, index) => index);

    for (let index = positions.length - 1; index > 0; index -= 1) {
      const swapIndex = getCryptoRandomInt(index + 1);
      [positions[index], positions[swapIndex]] = [positions[swapIndex], positions[index]];
    }

    for (let index = 0; index < targetHoles; index += 1) {
      const position = positions[index];
      const row = Math.floor(position / SIZE);
      const col = position % SIZE;
      puzzle[row][col] = 0;
    }

    return puzzle;
  };

  const clearConflictClasses = () => {
    boardNode.querySelectorAll(".sudoku-cell.is-conflict").forEach((cell) => {
      cell.classList.remove("is-conflict");
    });
  };

  const evaluateBoard = () => {
    clearConflictClasses();
    let incorrect = 0;
    let empty = 0;

    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        const value = state.current[row][col];
        if (!value) {
          empty += 1;
          continue;
        }

        if (value !== state.solution[row][col]) {
          incorrect += 1;
          const cellNode = state.cellRefs[row]?.[col];
          if (cellNode) {
            cellNode.classList.add("is-conflict");
          }
        }
      }
    }

    return { incorrect, empty };
  };

  const setCellValue = (row, col, value) => {
    state.current[row][col] = value;
    const cellNode = state.cellRefs[row]?.[col];
    if (!cellNode) {
      return;
    }

    if (value && value !== state.solution[row][col]) {
      cellNode.classList.add("is-conflict");
    } else {
      cellNode.classList.remove("is-conflict");
    }
  };

  const focusCell = (row, col) => {
    const safeRow = Math.max(0, Math.min(SIZE - 1, row));
    const safeCol = Math.max(0, Math.min(SIZE - 1, col));
    const targetCell = state.cellRefs[safeRow]?.[safeCol];
    if (targetCell) {
      targetCell.focus();
    }
  };

  const renderBoard = () => {
    boardNode.innerHTML = "";
    const refs = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));

    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        const given = state.puzzle[row][col] !== 0;
        const value = state.current[row][col] || "";
        const inputNode = document.createElement("input");

        inputNode.className = "sudoku-cell";
        inputNode.type = "text";
        inputNode.inputMode = "numeric";
        inputNode.maxLength = 1;
        inputNode.autocomplete = "off";
        inputNode.spellcheck = false;
        inputNode.value = `${value}`;
        inputNode.setAttribute("aria-label", `Row ${row + 1}, Column ${col + 1}`);
        inputNode.setAttribute("role", "gridcell");

        if (given) {
          inputNode.readOnly = true;
          inputNode.classList.add("is-given");
        }

        if ((col + 1) % BLOCK_SIZE === 0 && col !== SIZE - 1) {
          inputNode.classList.add("is-subgrid-right");
        }

        if ((row + 1) % BLOCK_SIZE === 0 && row !== SIZE - 1) {
          inputNode.classList.add("is-subgrid-bottom");
        }

        inputNode.addEventListener("focus", () => {
          inputNode.select();
        });

        inputNode.addEventListener("input", () => {
          if (given) {
            inputNode.value = `${state.puzzle[row][col]}`;
            return;
          }

          const sanitized = inputNode.value.replace(/[^1-9]/g, "").slice(-1);
          inputNode.value = sanitized;
          const nextValue = sanitized ? Number.parseInt(sanitized, 10) : 0;
          setCellValue(row, col, nextValue);
          updateFilledCount();

          if (!nextValue) {
            setStatus("");
            return;
          }

          const { incorrect, empty } = evaluateBoard();
          if (incorrect === 0 && empty === 0) {
            setStatus("Puzzle solved. Great work!", "success");
          } else {
            setStatus("");
          }
        });

        inputNode.addEventListener("keydown", (event) => {
          if (!given && (event.key === "Backspace" || event.key === "Delete")) {
            setCellValue(row, col, 0);
            inputNode.value = "";
            updateFilledCount();
            setStatus("");
            return;
          }

          let nextRow = row;
          let nextCol = col;
          let shouldMove = true;

          if (event.key === "ArrowUp") {
            nextRow -= 1;
          } else if (event.key === "ArrowDown") {
            nextRow += 1;
          } else if (event.key === "ArrowLeft") {
            nextCol -= 1;
          } else if (event.key === "ArrowRight") {
            nextCol += 1;
          } else {
            shouldMove = false;
          }

          if (!shouldMove) {
            return;
          }

          event.preventDefault();
          focusCell(nextRow, nextCol);
        });

        refs[row][col] = inputNode;
        boardNode.appendChild(inputNode);
      }
    }

    state.cellRefs = refs;
  };

  const createPuzzle = () => {
    state.difficulty = difficultyNode.value || "medium";
    state.solution = generateSolvedGrid();
    state.puzzle = generatePuzzleGrid(state.solution, state.difficulty);
    state.current = copyGrid(state.puzzle);
    renderBoard();
    updateFilledCount();
    setStatus("New puzzle ready.");
  };

  const checkPuzzle = () => {
    const { incorrect, empty } = evaluateBoard();
    if (incorrect === 0 && empty === 0) {
      setStatus("Puzzle solved. Great work!", "success");
      return;
    }

    if (incorrect === 0) {
      setStatus(`${empty} cells left. Keep going.`);
      return;
    }

    const suffix = incorrect === 1 ? "" : "s";
    setStatus(`${incorrect} incorrect cell${suffix} found.`, "error");
  };

  const solvePuzzle = () => {
    state.current = copyGrid(state.solution);
    renderBoard();
    updateFilledCount();
    setStatus("Puzzle solved for you. Start a new one when ready.", "success");
  };

  const resetPuzzle = () => {
    state.current = copyGrid(state.puzzle);
    renderBoard();
    updateFilledCount();
    setStatus("Puzzle reset.");
  };

  newButton.addEventListener("click", createPuzzle);
  checkButton.addEventListener("click", checkPuzzle);
  solveButton.addEventListener("click", solvePuzzle);
  resetButton.addEventListener("click", resetPuzzle);
  difficultyNode.addEventListener("change", createPuzzle);

  createPuzzle();
}

function setupTypingTest() {
  const promptNode = document.getElementById("typing-prompt");
  const inputNode = document.getElementById("typing-input");
  const timeNode = document.getElementById("typing-time-left");
  const wpmNode = document.getElementById("typing-wpm");
  const accuracyNode = document.getElementById("typing-accuracy");
  const cpmNode = document.getElementById("typing-cpm");
  const errorsNode = document.getElementById("typing-errors");
  const statusNode = document.getElementById("typing-status");
  const difficultyButtons = Array.from(document.querySelectorAll("[data-typing-difficulty]"));
  const durationButtons = Array.from(document.querySelectorAll("[data-typing-duration]"));
  const newTextButton = document.getElementById("typing-new-text");
  const restartButton = document.getElementById("typing-restart");

  if (
    !promptNode ||
    !inputNode ||
    !timeNode ||
    !wpmNode ||
    !accuracyNode ||
    !cpmNode ||
    !errorsNode ||
    !statusNode ||
    !durationButtons.length ||
    !newTextButton ||
    !restartButton
  ) {
    return;
  }

  const state = {
    difficulty: "medium",
    duration: 30,
    remaining: 30,
    started: false,
    ended: false,
    timerId: null,
    startTimestamp: 0,
    stopTimestamp: 0,
    endTimestamp: 0,
    passage: ""
  };

  const getDifficultyLabel = (difficulty) => {
    if (!difficulty) {
      return "Medium";
    }

    return `${difficulty.charAt(0).toUpperCase()}${difficulty.slice(1)}`;
  };

  const getPassagesByDifficulty = (difficulty) => {
    return TYPING_TEST_PASSAGES[difficulty] || TYPING_TEST_PASSAGES.medium || [];
  };

  const getRandomPassage = (current, difficulty) => {
    const pool = getPassagesByDifficulty(difficulty);

    if (pool.length <= 1) {
      return pool[0] || "";
    }

    const options = pool.filter((passage) => passage !== current);
    const source = options.length ? options : pool;
    const index = getCryptoRandomInt(source.length);
    return source[index];
  };

  const setStatus = (message, type = "") => {
    statusNode.textContent = message;
    statusNode.classList.remove("is-error", "is-success");
    if (type) {
      statusNode.classList.add(`is-${type}`);
    }
  };

  const setDuration = (duration) => {
    state.duration = duration;
    state.remaining = duration;
    durationButtons.forEach((button) => {
      button.classList.toggle("is-active", Number.parseInt(button.dataset.typingDuration, 10) === duration);
    });
  };

  const setDifficulty = (difficulty) => {
    const pool = getPassagesByDifficulty(difficulty);
    if (!pool.length) {
      return;
    }

    state.difficulty = difficulty;

    difficultyButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.typingDifficulty === difficulty);
    });
  };

  const stopTimer = () => {
    if (!state.timerId) {
      return;
    }

    window.clearInterval(state.timerId);
    state.timerId = null;
  };

  const computeMetrics = () => {
    const typedText = inputNode.value;
    const passage = state.passage;
    const typedChars = typedText.length;
    let correctChars = 0;

    for (let index = 0; index < typedChars && index < passage.length; index += 1) {
      if (typedText[index] === passage[index]) {
        correctChars += 1;
      }
    }

    const errors = Math.max(0, typedChars - correctChars);
    const elapsedSeconds = state.started
      ? Math.max(1, ((state.ended ? state.stopTimestamp : Date.now()) - state.startTimestamp) / 1000)
      : 0;
    const wpm = elapsedSeconds > 0 ? Math.round((correctChars / 5) / (elapsedSeconds / 60)) : 0;
    const cpm = elapsedSeconds > 0 ? Math.round(correctChars / (elapsedSeconds / 60)) : 0;
    const accuracy = typedChars > 0 ? Math.max(0, Math.round((correctChars / typedChars) * 100)) : 100;

    return { typedChars, errors, wpm, cpm, accuracy };
  };

  const renderPrompt = () => {
    const typedText = inputNode.value;
    promptNode.innerHTML = "";

    Array.from(state.passage).forEach((char, index) => {
      const charNode = document.createElement("span");
      charNode.className = "typing-char";
      charNode.textContent = char;

      if (index < typedText.length) {
        charNode.classList.add(typedText[index] === char ? "is-correct" : "is-incorrect");
      } else if (index === typedText.length && !state.ended) {
        charNode.classList.add("is-current");
      }

      promptNode.appendChild(charNode);
    });
  };

  const updateStats = () => {
    const { errors, wpm, cpm, accuracy } = computeMetrics();
    timeNode.textContent = `${Math.max(0, state.remaining)}s`;
    wpmNode.textContent = `${wpm}`;
    cpmNode.textContent = `${cpm}`;
    accuracyNode.textContent = `${accuracy}%`;
    errorsNode.textContent = `${errors}`;
  };

  const finishTest = (reason) => {
    if (state.ended) {
      return;
    }

    state.ended = true;
    state.stopTimestamp = Date.now();
    state.remaining = Math.max(0, Math.ceil((state.endTimestamp - state.stopTimestamp) / 1000));
    stopTimer();
    inputNode.disabled = true;
    renderPrompt();
    updateStats();

    const metrics = computeMetrics();
    setStatus(`${reason} ${metrics.wpm} WPM - ${metrics.accuracy}% accuracy.`, "success");
  };

  const startTimer = () => {
    if (state.started || state.ended) {
      return;
    }

    state.started = true;
    state.startTimestamp = Date.now();
    state.endTimestamp = state.startTimestamp + state.duration * 1000;
    state.stopTimestamp = 0;

    state.timerId = window.setInterval(() => {
      const remainingMs = state.endTimestamp - Date.now();
      state.remaining = Math.max(0, Math.ceil(remainingMs / 1000));

      if (remainingMs <= 0) {
        finishTest("Time is up.");
        return;
      }

      updateStats();
    }, 120);
  };

  const resetTest = (newPassage) => {
    stopTimer();
    state.started = false;
    state.ended = false;
    state.startTimestamp = 0;
    state.stopTimestamp = 0;
    state.endTimestamp = 0;
    state.remaining = state.duration;
    inputNode.disabled = false;
    inputNode.value = "";

    if (newPassage || !state.passage) {
      state.passage = getRandomPassage(state.passage, state.difficulty);
    }

    renderPrompt();
    updateStats();
    setStatus(`${getDifficultyLabel(state.difficulty)} mode. Timer starts when you type your first character.`);
  };

  difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const difficulty = button.dataset.typingDifficulty;
      if (!difficulty || !TYPING_TEST_PASSAGES[difficulty]) {
        return;
      }

      setDifficulty(difficulty);
      resetTest(true);
      inputNode.focus();
    });
  });

  durationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const duration = Number.parseInt(button.dataset.typingDuration, 10);
      if (!duration || Number.isNaN(duration)) {
        return;
      }

      setDuration(duration);
      resetTest(false);
      inputNode.focus();
    });
  });

  newTextButton.addEventListener("click", () => {
    resetTest(true);
    inputNode.focus();
  });

  restartButton.addEventListener("click", () => {
    resetTest(false);
    inputNode.focus();
  });

  inputNode.addEventListener("input", () => {
    if (state.ended) {
      return;
    }

    if (!state.started && inputNode.value.length > 0) {
      startTimer();
    }

    renderPrompt();
    updateStats();

    if (inputNode.value.length >= state.passage.length) {
      finishTest("Completed.");
    }
  });

  setDifficulty(state.difficulty);
  setDuration(state.duration);
  resetTest(true);
}

function initToolPages() {
  setupThemeToggle();
  setupPasswordGenerator();
  setupPomodoroTimer();
  setupQrCodeGenerator();
  setupCalculator();
  setupColorPaletteGenerator();
  setupSnakeGame();
  setupSudokuGame();
  setupTypingTest();
}

initToolPages();
