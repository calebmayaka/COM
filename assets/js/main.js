import { siteContent } from "./content.js";

const tabIds = ["profile", "consultancy", "tools", "contact"];
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

function getToolIconSvg(iconKey) {
  const icons = {
    python:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.4c3.8 0 3.6 1.6 3.6 1.6v2H8.4c-2.4 0-2.8 2-2.8 2v3.2H3.4S2 10.4 2 8.8c0-1.6 1.2-5.4 6-5.4H12Zm-4 2.1a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm4 15.1c-3.8 0-3.6-1.6-3.6-1.6v-2h7.2c2.4 0 2.8-2 2.8-2v-3.2h2.2s1.4 1.8 1.4 3.4c0 1.6-1.2 5.4-6 5.4H12Zm4-2.1a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z"/></svg>',
    framework:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v6H4V4Zm0 10h10v6H4v-6Zm12 0h4v6h-4v-6Z"/></svg>',
    api:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.8 6a2.8 2.8 0 1 1 0 5.6A2.8 2.8 0 0 1 7.8 6ZM16.2 12.4a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6ZM9.9 9.8l4.2 2.3m0 0-1.2 2.1"/></svg>',
    git:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6m-3-8 6 6m-9 2 6 6M5.5 8.5 8.5 5.5l10 10-3 3-10-10Z"/></svg>',
    docker:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 10h2v2H5v-2Zm3 0h2v2H8v-2Zm3 0h2v2h-2v-2Zm-6 3h10c-.4 2.8-2.5 4.5-5.6 4.5C6.2 17.5 5 15.8 5 13Zm12.3-3c.6-1.7 2.2-1.8 2.2-1.8s.1 1.8-1.2 2.8"/></svg>',
    os:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5.5h17v5h-17v-5Zm0 8h8v5h-8v-5Zm10 0h7v5h-7v-5Z"/></svg>',
    server:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v4H4V5Zm0 5.5h16v4H4v-4ZM4 16h16v3H4v-3Zm2-9.5h1.5M6 12h1.5M6 17.5h1.5"/></svg>',
    design:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5A8.5 8.5 0 1 0 20.5 12c0 1.9-1.6 2.2-2.3 2.2h-2.7a1.5 1.5 0 0 0-1.5 1.5c0 .7.3 1.4.3 2.1A2.8 2.8 0 0 1 11.5 21 8.5 8.5 0 0 1 12 3.5Zm-3.3 6.7a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Zm6.7 0a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Zm-3.3-2a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z"/></svg>',
    video:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h11v12H4V6Zm13 4 3-2v8l-3-2v-4Z"/></svg>',
    motion:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h5m2 0h4m2 0h3M6 8l-2 4 2 4m12-8 2 4-2 4"/></svg>',
    figma:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3.5h6a3 3 0 0 1 0 6H9v-6Zm0 6h6a3 3 0 1 1 0 6H9v-6Zm0 6h3a3 3 0 1 1-3 3v-3Zm0-12a3 3 0 1 0 0 6h3v-6H9Z"/></svg>',
    uiux:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4V5Zm2.5 3h5M6.5 11h4m5-3v8"/></svg>',
    javascript:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5V4Zm7.2 12.2c.6.9 1.4 1.4 2.7 1.4 1.4 0 2.4-.7 2.4-2 0-1.1-.7-1.6-2-2.1l-.7-.3c-.7-.3-1-.5-1-.9 0-.4.3-.7.9-.7.6 0 .9.2 1.2.7l1.6-1c-.7-1.1-1.7-1.6-2.8-1.6-1.8 0-3.1 1-3.1 2.5 0 1.4.8 2.1 2.2 2.7l.7.3c.8.3 1.2.6 1.2 1.1 0 .6-.5.9-1.2.9-.8 0-1.3-.4-1.8-1l-1.3 1Zm-5.8.3c.4.7 1.1 1.1 2.1 1.1 1.4 0 2.4-.8 2.4-2.5V9.7H8.8v5.4c0 .7-.3 1-.8 1-.4 0-.6-.1-.9-.4l-.7 1Z"/></svg>',
    css:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.5h14l-1.2 14.2L12 20.5l-5.8-2.8L5 3.5Zm3 3 .2 2.4h7.6l.2-2.4H8Zm.4 4.4.2 2.3h4.9l-.2 2-1.3.6-1.3-.6-.1-1h-2.2l.2 2.4 3.4 1.6 3.4-1.6.5-5.7H8.4Z"/></svg>'
  };

  return icons[iconKey] || '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 4 8.5v7L12 20l8-4.5v-7L12 4Zm0 2.2 5.6 3.1-5.6 3.1-5.6-3.1L12 6.2Zm-6 4.8 5 2.8v4.8l-5-2.8V11Zm7 7.6v-4.8l5-2.8v4.8l-5 2.8Z"/></svg>';
}

function renderProfileTools(profile) {
  const labelNode = document.getElementById("profile-tools-label");
  const listNode = document.getElementById("profile-tools-list");
  const tools = profile.tools || [];

  if (labelNode) {
    labelNode.textContent = profile.toolsLabel || "Tools I Work With";
  }

  if (!listNode) {
    return;
  }

  listNode.innerHTML = tools
    .map(
      (tool) => `
        <span class="tool-chip">
          <span class="tool-chip__icon" aria-hidden="true">${getToolIconSvg(tool.iconKey)}</span>
          <span class="tool-chip__text">${tool.name}</span>
        </span>
      `
    )
    .join("");
}

function renderProfileTerminal(profile) {
  const terminal = profile.terminal || {};
  const eyebrowNode = document.getElementById("profile-terminal-eyebrow");
  const titleNode = document.getElementById("profile-terminal-title");
  const promptNode = document.getElementById("profile-terminal-prompt");
  const inputNode = document.getElementById("profile-terminal-input");
  const runNode = document.querySelector(".profile-terminal__run");
  const outputLabelNode = document.getElementById("profile-terminal-output-label");
  const commandsNode = document.getElementById("profile-terminal-commands");
  const commands = terminal.commands || [];

  if (eyebrowNode) {
    eyebrowNode.textContent = terminal.eyebrow || "Playful terminal";
  }

  if (titleNode) {
    titleNode.textContent = terminal.title || "Try a quick command";
  }

  if (promptNode) {
    promptNode.textContent = terminal.promptLabel || "caleb@portfolio:~$";
  }

  if (inputNode) {
    inputNode.placeholder = terminal.placeholder || "Type a command";
  }

  if (runNode) {
    runNode.textContent = terminal.submitLabel || "Run";
  }

  if (outputLabelNode) {
    outputLabelNode.textContent = terminal.outputLabel || "Output";
  }

  if (!commandsNode) {
    return;
  }

  commandsNode.innerHTML = commands
    .map(
      (command) => `
        <button
          aria-pressed="false"
          class="profile-terminal__command"
          data-terminal-command="${command.id}"
          type="button"
        >
          ${command.label}
        </button>
      `
    )
    .join("");
}

function renderProjectLinks(project) {
  if (!project.liveUrl && !project.repoUrl) {
    return "";
  }

  return `
    <div class="feature-card__actions">
      ${project.liveUrl ? `<a class="hero-link hero-link--compact" href="${project.liveUrl}" rel="noreferrer" target="_blank">Live project</a>` : ""}
      ${project.repoUrl ? `<a class="hero-link hero-link--compact" href="${project.repoUrl}" rel="noreferrer" target="_blank">Source code</a>` : ""}
    </div>
  `;
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
  setText("consultancy-copy", profile.consultancyPitch);
  setLink("resume-link", profile.resumeUrl);
  setLink("hero-email", `mailto:${profile.email}`);
  setLink("hero-github", profile.githubUrl);
  setLink("hero-linkedin", profile.linkedinUrl);
  setLink("hero-twitter", profile.twitterUrl);
  setLink("hero-whatsapp", profile.whatsappUrl);
  setLink("contact-primary-cta", `mailto:${profile.email}`, profile.primaryCtaLabel || "Email me");
  setLink("contact-email", `mailto:${profile.email}`);
  setLink("contact-github", profile.githubUrl);
  setLink("contact-linkedin", profile.linkedinUrl);
  setLink("contact-twitter", profile.twitterUrl);
  renderProfileTools(profile);
  renderProfileTerminal(profile);
}

function renderListItems(items) {
  return (items || []).map((item) => `<li>${item}</li>`).join("");
}

function renderToolsHub() {
  const liveListNode = document.getElementById("tools-live-list");
  const plannedListNode = document.getElementById("tools-planned-list");
  const toolbox = siteContent.toolbox || {};
  const liveTools = toolbox.live || [];
  const plannedTools = toolbox.planned || [];

  if (liveListNode) {
    liveListNode.innerHTML = liveTools
      .map(
        (tool) => `
          <article class="toolbox-card tool-card" data-tool-card>
            <p class="meta-label">${tool.category || "Tool"}</p>
            <h3>${tool.title}</h3>
            <p>${tool.summary || ""}</p>
            <a class="hero-link hero-link--service" href="${tool.url}">${tool.ctaLabel || "Open tool"}</a>
          </article>
        `
      )
      .join("");
  }

  if (plannedListNode) {
    plannedListNode.innerHTML = plannedTools
      .map(
        (tool) => `
          <li class="tools-roadmap__item" data-tool-roadmap>
            <p>${tool.title}</p>
            <span>${tool.category || "Planned"}</span>
          </li>
        `
      )
      .join("");
  }
}

function buildServiceMailtoHref(service, email) {
  const params = new URLSearchParams();
  if (service.ctaSubject) {
    params.set("subject", service.ctaSubject);
  }
  if (service.ctaBody) {
    params.set("body", service.ctaBody);
  }

  const query = params.toString();
  return `mailto:${email}${query ? `?${query}` : ""}`;
}

function buildSoftwareProofMarkup() {
  const preferredTitles = [
    "HireSphere Hiring System",
    "FoodBankHub",
    "Restaurant Website",
    "Torrent Download to Google Drive (Colab)"
  ];

  const projects = siteContent.projects || [];
  const selectedProjects = preferredTitles
    .map((title) => projects.find((project) => project.title === title))
    .filter(Boolean);

  if (!selectedProjects.length) {
    return "";
  }

  return `
    <div class="service-story__proof">
      <p class="meta-label">Selected Work</p>
      <div class="service-story__proof-links">
        ${selectedProjects
          .map((project) => {
            const href = project.liveUrl || project.repoUrl;
            if (!href) {
              return `<span>${project.title}</span>`;
            }
            return `<a href="${href}" rel="noreferrer" target="_blank">${project.title}</a>`;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderConsultancyServices() {
  const container = document.getElementById("consultancy-services");
  const services = siteContent.services || [];
  const email = siteContent.profile?.email || "";

  if (!container) {
    return;
  }

  container.innerHTML = services
    .map((service, index) => {
      const serviceKey = service.id || `service-${index}`;
      const ctaHref = buildServiceMailtoHref(service, email);
      const tagsMarkup = (service.tags || [])
        .map((tag) => `<span class="tag-list__item">${tag}</span>`)
        .join("");
      const tagsLabel = service.tagsLabel || "Focus Areas";
      const forWhoPreview = (service.forWho || []).slice(0, 3);
      const deliverablesPreview = (service.deliverables || []).slice(0, 3);
      const softwareProof = service.id === "software-development" ? buildSoftwareProofMarkup() : "";
      const tagSection = tagsMarkup
        ? `
            <div class="service-story__tags">
              <p class="meta-label">${tagsLabel}</p>
              <div class="tag-list">${tagsMarkup}</div>
            </div>
          `
        : "";

      return `
        <article class="service-story" data-service-reveal>
          <div class="service-story__media-wrap">
            <img class="service-story__image" src="${service.imageUrl}" alt="${service.imageAlt || service.title}" loading="lazy" decoding="async" />
          </div>
          <div class="side-card service-story__content">
            <h3>
              <button class="service-card__trigger" data-open-service="${serviceKey}" type="button">
                ${service.title}
              </button>
            </h3>
            <p>${service.summary}</p>
            <div class="service-card__block">
              <p class="meta-label">Who it's for</p>
              <ul class="service-card__list">
                ${renderListItems(forWhoPreview)}
              </ul>
            </div>
            <div class="service-card__block">
              <p class="meta-label">Deliverables</p>
              <ul class="service-card__list">
                ${renderListItems(deliverablesPreview)}
              </ul>
            </div>
            <div class="service-card__outcome">
              <p class="meta-label">Expected result</p>
              <p>${service.outcome || ""}</p>
            </div>
            ${softwareProof}
            ${tagSection}
            <a class="hero-link hero-link--service" href="${ctaHref}">${service.ctaLabel || "Discuss this service"}</a>
          </div>
        </article>
      `;
    })
    .join("");
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

function buildConsultancyDeepDiveMarkup() {
  const services = siteContent.services || [];

  return `
    <div class="deep-dive-grid">
      ${services
        .map(
          (service) => buildServiceDetailCardMarkup(service)
        )
        .join("")}
    </div>
  `;
}

function buildServiceDetailCardMarkup(service) {
  return `
    <article class="timeline-card">
      <h3>${service.title}</h3>
      <p class="timeline-card__summary">${service.summary}</p>
      <div class="service-card__block">
        <p class="meta-label">Who it's for</p>
        <ul class="timeline-card__list">
          ${renderListItems(service.forWho)}
        </ul>
      </div>
      <div class="service-card__block">
        <p class="meta-label">Deliverables</p>
        <ul class="timeline-card__list">
          ${renderListItems(service.deliverables)}
        </ul>
      </div>
      <div class="service-card__outcome">
        <p class="meta-label">Expected result</p>
        <p>${service.outcome || ""}</p>
      </div>
      <div class="tag-list">
        ${(service.tags || []).map((tag) => `<span class="tag-list__item">${tag}</span>`).join("")}
      </div>
    </article>
  `;
}

function buildSoftwareServiceDeepDiveMarkup(service) {
  const projects = siteContent.projects || [];

  return `
    <div class="deep-dive-grid">
      ${buildServiceDetailCardMarkup(service)}
      ${projects
        .map(
          (project) => `
            <article class="feature-card feature-card--compact">
              <p class="eyebrow">${project.status || "Project"}</p>
              <div class="feature-card__body">
                <div>
                  <h3>${project.title}</h3>
                  <p class="feature-card__tagline">${project.tagline}</p>
                </div>
                <p class="feature-card__summary">${project.summary}</p>
                <ul class="feature-card__list feature-card__list--compact">
                  ${(project.highlights || []).slice(0, 2).map((item) => `<li>${item}</li>`).join("")}
                </ul>
                <div class="tag-list tag-list--compact">
                  ${(project.stack || []).map((item) => `<span class="tag-list__item">${item}</span>`).join("")}
                </div>
                ${renderProjectLinks(project)}
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function buildSingleServiceDeepDiveMarkup(service) {
  if (!service) {
    return "";
  }

  if (service.id === "software-development" || service.title.toLowerCase() === "software development") {
    return buildSoftwareServiceDeepDiveMarkup(service);
  }

  return buildServiceDetailCardMarkup(service);
}

function setupServiceRevealObserver() {
  const serviceNodes = document.querySelectorAll("[data-service-reveal]");
  if (!serviceNodes.length) {
    return;
  }

  serviceNodes.forEach((node) => node.classList.add("is-reveal-ready"));
  const revealAll = () => {
    serviceNodes.forEach((node) => node.classList.add("is-visible"));
  };

  if (motionQuery.matches) {
    revealAll();
    return;
  }

  const failSafeTimer = window.setTimeout(revealAll, 2400);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });

      const allVisible = Array.from(serviceNodes).every((node) => node.classList.contains("is-visible"));
      if (allVisible) {
        window.clearTimeout(failSafeTimer);
      }
    },
    {
      threshold: 0.24,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  serviceNodes.forEach((node) => observer.observe(node));
}

function setupDeepDive() {
  const overlay = document.getElementById("deep-dive");
  const body = document.getElementById("deep-dive-body");
  const title = document.getElementById("deep-dive-title");
  const eyebrow = document.getElementById("deep-dive-eyebrow");
  const closeButton = document.getElementById("deep-dive-close");
  const dismissButtons = document.querySelectorAll("[data-close-deep-dive]");
  const openers = document.querySelectorAll("[data-open-deep-dive]");
  const serviceOpeners = document.querySelectorAll("[data-open-service]");
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
    consultancy: {
      eyebrow: "Work with me",
      title: "Service details",
      html: buildConsultancyDeepDiveMarkup
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

  const openServiceDeepDive = (serviceKey, triggerNode) => {
    const services = siteContent.services || [];
    const service = services.find((item, index) => (item.id || `service-${index}`) === serviceKey);
    if (!service) {
      return;
    }

    returnFocusNode = triggerNode || null;
    eyebrow.textContent = "Work with me";
    title.textContent = service.title;
    body.innerHTML = buildSingleServiceDeepDiveMarkup(service);
    overlay.hidden = false;
    document.documentElement.classList.add("is-deep-dive-open");
    closeButton.focus();
  };

  openers.forEach((node) => {
    node.addEventListener("click", () => {
      openDeepDive(node.dataset.openDeepDive, node);
    });
  });

  serviceOpeners.forEach((node) => {
    node.addEventListener("click", () => {
      openServiceDeepDive(node.dataset.openService, node);
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

function setupProfileTerminal() {
  const card = document.getElementById("profile-terminal");
  const introNode = document.getElementById("profile-terminal-intro");
  const form = document.getElementById("profile-terminal-form");
  const input = document.getElementById("profile-terminal-input");
  const outputNode = document.getElementById("profile-terminal-output");
  const actionNode = document.getElementById("profile-terminal-output-action");
  const commands = Array.from(document.querySelectorAll("[data-terminal-command]"));
  const profile = siteContent.profile || {};
  const terminal = profile.terminal || {};
  const commandList = terminal.commands || [];

  if (!card || !introNode || !form || !input || !outputNode || !actionNode || !commandList.length) {
    return;
  }

  const commandMap = new Map(commandList.map((command) => [command.id.trim().toLowerCase(), command]));
  let introTimer = null;
  let eggTimer = null;

  const clearIntroTimer = () => {
    if (!introTimer) {
      return;
    }

    window.clearTimeout(introTimer);
    introTimer = null;
  };

  const setIntroText = (value) => {
    introNode.textContent = value || "";
  };

  const finishIntro = () => {
    clearIntroTimer();
    card.classList.remove("is-terminal-typing");
    setIntroText(terminal.introLine || "");
  };

  const typeIntroLine = () => {
    const introLine = terminal.introLine || "";

    if (!introLine) {
      return;
    }

    if (motionQuery.matches) {
      finishIntro();
      return;
    }

    clearIntroTimer();
    card.classList.add("is-terminal-typing");
    setIntroText("");

    const typeCharacter = (index) => {
      setIntroText(introLine.slice(0, index));

      if (index >= introLine.length) {
        introTimer = null;
        card.classList.remove("is-terminal-typing");
        return;
      }

      introTimer = window.setTimeout(() => {
        typeCharacter(index + 1);
      }, 28);
    };

    typeCharacter(1);
  };

  const clearOutput = () => {
    outputNode.innerHTML = "";
    actionNode.innerHTML = "";
  };

  const renderOutput = (lines) => {
    clearOutput();

    (lines || []).forEach((line) => {
      const outputLine = document.createElement("p");
      outputLine.className = "profile-terminal__line";
      outputLine.textContent = line;
      outputNode.appendChild(outputLine);
    });
  };

  const renderAction = (action) => {
    actionNode.innerHTML = "";

    if (!action || !action.type) {
      return;
    }

    if (action.type === "link") {
      const link = document.createElement("a");
      link.className = "profile-terminal__action hero-link hero-link--compact";
      link.href = action.href || `mailto:${profile.email || ""}`;
      link.textContent = action.label || "Open link";
      if (/^https?:/i.test(link.href)) {
        link.rel = "noreferrer";
        link.target = "_blank";
      }
      actionNode.appendChild(link);
      return;
    }

    if (action.type === "switch-tab") {
      const button = document.createElement("button");
      button.className = "profile-terminal__action hero-link hero-link--compact";
      button.type = "button";
      button.textContent = action.label || "Open";
      button.addEventListener("click", () => {
        setActiveTab(action.target || "consultancy");
      });
      actionNode.appendChild(button);
    }
  };

  const setActiveCommandState = (activeId) => {
    commands.forEach((button) => {
      const isActive = button.dataset.terminalCommand === activeId;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  };

  const triggerEgg = () => {
    if (motionQuery.matches) {
      return;
    }

    window.clearTimeout(eggTimer);
    card.classList.remove("is-easter-egg-active");
    void card.offsetWidth;
    card.classList.add("is-easter-egg-active");
    eggTimer = window.setTimeout(() => {
      card.classList.remove("is-easter-egg-active");
    }, 900);
  };

  const runCommand = (value) => {
    finishIntro();
    const normalizedValue = value.trim().toLowerCase();
    const command = commandMap.get(normalizedValue);

    if (!command) {
      setActiveCommandState("");
      renderOutput(terminal.fallbackOutput || ["Command not found."]);
      return;
    }

    setActiveCommandState(command.id);
    renderOutput(command.output || []);
    renderAction(command.action);

    if (command.action?.type === "easter-egg") {
      triggerEgg();
    }
  };

  commands.forEach((button) => {
    button.addEventListener("click", () => {
      const commandValue = button.dataset.terminalCommand || "";
      input.value = commandValue;
      runCommand(commandValue);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const commandValue = input.value.trim();

    if (!commandValue) {
      renderOutput(terminal.initialOutput || []);
      setActiveCommandState("");
      return;
    }

    runCommand(commandValue);
    input.focus();
    input.select();
  });

  renderOutput(terminal.initialOutput || []);
  typeIntroLine();
}

function setupProfileAnimations() {
  setupProfileIntro();
  setupProfileTerminal();
  setupProfileIconTilt();
  setupProfileCtaPulse();
}

function init() {
  renderProfile();
  renderConsultancyServices();
  renderToolsHub();
  setupServiceRevealObserver();
  setupProfileAnimations();
  setupDeepDive();
  setupThemeToggle();
  setupTabs();
  setupRevealObserver();
}

init();
