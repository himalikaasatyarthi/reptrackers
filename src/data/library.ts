import type { IconName } from "@/icons";
import type { ActionId } from "@/lib/progress";

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

export type Article = {
  id: string;
  category: string;
  title: string;
  time: string;
  color: string;
  icon: IconName;
  featured: boolean;
  summary: string;
  blocks: Block[];
};

export type DocPage = {
  id: string;
  title: string;
  summary: string;
  icon: IconName;
  blocks: Block[];
};

export type GalleryCard = {
  letter: string;
  title: string;
  caption: string;
  tone: string;
  icon: IconName;
  practice: string;
  tool: "bmi" | "body" | "diet" | "chat";
  action: ActionId;
};

export const values = [
  ["Care first", "Health guidance should feel humane, encouraging and stigma-free.", "heart"],
  ["Small wins", "We turn overwhelming goals into steady, achievable daily actions.", "target"],
  ["Built for all", "Every body, routine and starting point deserves thoughtful support.", "users"],
] as const;

export const gallery: GalleryCard[] = [
  {
    letter: "F",
    title: "Find your pace",
    caption: "Movement that meets you where you are.",
    tone: "coral",
    icon: "target",
    practice: "Walk for ten minutes at a pace where you can talk. Log it once today.",
    tool: "body",
    action: "walk",
  },
  {
    letter: "I",
    title: "Invest in rest",
    caption: "Recovery is a vital part of progress.",
    tone: "blue",
    icon: "heart",
    practice: "Pick a lights-out time and put tomorrow’s list on paper before screens dim.",
    tool: "chat",
    action: "mindful",
  },
  {
    letter: "T",
    title: "Train with joy",
    caption: "Consistency grows when movement feels good.",
    tone: "gold",
    icon: "spark",
    practice: "Choose the movement you would still do on a tired day, then do a short version.",
    tool: "body",
    action: "walk",
  },
  {
    letter: "N",
    title: "Nourish daily",
    caption: "Simple food choices, never rigid rules.",
    tone: "mint",
    icon: "leaf",
    practice: "Build one plate with vegetables, a protein you like, and a familiar starch.",
    tool: "diet",
    action: "water",
  },
  {
    letter: "E",
    title: "Ease your mind",
    caption: "Pause, breathe and make room to reset.",
    tone: "violet",
    icon: "brain",
    practice: "Name five things you see, four you feel, and three you hear. That is enough.",
    tool: "chat",
    action: "checkin",
  },
  {
    letter: "S",
    title: "Support others",
    caption: "Health gets better when we do it together.",
    tone: "rose",
    icon: "users",
    practice: "Send one honest check-in to someone you trust, or take a walk together.",
    tool: "chat",
    action: "support",
  },
];

export const articles: Article[] = [
  {
    id: "plate",
    category: "Nutrition",
    title: "Building a balanced plate without counting everything",
    time: "6 min read",
    color: "article-green",
    icon: "leaf",
    featured: true,
    summary: "A plate method you can use at home without a tracker.",
    blocks: [
      {
        type: "p",
        text: "Counting every gram is optional. A useful default is a plate you can see: about half vegetables or fruit, a quarter protein, and a quarter starch you already cook. Add a spoon of fat you enjoy — ghee, oil, nuts, or curd — so the meal actually satisfies you.",
      },
      {
        type: "h",
        text: "What to put down first",
      },
      {
        type: "p",
        text: "Start with the vegetable or salad, then dal, paneer, tofu, eggs, fish, chicken, or curd. Rice, roti, millet, or bread fills the remaining quarter. If you train hard, make the starch and protein portions a little larger instead of skipping the meal.",
      },
      {
        type: "ul",
        items: [
          "Breakfast can be smaller and still follow the idea: fruit plus a protein and a grain.",
          "Snacks are allowed. Fruit and roasted chana, or curd and nuts, are enough.",
          "Dessert after a full plate is different from dessert instead of a meal.",
        ],
      },
      {
        type: "h",
        text: "When the method is the wrong tool",
      },
      {
        type: "p",
        text: "Appetite, culture, budget, and medical conditions all change portions. People with diabetes, eating disorders, kidney disease, or pregnancy needs should use a registered dietitian rather than a general plate sketch. Rep Trackers only stores example days in the page itself.",
      },
    ],
  },
  {
    id: "reset",
    category: "Mental wellbeing",
    title: "A five-minute reset for overwhelming days",
    time: "4 min read",
    color: "article-purple",
    icon: "brain",
    featured: true,
    summary: "A short grounding sequence when the day feels too loud.",
    blocks: [
      {
        type: "p",
        text: "Overwhelm often wants a total solution. A five-minute reset does a smaller job: it brings your attention back into the room so the next action can be chosen on purpose.",
      },
      {
        type: "h",
        text: "The sequence",
      },
      {
        type: "ul",
        items: [
          "Put both feet on the floor.",
          "Name five things you can see, four you can feel, and three you can hear.",
          "Breathe out slightly longer than you breathe in, five times.",
          "Write the next ten-minute task in one sentence. Ignore the rest of the list.",
        ],
      },
      {
        type: "p",
        text: "If the same pressure is there most days, or if you feel unsafe, a counsellor or local crisis line is the right next step. The chatbot on this site can point you there. It cannot stay with you the way a person can.",
      },
    ],
  },
  {
    id: "walking",
    category: "Movement",
    title: "Why walking still counts as a real workout",
    time: "5 min read",
    color: "article-orange",
    icon: "target",
    featured: true,
    summary: "How to use walking when intense training is not the point.",
    blocks: [
      {
        type: "p",
        text: "Walking raises heart rate, keeps joints moving, and is easy to repeat. Those three facts are why it belongs in a training week even if you also lift or play a sport.",
      },
      {
        type: "h",
        text: "A week that is honest",
      },
      {
        type: "ul",
        items: [
          "Most days: 10 to 30 minutes at a pace where you can talk.",
          "After meals: a short loop can help you feel less sluggish.",
          "If something hurts sharply, stop and get it checked. Soreness that fades is different from pain that changes how you walk.",
        ],
      },
      {
        type: "p",
        text: "The body-mix tool suggests how to pair walking with strength. It reads your answers and, if you add a photo, a rough silhouette. It does not measure fitness.",
      },
    ],
  },
  {
    id: "water",
    category: "Nutrition",
    title: "Hydration without a gallon jug",
    time: "3 min read",
    color: "article-green",
    icon: "leaf",
    featured: false,
    summary: "A practical way to drink enough on ordinary days.",
    blocks: [
      {
        type: "p",
        text: "Thirst, pale-yellow urine, and a glass with each meal cover most temperate days. Heat, fever, and long workouts raise the need. Chasing a huge fixed target can be unnecessary, and in rare medical cases unsafe.",
      },
      {
        type: "ul",
        items: [
          "Start the day with one glass.",
          "Put water next to lunch and dinner.",
          "Use lemon, buttermilk, or coconut water if plain water bores you.",
          "Log the action once on this site. The point is the habit, not a perfect count.",
        ],
      },
    ],
  },
  {
    id: "rest",
    category: "Recovery",
    title: "Sleep is a training day",
    time: "5 min read",
    color: "article-purple",
    icon: "heart",
    featured: false,
    summary: "A short wind-down that does not require a perfect routine.",
    blocks: [
      {
        type: "p",
        text: "Sleep affects appetite, mood, and how hard movement feels. You do not need a new personality to protect it. Dim screens, write tomorrow’s tasks on paper, and keep the room as dark and cool as your home allows.",
      },
      {
        type: "p",
        text: "If you are awake for many nights, snore heavily, or stop breathing in your sleep, talk with a clinician. Caffeine after mid-afternoon and long naps can also shove bedtime later. The companion can help you pick one change. It cannot diagnose insomnia.",
      },
    ],
  },
  {
    id: "habits",
    category: "Habits",
    title: "Points, streaks, and why they stay on your device",
    time: "4 min read",
    color: "article-orange",
    icon: "medal",
    featured: false,
    summary: "How the sample leaderboard and your score actually work.",
    blocks: [
      {
        type: "p",
        text: "The names on the healthy habits board are a sample week included in the website. Nothing is uploaded when you log a walk, a glass of water, a check-in, a kind message, or twenty mindful minutes.",
      },
      {
        type: "ul",
        items: [
          "Each action scores once per calendar day.",
          "A streak grows when you log on consecutive days and resets when a day is missed.",
          "Your opening score is 1,240 so the first visit matches the designed board. Reset clears it back to that opening score.",
          "Rank is calculated against the bundled sample, not against live people.",
        ],
      },
      {
        type: "p",
        text: "A shared computer will show the last person’s local score. Use Reset on-device score before you hand the browser to someone else.",
      },
    ],
  },
];

export const docs: DocPage[] = [
  {
    id: "privacy",
    title: "Privacy policy",
    summary: "What stays in the browser, and the one optional request that leaves it.",
    icon: "shield",
    blocks: [
      {
        type: "p",
        text: "Rep Trackers is a static site. The articles, meal ideas, sample leaderboard, score rules, and companion notes are files in the page. There is no Rep Trackers account, database, or server receiving your photos, meals, or chat.",
      },
      {
        type: "h",
        text: "Stored on this device",
      },
      {
        type: "ul",
        items: [
          "reptrackers.progress.v1 — name, points, streak, today’s actions, challenge, and pledge.",
          "reptrackers.chat.v1 — the messages in the wellness chat.",
          "reptrackers.model.v1 — optional endpoint, model name, and API key if you turn a model on.",
        ],
      },
      {
        type: "h",
        text: "Photos",
      },
      {
        type: "p",
        text: "A body photo is drawn into a canvas in this tab to estimate a rough silhouette. The file is not uploaded. Closing or refreshing the page drops the preview. The object URL is revoked when you replace the photo.",
      },
      {
        type: "h",
        text: "Optional model",
      },
      {
        type: "p",
        text: "If you enable a model and save a key, the text of this chat — and a short bundle of notes from this site — is sent from your browser straight to the endpoint you typed. Rep Trackers does not proxy that call and does not see the key. Treat the key like a password. Anyone who can run script in this browser could read local storage, so use a key with a small spending limit.",
      },
      {
        type: "p",
        text: "Fonts load from Google Fonts. That is a request to Google when the page opens. The site does not add analytics.",
      },
    ],
  },
  {
    id: "ethics",
    title: "Ethical AI",
    summary: "The companion is included. A generative model is optional and visible.",
    icon: "spark",
    blocks: [
      {
        type: "p",
        text: "The default companion does not generate open-ended medical claims. It retrieves short notes that ship with the site, then writes a fixed style of reply: a reflection, the note, and one next question. You can read those notes in the articles.",
      },
      {
        type: "ul",
        items: [
          "Crisis language never calls a model. You get helplines instead.",
          "The companion refuses diagnosis and medication advice.",
          "A connected model receives the same limits in its instructions, and the local notes as context.",
          "If the model request fails, the included companion still answers. The page does not depend on it.",
          "Replies are labelled Included companion, Connected model, or Companion fallback.",
        ],
      },
      {
        type: "p",
        text: "Somatotypes are not used as biological facts. The body tool offers a movement mix from your answers plus an optional low-confidence photo hint.",
      },
    ],
  },
  {
    id: "cases",
    title: "Case studies",
    summary: "Illustrative composites of how the on-page tools get used. Not individual records.",
    icon: "users",
    blocks: [
      {
        type: "p",
        text: "These sketches combine common situations. They are not testimonials, not clinic data, and not people on the sample leaderboard.",
      },
      {
        type: "h",
        text: "A hostel week",
      },
      {
        type: "p",
        text: "A student uses the plate guide at the mess, logs a walk after dinner, and asks the companion about late-night studying. The useful change is a fixed lights-out and one logged walk, not a new diet identity.",
      },
      {
        type: "h",
        text: "A family kitchen",
      },
      {
        type: "p",
        text: "Two adults share the vegetarian day plan, switch the variant once, and ignore the calorie range because one of them is pregnant and already seeing a dietitian. The page is a menu spark, not the care plan.",
      },
      {
        type: "h",
        text: "A restart after illness",
      },
      {
        type: "p",
        text: "Someone cleared to walk by their clinician uses the ease-in mix and the streak only as a reminder. They reset the on-device score on a shared laptop at work.",
      },
    ],
  },
  {
    id: "risks",
    title: "Risk register",
    summary: "Harms we can see from a static health page, and the response built into it.",
    icon: "target",
    blocks: [
      {
        type: "h",
        text: "BMI read as a diagnosis",
      },
      {
        type: "p",
        text: "Response: the result names a WHO-style range for adults, shows a healthy-weight span for the height entered, and says what the number cannot tell you. It is not calculated for missing or extreme inputs.",
      },
      {
        type: "h",
        text: "Photo feels like surveillance",
      },
      {
        type: "p",
        text: "Response: the preview stays in the tab. The silhouette step is explained as low confidence. The movement mix works with answers alone.",
      },
      {
        type: "h",
        text: "Chatbot misses a crisis",
      },
      {
        type: "p",
        text: "Response: matching language skips the model and shows AASRA, iCall, 988, and the IASP directory. This is not a monitoring service.",
      },
      {
        type: "h",
        text: "A connected model overclaims",
      },
      {
        type: "p",
        text: "Response: instructions forbid diagnosis and doses. The badge says the chat left the device. Failure falls back to included notes. Some providers block browser calls; that is expected, not a hidden server.",
      },
      {
        type: "h",
        text: "Sample board looks live",
      },
      {
        type: "p",
        text: "Response: the card says the board is bundled with the site and that your score is stored on the device. Rank math uses that fixed list.",
      },
      {
        type: "h",
        text: "Meal plan used as treatment",
      },
      {
        type: "p",
        text: "Response: ranges are labelled educational. The copy tells you to adjust for appetite, culture, and medical care.",
      },
    ],
  },
  {
    id: "code",
    title: "Code of ethics",
    summary: "The limits on language, claims, and inclusion.",
    icon: "heart",
    blocks: [
      {
        type: "ul",
        items: [
          "Speak to the person in front of the page. Do not grade their body.",
          "Prefer the next small action over a transformation promise.",
          "Say when a number is a sample, an estimate, or a self-check.",
          "Keep vegetarian, vegan, and flexible plates equally specific.",
          "Do not hide that an optional model sends text to a third party.",
          "Do not invent live community counts. Published sample figures stay labelled.",
          "Leave diagnosis, supplements, and training loads for qualified people.",
          "Make the static page useful with the network off, except for fonts and an optional model the visitor chose.",
        ],
      },
    ],
  },
  {
    id: "framework",
    title: "Action framework",
    summary: "How a concern on this static site becomes a change in the files.",
    icon: "check",
    blocks: [
      {
        type: "ol",
        items: [
          "Name the harm: misuse, shame, privacy, crisis, or a false claim of live data.",
          "Find the file that produces it — a copy block, a formula, or the model instructions.",
          "Change the included content so the safe path works with no server.",
          "If a model is involved, keep the included companion as the path that still answers.",
          "Update this register and the privacy note in the same change.",
          "Rebuild the static files. There is no production database to migrate.",
        ],
      },
      {
        type: "p",
        text: "The ordered list above is the whole loop. Accountability is a commit to this repository, not a dashboard.",
      },
    ],
  },
];

export function articleById(id: string): Article | undefined {
  return articles.find((article) => article.id === id);
}

export function docById(id: string): DocPage | undefined {
  return docs.find((doc) => doc.id === id);
}
