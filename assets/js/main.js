import { siteContent } from "./content.js";

const sectionIds = ["about", "projects", "experience", "credibility", "contact"];

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

function renderHero() {
  const { profile, experience, certifications } = siteContent;

  setText("profile-location", profile.location);
  setText("profile-name", profile.name);
  setText("profile-summary", profile.summary);
  setText("hero-headline", `${profile.headline} with real-world ICT support depth.`);
  setText("hero-subheadline", profile.subheadline);
  setText("about-lead", profile.aboutLead);
  setText("about-support", profile.aboutSupport);
  setText(
    "contact-copy",
    "If you are hiring, collaborating, or building something that needs reliable engineering and grounded technical support, Caleb would love to connect."
  );
  setText("footer-copy", `${profile.name} - ${new Date().getFullYear()}`);

  setLink("resume-link", profile.resumeUrl);
  setLink("hero-email", `mailto:${profile.email}`, profile.email);
  setLink("hero-github", profile.githubUrl, "GitHub");
  setLink("hero-linkedin", profile.linkedinUrl, "LinkedIn");
  setLink("contact-email", `mailto:${profile.email}`);
  setLink("contact-github", profile.githubUrl);
  setLink("contact-linkedin", profile.linkedinUrl);
  setLink("contact-resume", profile.resumeUrl);

  const focusPills = document.getElementById("focus-pills");
  focusPills.innerHTML = profile.focusAreas
    .map(
      (item) =>
        `<li class="inline-flex items-center rounded-full border border-ink-950/10 bg-white/75 px-4 py-2 text-sm font-medium text-ink-900">${item}</li>`
    )
    .join("");

  const heroStats = document.getElementById("hero-stats");
  heroStats.innerHTML = [
    {
      label: "Roles",
      value: String(experience.length).padStart(2, "0")
    },
    {
      label: "Certifications",
      value: String(certifications.length).padStart(2, "0")
    },
    {
      label: "Flagship project",
      value: "01"
    }
  ]
    .map(
      (stat) => `
        <div class="stat-card">
          <dt class="text-[11px] font-bold uppercase tracking-[0.28em] text-ink-900/55">${stat.label}</dt>
          <dd class="mt-3 text-3xl font-semibold text-ink-950">${stat.value}</dd>
        </div>
      `
    )
    .join("");
}

function renderEducation() {
  const educationList = document.getElementById("education-list");
  educationList.innerHTML = siteContent.education
    .map(
      (entry) => `
        <div class="border-l-2 border-rust-500/70 pl-4">
          <p class="text-sm font-bold uppercase tracking-[0.24em] text-teal-600">${entry.dateRange}</p>
          <h3 class="mt-2 text-xl font-semibold text-ink-950">${entry.award}</h3>
          <p class="mt-1 text-sm font-medium text-ink-900/70">${entry.institution}</p>
          <p class="mt-3 text-sm leading-7 text-ink-900/75">${entry.notes}</p>
        </div>
      `
    )
    .join("");

  const strengthsList = document.getElementById("strengths-list");
  strengthsList.innerHTML = siteContent.profile.strengths
    .map((item) => `<li class="strength-item">${item}</li>`)
    .join("");
}

function renderProjects() {
  const projectsGrid = document.getElementById("projects-grid");
  const projectCards = siteContent.projects.map((project, index) => {
    const cardClasses = index === 0 ? "project-card lg:col-span-2" : "project-card";
    const links = [project.liveUrl, project.repoUrl].filter(Boolean).length
      ? `
          <div class="mt-6 flex flex-wrap gap-3">
            ${project.liveUrl ? `<a class="btn-secondary" href="${project.liveUrl}" rel="noreferrer" target="_blank">Live project</a>` : ""}
            ${project.repoUrl ? `<a class="btn-secondary" href="${project.repoUrl}" rel="noreferrer" target="_blank">Source code</a>` : ""}
          </div>
        `
      : `<p class="mt-6 text-sm font-medium text-ink-900/65">Links can be added later as the public case study evolves.</p>`;

    return `
      <article class="${cardClasses}" data-reveal>
        <p class="section-kicker">${project.status}</p>
        <div class="mt-5 space-y-4">
          <div>
            <h3 class="text-2xl font-semibold text-ink-950">${project.title}</h3>
            <p class="mt-2 text-base leading-8 text-ink-900/80">${project.tagline}</p>
          </div>
          <p class="text-base leading-8 text-ink-900/75">${project.summary}</p>
          <ul class="grid gap-3 text-sm leading-7 text-ink-900/75">
            ${project.highlights.map((item) => `<li class="rounded-[1.25rem] border border-ink-950/10 bg-sand-50/80 px-4 py-3">${item}</li>`).join("")}
          </ul>
          <div class="flex flex-wrap gap-3">
            ${project.stack.map((item) => `<span class="stack-chip">${item}</span>`).join("")}
          </div>
          ${links}
        </div>
      </article>
    `;
  });

  while (projectCards.length < 3) {
    projectCards.push(`
      <article class="project-card" data-reveal>
        <p class="section-kicker">Next case study</p>
        <div class="mt-5 space-y-4">
          <h3 class="text-2xl font-semibold text-ink-950">More project stories will be added here.</h3>
          <p class="text-base leading-8 text-ink-900/75">
            The layout intentionally leaves room for future software engineering work without making the current site feel empty.
          </p>
          <div class="rounded-[1.5rem] border border-dashed border-ink-950/15 bg-white/50 px-5 py-6 text-sm leading-7 text-ink-900/65">
            Future additions can drop straight into the same content model with title, summary, highlights, stack, and optional links.
          </div>
        </div>
      </article>
    `);
  }

  projectsGrid.innerHTML = projectCards.join("");
}

function renderExperience() {
  const experienceList = document.getElementById("experience-list");
  experienceList.innerHTML = siteContent.experience
    .map(
      (role) => `
        <article class="experience-card" data-reveal>
          <div class="grid gap-5 lg:grid-cols-[0.34fr_1fr]">
            <div class="space-y-2">
              <p class="text-sm font-bold uppercase tracking-[0.24em] text-teal-600">${role.dateRange}</p>
              <h3 class="text-2xl font-semibold text-ink-950">${role.role}</h3>
              <p class="text-sm font-medium text-ink-900/70">${role.organization}</p>
              <p class="text-sm text-ink-900/60">${role.location}</p>
            </div>
            <div class="space-y-4">
              <p class="text-base leading-8 text-ink-900/78">${role.summary}</p>
              <ul class="grid gap-3 text-sm leading-7 text-ink-900/75">
                ${role.highlights.map((item) => `<li class="rounded-[1.25rem] border border-ink-950/10 bg-white/70 px-4 py-3">${item}</li>`).join("")}
              </ul>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderCredibility() {
  const stackGroups = document.getElementById("stack-groups");
  stackGroups.innerHTML = siteContent.techStack
    .map(
      (group) => `
        <section>
          <h3 class="text-sm font-bold uppercase tracking-[0.28em] text-ink-900/60">${group.label}</h3>
          <div class="mt-4 flex flex-wrap gap-3">
            ${group.items.map((item) => `<span class="stack-chip">${item}</span>`).join("")}
          </div>
        </section>
      `
    )
    .join("");

  const certificationsList = document.getElementById("certifications-list");
  certificationsList.innerHTML = siteContent.certifications
    .map(
      (cert) => `
        <article class="cert-card">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="text-xl font-semibold text-ink-950">${cert.title}</h3>
              <p class="mt-2 text-sm leading-7 text-ink-900/75">${cert.issuer}</p>
            </div>
            <p class="text-sm font-bold uppercase tracking-[0.24em] text-teal-600">${cert.year}</p>
          </div>
        </article>
      `
    )
    .join("");
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
      threshold: 0.2,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function setupNavHighlight() {
  const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      const activeEntry = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!activeEntry) {
        return;
      }

      navLinks.forEach((link) => {
        const matches = link.getAttribute("href") === `#${activeEntry.target.id}`;
        if (matches) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    {
      threshold: [0.2, 0.5, 0.7],
      rootMargin: "-20% 0px -60% 0px"
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function init() {
  renderHero();
  renderEducation();
  renderProjects();
  renderExperience();
  renderCredibility();
  setupRevealObserver();
  setupNavHighlight();
}

init();
