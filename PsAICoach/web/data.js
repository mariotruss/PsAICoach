// Mock Data for PsyCoach Prototype
export const mockData = {
  prompts: [
    "What is one moment today that brought you a sense of calm?",
    "Describe a challenge you faced today. How did you respond?",
    "Name three things you appreciate about yourself right now.",
    "What is a supportive message you wish you could hear today?",
    "What emotion is asking for attention today?",
    "What boundary did you set or wish you had set?",
    "Describe a small victory from today, no matter how small.",
    "What pattern are you noticing in your thoughts or feelings?"
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
    },
    {
      title: "Set a healthy boundary",
      detail: "Declined extra work commitment to protect mental health."
    }
  ],
  
  distortions: [
    {
      name: "All-or-Nothing Thinking",
      example: "If the morning went poorly, the entire day is ruined.",
      reframe: "Notice shades of gray and list one positive moment from today."
    },
    {
      name: "Catastrophizing",
      example: "If I make a mistake, everything will collapse.",
      reframe: "Rate the actual impact from 0-10 and identify your support systems."
    },
    {
      name: "Mind Reading",
      example: "They didn't text back; they must be angry at me.",
      reframe: "List alternate reasons and plan a gentle check-in when ready."
    },
    {
      name: "Should Statements",
      example: "I should be able to handle this without feeling stressed.",
      reframe: "Replace 'should' with 'I would prefer to' and practice self-compassion."
    },
    {
      name: "Personalization",
      example: "My friend seems upset; it must be something I did.",
      reframe: "Consider external factors and ask directly if appropriate."
    }
  ],
  
  reframes: [
    {
      title: "Thought Record",
      steps: [
        "Write the triggering situation in detail",
        "Capture the automatic thought and rate emotion intensity (0-10)",
        "Search for evidence that supports the thought",
        "Search for evidence that contradicts the thought",
        "Craft a balanced alternative perspective",
        "Re-rate emotion intensity after reframing"
      ]
    },
    {
      title: "Compassionate Friend Exercise",
      steps: [
        "Imagine what a caring friend would say to you",
        "Write that supportive message to yourself",
        "Identify one small act of kindness you can offer yourself",
        "Practice saying it aloud with warmth"
      ]
    },
    {
      title: "Best Friend Perspective",
      steps: [
        "Describe your situation as if a best friend came to you with it",
        "What advice would you give them?",
        "What compassion would you show them?",
        "Apply that same kindness to yourself"
      ]
    }
  ],
  
  experiments: [
    {
      title: "Pleasant Activity Scheduling",
      description: "Plan one energizing activity twice this week and note mood before/after. Track patterns between activities and emotional state."
    },
    {
      title: "Reality Testing Log",
      description: "Record moments of uncertainty and rate confidence before and after checking facts. Notice patterns in triggers and responses."
    },
    {
      title: "Opposite Action",
      description: "When avoidance urges arise, choose a brief, safe action that moves you toward your values. Note the outcome and learning."
    },
    {
      title: "Behavioral Activation",
      description: "When feeling low, engage in a small meaningful activity for 10 minutes. Observe changes in mood and energy."
    },
    {
      title: "Worry Time Experiment",
      description: "Designate 15 minutes daily for worrying. When worries arise outside this time, note them for later. Track anxiety levels."
    }
  ],
  
  grounding: [
    {
      title: "5-4-3-2-1 Senses",
      detail: "Notice five things you can see, four you can touch, three you can hear, two you can smell, one you can taste. Repeat slowly."
    },
    {
      title: "Temperature Reset",
      detail: "Hold something cool or splash water on your face to help regulate your nervous system through physical sensation."
    },
    {
      title: "Anchor Phrase",
      detail: "Repeat a calming phrase such as 'Right now, I am safe; this feeling will pass.' Say it with intentional breath."
    },
    {
      title: "Body Scan",
      detail: "Notice sensations from toes to head without judgment. Where is there tension? Where is there ease? Breathe into tight areas."
    },
    {
      title: "Grounding Objects",
      detail: "Hold a meaningful object (stone, photo, keychain). Notice its texture, weight, and temperature. Let it anchor you to the present."
    },
    {
      title: "54321 Countdown",
      detail: "Count backwards from 54 by 3s. This engages your cognitive mind and interrupts rumination or panic spirals."
    }
  ],
  
  therapist: {
    moodSummary: [
      { 
        label: "Average Mood", 
        value: "5.6 / 10", 
        trend: "↑ Stable improvements over 2 weeks" 
      },
      { 
        label: "Sleep Quality", 
        value: "6.2 / 10", 
        trend: "↔ Maintained with nightly check-ins" 
      },
      { 
        label: "Stress Peaks", 
        value: "3 alerts", 
        trend: "↓ Decreased after grounding practice" 
      },
      { 
        label: "Engagement", 
        value: "87%", 
        trend: "↑ Daily check-ins consistent" 
      }
    ],
    
    highlights: [
      {
        title: "Theme: Anticipatory anxiety",
        detail: "User practiced reframing work-related worries and scheduled regular decompression walks. Showing progress in recognizing patterns."
      },
      {
        title: "Mood improvement trajectory",
        detail: "Baseline mood rose from 4 to 6 over two weeks with medication adherence reminders and CBT practice."
      },
      {
        title: "Crisis protocol rehearsed",
        detail: "User rehearsed contacting support network during a difficult moment; no escalation detected. Strong safety awareness."
      },
      {
        title: "Boundary setting success",
        detail: "User reported successfully setting a work boundary, leading to reduced stress and improved weekend mood."
      }
    ],
    
    alerts: [
      {
        title: "Self-harm keyword detected (Feb 18)",
        detail: "AI prompted safety plan; user confirmed they were safe and contacted therapist. Follow-up completed successfully."
      },
      {
        title: "Paranoia indication (Feb 22)",
        detail: "Reality check module engaged automatically. User worked through grounding exercises; intensity reduced from 8 to 4." 
      },
      {
        title: "Missed check-ins (Feb 25-26)",
        detail: "Two consecutive days without engagement. Automated gentle reminder sent. User resumed engagement on Feb 27."
      }
    ]
  }
};
