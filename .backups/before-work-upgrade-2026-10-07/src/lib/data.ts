/** Sole source of portfolio copy. Facts transcribed from resume_2026_modmed.pdf,
 * pages 1–2; URLs read from PDF annotations. Interface copy is not a biographical claim.
 * No résumé summary, professional title, home location or employment was supplied.
 */
export const PROFILE = {
  name: "Sai Shashank Vakkalanka",
  firstName: "Sai",
  displayName: "Sai Shashank",
  initials: "SS",
  role: "Computer Science and Engineering",
  email: "shashankvakkalanka@gmail.com",
  phone: "+91-986-6012-610",
  phoneHref: "tel:+919866012610",
  location: null,
  resumeSummary: null,
  github: "https://github.com/SaiShashank-10",
  linkedin: "https://www.linkedin.com/in/vakkalanka-sai-shashank/",
  website: "https://shashhh-folio.vercel.app",
  resume: "/resume.pdf",
  degree: "B.Tech. CSE",
  institute: "Gokaraju Rangaraju Institute of Engineering and Technology",
  years: "2023–2027",
  graduation: "2027",
  cgpa: "8.73",
  aboutLine: "B.Tech. CSE · 2023–2027",
  aboutDetail: "Gokaraju Rangaraju Institute of Engineering and Technology",
  quote: "Building technical solutions for real-world problems.",
  quoteSource:
    "Paraphrased from the Internal Smart India Hackathon recognition.",
  portraitAlt:
    "Animated avatar of Sai Shashank, extracted from the supplied introduction video.",
  videoText:
    "Animated self-introduction by Sai Shashank Vakkalanka. His résumé details follow on this page.",
} as const;

export const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
] as const;

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  dates: string;
  description: string;
  features: string[];
  tech: string[];
  github: string;
  illustration: "network" | "library" | "audio" | "agriculture" | "hotel";
};
export const PROJECTS: Project[] = [
  {
    id: "devpool",
    index: "01",
    title: "DevPool",
    kicker: "Unified Platform Connecting Tech Enthusiasts",
    dates: "Jan. 2026 – April 2026",
    description:
      "Analyzed industry hiring and experience gaps by engineering a unified triple-role React/Node.js ecosystem, uniting AI portfolio vetting with shadow learning.",
    features: [
      "MediaPipe biometric telemetry",
      "Cloudinary video proof-of-work",
      "93.2% tracking precision",
      "100% commit integrity",
      "Safe code execution sandboxes",
      "Recruitment and mentorship",
    ],
    tech: [
      "React.js",
      "Node.js",
      "FastAPI",
      "PostgreSQL",
      "Supabase",
      "Cloudflare Workers",
      "Cerebras AI",
      "MediaPipe",
      "Cloudinary",
      "Monaco Editor",
    ],
    github: "https://github.com/SaiShashank-10/devpool_26",
    illustration: "network",
  },
  {
    id: "genlib",
    index: "02",
    title: "Gen-Lib",
    kicker: "Flutter – Dart Project",
    dates: "June 2025 – August 2025",
    description:
      "Analyzed manual library bottlenecks to build a centralized system solving inventory, user automation, and penalty tracking gaps.",
    features: [
      "Role-based Flutter/Firebase architecture",
      "QR state transitions",
      "On-device ML",
      "Real-time data consistency",
      "Automated checkouts",
      "Secure fine collections",
    ],
    tech: ["Flutter", "Firebase", "Dart", "Razorpay API"],
    github: "https://github.com/SaiShashank-10/libraryqr",
    illustration: "library",
  },
  {
    id: "pixelpulse",
    index: "03",
    title: "PixelPulse",
    kicker: "AI Story Song Suggester",
    dates: "Nov. 2025 – Dec. 2025",
    description:
      "Analyzed multimodal inputs using YOLOv8 and OpenAI CLIP to extract semantic features, enabling highly accurate visual-to-audio mapping.",
    features: [
      "Decoupled microservice architecture",
      "FastAPI ML inference",
      "Interactive Streamlit client",
      "Zero-touch Spotify recommendations",
    ],
    tech: [
      "Python",
      "FastAPI",
      "Streamlit",
      "Hugging Face (ViT)",
      "OpenCV",
      "Spotipy",
      "Scikit-learn",
      "Plotly",
    ],
    github: "https://github.com/SaiShashank-10/pixelpulse-frontend",
    illustration: "audio",
  },
  {
    id: "nethra",
    index: "04",
    title: "Nethra",
    kicker: "Intelligent AgTech Platform",
    dates: "Nov. 2025 – Dec. 2025",
    description:
      "Analyzed fragmented agricultural workflows to build a unified platform solving real-time crop diagnosis, market discovery, and equipment rental gaps.",
    features: [
      "On-device ML",
      "Geolocation",
      "Biometric authentication",
      "Data-driven yield predictability",
      "Localized Mandi API integrations",
      "Secure rentals",
    ],
    tech: [
      "Flutter",
      "Dart",
      "Computer Vision (YOLO/TF)",
      "Geolocation",
      "Local Auth",
      "REST APIs",
    ],
    github: "https://github.com/SaiShashank-10/Nethra_mobile",
    illustration: "agriculture",
  },
  {
    id: "hotel",
    index: "05",
    title: "Hotel Management System",
    kicker: "Java GUI Application",
    dates: "Sept. 2024 – Oct. 2024",
    description:
      "Analyzed manual administration bottlenecks to build an end-to-end Java application solving booking, billing, and record gaps.",
    features: [
      "Role-based access control",
      "Workflow data protection",
      "Secure authentication",
      "Real-time record-keeping",
    ],
    tech: ["Java", "Apache NetBeans", "GUI frameworks"],
    github: "https://github.com/SaiShashank-10/Hotel_Mgmt",
    illustration: "hotel",
  },
];

export type SkillGroup = { family: string; skills: string[] };
export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Languages",
    skills: ["Java", "C", "Python", "SQL", "Dart", "JavaScript"],
  },
  {
    family: "Frontend",
    skills: ["HTML", "CSS", "React.js", "Flutter", "Next.js", "Streamlit"],
  },
  {
    family: "Backend",
    skills: [
      "Firebase",
      "FastAPI",
      "Node.js",
      "Supabase",
      "Cloudflare Workers",
      "Razorpay API",
    ],
  },
  { family: "Databases", skills: ["PostgreSQL"] },
  {
    family: "Tools",
    skills: [
      "Visual Studio Code",
      "Git",
      "GitHub Actions",
      "Canva",
      "Hugging Face Spaces",
      "Cloudinary",
      "Monaco Editor",
      "Apache NetBeans",
      "Plotly",
      "Spotipy",
    ],
  },
  {
    family: "AI & ML",
    skills: [
      "Computer Vision",
      "Agentic AI",
      "Cerebras AI",
      "MediaPipe",
      "YOLOv8",
      "OpenAI CLIP",
      "Hugging Face (ViT)",
      "OpenCV",
      "Scikit-learn",
      "On-device ML",
      "Computer Vision (YOLO/TF)",
    ],
  },
  {
    family: "Concepts",
    skills: ["REST APIs", "Geolocation", "Local Auth", "GUI frameworks"],
  },
  {
    family: "People",
    skills: [
      "Event Management",
      "Teamwork",
      "Effective Communication",
      "Leadership",
    ],
  },
];
const SYMBOLS: Record<string, string> = {
  Java: "Ja",
  C: "C",
  Python: "Py",
  SQL: "Sq",
  Dart: "Da",
  JavaScript: "Js",
  HTML: "Ht",
  CSS: "Cs",
  "React.js": "Re",
  Flutter: "Fl",
  "Next.js": "Nx",
  Firebase: "Fb",
  FastAPI: "Fa",
  "Node.js": "No",
  PostgreSQL: "Pg",
  "Visual Studio Code": "Vs",
  "GitHub Actions": "Gh",
  "Computer Vision": "Cv",
  "Agentic AI": "Ai",
  "REST APIs": "Ap",
};
export const SKILLS = SKILL_GROUPS.flatMap((group) =>
  group.skills.map((name) => ({
    name,
    family: group.family,
    symbol: SYMBOLS[name] ?? name.replace(/[^a-zA-Z]/g, "").slice(0, 2),
  })),
).map((skill, index) => ({ ...skill, number: index + 1 }));
export const skillProjects = (name: string) =>
  PROJECTS.filter(
    (p) =>
      p.tech.includes(name) ||
      (name === "Computer Vision" && p.id === "nethra") ||
      (name === "On-device ML" && ["genlib", "nethra"].includes(p.id)) ||
      (["YOLOv8", "OpenAI CLIP"].includes(name) && p.id === "pixelpulse"),
  );

export type TimelineEntry = {
  date: string;
  sort: number;
  title: string;
  place: string;
  detail: string;
  kind: "Education" | "Community";
};
export const EDUCATION: TimelineEntry[] = [
  {
    date: "2021",
    sort: 2021,
    title: "Secondary",
    place: "Genesis International School",
    detail: "CGPA: 8.0",
    kind: "Education",
  },
  {
    date: "2021–2023",
    sort: 2021.1,
    title: "Senior Secondary",
    place: "Sri Chaitanya Jr College",
    detail: "95.4%",
    kind: "Education",
  },
  {
    date: "2023–2027",
    sort: 2023,
    title: "B.Tech. CSE",
    place: PROFILE.institute,
    detail: "CGPA: 8.73",
    kind: "Education",
  },
];
export const EXPERIENCE: TimelineEntry[] = [
  {
    date: "July 2024 – Present",
    sort: 2024.07,
    title: "L1 Coordinator",
    place: "Street Cause Hyderabad (GRIET)",
    detail:
      "Serving as L1 Coordinator at Street Cause GRIET, leading large-scale social initiatives across Gadwal, Mulugu, and Jangaon, including educational support, resource distribution, and the successful execution of RFC 11 by overseeing logistics, pass sales, and participant coordination.",
    kind: "Community",
  },
  {
    date: "Oct. 2024 – Present",
    sort: 2024.1,
    title: "Logistics Member",
    place: "Google Developer Groups on Campus – GRIET",
    detail:
      "Supported the planning and execution of technical events and workshops by managing logistics, coordination, and on-site operations.",
    kind: "Community",
  },
  {
    date: "Oct. 2024 – Present",
    sort: 2024.11,
    title: "Logistics Member",
    place: "X Kernel Coding Club, GRIET",
    detail:
      "Organized X-Kernel Coding Club’s flagship tech event at GRIET, managing logistics, scheduling, and real-time operations for 150+ participants, ensuring smooth execution and effective cross-team coordination.",
    kind: "Community",
  },
];
export const TIMELINE = [...EDUCATION, ...EXPERIENCE].sort(
  (a, b) => a.sort - b.sort,
);
export const CERTIFICATIONS = [
  {
    title: "Data Analytics with Python",
    issuer: "NPTEL",
    distinction: "Elite · 78%",
    date: "May 2026",
  },
  {
    title: "Data Science for Engineers",
    issuer: "NPTEL",
    distinction: "Elite · 67%",
    date: "September 2025",
  },
  {
    title: "AI Foundations Associate",
    issuer: "Oracle",
    distinction: "",
    date: "August 2025",
  },
] as const;
export const ACHIEVEMENTS = [
  {
    title: "Internal Smart India Hackathon",
    caption: "1st Prize Winner",
    detail: "O Bug Squad Team · GRIET",
    date: "Sept. 2025",
    value: 1,
    suffix: "st",
    label: "1st Prize Winner — Internal Smart India Hackathon (SIH)",
    description:
      "Secured 1st place on campus by building a technical solution for a real-world problem.",
    icon: "trophy",
  },
  {
    title: "Hack Your Path 7.0",
    caption: "Top 12 Finalist",
    detail: "Team Chakravyuh · HITAM Hyderabad",
    date: "Feb. 2026",
    value: 12,
    suffix: "",
    label: "Top 12 Finalist — Hack Your Path 7.0",
    description:
      "Ranked in the Top 12 of 300+ teams at a 24-hour national hackathon for developing an innovative tech solution.",
    icon: "laurel",
  },
] as const;

export const COPY = {
  improvements: {
    featured: "Selected projects",
    viewProject: "Explore",
    previousProject: "Previous project",
    nextProject: "Next project",
    skillDetails: "Details ↓",
    skillHint: "Hover, tap or use the arrow keys to explore.",
    galleryHint: "Hover a panel, or use the arrows to explore.",
    emailAction: "Send an email ↗",
    contactNote: "Email, call, or find me on GitHub and LinkedIn.",
  },
  hero: {
    headingStart: "Sai Shashank",
    headingEnd: "Vakkalanka",
    subtitle: "Computer Science And Engineering",
    eyebrow: "B.Tech. CSE / 2023–2027",
    explore: "Explore work",
    contact: "Let’s talk",
    resume: "Résumé ↓",
    scroll: "Scroll to discover",
    note: "Code. Community. Curiosity.",
  },
  sections: {
    about: {
      index: "01",
      tag: "A little introduction",
      title: "The person behind the",
      accent: "work.",
    },
    skills: {
      index: "02",
      tag: "The toolkit",
      title: "A periodic table of my",
      accent: "stack.",
    },
    work: {
      index: "03",
      tag: "Selected work",
      title: "Ideas, made",
      accent: "real.",
    },
    certifications: {
      index: "04",
      tag: "Certifications",
      title: "Always",
      accent: "learning.",
    },
    experience: {
      index: "05",
      tag: "Education & community",
      title: "A path in",
      accent: "progress.",
    },
    achievements: {
      index: "06",
      tag: "Awards & recognitions",
      title: "A few",
      accent: "milestones.",
    },
    contact: {
      index: "07",
      tag: "Get in touch",
      title: "Let’s build",
      accent: "something together.",
    },
  },
  about: {
    community: "L1 Coordinator · Street Cause",
    greeting: "Hi, I’m",
    quickFacts: "At a glance",
    front: "Front",
    reverse: "Reverse",
    swing: "Swing the ID card",
    drag: "Drag to swing the ID card, or use the arrow keys",
    controls: "ID card controls",
    flip: "Flip to get to know me",
    back: "What I am",
    found: "If found, say hello",
    badge: "DEVELOPER ID",
    signature: "Sai Shashank",
    facts: [
      "B.Tech. CSE · CGPA 8.73",
      "DevPool · Gen-Lib · PixelPulse",
      "Nethra · Hotel Management System",
      "1st Prize · Internal SIH",
      "Top 12 · Hack Your Path 7.0",
    ],
  },
  skills: {
    closeDialog: "Close skill details",
    selectionHint: "Hover to preview · Click or press Enter for details · Arrow keys to explore",
    pinned: "Pinned element",
    preview: "Preview",
    pin: "Pin",
    unpin: "Unpin",
    pinLabel: "Pin selected skill",
    unpinLabel: "Unpin selected skill",
    inventory: "The stack, at a glance",
    elements: "elements",
    families: "families",
    documentation: "Read documentation",
    resource: "Learning resource",
    newTab: "opens in a new tab",
    all: "All elements",
    hint: "Hover, focus or tap an element to explore.",
    used: "In the work",
    empty: "Listed in the résumé skill set.",
    label: "Selected element",
  },
  work: {
    github: "View on GitHub ↗",
    illustrative: "Illustrative UI",
    count: "projects",
    expand: "Explore project",
    ui: {
      network: ["Portfolio vetting", "Shadow learning", "Proof-of-work"],
      library: ["Inventory", "QR checkout", "Fine collections"],
      audio: ["Media upload", "Visual-to-audio", "Spotify recommendations"],
      agriculture: ["Crop diagnosis", "Market discovery", "Equipment rentals"],
      hotel: ["Booking", "Billing", "Records"],
    },
  },
  certifications: { count: "certifications · a continuing curiosity" },
  timeline: {
    next: "Next",
    invitation: "Your team?",
    link: "Let’s talk ↗",
    navigate: "Explore the path",
    chapter: "Current chapter",
  },
  achievements: {
    end: "and counting →",
    hint: "Scroll to explore",
    previous: "Previous achievement",
    next: "Next achievement",
  },
  contact: {
    copy: "Copy",
    copied: "Copied ✓",
    failed: "Couldn’t copy. Select the email to copy it.",
    badge: "SAY HELLO · SAY HELLO · ",
    top: "Back to top ↑",
    built: "Built with Next.js",
  },
  ui: {
    skip: "Skip to content",
    menu: "Menu",
    close: "Close",
    resume: "Résumé",
    github: "GitHub",
    linkedin: "LinkedIn",
    mute: "Mute introduction",
    unmute: "Play introduction with sound",
    pause: "Pause introduction",
    play: "Play introduction",
    degree: "Degree",
    score: "CGPA",
    graduation: "Class of",
    email: "Email",
    education: "Education",
    community: "Community",
    nav: "Main navigation",
  },
} as const;


export const HERO_TICKER = {
  label: "Selected highlights",
  pause: "Pause scrolling highlights",
  resume: "Resume scrolling highlights",
  items: [
    ...PROJECTS.slice(0, 4).map(project => ({ label: project.title, kind: "Project" })),
    { label: "1st Prize — Internal SIH", kind: "Recognition" },
    { label: "Top 12 — Hack Your Path 7.0", kind: "Recognition" },
    { label: COPY.about.community, kind: "Community" },
  ],
} as const;


// External learning references requested separately from resume content.
export type SkillDocumentation = { url: string; provider: string; kind: "docs" | "resource" };
export const SKILL_DOCS: Record<string, SkillDocumentation> = {
  "Java": {
    "url": "https://dev.java/learn/",
    "provider": "Dev.java",
    "kind": "docs"
  },
  "C": {
    "url": "https://www.gnu.org/software/c-intro-and-ref/manual/c-intro-and-ref.html",
    "provider": "GNU",
    "kind": "docs"
  },
  "Python": {
    "url": "https://docs.python.org/3/",
    "provider": "Python",
    "kind": "docs"
  },
  "SQL": {
    "url": "https://www.postgresql.org/docs/current/tutorial-sql.html",
    "provider": "PostgreSQL",
    "kind": "resource"
  },
  "Dart": {
    "url": "https://dart.dev/guides",
    "provider": "Dart",
    "kind": "docs"
  },
  "JavaScript": {
    "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    "provider": "MDN Web Docs",
    "kind": "docs"
  },
  "HTML": {
    "url": "https://developer.mozilla.org/en-US/docs/Web/HTML",
    "provider": "MDN Web Docs",
    "kind": "docs"
  },
  "CSS": {
    "url": "https://developer.mozilla.org/en-US/docs/Web/CSS",
    "provider": "MDN Web Docs",
    "kind": "docs"
  },
  "React.js": {
    "url": "https://react.dev/learn",
    "provider": "React",
    "kind": "docs"
  },
  "Flutter": {
    "url": "https://docs.flutter.dev/",
    "provider": "Flutter",
    "kind": "docs"
  },
  "Next.js": {
    "url": "https://nextjs.org/docs",
    "provider": "Next.js",
    "kind": "docs"
  },
  "Streamlit": {
    "url": "https://docs.streamlit.io/",
    "provider": "Streamlit",
    "kind": "docs"
  },
  "Firebase": {
    "url": "https://firebase.google.com/docs",
    "provider": "Firebase",
    "kind": "docs"
  },
  "FastAPI": {
    "url": "https://fastapi.tiangolo.com/",
    "provider": "FastAPI",
    "kind": "docs"
  },
  "Node.js": {
    "url": "https://nodejs.org/docs/latest/api/",
    "provider": "Node.js",
    "kind": "docs"
  },
  "Supabase": {
    "url": "https://supabase.com/docs",
    "provider": "Supabase",
    "kind": "docs"
  },
  "Cloudflare Workers": {
    "url": "https://developers.cloudflare.com/workers/",
    "provider": "Cloudflare",
    "kind": "docs"
  },
  "Razorpay API": {
    "url": "https://razorpay.com/docs/api/",
    "provider": "Razorpay",
    "kind": "docs"
  },
  "PostgreSQL": {
    "url": "https://www.postgresql.org/docs/current/",
    "provider": "PostgreSQL",
    "kind": "docs"
  },
  "Visual Studio Code": {
    "url": "https://code.visualstudio.com/docs",
    "provider": "Visual Studio Code",
    "kind": "docs"
  },
  "Git": {
    "url": "https://git-scm.com/doc",
    "provider": "Git",
    "kind": "docs"
  },
  "GitHub Actions": {
    "url": "https://docs.github.com/en/actions",
    "provider": "GitHub",
    "kind": "docs"
  },
  "Canva": {
    "url": "https://www.canva.com/help/",
    "provider": "Canva",
    "kind": "docs"
  },
  "Hugging Face Spaces": {
    "url": "https://huggingface.co/docs/hub/spaces",
    "provider": "Hugging Face",
    "kind": "docs"
  },
  "Cloudinary": {
    "url": "https://cloudinary.com/documentation",
    "provider": "Cloudinary",
    "kind": "docs"
  },
  "Monaco Editor": {
    "url": "https://microsoft.github.io/monaco-editor/docs.html",
    "provider": "Microsoft",
    "kind": "docs"
  },
  "Apache NetBeans": {
    "url": "https://netbeans.apache.org/tutorial/main/kb/docs/",
    "provider": "Apache",
    "kind": "docs"
  },
  "Plotly": {
    "url": "https://plotly.com/python/",
    "provider": "Plotly",
    "kind": "docs"
  },
  "Spotipy": {
    "url": "https://spotipy.readthedocs.io/en/2.25.1/",
    "provider": "Spotipy",
    "kind": "docs"
  },
  "Computer Vision": {
    "url": "https://docs.opencv.org/4.x/d9/df8/tutorial_root.html",
    "provider": "OpenCV",
    "kind": "resource"
  },
  "Agentic AI": {
    "url": "https://huggingface.co/learn/agents-course/unit0/introduction",
    "provider": "Hugging Face",
    "kind": "resource"
  },
  "Cerebras AI": {
    "url": "https://inference-docs.cerebras.ai/",
    "provider": "Cerebras",
    "kind": "docs"
  },
  "MediaPipe": {
    "url": "https://ai.google.dev/edge/mediapipe/solutions/guide",
    "provider": "Google AI Edge",
    "kind": "docs"
  },
  "YOLOv8": {
    "url": "https://docs.ultralytics.com/models/yolov8/",
    "provider": "Ultralytics",
    "kind": "docs"
  },
  "OpenAI CLIP": {
    "url": "https://github.com/openai/CLIP",
    "provider": "OpenAI",
    "kind": "docs"
  },
  "Hugging Face (ViT)": {
    "url": "https://huggingface.co/docs/transformers/model_doc/vit",
    "provider": "Hugging Face",
    "kind": "docs"
  },
  "OpenCV": {
    "url": "https://docs.opencv.org/4.x/",
    "provider": "OpenCV",
    "kind": "docs"
  },
  "Scikit-learn": {
    "url": "https://scikit-learn.org/stable/user_guide.html",
    "provider": "Scikit-learn",
    "kind": "docs"
  },
  "On-device ML": {
    "url": "https://ai.google.dev/edge/litert",
    "provider": "Google AI Edge",
    "kind": "resource"
  },
  "Computer Vision (YOLO/TF)": {
    "url": "https://www.tensorflow.org/tutorials/images",
    "provider": "TensorFlow",
    "kind": "resource"
  },
  "REST APIs": {
    "url": "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design",
    "provider": "Microsoft Learn",
    "kind": "resource"
  },
  "Geolocation": {
    "url": "https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API",
    "provider": "MDN Web Docs",
    "kind": "resource"
  },
  "Local Auth": {
    "url": "https://pub.dev/packages/local_auth",
    "provider": "Flutter",
    "kind": "resource"
  },
  "GUI frameworks": {
    "url": "https://docs.flutter.dev/ui",
    "provider": "Flutter",
    "kind": "resource"
  },
  "Event Management": {
    "url": "https://www.eventbrite.com/resources/event-planning/checklist/",
    "provider": "Eventbrite",
    "kind": "resource"
  },
  "Teamwork": {
    "url": "https://www.skillsyouneed.com/ips/team-working.html",
    "provider": "SkillsYouNeed",
    "kind": "resource"
  },
  "Effective Communication": {
    "url": "https://www.skillsyouneed.com/ips/communication-skills.html",
    "provider": "SkillsYouNeed",
    "kind": "resource"
  },
  "Leadership": {
    "url": "https://www.skillsyouneed.com/leadership-skills.html",
    "provider": "SkillsYouNeed",
    "kind": "resource"
  }
};

