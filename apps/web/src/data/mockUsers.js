/**
 * @file mockUsers.js
 * @project Project CHOWKI — Campus Outbreak Surveillance System
 * @author Synthreaper | github.com/synthreaper/chowki
 * @description Role-based mock credentials and persona profiles with strictly unique permissions
 * @lastModified 2026-08-22
 */

export const MOCK_USERS = [
  {
    id: 'judge',
    email: 'judge@hackathon.ai',
    password: 'password123',
    name: 'Prof. Ananya Sen',
    title: 'Hackathon Grand Jury & AI Auditor',
    role: 'judge',
    roleLabel: 'Grand Jury Panel',
    badgeClass: 'badge-lavender',
    emoji: '⚖️',
    clearance: 'Full Algorithmic Transparency',
    defaultTab: 'simulator',
    allowedTabs: ['simulator', 'radar', 'investigation', 'commander', 'warden', 'mess', 'student', 'dpdp'],
    organization: 'Hacks 11 Evaluation Committee',
    avatarBg: '#EBE9FE',
    avatarColor: '#59569D',
    summary: 'Audit Poisson STPSS (N=999) scan statistics, Bayesian posterior vectors, and DPDP Act 2023 zero-knowledge compliance.',
    keyCapabilities: [
      'Scenario A vs Scenario B Live Mathematical Truth Table',
      'Space-Time Permutation Monte Carlo Verification (p < 0.05)',
      '17 Pytest Unit Tests & 90% Code Coverage Inspector',
      'Universal Stakeholder View Access & Telemetry Override'
    ]
  },
  {
    id: 'cmo',
    email: 'cmo@chowki.ac.in',
    password: 'password123',
    name: 'Dr. Rajesh Varma, MD',
    title: 'Chief Medical Officer (CMO)',
    role: 'cmo',
    roleLabel: 'Institutional Commander',
    badgeClass: 'badge-crimson',
    emoji: '👨‍⚕️',
    clearance: 'Level 4 Incident Commander',
    defaultTab: 'radar',
    allowedTabs: ['radar', 'investigation', 'commander', 'simulator', 'dpdp'],
    organization: 'Campus Health & Medical Center',
    avatarBg: '#FFE4E6',
    avatarColor: '#BA1A1A',
    summary: 'Spatiotemporal epidemic surveillance, outbreak confirmation, mass containment protocols, and certified medical dossier signing.',
    keyCapabilities: [
      'Live 24h Outbreak Spatial Radar & Floor Blueprints',
      'Cross-Tabulation Exposure Odds Ratio Matrix (OR=14.2)',
      '1-Click Food Lockdown & RO Shock Chlorination Powers',
      'Download Certified CMO Incident Dossier (.md)'
    ]
  },
  {
    id: 'warden',
    email: 'warden@chowki.ac.in',
    password: 'password123',
    name: 'Suresh Patil',
    title: 'Senior Hostel Warden (Block C)',
    role: 'warden',
    roleLabel: 'Ground Operations',
    badgeClass: 'badge-amber',
    emoji: '👨‍✈️',
    clearance: 'Level 2 Floor Warden',
    defaultTab: 'warden',
    allowedTabs: ['warden', 'radar'],
    organization: 'Hostel Administration & Welfare',
    avatarBg: '#FEF3C7',
    avatarColor: '#92400E',
    summary: 'Corridor-level resident welfare, live student pulse queue, room isolation tracking, doorstep ORS distribution, and field chlorine strip logging.',
    keyCapabilities: [
      'Live Resident Pulse Inflow Queue (Room 302-306)',
      'Doorstep WHO-ORS Hydration Delivery Checklist',
      'On-Ground Field Chlorine Test Strip Logger',
      'Direct Emergency Escalation to Medical Center'
    ]
  },
  {
    id: 'mess',
    email: 'mess@chowki.ac.in',
    password: 'password123',
    name: 'Chef Harish Mehra',
    title: 'Executive Chef & HACCP Lead',
    role: 'mess',
    roleLabel: 'Dining & HACCP Lead',
    badgeClass: 'badge-lime',
    emoji: '🍽️',
    clearance: 'Level 2 Kitchen Hazard Lead',
    defaultTab: 'mess',
    allowedTabs: ['mess', 'radar'],
    organization: 'Dining Services & Food Safety Board',
    avatarBg: '#F4FDE2',
    avatarColor: '#364B00',
    summary: 'Real-time bain-marie and cold holding temperature logs, dish contamination hazard scores, 1-click batch quarantine, and supplier hygiene auditing.',
    keyCapabilities: [
      'Bain-Marie (>65°C) & Cold Storage (<4°C) Telemetry',
      'Dish Risk Multiplier Index (Paneer vs Rice vs Dal)',
      '1-Click Raw Material & Recipe Quarantine Action',
      'Supplier QA Inspection Ledger'
    ]
  },
  {
    id: 'student',
    email: 'student@chowki.ac.in',
    password: 'password123',
    name: 'Aarav Sharma',
    title: 'Student Resident (Room 304, Block C)',
    role: 'student',
    roleLabel: 'Campus Resident',
    badgeClass: 'badge-lavender',
    emoji: '🎓',
    clearance: 'DPDP Data Principal',
    defaultTab: 'student',
    allowedTabs: ['student', 'dpdp'],
    organization: 'B.Tech Computer Science (3rd Year)',
    avatarBg: '#F2EEFF',
    avatarColor: '#6865AD',
    summary: '15-second bilingual symptom self-pulse, personal dehydration risk calculation, nearest ORS dispenser map, and DPDP Act Section 8(7) consent shredder.',
    keyCapabilities: [
      '15-Second Zero-Friction Hindi/English Health Pulse',
      'Personal Dehydration & Clinical Risk Calculator',
      'Campus Free ORS Dispenser & Dispensary Map',
      'DPDP Act Section 8(7) Instant Data Shredder'
    ]
  }
];

export const getPersonaById = (id) => {
  return MOCK_USERS.find((u) => u.id === id) || MOCK_USERS[0];
};

export const authenticateMockUser = (email, password) => {
  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (user && (password === 'password123' || password.length >= 4)) {
    return { success: true, user };
  }
  return { success: false, error: 'Invalid credentials. Use any of the pre-filled mock credentials.' };
};
