// All portfolio content lives here so the markup stays about layout.
const base = import.meta.env.BASE_URL;
const m = (f) => `${base}media/${f}`;
const img = (f) => `${base}img/${f}`;

export const profile = {
  name: 'Tuan Ahmad Wafiq',
  fullName: 'Tuan Ahmad Wafiq Bin Tuan Mahmud',
  email: 'tuanwaf02@gmail.com',
  workEmail: 'wafiq@knowledgecom.tech',
  linkedin: 'https://www.linkedin.com/in/tuan-ahmad-wafiq-7ab842356/',
  github: 'https://github.com/Tuanwaf',
  resume: `${base}docs/Wafiq-Resume.pdf`,
  location: 'Cyberjaya, Selangor, MY',
};

export const projects = [
  {
    id: 'bajetbro',
    no: '01',
    name: 'BajetBro',
    kind: 'Budgeting PWA',
    tagline: 'Budgeting that feels like a game, not homework.',
    blurb:
      'A Malaysian-flavoured budgeting app that works fully offline. Log income, spending and transfers across your banks and e-wallets, plan commitments and goals, and keep a daily streak alive with a buddy that levels up through ten tiers.',
    features: ['Offline-first (IndexedDB)', 'Streaks, freezes & tier-ups', 'Wallet stack for every bank', 'In-app update prompts'],
    stack: ['Svelte 5', 'Vite', 'Dexie', 'three.js', 'PWA'],
    url: 'https://tuanwaf.github.io/BajetBro/',
    source: 'https://github.com/Tuanwaf/BajetBro',
    icon: img('app-bajetbro.webp'),
    device: 'phone',
    accent: '#BDF0D5',
    accent2: '#FFCDB2',
    clips: [{ label: 'App tour', src: m('bajetbro.mp4'), poster: m('bajetbro-poster.webp') }],
  },
  {
    id: 'kail',
    no: '02',
    name: 'Island of Kail',
    kind: 'Educational game · Godot',
    tagline: 'Cast. Think. Catch. Explore.',
    blurb:
      'A cozy top-down fishing adventure for Malaysian primary schoolers (Darjah 1–6). Every bite is a Bahasa Melayu or English question drawn from the KSSR syllabus — answer right to land the fish, sell your catch, upgrade your rod and survive the night.',
    features: ['10 quiz formats, gated by level', 'Bilingual BM / English', 'Rods, perks, day & night cycle', 'Installable, touch-ready'],
    stack: ['Godot 4.7', 'GDScript', 'Web export', 'PWA'],
    url: 'https://island-of-kail.vercel.app',
    icon: img('app-kail.webp'),
    device: 'console',
    accent: '#B9DCFF',
    accent2: '#FFEBA6',
    pixel: true,
    clips: [
      { label: 'Gameplay', src: m('kail-play.mp4'), poster: m('kail-play-poster.webp') },
      { label: 'Title', src: m('kail-title.mp4'), poster: m('kail-title-poster.webp') },
    ],
  },
  {
    id: 'noctudite',
    no: '03',
    name: 'Noctudite',
    kind: 'Pixel platformer · Godot',
    tagline: 'A lantern, a cave, and a lot of spikes.',
    blurb:
      'A moody 2D pixel-art platformer. Guide a hooded vagabond through frozen caverns with tight movement — double jump, air-dash, coyote time — collect stars and unlock the next level.',
    features: ['Double jump & air-dash', 'Hand-built Tiled levels', 'Star rating per level', 'Plays in the browser'],
    stack: ['Godot 4.7', 'GDScript', 'Tiled', 'Web export'],
    url: 'https://noctudite.vercel.app',
    icon: img('app-noctudite.webp'),
    device: 'console',
    accent: '#CDB9FF',
    accent2: '#FFBFD9',
    pixel: true,
    clips: [
      { label: 'Gameplay', src: m('noctudite-play.mp4'), poster: m('noctudite-play-poster.webp') },
      { label: 'Title', src: m('noctudite-title.mp4'), poster: m('noctudite-title-poster.webp') },
    ],
  },
];

export const lab = {
  name: 'Kembara & Catch',
  kind: 'In the lab',
  blurb:
    'An educational creature-catching adventure where maths answers power your attacks. Tiled overworld, layered character skins and a VS-style battle screen.',
  stack: ['SvelteKit', 'TypeScript', 'Phaser 4', 'SQLite'],
};

export const training = {
  programmes: [
    {
      tag: 'Internal staff training',
      title: 'AI+ Everyone™',
      text:
        'Delivered the AI+ Everyone™ programme to internal staff at Knowledgecom — AI fundamentals, machine learning concepts, generative AI, responsible AI and prompt engineering for non-technical teams.',
      color: 'lilac',
    },
    {
      tag: 'Hands-on workshop',
      title: 'Generative AI for the Data Analyst',
      text:
        'A practical Gen AI workshop: AI-assisted data cleaning, AI-assisted reporting, Claude AI for analytics and the responsible use of generative AI at work.',
      color: 'peach',
    },
    {
      tag: 'Public programmes',
      title: 'AI Awareness & Productivity',
      text:
        'AI literacy and workplace-productivity sessions for public participants, career switchers and job seekers — from “what is AI?” to using it every day.',
      color: 'mint',
    },
  ],
  topics: [
    'AI Fundamentals',
    'Machine Learning',
    'Generative AI',
    'Responsible AI',
    'Prompt Engineering',
    'AI Productivity',
    'Claude for Analytics',
    'AI-assisted Reporting',
  ],
  audiences: [
    'Internal employees of Knowledgecom Corporation',
    'Public AI awareness & digital-skills participants',
    'Career-transition participants & job seekers',
    'Non-technical professionals adopting AI',
  ],
  tool: { name: 'AI+ Everyone™ exam simulator', url: 'https://tuanwaf.github.io/Ai-Everyone/', text: 'A practice-exam web app I built so my trainees can drill all three question sets before the real thing.' },
};

export const journey = [
  {
    when: 'Jan 2026 — Now',
    role: 'Trainer / IT Consultant',
    org: 'Knowledgecom Corporation · Petaling Jaya',
    type: 'work',
    points: [
      'Deliver AI awareness, Generative AI and workplace-productivity programmes, in person and online.',
      'Build training materials — slides, hands-on exercises, assessments and learning resources.',
      'Adapt delivery to each group’s skill level and improve content from assessment and feedback.',
    ],
  },
  {
    when: 'Aug 2026',
    role: 'HRD Corp Train-the-Trainer',
    org: 'Professional development',
    type: 'cert',
    points: ['Completed the HRD Corp TTT programme — awaiting assessment results and accreditation.'],
  },
  {
    when: 'Aug — Nov 2025',
    role: 'Digital Associates Apprentice',
    org: 'Knowledgecom Academy · Petaling Jaya',
    type: 'work',
    points: ['Designed and built a full-stack training-management mobile app with React Native and Laravel (JWT auth, OTP recovery, REST APIs).'],
  },
  {
    when: 'Mar — Jun 2025',
    role: 'Web Developer Intern',
    org: 'Tamarix Onesolutions · Cyberjaya',
    type: 'work',
    points: [
      'Built and maintained responsive client websites with HTML, CSS, JavaScript and PHP.',
      'Ran system testing and QA — UAT scripts and bug reports.',
      'Wrote technical docs, user guides and video tutorials for system delivery.',
    ],
  },
  {
    when: '2023 — 2025',
    role: 'BSc (Hons) Computer Science',
    org: 'UiTM Kuala Terengganu',
    type: 'edu',
    points: ['CGPA 3.70 · Dean’s List in 3 of 4 semesters.', 'Final year project: a video-game recommender using NMF collaborative filtering.'],
  },
  {
    when: 'Sep 2022 — Feb 2023',
    role: 'Web Developer Intern',
    org: 'JAZRO Robotic Academy · Kerteh',
    type: 'work',
    points: ['Built EduBlock — a Blockly-based site that teaches kids to code and drive the EduBot learning robot.'],
  },
  {
    when: '2021 — 2023',
    role: 'Diploma in Computer Science',
    org: 'UiTM Machang',
    type: 'edu',
    points: ['CGPA 3.85 · Vice-Chancellor’s Award · Best Student Award.'],
  },
];

export const certs = [
  { name: 'AI+ Foundation™', by: 'AI CERTs®', tone: 'lilac', mark: 'AI+' },
  { name: 'AI+ Everyone™', by: 'AI CERTs®', tone: 'peach', mark: 'AI+' },
  { name: 'AI+ Developer™', by: 'AI CERTs®', tone: 'mint', mark: 'AI+' },
  { name: 'Train-the-Trainer', by: 'HRD Corp', tone: 'butter', mark: 'TTT', pending: 'Accreditation pending' },
  { name: 'MERN Full Stack Developer', by: 'K-Youth', tone: 'sky', mark: 'MERN' },
  { name: 'The Power of Machine Learning', by: 'Python workshop', tone: 'rose', mark: 'PY' },
  { name: 'Hands-on Mobile Apps', by: 'Flutter workshop', tone: 'sky', mark: 'FL' },
  { name: 'Dynamic Web Apps', by: 'Angular workshop', tone: 'lilac', mark: 'NG' },
];

export const skills = {
  Languages: ['Python', 'JavaScript', 'TypeScript', 'Java', 'PHP', 'GDScript'],
  'Web & mobile': ['React', 'React Native', 'Svelte', 'SvelteKit', 'Node.js', 'Express', 'Flutter', 'Angular', 'HTML', 'CSS'],
  'Back end': ['Laravel', 'REST APIs', 'JWT / Sanctum', 'MySQL', 'MongoDB', 'SQLite'],
  'Games & 3D': ['Godot', 'Phaser', 'three.js', 'Tiled'],
  'AI & data': ['Generative AI', 'Prompt engineering', 'Claude', 'TensorFlow', 'scikit-learn', 'Pandas', 'OpenCV', 'MediaPipe'],
  Tools: ['Git', 'GitHub', 'Postman', 'Vite', 'Vercel', 'PWA'],
};

export const more = [
  { name: 'Training Management System', what: 'React Native · Laravel · JWT', note: 'Knowledgecom apprenticeship', tone: 'mint' },
  { name: 'EduBlock', what: 'Blockly · JavaScript', note: 'Coding for kids + EduBot', url: 'https://edublock.jazro.com.my/Jazro2/index2.html', tone: 'butter' },
  { name: 'Video Game Recommender', what: 'Python · NMF · Streamlit', note: 'Final year project', url: 'https://github.com/Tuanwaf/Video-Games-Recommender-using-NMF-Collaborative-Filtering', tone: 'lilac' },
  { name: 'Sign Language Recognition', what: 'OpenCV · MediaPipe · scikit-learn', note: 'Real-time gestures → text', url: 'https://github.com/Tuanwaf/Sign-Language-Detector-using-Python', tone: 'peach' },
  { name: 'Brain Tumor Detection', what: 'MATLAB · image processing', note: 'MRI filtering pipeline', url: 'https://github.com/Tuanwaf/Brain-Tumor-Detection-System-using-Matlab', tone: 'sky' },
  { name: 'AI+ Everyone Exam Simulator', what: 'Alpine.js · Tailwind', note: 'Practice tool for trainees', url: 'https://tuanwaf.github.io/Ai-Everyone/', tone: 'rose' },
];
