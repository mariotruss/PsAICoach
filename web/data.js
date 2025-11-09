const mockData = {
  prompts: [
    "What is one moment today that brought you a sense of calm?",
    "Describe a challenge you faced today. How did you respond?",
    "Name three things you appreciate about yourself right now.",
    "What is a supportive message you wish you could hear today?"
  ],
  moodTrend: [
    { date: "2024-02-15", score: 5 },
    { date: "2024-02-16", score: 4 },
    { date: "2024-02-17", score: 3 },
    { date: "2024-02-18", score: 5 },
    { date: "2024-02-19", score: 6 },
    { date: "2024-02-20", score: 6 },
    { date: "2024-02-21", score: 7 },
    { date: "2024-02-22", score: 5 },
    { date: "2024-02-23", score: 6 },
    { date: "2024-02-24", score: 7 },
    { date: "2024-02-25", score: 6 },
    { date: "2024-02-26", score: 5 },
    { date: "2024-02-27", score: 4 },
    { date: "2024-02-28", score: 6 }
  ],
  notableMoments: [
    {
      title: "Practiced grounding during commute",
      detail: "Used the 5-4-3-2-1 technique after a stressful phone call."
    },
    {
      title: "Shared feelings with therapist",
      detail: "Discussed recurring anxiety and co-created breathing plan."
    },
    {
      title: "Completed exposure exercise",
      detail: "Visited the crowded cafe for 15 minutes without leaving early."
    }
  ],
  distortions: [
    {
      name: "All-or-Nothing Thinking",
      example: "If the morning went poorly, the entire day is ruined.",
      reframe: "Notice shades of gray and list one positive moment."
    },
    {
      name: "Catastrophizing",
      example: "If I make a mistake, everything will collapse.",
      reframe: "Rate the actual impact from 0-10 and identify supports."
    },
    {
      name: "Mind Reading",
      example: "They didn't text back; they must be angry at me.",
      reframe: "List alternate reasons and plan a gentle check-in."
    }
  ],
  reframes: [
    {
      title: "Thought Record",
      steps: [
        "Write the triggering situation.",
        "Capture the automatic thought and emotion intensity.",
        "Search for evidence for and against the thought.",
        "Craft a balanced alternative perspective."
      ]
    },
    {
      title: "Compassionate Friend",
      steps: [
        "Imagine what a caring friend would say.",
        "Write that message to yourself.",
        "Identify one small act of kindness you can offer yourself."
      ]
    }
  ],
  experiments: [
    {
      title: "Pleasant Activity Scheduling",
      description: "Plan one energizing activity twice this week and note mood before/after."
    },
    {
      title: "Reality Testing Log",
      description: "Record moments of uncertainty and rate how confident you feel after checking facts."
    },
    {
      title: "Opposite Action",
      description: "When avoidance urges arise, choose a brief, safe action that moves you toward your values."
    }
  ],
  grounding: [
    {
      title: "5-4-3-2-1 Senses",
      detail: "Notice five things you can see, four you can touch, three you can hear, two you can smell, one you can taste."
    },
    {
      title: "Temperature Reset",
      detail: "Hold something cool or splash water on your face to help regulate your nervous system."
    },
    {
      title: "Anchor Phrase",
      detail: "Repeat a calming phrase such as 'Right now, I am safe; this feeling will pass.'"
    }
  ],
  therapist: {
    moodSummary: [
      { label: "Average Mood", value: "5.6 / 10", trend: "↑ Stable improvements over 2 weeks" },
      { label: "Sleep Quality", value: "6.2 / 10", trend: "↔ Maintained with nightly check-ins" },
      { label: "Stress Peaks", value: "3 alerts", trend: "↓ Decreased after grounding practice" }
    ],
    highlights: [
      {
        title: "Theme: anticipatory anxiety",
        detail: "User practiced reframing work-related worries and scheduled decompression walks."
      },
      {
        title: "Mood improvement",
        detail: "Baseline mood rose from 4 to 6 with medication adherence reminders."
      },
      {
        title: "Crisis protocol rehearsed",
        detail: "User rehearsed contacting support network; no escalation detected."
      }
    ],
    alerts: [
      {
        title: "Self-harm keyword detected (Feb 18)",
        detail: "AI prompted safety plan; user confirmed they were safe and contacted therapist."
      },
      {
        title: "Paranoia flag (Feb 22)",
        detail: "Reality check module engaged, and delusion intensity reduced from 8 to 4." 
      }
    ]
  }
};

const crisisPhrases = [
  'self-harm',
  'end it',
  'suicide',
  'hurt myself',
  'can\'t go on',
  'kill myself'
];

const supportiveResponses = [
  {
    matcher: /\b(anxious|anxiety|worried|nervous)\b/i,
    reply: "I hear how much anxiety is showing up. Let\'s take a breath together. What might help you feel 5% more grounded right now?"
  },
  {
    matcher: /\b(sad|down|depressed|low)\b/i,
    reply: "I\'m sitting with you in this sadness. Would it help to explore what emotion is underneath or what comfort you need?"
  },
  {
    matcher: /\b(angry|frustrated|mad)\b/i,
    reply: "Anger is a powerful signal. What boundary was crossed, and what support could you ask for?"
  },
  {
    matcher: /\b(paranoid|hallucination|hearing|seeing)\b/i,
    reply: "Thank you for sharing something so intense. Would you like to try a reality-check exercise together?"
  }
];

const reflectivePrompts = [
  "What emotions are you noticing in your body right now?",
  "If a friend felt the way you do, what would you want for them?",
  "What small action could honor your needs in the next hour?",
  "What support would feel meaningful to ask for today?"
];

const realityChecks = [
  {
    matcher: /voice|whisper|hearing/i,
    summary: "Hearing something is unsettling."
  },
  {
    matcher: /see|seeing|vision|shadow/i,
    summary: "Seeing things others may not notice can be confusing."
  },
  {
    matcher: /follow|watch|paranoid/i,
    summary: "Feeling observed is stressful."
  }
];
