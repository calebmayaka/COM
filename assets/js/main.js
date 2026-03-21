import { siteContent } from "./content.js";

const tabIds = ["profile", "consultancy", "contact"];
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

  document.getElementById("focus-list").innerHTML = profile.focusAreas
    .map((item) => `<span class="focus-pill">${item}</span>`)
    .join("");

}

function renderListItems(items) {
  return (items || []).map((item) => `<li>${item}</li>`).join("");
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

function setupProfileAnimations() {
  setupProfileIntro();
  setupProfileIconTilt();
  setupProfileCtaPulse();
}

function init() {
  renderProfile();
  renderConsultancyServices();
  setupServiceRevealObserver();
  setupProfileAnimations();
  setupDeepDive();
  setupThemeToggle();
  setupTabs();
  setupRevealObserver();
}

init();
