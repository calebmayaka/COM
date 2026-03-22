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
  setupTypingTest();
}

initToolPages();
