# Caleb Mayaka Personal Site AI Build Spec

## Product Summary
- Build a one-page static personal website for Caleb Mayaka.
- Primary positioning: `Software Engineer`.
- Supporting positioning: `ICT Support Expert`.
- Audience: recruiters, technical hiring teams, professional collaborators, and organizations that value dependable engineering plus grounded support experience.
- Deployment target: GitHub Pages.
- Stack: vanilla HTML, static CSS, lightweight vanilla JavaScript.

## Design Direction
- Visual style: bold editorial, warm and professional, not generic SaaS.
- Mood: calm, credible, modern, and practical.
- Typography:
  - Display: `Instrument Serif`
  - Body/UI: `Space Grotesk`
- Color direction:
  - Base: warm sand / off-white
  - Primary ink: deep blue-black
  - Accents: teal and rust
- Motion: subtle reveal-on-scroll and hover lift only.
- No profile photo in v1.

## Information Architecture
1. Hero
2. About
3. Featured Projects
4. Experience
5. Tech Stack & Certifications
6. Contact

## Copy Rules
- Keep the voice professional and warm.
- Do not paste resume bullets unchanged unless clarity requires it.
- Prefer concise web copy that emphasizes value, reliability, and practical impact.
- Lead with software engineering in the hero.
- Use ICT support experience to strengthen credibility, not replace the engineering narrative.

## Content Model
Use one centralized content object with these fields:

```js
profile: {
  name,
  headline,
  subheadline,
  location,
  summary,
  email,
  githubUrl,
  linkedinUrl,
  resumeUrl
}

projects: [{
  title,
  tagline,
  summary,
  highlights[],
  stack[],
  liveUrl,
  repoUrl,
  status
}]

experience: [{
  organization,
  role,
  location,
  dateRange,
  summary,
  highlights[]
}]

education: [{
  institution,
  award,
  dateRange,
  notes
}]

certifications: [{
  title,
  issuer,
  year
}]
```

Additional local fields are allowed for presentation helpers, such as `techStack`, `focusAreas`, or `strengths`.

## Resume-Derived Source Content
### Profile
- Name: `Caleb Mayaka`
- Headline: `Software Engineer`
- Supporting title: `ICT Support Expert`
- Location: `Nairobi, Kenya`
- Email: `mayakaombogo254@gmail.com`
- GitHub: `https://www.github.com/calebmayaka`
- LinkedIn: `https://www.linkedin.com/in/calebmayaka`
- Resume asset path: `./assets/files/caleb-mayaka-resume.pdf`

### Summary
Caleb is a computer science graduate with experience in software development, computer troubleshooting and repair, mobile phone repair, Windows and Linux installation, network setup, and advanced Microsoft Office support. He aims to build stable systems, deliver efficient IT solutions, and improve user satisfaction through continuous learning and collaboration.

### Education
- `Egerton University`
  - `Bachelor of Science in Computer Science`
  - `2020 - 2024`
  - `Second Class Honours, Upper Division`
- `Kisii School`
  - `KCSE`
  - `2016 - 2019`
  - `B+`

### Project
- `HireSphere Hiring System`
  - Job search and application platform for jobseekers and recruiters
  - Feature highlights:
    - Authentication, registration, login, password reset
    - Email notifications
    - Role-based access control
    - CRUD operations across database-backed content
    - Location-based job recommendation logic
    - Google Maps API integration

### Experience
- `KASNEB` - `ICT Intern` - `Nairobi, Kenya` - `2024 - 2025`
  - ICT customer support
  - Microsoft Dynamics troubleshooting
  - Windows/Linux/software installation
  - Hardware troubleshooting and upgrades
  - Network support
  - Computing infrastructure setup for exams
- `ICT Authority` - `Presidential Digitalent Programme - Software Dev Intern` - `Nairobi, Kenya` - `2024 - 2025`
  - Software Engineering and AI track
  - Cohort IX
- `County Assembly of Nyamira` - `ICT Attache` - `Nyamira, Kenya` - `2023`
  - Device setup
  - Hardware troubleshooting
  - Audio/visual readiness for sittings
  - Network infrastructure support
  - ICT strategic policy collaboration

### Tech Stack
- Languages/frameworks:
  - Python
  - Django
  - Django REST
  - JavaScript
  - HTML
  - CSS
  - Tailwind CSS
- Tools/platforms:
  - Git
  - GitHub
  - Docker
  - VS Code
  - XAMPP
  - Microsoft Office
  - Windows
  - Linux
- ICT support skills:
  - Computer repair
  - Mobile phone repair
  - Network setup
  - Driver installation
  - Printer troubleshooting
  - Customer support

### Certifications
- Cisco Certified Network Associate 1 - `2024`
- Cisco Computer Hardware Essentials - `2025`
- Cisco Network Support and Security - `2024`
- Cisco Digital Awareness - `2025`

## Interaction Behavior
- Sticky top navigation with in-page anchor links.
- Smooth scrolling unless reduced-motion is requested.
- Reveal-on-scroll for major content blocks.
- Active nav state should follow the section in view.
- Resume button should download/open the static PDF asset.
- Do not require JavaScript for link targets to exist, but content rendering may be JS-driven in this implementation.

## GitHub Pages Constraints
- No backend.
- No CMS.
- No runtime dependency on Tailwind CDN.
- Use only relative asset paths.
- Keep the site working under a GitHub Pages project subpath.
- Commit the static site CSS file to the repo.

## Acceptance Criteria
- One-page static portfolio is visually polished on mobile and desktop.
- Hero leads with software engineering positioning.
- About section frames ICT support as a strength, not a detour.
- HireSphere appears as the flagship project.
- Experience is concise and curated.
- Tech stack and certifications are easy to scan.
- Contact section exposes email, GitHub, LinkedIn, and resume download.
- Page is keyboard navigable and respects reduced-motion preferences.
- Another AI or engineer can implement or revise the site from this spec without needing more product decisions.
