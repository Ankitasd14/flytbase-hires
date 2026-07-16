export type RoleStat = {
  label: string
  value: string
}

export type RoleIconId = 'swords' | 'megaphone' | 'palette' | 'shield'

export type Role = {
  slug: string
  name: string
  className: string
  tags: string[]
  description: string
  accent: string
  icon: RoleIconId
  stats: RoleStat[]
  details: {
    summary: string
    bullets: string[]
    schedule: string
  }
  outcomes: string[]
}

/** Shared track outcomes — same prize story across open + waitlist classes. */
export const sharedOutcomes = [
  'Win the track, get hired at FlytBase — no further rounds, no additional interviews.',
  'Direct evaluation from FlytBase operators, live, on your actual work.',
  'A portfolio-ready case study from a real one-day sprint — not a hypothetical.',
  "Visibility with the team hiring for this role, win or not — this isn't your only shot at FlytBase.",
]

export const roles: Role[] = [
  {
    slug: 'business-development',
    name: 'Business Development',
    className: 'Deal Duelist',
    tags: ['OUTREACH', 'PIPELINE', 'CLOSE'],
    description:
      'Spark conversations, read signals fast, and duel your way from cold lead to warm demo.',
    accent: '#ffcc00',
    icon: 'swords',
    stats: [
      { label: 'SPEED', value: '+11' },
      { label: 'GRIT', value: '+14' },
    ],
    details: {
      summary:
        'A live BD sprint where you hunt accounts, craft outreach, and pitch like the deal depends on it — because it does.',
      bullets: [
        'Problem statement drops live at 9:00 AM — no pre-reads, no head starts',
        'Build your outbound + inbound infra end-to-end before the clock runs out',
        'Live judging as you go — bring your reasoning, not just your output',
        "Submissions lock at 5:00 PM sharp — what's shipped is what's judged",
      ],
      schedule: 'Virtual · Sat, 25 July · 10:00–18:00 IST',
    },
    outcomes: sharedOutcomes,
  },
  {
    slug: 'marketing',
    name: 'Marketing',
    className: 'Marketing Mage',
    tags: ['DEMAND', 'CONTENT', 'BRAND'],
    description:
      'Cast spells that scale attention — campaigns, hooks, and narratives that actually convert.',
    accent: '#d64161',
    icon: 'megaphone',
    stats: [
      { label: 'REACH', value: '+12' },
      { label: 'CREATIVITY', value: '+10' },
    ],
    details: {
      summary:
        'A campaign craft-a-thon: invent a launch narrative for FlytBase Campus Connect and prove you can move minds in a day.',
      bullets: [
        'Define audience, hook, and channel mix for a campus push',
        'Write landing copy + social snippets in our voice',
        'Design a one-page teaser concept (Figma or slides OK)',
        'Defend your funnel math in a 5-minute pitch',
      ],
      schedule: 'Virtual · Sat, 25 July · 10:00–18:00 IST',
    },
    outcomes: sharedOutcomes,
  },
  {
    slug: 'creatives',
    name: 'Creatives',
    className: 'Design Ranger',
    tags: ['VISUAL', 'MOTION', 'SYSTEMS'],
    description:
      'Scout the vibe, sketch the system, and ship pixel-sharp art that makes the brand feel alive.',
    accent: '#00b8e6',
    icon: 'palette',
    stats: [
      { label: 'CRAFT', value: '+15' },
      { label: 'VISION', value: '+9' },
    ],
    details: {
      summary:
        'Design under a time limit: reimagine a hiring-hackathon micro-experience that feels like a game, not a form.',
      bullets: [
        'Moodboard a retro-meets-drone visual world',
        'Produce key art + UI components for a signup flow',
        'Animate one micro-interaction or title card',
        'Show how the system scales across social formats',
      ],
      schedule: 'Virtual · Sat, 25 July · 10:00–18:00 IST',
    },
    outcomes: sharedOutcomes,
  },
  {
    slug: 'customer-success',
    name: 'Customer Success',
    className: 'Success Paladin',
    tags: ['ADVOCACY', 'ONBOARD', 'RETAIN'],
    description:
      'Shield customers through chaos — onboard, diagnose, and turn friction into loyalty.',
    accent: '#3b5bdb',
    icon: 'shield',
    stats: [
      { label: 'EMPATHY', value: '+13' },
      { label: 'CLARITY', value: '+11' },
    ],
    details: {
      summary:
        'A customer-rescue arena: diagnose a messy onboarding case, rebuild trust, and write the playbook that prevents a rematch.',
      bullets: [
        'Triage a simulated customer escalation thread',
        'Map the onboarding journey and kill three friction points',
        'Draft a health-score + check-in cadence',
        'Host a recovery call simulation with judges',
      ],
      schedule: 'Virtual · Sat, 25 July · 10:00–18:00 IST',
    },
    outcomes: sharedOutcomes,
  },
]

export function getRoleBySlug(slug: string): Role | undefined {
  return roles.find((role) => role.slug === slug)
}
