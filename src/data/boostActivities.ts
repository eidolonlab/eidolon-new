export interface BoostActivity {
  id: string;
  pillar: string;
  type: string;
  name: string;
  description: string;
  duration_seconds: number;
  difficulty_level: number;
  instructions: string[];
  encouragement_text: string[];
  sort_order: number;
}

export const BOOST_ACTIVITIES: BoostActivity[] = [
  {
    id: '1',
    pillar: 'switch_control',
    type: 'glitch_switch',
    name: 'Stand & Stretch',
    description: 'Quick physical reset to break rumination loops',
    duration_seconds: 30,
    difficulty_level: 1,
    instructions: [
      'Stand up from your seat',
      'Reach arms overhead',
      'Take 3 deep breaths',
      'Shake out your body'
    ],
    encouragement_text: [
      "You're doing it!",
      'Feel that energy shift?',
      'Nice work breaking the loop!'
    ],
    sort_order: 1
  },
  {
    id: '2',
    pillar: 'switch_control',
    type: 'glitch_switch',
    name: 'Object Focus',
    description: 'Ground yourself by describing your surroundings',
    duration_seconds: 30,
    difficulty_level: 1,
    instructions: [
      'Look at an object near you',
      'Describe 3 details about it',
      'Touch it if you can',
      'Notice how you feel now'
    ],
    encouragement_text: [
      'Great awareness!',
      "You're present now",
      "That's the shift!"
    ],
    sort_order: 2
  },
  {
    id: '3',
    pillar: 'switch_control',
    type: 'grounding',
    name: 'Breath Trace',
    description: 'Follow the moving line with your breath',
    duration_seconds: 60,
    difficulty_level: 2,
    instructions: [
      'Watch the expanding circle',
      'Breathe in as it grows',
      'Breathe out as it shrinks',
      'Match your breath to the rhythm'
    ],
    encouragement_text: [
      'Perfect rhythm',
      "You're centered now",
      'Beautiful breathing!'
    ],
    sort_order: 3
  },
  {
    id: '4',
    pillar: 'switch_control',
    type: 'momentum',
    name: 'Two Minute Start',
    description: "Just begin. We'll stay with you.",
    duration_seconds: 120,
    difficulty_level: 1,
    instructions: [
      "Pick the thing you've been avoiding",
      'Set timer for 2 minutes',
      'Start. Just start.',
      'You did it!'
    ],
    encouragement_text: [
      "You started! That's huge!",
      'Momentum is building',
      'See? You can do hard things!'
    ],
    sort_order: 4
  },
  {
    id: '5',
    pillar: 'switch_control',
    type: 'emergency',
    name: 'Panic Redirect',
    description: "Quick support when you're overwhelmed",
    duration_seconds: 90,
    difficulty_level: 1,
    instructions: [
      "You're okay. Breathe.",
      'Name 3 things you can see',
      'Pick ONE small action',
      'Do just that one thing'
    ],
    encouragement_text: [
      "You're safe",
      'One step at a time',
      "I'm here with you",
      "You're doing great"
    ],
    sort_order: 5
  },
  {
    id: '6',
    pillar: 'body_balance',
    type: 'balance',
    name: 'Single-Leg Stand',
    description: 'Balance on one leg to activate coordination',
    duration_seconds: 30,
    difficulty_level: 2,
    instructions: [
      'Stand near a wall for safety',
      'Lift one foot off the ground',
      'Hold for 30 seconds',
      'Switch legs and repeat'
    ],
    encouragement_text: [
      'Steady!',
      "You've got this!",
      'Balance champion!'
    ],
    sort_order: 6
  },
  {
    id: '7',
    pillar: 'body_balance',
    type: 'balance',
    name: 'Eyes-Closed Balance',
    description: 'Advanced balance for attention boost',
    duration_seconds: 20,
    difficulty_level: 3,
    instructions: [
      'Stand with feet together',
      'Close your eyes',
      'Hold steady for 20 seconds',
      'Notice how focused you feel'
    ],
    encouragement_text: [
      'Impressive!',
      'Your brain is working hard!',
      'Focus activated!'
    ],
    sort_order: 7
  },
  {
    id: '8',
    pillar: 'body_balance',
    type: 'coordination',
    name: 'Jump Reset',
    description: 'Quick energy burst and coordination',
    duration_seconds: 30,
    difficulty_level: 1,
    instructions: [
      'Stand with space around you',
      'Jump 10 times',
      'Clap at the top of each jump',
      'Feel that energy!'
    ],
    encouragement_text: [
      'Energy boost!',
      "You're powered up!",
      'Fantastic!'
    ],
    sort_order: 8
  },
  {
    id: '9',
    pillar: 'body_balance',
    type: 'coordination',
    name: 'Pattern Throw',
    description: 'Hand-eye coordination challenge',
    duration_seconds: 60,
    difficulty_level: 3,
    instructions: [
      'Take a soft object (ball, rolled socks)',
      'Toss from hand to hand',
      'Count to 20 catches',
      'Try not to drop it!'
    ],
    encouragement_text: [
      'Smooth!',
      'Coordination unlocked!',
      'Your brain is learning!'
    ],
    sort_order: 9
  },
  {
    id: '10',
    pillar: 'body_balance',
    type: 'strength',
    name: 'Plank Hold',
    description: 'Core strength and attention',
    duration_seconds: 30,
    difficulty_level: 3,
    instructions: [
      'Get into plank position',
      'Hold for 30 seconds',
      'Focus on your breathing',
      "You're stronger than you think!"
    ],
    encouragement_text: [
      'Strength!',
      "You're powerful!",
      'Core engaged!'
    ],
    sort_order: 10
  },
  {
    id: '11',
    pillar: 'body_balance',
    type: 'coordination',
    name: 'Wall Touch Sprint',
    description: 'Quick movement coordination',
    duration_seconds: 20,
    difficulty_level: 2,
    instructions: [
      'Stand facing a wall',
      'Touch wall with both hands',
      'Step back 2 paces',
      'Repeat 10 times quickly'
    ],
    encouragement_text: [
      'Speed!',
      'Coordination master!',
      "You're quick!"
    ],
    sort_order: 11
  }
];

export function getActivitiesByPillar(pillar: string): BoostActivity[] {
  return BOOST_ACTIVITIES.filter(a => a.pillar === pillar);
}

export function getActivityById(id: string): BoostActivity | undefined {
  return BOOST_ACTIVITIES.find(a => a.id === id);
}
