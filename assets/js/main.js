import { siteContent } from "./content.js";

const tabIds = ["profile", "showcase", "contact"];
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const panelTimers = new Map();

function clearPanelTimer(panel, key) {
  const timerKey = `${panel.id}:${key}`;
  const timerId = panelTimers.get(timerKey);

  if (!timerId) {
    return;
  }

  window.clearTimeout(timerId);
  panelTimers.delete(timerKey);
}

function setPanelTimer(panel, key, callback, delay) {
  const timerKey = `${panel.id}:${key}`;
  const timerId = window.setTimeout(() => {
    panelTimers.delete(timerKey);
    callback();
  }, delay);

  panelTimers.set(timerKey, timerId);
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) {
    node.textContent = value;
  }
}

function setLink(id, href, label) {
  const node = document.getElementById(id);
  if (!node) {
    return;
  }

  node.href = href;
  if (label) {
    node.textContent = label;
  }
}

function renderSocialLinks() {
  const container = document.getElementById("social-links");
  if (!container) {
    return;
  }

  const { profile } = siteContent;
  const socialLinks = [
    { label: "Git", href: profile.githubUrl, external: true },
    { label: "In", href: profile.linkedinUrl, external: true },
    { label: "Mail", href: `mailto:${profile.email}`, external: false }
  ];

  container.innerHTML = socialLinks
    .map(
      (item) =>
        `<a href="${item.href}" rel="${item.external ? "noreferrer" : ""}" target="${item.external ? "_blank" : "_self"}">${item.label}</a>`
    )
    .join("");
}

function setupThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  const root = document.documentElement;

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

function renderProfile() {
  const { profile } = siteContent;

  setText("profile-summary", profile.summary);
  setText("contact-copy", profile.contactPitch);
  setLink("resume-link", profile.resumeUrl);
  setLink("hero-email", `mailto:${profile.email}`);
  setLink("hero-github", profile.githubUrl);
  setLink("hero-linkedin", profile.linkedinUrl);
  setLink("hero-twitter", profile.twitterUrl);
  setLink("contact-email", `mailto:${profile.email}`);
  setLink("contact-github", profile.githubUrl);
  setLink("contact-linkedin", profile.linkedinUrl);
  setLink("contact-twitter", profile.twitterUrl);

  document.getElementById("focus-list").innerHTML = profile.focusAreas
    .map((item) => `<span class="focus-pill">${item}</span>`)
    .join("");
}

function renderFeaturedProject() {
  const project = siteContent.projects[0];
  const highlights = project.highlights.slice(0, 2);

  document.getElementById("featured-project").innerHTML = `
    <p class="eyebrow">${project.status}</p>
    <div class="feature-card__body">
      <div>
        <h3>${project.title}</h3>
        <p class="feature-card__tagline">${project.tagline}</p>
      </div>
      <p class="feature-card__summary">${project.summary}</p>
      <ul class="feature-card__list">
        ${highlights.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <div class="tag-list tag-list--compact">
        ${project.stack.map((item) => `<span class="tag-list__item">${item}</span>`).join("")}
      </div>
      <p class="feature-card__note">Open the full case study for the complete workflow and implementation details.</p>
    </div>
  `;

  const showcaseTech = document.getElementById("showcase-tech");
  if (showcaseTech) {
    const stackSet = new Set([
      ...project.stack,
      ...siteContent.techStack[0].items,
      "Git",
      "Docker"
    ]);

    showcaseTech.innerHTML = Array.from(stackSet)
      .slice(0, 10)
      .map((item) => `<span class="tag-list__item">${item}</span>`)
      .join("");
  }
}

function buildProfileDeepDiveMarkup() {
  const { profile } = siteContent;
  return `
    <div class="deep-dive-grid deep-dive-grid--two">
      <article class="timeline-card">
        <h3>Working approach</h3>
        <p class="timeline-card__summary">${profile.summary}</p>
        <ul class="timeline-card__list">
          ${profile.strengths.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </article>
      <article class="side-card">
        <p class="meta-label">Focus areas</p>
        <div class="tag-list">
          ${profile.focusAreas.map((item) => `<span class="tag-list__item">${item}</span>`).join("")}
        </div>
        <p class="meta-label">Links</p>
        <div class="quick-links">
          <a href="mailto:${profile.email}">${profile.email}</a>
          <a href="${profile.githubUrl}" rel="noreferrer" target="_blank">GitHub</a>
          <a href="${profile.linkedinUrl}" rel="noreferrer" target="_blank">LinkedIn</a>
          <a href="${profile.twitterUrl}" rel="noreferrer" target="_blank">X / Twitter</a>
        </div>
      </article>
    </div>
  `;
}

function buildShowcaseDeepDiveMarkup() {
  const project = siteContent.projects[0];
  const linksMarkup =
    project.liveUrl || project.repoUrl
      ? `
        <div class="feature-card__actions">
          ${project.liveUrl ? `<a class="hero-link" href="${project.liveUrl}" rel="noreferrer" target="_blank">Live project</a>` : ""}
          ${project.repoUrl ? `<a class="hero-link" href="${project.repoUrl}" rel="noreferrer" target="_blank">Source code</a>` : ""}
        </div>
      `
      : `<p class="feature-card__note">Public links can be added later as the project case study expands.</p>`;

  return `
    <article class="feature-card">
      <p class="eyebrow">${project.status}</p>
      <div class="feature-card__body">
        <div>
          <h3>${project.title}</h3>
          <p class="feature-card__tagline">${project.tagline}</p>
        </div>
        <p class="feature-card__summary">${project.summary}</p>
        <ul class="feature-card__list">
          ${project.highlights.map((item) => `<li>${item}</li>`).join("")}
        </ul>
        <div class="tag-list">
          ${project.stack.map((item) => `<span class="tag-list__item">${item}</span>`).join("")}
        </div>
        ${linksMarkup}
      </div>
    </article>
  `;
}

function setupDeepDive() {
  const overlay = document.getElementById("deep-dive");
  const body = document.getElementById("deep-dive-body");
  const title = document.getElementById("deep-dive-title");
  const eyebrow = document.getElementById("deep-dive-eyebrow");
  const closeButton = document.getElementById("deep-dive-close");
  const dismissButtons = document.querySelectorAll("[data-close-deep-dive]");
  const openers = document.querySelectorAll("[data-open-deep-dive]");
  let returnFocusNode = null;

  if (!overlay || !body || !title || !eyebrow || !closeButton) {
    return;
  }

  const sections = {
    profile: {
      eyebrow: "Profile",
      title: "Approach and strengths",
      html: buildProfileDeepDiveMarkup
    },
    showcase: {
      eyebrow: "Showcase",
      title: "HireSphere full case study",
      html: buildShowcaseDeepDiveMarkup
    }
  };

  const closeDeepDive = () => {
    overlay.hidden = true;
    body.innerHTML = "";
    document.documentElement.classList.remove("is-deep-dive-open");
    if (returnFocusNode) {
      returnFocusNode.focus();
    }
  };

  const openDeepDive = (sectionKey, triggerNode) => {
    const section = sections[sectionKey];
    if (!section) {
      return;
    }

    returnFocusNode = triggerNode || null;
    eyebrow.textContent = section.eyebrow;
    title.textContent = section.title;
    body.innerHTML = section.html();
    overlay.hidden = false;
    document.documentElement.classList.add("is-deep-dive-open");
    closeButton.focus();
  };

  openers.forEach((node) => {
    node.addEventListener("click", () => {
      openDeepDive(node.dataset.openDeepDive, node);
    });
  });

  dismissButtons.forEach((node) => {
    node.addEventListener("click", closeDeepDive);
  });

  closeButton.addEventListener("click", closeDeepDive);

  window.addEventListener("keydown", (event) => {
    if (!overlay.hidden && event.key === "Escape") {
      closeDeepDive();
    }
  });
}

function setActiveTab(tabId) {
  const triggers = document.querySelectorAll("[data-tab-trigger]");
  const panels = Array.from(document.querySelectorAll("[data-tab-panel]"));
  const nextPanel = panels.find((panel) => panel.dataset.tabPanel === tabId);
  const currentPanel = panels.find((panel) => !panel.hidden && panel !== nextPanel);
  const reducedMotion = motionQuery.matches;

  if (!nextPanel) {
    return;
  }

  document.documentElement.setAttribute("data-active-tab", tabId);

  triggers.forEach((trigger) => {
    const isActive = trigger.dataset.tabTrigger === tabId;
    trigger.setAttribute("aria-selected", isActive ? "true" : "false");
    trigger.setAttribute("tabindex", isActive ? "0" : "-1");
    trigger.classList.toggle("is-active", isActive);
  });

  panels.forEach((panel) => {
    clearPanelTimer(panel, "enter");
    clearPanelTimer(panel, "hide");

    if (panel === nextPanel) {
      panel.hidden = false;
      panel.classList.remove("is-exiting");
      panel.classList.add("is-active", "is-entering");
      panel.setAttribute("tabindex", "0");
      panel.removeAttribute("aria-hidden");
      panel.scrollTop = 0;

      setPanelTimer(panel, "enter", () => {
        panel.classList.remove("is-entering");
      }, 260);
      return;
    }

    panel.classList.remove("is-active", "is-entering");
    panel.setAttribute("tabindex", "-1");

    if (panel === currentPanel && !reducedMotion) {
      panel.classList.add("is-exiting");
      panel.setAttribute("aria-hidden", "true");
      setPanelTimer(panel, "hide", () => {
        panel.hidden = true;
        panel.classList.remove("is-exiting");
        panel.removeAttribute("aria-hidden");
      }, 220);
      return;
    }

    panel.hidden = true;
    panel.classList.remove("is-exiting");
    panel.removeAttribute("aria-hidden");
  });

  if (window.location.hash !== `#${tabId}`) {
    history.replaceState(null, "", `#${tabId}`);
  }
}

function setupTabs() {
  const initialTab = tabIds.includes(window.location.hash.slice(1)) ? window.location.hash.slice(1) : "profile";
  const triggers = Array.from(document.querySelectorAll("[data-tab-trigger]"));

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      setActiveTab(trigger.dataset.tabTrigger);
    });

    trigger.addEventListener("keydown", (event) => {
      const currentIndex = triggers.indexOf(trigger);
      let nextIndex = currentIndex;

      if (event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % triggers.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = triggers.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      triggers[nextIndex].focus();
      setActiveTab(triggers[nextIndex].dataset.tabTrigger);
    });
  });

  document.querySelectorAll("[data-switch-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      setActiveTab(button.dataset.switchTab);
    });
  });

  window.addEventListener("hashchange", () => {
    const hashTab = window.location.hash.slice(1);
    if (tabIds.includes(hashTab)) {
      setActiveTab(hashTab);
    }
  });

  setActiveTab(initialTab);
}

function setupRevealObserver() {
  const reducedMotion = motionQuery.matches;
  const revealNodes = document.querySelectorAll("[data-reveal]");

  if (reducedMotion) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -48px 0px"
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function setupProfileIntro() {
  const profileMinimal = document.getElementById("profile-minimal");

  if (!profileMinimal) {
    return;
  }

  if (motionQuery.matches) {
    profileMinimal.classList.add("is-intro-complete");
    return;
  }

  profileMinimal.classList.add("is-intro-start");

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      profileMinimal.classList.add("is-intro-ready");
      profileMinimal.classList.remove("is-intro-start");
      profileMinimal.classList.add("is-intro-complete");
    });
  });
}

function setupProfileIconTilt() {
  if (motionQuery.matches) {
    return;
  }

  const icons = document.querySelectorAll(".profile-icon");

  icons.forEach((icon) => {
    let settleTimer = null;

    const clearSettle = () => {
      if (!settleTimer) {
        return;
      }

      window.clearTimeout(settleTimer);
      settleTimer = null;
    };

    const settleIcon = () => {
      clearSettle();
      icon.classList.add("is-interacting", "is-settling");
      icon.style.transform = "translateY(0) rotateX(0deg) rotateY(0deg)";

      settleTimer = window.setTimeout(() => {
        icon.classList.remove("is-interacting", "is-settling");
        icon.style.removeProperty("transform");
        icon.style.animation = "none";
        void icon.offsetWidth;
        icon.style.removeProperty("animation");
      }, 280);
    };

    icon.addEventListener("pointermove", (event) => {
      const rect = icon.getBoundingClientRect();
      const horizontal = (event.clientX - rect.left) / rect.width - 0.5;
      const vertical = (event.clientY - rect.top) / rect.height - 0.5;
      const tiltX = (-vertical * 12).toFixed(2);
      const tiltY = (horizontal * 12).toFixed(2);

      clearSettle();
      icon.classList.remove("is-settling");
      icon.classList.add("is-interacting");
      icon.style.transform = `translateY(-4px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    icon.addEventListener("pointerleave", settleIcon);
    icon.addEventListener("pointercancel", settleIcon);
    icon.addEventListener("blur", settleIcon);
  });
}

function setupProfileCtaPulse() {
  const standoutCta = document.querySelector(".hero-link--standout");

  if (!standoutCta || motionQuery.matches) {
    return;
  }

  const triggerPulse = () => {
    standoutCta.classList.remove("is-pulsing");
    void standoutCta.offsetWidth;
    standoutCta.classList.add("is-pulsing");

    window.setTimeout(() => {
      standoutCta.classList.remove("is-pulsing");
    }, 1700);
  };

  window.setTimeout(triggerPulse, 1000);

  window.setInterval(() => {
    if (document.documentElement.getAttribute("data-active-tab") === "profile") {
      triggerPulse();
    }
  }, 6500);
}

function setupProfileAnimations() {
  setupProfileIntro();
  setupProfileIconTilt();
  setupProfileCtaPulse();
}

function init() {
  renderSocialLinks();
  renderProfile();
  renderFeaturedProject();
  setupProfileAnimations();
  setupDeepDive();
  setupThemeToggle();
  setupTabs();
  setupRevealObserver();
}

init();
