export const siteContent = {
  profile: {
    name: "Caleb Mayaka",
    siteUrl: "https://www.calebmayaka.com/",
    roleLine: "lets build something great",
    seoTitle: "Caleb Mayaka | Software Engineer & Technical Services",
    seoDescription:
      "Caleb Mayaka is a Software Engineer providing dependable software development and practical technical services including hardware support, video editing, and graphics design.",
    ogImageUrl: "https://www.calebmayaka.com/assets/images/og-calebmayaka-1200x630.png",
    headline: "lets build something great",
    subheadline:
      "I build dependable software shaped by hands-on system admin experience and a practical understanding of how systems are used every day.",
    location: "Kenya",
    summary:
      "I design dependable web systems that are easy to run and maintain.",
    aboutMe:
      "I have been close to computers from an early age, and that curiosity grew into a practical software engineering journey. I started by building with simple tools, then moved into coding full solutions with modern web technologies. Today I focus on building useful systems, automating repetitive work, and delivering software that is dependable in real-world use. My background in hands-on system administration helps me build with both product thinking and operational reliability in mind.",
    showcaseCopy:
      "This work is presented as a focused showcase of how I think through useful systems, clean workflows, and practical implementation.",
    experienceCopy:
      "Across internships and field support roles, I have worked across software delivery, technical support, infrastructure setup, and day-to-day problem solving in real operational environments.",
    contactPitch:
      "If you need reliable technical support with clear communication and practical execution, I would love to work with you.",
    consultancyPitch:
      "I help individuals and teams build reliable systems, eliminate technical friction, and get real work done faster without unnecessary complexity.",
    primaryCtaLabel: "Email me",
    responseTimeNote: "Typical response within 24 hours.",
    terminal: {
      eyebrow: "Terminal",
      title: "Try a quick command",
      introLine: "booting caleb.exe ... practical engineering with a little personality.",
      placeholder: "Type whoami, stack, services, contact, or fun",
      promptLabel: "caleb@portfolio:~$",
      submitLabel: "Run",
      outputLabel: "Output",
      initialOutput: ["Tap a command chip or type one above to explore."],
      fallbackOutput: ["Command not found.", "Try one of these: whoami, stack, services, contact, fun."],
      commands: [
        {
          id: "whoami",
          label: "whoami",
          output: [
            "Caleb Mayaka",
            "Software Engineer.",
            "I build dependable web systems with a practical, operations-aware mindset."
          ]
        },
        {
          id: "stack",
          label: "stack",
          output: [
            "Core stack: Python, Django, JavaScript, Tailwind CSS, REST APIs.",
            "Focus areas: Django, System Admin, Workflow Automation.",
            "Also comfortable with Docker, Linux/Windows, Proxmox, and design tooling."
          ]
        },
        {
          id: "services",
          label: "services",
          output: [
            "I offer software development, hardware maintenance & IT support, video editing, graphics design, and consultancy.",
            "Best fit: practical builds, smoother workflows, and dependable technical support."
          ],
          action: {
            type: "switch-tab",
            target: "consultancy",
            label: "Work with me"
          }
        },
        {
          id: "contact",
          label: "contact",
          output: [
            "Email: mayakaombogo254@gmail.com",
            "WhatsApp: +254 798 934 667",
            "Typical response within 24 hours."
          ],
          action: {
            type: "link",
            href: "mailto:mayakaombogo254@gmail.com",
            label: "Email Caleb"
          }
        },
        {
          id: "fun",
          label: "fun",
          output: [
            "I like software that stays calm in production and still feels human to use.",
            "Also yes, I will absolutely polish a tiny interaction if it makes the page more memorable."
          ],
          action: {
            type: "easter-egg"
          }
        }
      ]
    },
    whyWorkWithMe: [
      "Outcome-focused delivery with clear timelines and practical scope.",
      "Strong mix of software engineering and hands-on technical troubleshooting.",
      "Reliable communication from first discussion to final handoff."
    ],
    strengths: [
      "Builds software with a practical eye for reliability and user needs.",
      "Moves comfortably between product work, troubleshooting, and technical support.",
      "Communicates clearly with both technical teammates and everyday users.",
      "Learns quickly and stays grounded in solving the actual problem."
    ],
    toolsLabel: "Tools I Work With",
    tools: [
      { name: "Python", iconKey: "python" },
      { name: "Django", iconKey: "framework" },
      { name: "REST APIs", iconKey: "api" },
      { name: "Git", iconKey: "git" },
      { name: "Docker", iconKey: "docker" },
      { name: "Linux/Windows", iconKey: "os" },
      { name: "Proxmox", iconKey: "server" },
      { name: "Adobe Photoshop", iconKey: "design" },
      { name: "Adobe Premiere Pro", iconKey: "video" },
      { name: "Adobe After Effects", iconKey: "motion" },
      { name: "Figma", iconKey: "figma" },
      { name: "Adobe XD", iconKey: "uiux" },
      { name: "JavaScript", iconKey: "javascript" },
      { name: "Tailwind CSS", iconKey: "css" }
    ],
    focusAreas: ["Django", "System Admin", "Workflow Automation"],
    email: "mayakaombogo254@gmail.com",
    githubUrl: "https://www.github.com/calebmayaka",
    linkedinUrl: "https://www.linkedin.com/in/calebmayaka",
    twitterUrl: "https://x.com/ombogomayaka",
    whatsappUrl: "https://wa.me/254798934667",
    resumeUrl: "./assets/files/caleb-mayaka-resume.pdf"
  },
  projects: [
    {
      title: "HireSphere Hiring System",
      tagline: "A hiring platform designed to make job discovery, posting, and recruitment workflows easier to manage.",
      summary:
        "HireSphere is a recruitment system built for both jobseekers and recruiters. It reflects my interest in products that solve clear user problems while keeping the underlying workflow practical and organized.",
      highlights: [
        "Authentication with registration, login, and email-based password reset.",
        "Role-aware access control for the different people using the system.",
        "CRUD workflows for managing jobs and related application data.",
        "Location-based recommendation logic for more relevant job discovery.",
        "Email notifications and Google Maps API integration."
      ],
      stack: ["Python", "Django", "Django REST", "JavaScript", "Tailwind CSS", "Google Maps API"],
      liveUrl: "",
      repoUrl: "",
      status: "Featured case study"
    },
    {
      title: "Torrent Download to Google Drive (Colab)",
      tagline: "A practical Python workflow for downloading torrent or magnet links straight into Google Drive using Colab.",
      summary:
        "This utility project uses Google Colab and libtorrent to run long downloads in a cloud notebook and save output directly to Drive, avoiding local machine constraints.",
      highlights: [
        "Mounts Google Drive from Colab for direct cloud storage output.",
        "Uses libtorrent for torrent and magnet download handling.",
        "Tracks progress, peers, transfer rates, and elapsed time during downloads.",
        "Built as a lightweight notebook workflow with minimal setup steps."
      ],
      stack: ["Python", "Google Colab", "libtorrent", "Google Drive"],
      liveUrl: "",
      repoUrl: "https://github.com/calebmayaka/Python-Torrent-Download-To-Google-Drive-Google-Colab",
      status: "Utility project"
    },
    {
      title: "Restaurant Website",
      tagline: "A class project website focused on a clean restaurant browsing and menu experience.",
      summary:
        "This project was built for web development coursework and demonstrates practical frontend layout work, visual styling, and interactive page behavior for a restaurant concept.",
      highlights: [
        "Built as a complete static website for coursework submission.",
        "Implements page interactions with vanilla JavaScript.",
        "Uses responsive HTML and CSS structure for web presentation."
      ],
      stack: ["HTML", "CSS", "JavaScript"],
      liveUrl: "https://calebmayaka.github.io/COMP-341-SUBMISSION/#go_to_top",
      repoUrl: "https://github.com/calebmayaka/COMP-341-SUBMISSION",
      status: "Course project"
    },
    {
      title: "FoodBankHub",
      tagline: "A platform concept centered on food support coordination and access.",
      summary:
        "FoodBankHub is presented as a practical product idea focused on improving how people discover, request, and manage food support resources.",
      highlights: [
        "Structured as a focused repository for the FoodBankHub concept.",
        "Positioned around community impact and practical access workflows."
      ],
      stack: ["Web Application", "Community Platform"],
      liveUrl: "",
      repoUrl: "https://github.com/calebmayaka/FoodBankHub",
      status: "Product concept"
    },
    {
      title: "COMP-390 Group Project",
      tagline: "Academic team project delivered as part of coursework.",
      summary:
        "A collaborative course project focused on practical implementation, team coordination, and end-to-end delivery of a working solution.",
      highlights: [
        "Built and delivered in a group setting with shared responsibilities.",
        "Applied software engineering practices from planning to implementation."
      ],
      stack: ["Academic Project", "Team Collaboration"],
      liveUrl: "",
      repoUrl: "https://github.com/calebmayaka/COMP-390-GRP-8",
      status: "Course project"
    }
  ],
  toolbox: {
    heading: "Mini tools and games",
    live: [
      {
        id: "password-generator",
        title: "Password Generator",
        summary: "Generate strong passwords with adjustable length and character sets, then copy in one click.",
        category: "Security Utility",
        url: "./tools/password-generator.html",
        ctaLabel: "Open tool"
      },
      {
        id: "typing-test",
        title: "Typing Test",
        summary: "Measure your speed and accuracy with timed passages, live metrics, and instant feedback.",
        category: "Productivity Game",
        url: "./tools/typing-test.html",
        ctaLabel: "Open tool"
      },
      {
        id: "smart-todo-list",
        title: "Smart To-Do List",
        summary: "Manage daily tasks with smart sorting, streak tracking, due-date awareness, and local-first persistence.",
        category: "Productivity Utility",
        url: "./tools/smart-todo-list.html",
        ctaLabel: "Open tool"
      },
      {
        id: "pomodoro-timer",
        title: "Pomodoro Timer",
        summary: "Run focused work sessions with short and long breaks, cycle tracking, and clear timer controls.",
        category: "Focus Utility",
        url: "./tools/pomodoro-timer.html",
        ctaLabel: "Open tool"
      },
      {
        id: "qr-code-generator",
        title: "QR Code Generator",
        summary: "Generate clean QR codes from text or URLs, then download as PNG in one click.",
        category: "Sharing Utility",
        url: "./tools/qr-code-generator.html",
        ctaLabel: "Open tool"
      },
      {
        id: "calculator",
        title: "Calculator",
        summary: "Run fast day-to-day calculations with keyboard support and clean operator controls.",
        category: "Math Utility",
        url: "./tools/calculator.html",
        ctaLabel: "Open tool"
      },
      {
        id: "color-palette-generator",
        title: "Color Palette Generator",
        summary: "Generate polished color palettes, lock favorite swatches, and copy values instantly.",
        category: "Design Utility",
        url: "./tools/color-palette-generator.html",
        ctaLabel: "Open tool"
      },
      {
        id: "snake-game",
        title: "Snake Game",
        summary: "Play a clean browser snake game with keyboard controls, score tracking, and best-score memory.",
        category: "Mini Game",
        url: "./tools/snake-game.html",
        ctaLabel: "Open tool"
      },
      {
        id: "sudoku",
        title: "Sudoku",
        summary: "Solve generated Sudoku puzzles with difficulty modes, instant checks, and solve support.",
        category: "Logic Game",
        url: "./tools/sudoku.html",
        ctaLabel: "Open tool"
      }
    ],
    planned: [
      { title: "Unit Converter", category: "Utility" },
      { title: "Markdown Previewer", category: "Productivity" },
      { title: "Memory Match", category: "Mini game" }
    ]
  },
  windowsOfficeHub: {
    navLabel: "Windows & Office",
    eyebrow: "Resource hub",
    title: "Windows & Office",
    intro:
      "Use this hub to find official Microsoft downloads, legitimate activation guidance, reinstall help, and practical troubleshooting for mainstream Windows and Office products.",
    disclaimer:
      "This hub provides official Microsoft downloads and safe support guidance only. It does not include cracks, bypass scripts, unofficial activators, or mirrored pirated downloads.",
    jumpLinks: [
      { id: "windows", label: "Windows" },
      { id: "office", label: "Office" },
      { id: "activation", label: "Activation" },
      { id: "faq", label: "FAQ" },
      { id: "troubleshooting", label: "Troubleshooting" }
    ],
    sections: [
      {
        id: "windows",
        title: "Windows Downloads",
        description: "Choose the official Microsoft download path that matches your device and reinstall goal.",
        items: [
          {
            title: "Windows 11 Download",
            summary: "Official Installation Assistant, media creation tool, and ISO access for supported devices.",
            url: "https://www.microsoft.com/en-us/software-download/windows11",
            sourceLabel: "Official Microsoft download",
            ctaLabel: "Open Windows 11 download",
            badge: "Download",
            product: "Windows 11",
            isOfficial: true,
            note: "Best starting point for clean installs, in-place upgrades, and official install media."
          },
          {
            title: "Windows 10 Download",
            summary: "Official media creation tool and reinstall guidance for Windows 10 systems.",
            url: "https://www.microsoft.com/en-us/software-download/windows10",
            sourceLabel: "Official Microsoft download",
            ctaLabel: "Open Windows 10 download",
            badge: "Download",
            product: "Windows 10",
            isOfficial: true,
            note: "Windows 10 reached end of free support on October 14, 2025, so upgrade planning matters."
          }
        ]
      },
      {
        id: "office",
        title: "Office Downloads",
        description: "Install or reinstall the Office edition that matches the license already tied to your account or device.",
        items: [
          {
            title: "Microsoft 365 / Office 2024 / Office 2021",
            summary: "Official install and reinstall guide for current Microsoft 365 plans and newer perpetual Office releases.",
            url: "https://support.microsoft.com/en-us/office/download-install-or-reinstall-microsoft-365-office-2024-or-office-2021-on-a-pc-or-mac-4414eaaf-0478-48be-9c42-23adc4716658?ms.officeurl=downloadoffice",
            sourceLabel: "Official Microsoft support",
            ctaLabel: "Open install guide",
            badge: "Install",
            product: "Microsoft 365 / Office 2024",
            isOfficial: true,
            note: "Use the Microsoft account or work account that is already linked to the purchase or subscription."
          },
          {
            title: "Office 2021 / 2019 / 2016 Reinstall",
            summary: "Official reinstall guidance for older perpetual Office versions after setup or account redemption.",
            url: "https://support.microsoft.com/en-us/office/download-and-install-or-reinstall-office-2021-office-2019-or-office-2016-7c695b06-6d1a-4917-809c-98ce43f86479",
            sourceLabel: "Official Microsoft support",
            ctaLabel: "Open reinstall guide",
            badge: "Reinstall",
            product: "Office 2021 / 2019 / 2016",
            isOfficial: true,
            note: "Office 2019 and Office 2016 reached end of support on October 14, 2025."
          },
          {
            title: "Preinstalled Office on a New PC",
            summary: "Official steps for reinstalling Office or Microsoft 365 that originally shipped with your device.",
            url: "https://support.microsoft.com/en-us/office/reinstall-office-or-microsoft-365-in-your-office-pre-installed-pc-for-personal-1499b339-3860-4d33-9511-daf96310b827",
            sourceLabel: "Official Microsoft support",
            ctaLabel: "Open preinstalled-PC guide",
            badge: "Support",
            product: "Preinstalled Office",
            isOfficial: true,
            note: "Useful when a reset or replacement PC asks you to sign in again before apps will activate."
          }
        ]
      },
      {
        id: "activation",
        title: "Activation & Licensing",
        description: "Understand the legitimate activation path before reinstalling, switching hardware, or changing editions.",
        items: [
          {
            title: "Activate Windows",
            summary: "Official guidance for digital licenses, product keys, and what activation method applies to your device.",
            url: "https://support.microsoft.com/en-us/windows/activate-windows-c39005d4-95ee-b91e-b399-2820fda32227",
            sourceLabel: "Official Microsoft support",
            ctaLabel: "Open Windows activation guide",
            badge: "Activation",
            product: "Windows",
            isOfficial: true,
            note: "You need a valid digital license or 25-character product key to activate Windows legitimately."
          },
          {
            title: "Activate Office for Windows",
            summary: "Official activation steps for Microsoft 365 and non-subscription Office on Windows devices.",
            url: "https://support.microsoft.com/en-gb/office/activate-office-5bd38f38-db92-448b-a982-ad170b1e187e",
            sourceLabel: "Official Microsoft support",
            ctaLabel: "Open Office activation guide",
            badge: "Activation",
            product: "Office",
            isOfficial: true,
            note: "Sign in with the same account that bought, redeemed, or was assigned the Office license."
          },
          {
            title: "Reactivate Microsoft 365 or Office",
            summary: "Official troubleshooting path for Office apps that install successfully but later ask to be activated again.",
            url: "https://support.microsoft.com/en-us/office/reactivate-microsoft-365-or-office-91600da9-4ff1-4807-bde4-f80d82fb7e28",
            sourceLabel: "Official Microsoft support",
            ctaLabel: "Open reactivation guide",
            badge: "Troubleshoot",
            product: "Office",
            isOfficial: true,
            note: "Best starting point after reinstalling, moving to a new PC, or seeing an unlicensed product message."
          }
        ]
      }
    ],
    faq: [
      {
        question: "Do I need a product key every time I reinstall Windows?",
        answer:
          "Not always. Many systems reactivate automatically using a digital license that is already linked to the device or to a Microsoft account."
      },
      {
        question: "Can I use these download links without already owning Windows or Office?",
        answer:
          "You can download the installation media, but legitimate activation still requires a valid license, subscription, or previously linked entitlement."
      },
      {
        question: "Which Office guide should I use if I bought a one-time version?",
        answer:
          "Use the reinstall guide for Office 2021, 2019, or 2016 after the product has been redeemed to your Microsoft account. If you are on Microsoft 365 or Office 2024, use the newer install guide."
      },
      {
        question: "Why does Microsoft ask me to sign in before Office activates?",
        answer:
          "Because modern Office licensing is usually linked to a Microsoft account or a work or school account. Signing in confirms which license belongs to you."
      },
      {
        question: "Should I still install Windows 10 in 2026?",
        answer:
          "Only when you specifically need it for hardware or compatibility reasons. Microsoft ended free Windows 10 support on October 14, 2025, so Windows 11 is the safer default when your hardware allows it."
      }
    ],
    troubleshooting: [
      {
        title: "Office install fails or hangs",
        summary: "Start with Microsoft's install troubleshooter if setup stalls, errors out, or refuses to complete.",
        url: "https://support.microsoft.com/en-us/office/troubleshoot-installing-office-35ff2def-e0b2-4dac-9784-4cf212c1f6c2",
        sourceLabel: "Official Microsoft support",
        ctaLabel: "Open install troubleshooter",
        note: "This is the safest first response before trying manual cleanup or reinstall loops."
      },
      {
        title: "Windows says it is not activated after reinstall",
        summary: "Check whether your device should be using a digital license or product key and follow Microsoft's reactivation steps.",
        url: "https://support.microsoft.com/en-us/windows/activate-windows-c39005d4-95ee-b91e-b399-2820fda32227",
        sourceLabel: "Official Microsoft support",
        ctaLabel: "Open Windows activation help",
        note: "This is especially common after major hardware changes, motherboard replacements, or clean installs."
      },
      {
        title: "Office keeps asking to activate again",
        summary: "Use Microsoft's reactivation flow when apps are installed but show unlicensed or subscription prompts.",
        url: "https://support.microsoft.com/en-us/office/reactivate-microsoft-365-or-office-91600da9-4ff1-4807-bde4-f80d82fb7e28",
        sourceLabel: "Official Microsoft support",
        ctaLabel: "Open Office reactivation help",
        note: "Usually fixed by signing in with the correct account, removing conflicting installs, or re-linking the license."
      },
      {
        title: "You cannot switch from Microsoft 365 to Office cleanly",
        summary: "Use Microsoft's cleanup and uninstall guidance before moving from a Microsoft 365 install to a perpetual Office version.",
        url: "https://support.microsoft.com/en-us/office/can-t-switch-from-microsoft-365-to-office-763112e1-969c-4bea-b9ab-66b724bf1bb1",
        sourceLabel: "Official Microsoft support",
        ctaLabel: "Open switch-version guide",
        note: "This helps avoid version conflicts that block activation or reinstall attempts."
      }
    ],
    contactCta: {
      title: "Need help with installation or activation?",
      summary:
        "If you want hands-on help choosing the right installer, reinstalling cleanly, or resolving legitimate activation issues, I can help you work through it.",
      primaryLabel: "Go to contact",
      secondaryLabel: "Email me"
    }
  },
  services: [
    {
      id: "software-development",
      title: "Software Development",
      summary: "I build dependable web applications and internal tools that streamline operations and scale with your needs.",
      forWho: [
        "Startups building MVPs or internal systems",
        "Teams replacing manual or inefficient workflows",
        "Organizations that need stable, long-term solutions"
      ],
      deliverables: [
        "Custom web features and workflow automation",
        "Secure backend systems and API integrations",
        "Clean, scalable, and deployment-ready code"
      ],
      outcome: "A reliable system that reduces manual work, improves efficiency, and supports growth.",
      tags: ["Web Apps", "APIs", "Automation"],
      tagsLabel: "Focus Areas",
      imageUrl: "./assets/images/services/software-development.jpg",
      imageAlt: "Developer working on software architecture and code on multiple screens.",
      ctaLabel: "Discuss this service",
      ctaSubject: "Software Development Inquiry",
      ctaBody: "Hi Caleb, I would like to discuss your Software Development service."
    },
    {
      id: "hardware-maintenance-repairs",
      title: "Hardware Maintenance & IT Support",
      summary: "I keep your devices, systems, and office infrastructure running reliably so your work never stops.",
      forWho: [
        "Offices experiencing frequent downtime",
        "Teams without dedicated IT support",
        "Individuals who need dependable repair and setup"
      ],
      deliverables: [
        "Full diagnostics and issue resolution",
        "Hardware repair, upgrades, and optimization",
        "System setup (Windows, Linux, networks, printers)"
      ],
      outcome: "Less downtime, longer device lifespan, and smoother day-to-day operations.",
      tags: ["Diagnostics", "Repairs", "Maintenance", "Network Setup"],
      tagsLabel: "Core Services",
      imageUrl: "./assets/images/services/hardware-repairs.jpg",
      imageAlt: "Technician repairing computer hardware on a workbench.",
      ctaLabel: "Discuss this service",
      ctaSubject: "Hardware Maintenance & Repair Inquiry",
      ctaBody: "Hi Caleb, I would like to discuss your Hardware Maintenance and Repairs service."
    },
    {
      id: "video-editing",
      title: "Video Editing",
      summary: "I create clean, engaging videos that communicate your message clearly and keep your audience watching.",
      forWho: [
        "Content creators and personal brands",
        "Businesses running campaigns or promotions"
      ],
      deliverables: [
        "Structured edits with clean pacing and flow",
        "Text overlays, captions, and visual polish",
        "Export optimized for social and web platforms"
      ],
      outcome: "Professional, engaging videos that hold attention and communicate effectively.",
      tags: ["Cuts", "Motion", "Social Exports"],
      tagsLabel: "Focus Areas",
      imageUrl: "./assets/images/services/video-editing.jpg",
      imageAlt: "Video editor timeline on screen with color grading and clip cuts.",
      ctaLabel: "Discuss this service",
      ctaSubject: "Video Editing Inquiry",
      ctaBody: "Hi Caleb, I would like to discuss your Video Editing service."
    },
    {
      id: "graphics-design",
      title: "Graphic Design",
      summary: "I design clear, consistent visuals that strengthen your brand and make your communication more effective.",
      forWho: [
        "Founders building a brand identity",
        "Teams running campaigns or social media"
      ],
      deliverables: [
        "Social media graphics and campaign assets",
        "Clean, consistent design layouts",
        "Reusable templates for ongoing content"
      ],
      outcome: "Stronger brand presence and clearer visual communication.",
      tags: ["Brand Assets", "Posters", "Social Media"],
      tagsLabel: "Focus Areas",
      imageUrl: "./assets/images/services/graphics-design.jpg",
      imageAlt: "Designer workspace showing brand colors, typography, and graphic layouts.",
      ctaLabel: "Discuss this service",
      ctaSubject: "Graphics Design Inquiry",
      ctaBody: "Hi Caleb, I would like to discuss your Graphics Design service."
    },
    {
      id: "consultancy",
      title: "Technical Consultancy",
      summary: "I help you make the right technical decisions: what to build, how to build it, and how to run it effectively.",
      forWho: [
        "Teams planning systems or digital products",
        "Individuals improving workflows or infrastructure"
      ],
      deliverables: [
        "Clear, practical technical advice",
        "Step-by-step implementation roadmap",
        "Guidance tailored to your resources and constraints"
      ],
      outcome: "Better decisions, less guesswork, and a clear path to execution.",
      tags: [],
      imageUrl: "./assets/images/services/consultancy.jpg",
      imageAlt: "Professional consultancy session discussing technical implementation strategy.",
      ctaLabel: "Discuss this service",
      ctaSubject: "Technical Consultancy Inquiry",
      ctaBody: "Hi Caleb, I would like to discuss your Consultancy service."
    }
  ],
  experience: [
    {
      organization: "KASNEB",
      role: "ICT Intern",
      location: "Kenya",
      dateRange: "2024 - 2025",
      summary:
        "Supported the daily ICT environment for staff and students, helping keep systems, devices, and exam infrastructure stable and ready for use.",
      highlights: [
        "Handled technical support across software, devices, and end-user issues.",
        "Diagnosed Microsoft Dynamics issues and restored smoother user workflows.",
        "Installed and configured Windows, Linux, and supporting software tools.",
        "Troubleshot laptops, desktops, printers, and other peripherals.",
        "Helped with network support and computing setup for computer-based exams."
      ]
    },
    {
      organization: "ICT Authority",
      role: "Presidential Digitalent Programme - Software Dev Intern",
      location: "Kenya",
      dateRange: "2024 - 2025",
      summary:
        "Selected into cohort IX of the Presidential Digitalent Programme under the Software Engineering and AI track.",
      highlights: [
        "Contributed within a recognized national internship pipeline focused on engineering growth.",
        "Deepened software engineering and AI foundations inside a structured professional setting."
      ]
    },
    {
      organization: "County Assembly of Nyamira",
      role: "ICT Attache",
      location: "Nyamira, Kenya",
      dateRange: "2023",
      summary:
        "Supported internal ICT infrastructure, device setup, and meeting readiness for day-to-day assembly operations.",
      highlights: [
        "Set up computers, laptops, and related equipment for operational use.",
        "Reduced downtime through hardware troubleshooting and printer support.",
        "Prepared audio and display systems for assembly sittings.",
        "Supported networking infrastructure for the new county assembly building.",
        "Contributed to the 2023 - 2025 ICT strategic policy review process."
      ]
    }
  ],
  education: [
    {
      institution: "Egerton University",
      award: "Bachelor of Science in Computer Science",
      dateRange: "2020 - 2024",
      notes: "Second Class Honours, Upper Division"
    },
    {
      institution: "Kisii School",
      award: "Kenya Certificate of Secondary Education",
      dateRange: "2016 - 2019",
      notes: "Grade B+"
    }
  ],
  certifications: [
    {
      title: "Cisco Certified Network Associate 1",
      issuer: "Cisco Networking Academy",
      year: "2024"
    },
    {
      title: "Cisco Computer Hardware Essentials",
      issuer: "Cisco Networking Academy",
      year: "2025"
    },
    {
      title: "Cisco Network Support and Security",
      issuer: "Cisco Networking Academy",
      year: "2024"
    },
    {
      title: "Cisco Digital Awareness",
      issuer: "Cisco Networking Academy",
      year: "2025"
    }
  ],
  techStack: [
    {
      label: "Languages and web",
      items: ["Python", "Django", "Django REST", "JavaScript", "HTML", "CSS", "Tailwind CSS"]
    },
    {
      label: "Tools and platforms",
      items: ["Git", "GitHub", "Docker", "VS Code", "XAMPP", "Windows", "Linux", "Microsoft Office"]
    },
    {
      label: "ICT capabilities",
      items: [
        "Computer repair",
        "Mobile phone repair",
        "Network setup",
        "Driver installation",
        "Printer troubleshooting",
        "Customer support"
      ]
    }
  ]
};
