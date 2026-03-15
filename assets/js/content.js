export const siteContent = {
  profile: {
    name: "Caleb Mayaka",
    roleLine: "Software Engineer",
    headline: "Software engineer building dependable digital experiences.",
    subheadline:
      "I build dependable software shaped by hands-on system admin experience and a practical understanding of how systems are used every day.",
    location: "Kenya",
    summary:
      "I design dependable web systems that are easy to run and maintain.",
    showcaseCopy:
      "This work is presented as a focused showcase of how I think through useful systems, clean workflows, and practical implementation.",
    experienceCopy:
      "Across internships and field support roles, I have worked across software delivery, technical support, infrastructure setup, and day-to-day problem solving in real operational environments.",
    contactPitch:
      "If you are looking for someone who can contribute to software work while understanding the systems and support reality around it, I would love to connect.",
    strengths: [
      "Builds software with a practical eye for reliability and user needs.",
      "Moves comfortably between product work, troubleshooting, and technical support.",
      "Communicates clearly with both technical teammates and everyday users.",
      "Learns quickly and stays grounded in solving the actual problem."
    ],
    focusAreas: ["Django", "System Admin", "Workflow Automation"],
    email: "mayakaombogo254@gmail.com",
    githubUrl: "https://www.github.com/calebmayaka",
    linkedinUrl: "https://www.linkedin.com/in/calebmayaka",
    twitterUrl: "https://x.com/ombogomayaka",
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
