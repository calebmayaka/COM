export const siteContent = {
  profile: {
    name: "Caleb Mayaka",
    siteUrl: "https://www.calebmayaka.com/",
    roleLine: "Software Engineer",
    seoTitle: "Caleb Mayaka | Software Engineer & Technical Services",
    seoDescription:
      "Caleb Mayaka is a Software Engineer providing dependable software development and practical technical services including hardware support, video editing, and graphics design.",
    ogImageUrl: "https://www.calebmayaka.com/assets/images/og-calebmayaka-1200x630.png",
    headline: "Software engineer building dependable digital experiences.",
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
