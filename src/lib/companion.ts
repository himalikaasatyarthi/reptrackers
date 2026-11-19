import { articleById } from "@/data/library";

export type CompanionSource = {
  id: string;
  title: string;
};

export type LocalReply = {
  text: string;
  sources: CompanionSource[];
  crisis: boolean;
  context: string;
};

type Note = {
  id: string;
  title: string;
  articleId?: string;
  tags: string[];
  text: string;
  follow: string;
};

const NOTES: Note[] = [
  {
    id: "sleep",
    title: "Sleep",
    articleId: "rest",
    tags: ["sleep", "insomnia", "tired", "rest", "awake", "bed", "bedtime", "screens"],
    text: "Protect one part of the night: dim screens, write tomorrow’s tasks on paper, and keep the room as dark as you can. Caffeine late in the day and long naps can push bedtime later.",
    follow: "Has this been going on for more than a few nights?",
  },
  {
    id: "stress",
    title: "Stress",
    articleId: "reset",
    tags: ["stress", "stressed", "anxious", "anxiety", "overwhelm", "overwhelmed", "panic", "worry", "worried"],
    text: "You do not have to solve the whole day. Put both feet down, name five things you see, four you feel, and three you hear, then pick a ten-minute task.",
    follow: "What would feel manageable in the next ten minutes?",
  },
  {
    id: "mood",
    title: "Low mood",
    articleId: "reset",
    tags: ["sad", "down", "depressed", "lonely", "alone", "unmotivated", "motivation", "empty", "hopeless"],
    text: "Low days shrink the menu. A glass of water, a short walk, or a message to one person still counts. If this mood has been heavy for a while, a counsellor is a reasonable next step.",
    follow: "Do you want a tiny action, or help finding words for how it feels?",
  },
  {
    id: "move",
    title: "Movement",
    articleId: "walking",
    tags: ["walk", "walking", "exercise", "workout", "run", "gym", "sore", "strength", "cardio", "move"],
    text: "Walking counts. Ten to thirty minutes at a talking pace, on most days, is a real plan. Pair it with strength you can recover from, and stop if pain changes how you move.",
    follow: "Are you starting from rest, or fitting this around training you already do?",
  },
  {
    id: "food",
    title: "Meals",
    articleId: "plate",
    tags: ["diet", "food", "eat", "eating", "meal", "hungry", "breakfast", "lunch", "dinner", "protein", "vegetarian", "vegan"],
    text: "Build one plate you can see: half vegetables or fruit, a quarter protein, a quarter starch, and some fat so it satisfies you. The diet tool on this page has full example days.",
    follow: "Do you want steady energy, strength, or a lighter-feeling day?",
  },
  {
    id: "water",
    title: "Hydration",
    articleId: "water",
    tags: ["water", "thirst", "hydrate", "hydration", "drink"],
    text: "A glass with each meal, and more in heat or long workouts, covers ordinary days. You only need to log water once here — the habit matters more than a perfect total.",
    follow: "Is today hot, or mostly a normal indoor day?",
  },
  {
    id: "body",
    title: "Body check",
    articleId: "walking",
    tags: ["bmi", "weight", "fat", "body", "posture", "frame", "shape"],
    text: "BMI is an adult screening range, not a diagnosis or a fitness score. The body tool suggests a movement mix from your answers and an optional on-page silhouette. Neither one measures health by itself.",
    follow: "Are you trying to understand a number, or choose how to move this week?",
  },
  {
    id: "focus",
    title: "Focus",
    articleId: "habits",
    tags: ["focus", "study", "work", "procrastinate", "habit", "streak", "points", "consistent", "consistency"],
    text: "Pick one action you can finish today: a walk, water, a check-in, a kind message, or twenty quiet minutes. This page scores each of those once per day, on this device only.",
    follow: "Which of those five could you finish before tonight?",
  },
  {
    id: "social",
    title: "Support",
    articleId: "reset",
    tags: ["friend", "family", "support", "lonely", "talk", "relationship"],
    text: "Health is easier with one other person. A short honest message, or a walk together, is a complete action. You do not need to explain your whole history.",
    follow: "Is there someone you could contact today, even briefly?",
  },
  {
    id: "breath",
    title: "Breathing Reset",
    articleId: "reset",
    tags: ["breath", "breathing", "calm", "ground", "grounding", "relax", "reset", "chest", "shallow"],
    text: "Try the physiological sigh: two quick inhales through the nose, then one slow, long exhale through the mouth. Repeat three times to send an immediate calming signal to your nervous system.",
    follow: "Would you like to try taking three slow breaths together right now?",
  },
  {
    id: "recovery",
    title: "Active Recovery",
    articleId: "walking",
    tags: ["sore", "soreness", "stiff", "ache", "stretching", "stretch", "recover", "recovery", "rest day"],
    text: "Delayed soreness after training is normal. A gentle 15-minute walk and easy hip/shoulder circles circulate blood and ease stiffness far better than staying completely stationary.",
    follow: "Did you do a hard workout recently, or is this tension from desk work?",
  },
  {
    id: "burnout",
    title: "Burnout & Energy",
    articleId: "rest",
    tags: ["burnout", "exhausted", "drained", "overworked", "fatigue", "tired of everything"],
    text: "When exhaustion is deep, pushing harder backfires. Lower your expectations for today to the bare minimum: stay hydrated, eat a warm meal, and let yourself rest without guilt.",
    follow: "What is one non-essential thing you could take off your plate today?",
  },
  {
    id: "habits",
    title: "Habit Stacking",
    articleId: "habits",
    tags: ["habits", "routine", "consistency", "start", "discipline", "stick to", "fail"],
    text: "Attach a new tiny habit to something you already do every single day. For instance: drink a glass of water right while your coffee or tea is brewing, or stretch for two minutes right after brushing your teeth.",
    follow: "What existing daily routine could you anchor a small win onto?",
  },
];

export const SUGGESTED_PROMPTS = [
  "Feeling stressed and overwhelmed",
  "Can't fall asleep, mind racing",
  "How should I start exercising?",
  "Quick 2-minute breath reset",
  "Simple balanced dinner idea",
];

const CRISIS =
  /\b(suicid\w*|kill myself|killing myself|end my life|self[-\s]?harm|want to die|hurt myself|do not want to live|don't want to live|dont want to live)\b/i;

const MEDICAL =
  /\b(diagnos\w*|prescri\w*|dosage|antibiotic|insulin|mg\b|medication|medicine|supplement dose)\b/i;

const ACKS = [
  "Thank you for saying it plainly.",
  "That is a reasonable thing to bring here.",
  "I can work with that.",
  "Let’s keep this small enough to finish.",
];

const CRISIS_TEXT = [
  "I’m glad you said that. I’m not able to help with a crisis in this chat, and I won’t send this message to a model.",
  "If you might hurt yourself, contact local emergency services now.",
  "India: AASRA +91 98204 66726 · iCall 9152987821.",
  "United States: call or text 988.",
  "Elsewhere: https://www.iasp.info/suicidalthoughts/",
  "You deserve a person who can stay with you in real time.",
].join(" ");

const STOP = new Set([
  "the",
  "and",
  "for",
  "you",
  "your",
  "that",
  "this",
  "with",
  "have",
  "has",
  "was",
  "are",
  "but",
  "not",
  "just",
  "what",
  "how",
  "can",
  "could",
  "would",
  "about",
  "from",
  "its",
  "it's",
  "i'm",
  "ive",
  "been",
  "they",
  "them",
  "then",
  "than",
  "into",
  "over",
  "after",
  "before",
  "really",
  "very",
  "feel",
  "feeling",
  "like",
  "want",
  "need",
  "help",
  "please",
  "today",
  "something",
]);

function tokens(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP.has(word));
}

function hash(value: string): number {
  return [...value].reduce((sum, char) => (sum * 33 + char.charCodeAt(0)) >>> 0, 7);
}

function sourceFor(note: Note): CompanionSource | null {
  if (!note.articleId) return null;
  const article = articleById(note.articleId);
  return article ? { id: article.id, title: article.title } : { id: note.articleId, title: note.title };
}

export function localAnswer(message: string, history: { role: string; text: string }[] = []): LocalReply {
  if (CRISIS.test(message)) {
    return { text: CRISIS_TEXT, sources: [], crisis: true, context: "" };
  }

  const followUp = /^(yes|yeah|yep|ok|okay|more|sure|please)\b/i.test(message.trim());
  const earlier = history
    .filter((turn) => turn.role === "user")
    .slice(-2)
    .map((turn) => turn.text)
    .join(" ");
  const query = followUp ? `${earlier} ${message}` : message;
  const words = new Set(tokens(query));

  const ranked = NOTES.map((note) => {
    let score = 0;
    for (const tag of note.tags) {
      if (query.toLowerCase().includes(tag)) score += tag.includes(" ") ? 4 : 3;
    }
    for (const word of tokens(`${note.title} ${note.text}`)) {
      if (words.has(word)) score += 1;
    }
    return { note, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const medical = MEDICAL.test(message);
  const boundary = medical
    ? "I can’t diagnose a condition or suggest medicines or doses. A qualified clinician should look at that. "
    : "";
  const ack = ACKS[hash(message) % ACKS.length];
  const top = ranked[0];
  const second = ranked[1] && top && ranked[1].score >= top.score - 1 ? ranked[1] : undefined;

  if (!top) {
    const text = `${boundary}${ack} I can help with sleep, stress, meals, movement, hydration, and getting started — using the guides included on this page. What feels most useful right now?`;
    return {
      text,
      sources: [],
      crisis: false,
      context: medical
        ? "Do not diagnose or recommend medication. Offer general wellbeing only."
        : "General wellbeing. Use only ordinary public-health habits. Do not diagnose.",
    };
  }

  const picked = [top, second].filter((item): item is { note: Note; score: number } => Boolean(item));
  const text = [
    boundary + ack,
    top.note.text,
    second ? second.note.text : "",
    top.note.follow,
  ]
    .filter(Boolean)
    .join(" ");
  const sources = picked
    .map((item) => sourceFor(item.note))
    .filter((item): item is CompanionSource => Boolean(item))
    .filter((item, index, list) => list.findIndex((other) => other.id === item.id) === index);
  const context = [
    medical ? "Do not diagnose or recommend medication, supplements, or doses." : "Do not diagnose.",
    ...picked.map((item) => `${item.note.title}: ${item.note.text}`),
  ].join("\n");

  return { text, sources, crisis: false, context };
}
