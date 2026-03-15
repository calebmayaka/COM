import { siteContent } from "./content.js";

const tabIds = ["profile", "showcase", "experience", "contact"];

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
  return;
}

function renderProfile() {
  const { profile, education, experience, certifications } = siteContent;

  setText("profile-location", profile.location);
  setText("hero-headline", profile.headline);
  setText("hero-subheadline", profile.subheadline);
  setText("profile-name", profile.name);
  setText("profile-role", profile.roleLine);
  setText("profile-summary", profile.summary);
  setText("profile-copy", profile.summary);
  setText("showcase-copy", profile.showcaseCopy);
  setText("experience-copy", profile.experienceCopy);
  setText("contact-copy", profile.contactPitch);
  setLink("resume-link", profile.resumeUrl);
  setLink("hero-email", `mailto:${profile.email}`, profile.email);
  setLink("hero-github", profile.githubUrl, "GitHub");
  setLink("hero-linkedin", profile.linkedinUrl, "LinkedIn");
  setLink("contact-email", `mailto:${profile.email}`);
  setLink("contact-github", profile.githubUrl);
  setLink("contact-linkedin", profile.linkedinUrl);
  setLink("contact-resume", profile.resumeUrl);

  document.getElementById("focus-pills").innerHTML = profile.focusAreas
    .map((item) => `<li class="tag-list__item">${item}</li>`)
    .join("");

  document.getElementById("hero-stats").innerHTML = [
    { label: "Roles", value: String(experience.length).padStart(2, "0") },
    { label: "Certs", value: String(certifications.length).padStart(2, "0") },
    { label: "Case study", value: "01" }
  ]
    .map(
      (stat) => `
        <div class="stat-card">
          <dt>${stat.label}</dt>
          <dd>${stat.value}</dd>
        </div>
      `
    )
    .join("");

  document.getElementById("education-list").innerHTML = education
    .map(
      (entry) => `
        <article class="education-item">
          <p class="education-item__date">${entry.dateRange}</p>
          <h3>${entry.award}</h3>
          <p class="education-item__institution">${entry.institution}</p>
          <p class="education-item__note">${entry.notes}</p>
        </article>
      `
    )
    .join("");

  document.getElementById("strengths-list").innerHTML = profile.strengths
    .map((item) => `<li>${item}</li>`)
    .join("");
}

function renderFeaturedProject() {
  const project = siteContent.projects[0];
  const linksMarkup =
    project.liveUrl || project.repoUrl
      ? `
        <div class="feature-card__actions">
          ${project.liveUrl ? `<a class="button button--ghost" href="${project.liveUrl}" rel="noreferrer" target="_blank">Live project</a>` : ""}
          ${project.repoUrl ? `<a class="button button--ghost" href="${project.repoUrl}" rel="noreferrer" target="_blank">Source code</a>` : ""}
        </div>
      `
      : `<p class="feature-card__note">Public links can be added later as the project case study expands.</p>`;

  document.getElementById("featured-project").innerHTML = `
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
      <div class="tag-list tag-list--compact">
        ${project.stack.map((item) => `<span class="tag-list__item">${item}</span>`).join("")}
      </div>
      ${linksMarkup}
    </div>
  `;
}

function renderExperience() {
  document.getElementById("experience-list").innerHTML = siteContent.experience
    .map(
      (role) => `
        <article class="timeline-card">
          <div class="timeline-card__meta">
            <p class="timeline-card__date">${role.dateRange}</p>
            <h3>${role.role}</h3>
            <p>${role.organization}</p>
            <span>${role.location}</span>
          </div>
          <div class="timeline-card__body">
            <p class="timeline-card__summary">${role.summary}</p>
            <ul class="timeline-card__list">
              ${role.highlights.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>
        </article>
      `
    )
    .join("");

  document.getElementById("stack-groups").innerHTML = siteContent.techStack
    .map(
      (group) => `
        <section class="stack-group">
          <h3>${group.label}</h3>
          <div class="tag-list tag-list--compact">
            ${group.items.map((item) => `<span class="tag-list__item">${item}</span>`).join("")}
          </div>
        </section>
      `
    )
    .join("");

  document.getElementById("certifications-list").innerHTML = siteContent.certifications
    .map(
      (cert) => `
        <article class="cert-item">
          <div>
            <h3>${cert.title}</h3>
            <p>${cert.issuer}</p>
          </div>
          <span>${cert.year}</span>
        </article>
      `
    )
    .join("");
}

function setActiveTab(tabId) {
  const triggers = document.querySelectorAll("[data-tab-trigger]");
  const panels = document.querySelectorAll("[data-tab-panel]");

  triggers.forEach((trigger) => {
    const isActive = trigger.dataset.tabTrigger === tabId;
    trigger.setAttribute("aria-selected", isActive ? "true" : "false");
    trigger.setAttribute("tabindex", isActive ? "0" : "-1");
    trigger.classList.toggle("is-active", isActive);
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.tabPanel === tabId;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });

  if (window.location.hash !== `#${tabId}`) {
    history.replaceState(null, "", `#${tabId}`);
  }
}

function setupTabs() {
  const initialTab = tabIds.includes(window.location.hash.slice(1)) ? window.location.hash.slice(1) : "profile";

  document.querySelectorAll("[data-tab-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      setActiveTab(trigger.dataset.tabTrigger);
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
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

function init() {
  renderSocialLinks();
  renderProfile();
  renderFeaturedProject();
  renderExperience();
  setupTabs();
  setupRevealObserver();
}

init();
