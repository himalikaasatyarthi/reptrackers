import { FormEvent, useMemo, useRef, useState } from "react";

type IconName =
  | "arrow"
  | "bars"
  | "body"
  | "brain"
  | "calculator"
  | "camera"
  | "check"
  | "chevron"
  | "close"
  | "heart"
  | "leaf"
  | "medal"
  | "message"
  | "shield"
  | "spark"
  | "target"
  | "upload"
  | "users";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  const paths: Record<IconName, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    bars: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    body: (
      <>
        <circle cx="12" cy="4.5" r="2.5" />
        <path d="M8.5 10c1.2-1.5 2.3-2 3.5-2s2.3.5 3.5 2M9 9.5l-1 5 2 2-.5 5M15 9.5l1 5-2 2 .5 5" />
      </>
    ),
    brain: (
      <>
        <path d="M9.5 4.5A3 3 0 0 0 5 7a3 3 0 0 0-1 5.8A3.5 3.5 0 0 0 8 18a3 3 0 0 0 4 1.5V6a3 3 0 0 0-2.5-1.5Z" />
        <path d="M14.5 4.5A3 3 0 0 1 19 7a3 3 0 0 1 1 5.8 3.5 3.5 0 0 1-4 5.2 3 3 0 0 1-4 1.5M8 9.5c0 1.5 1 2.5 2.5 2.5M16 9.5c0 1.5-1 2.5-2.5 2.5" />
      </>
    ),
    calculator: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M8 7h8M8 11h1M12 11h1M16 11h1M8 15h1M12 15h1M16 15h1M8 18h1M12 18h5" />
      </>
    ),
    camera: (
      <>
        <path d="M4 8h3l1.5-2h7L17 8h3v11H4Z" />
        <circle cx="12" cy="13.5" r="3.5" />
      </>
    ),
    check: (
      <>
        <path d="m5 12 4 4L19 6" />
      </>
    ),
    chevron: (
      <>
        <path d="m8 10 4 4 4-4" />
      </>
    ),
    close: (
      <>
        <path d="M6 6l12 12M18 6 6 18" />
      </>
    ),
    heart: (
      <>
        <path d="M20.8 5.8a5.4 5.4 0 0 0-7.6 0L12 7l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 22l8.8-8.6a5.4 5.4 0 0 0 0-7.6Z" />
      </>
    ),
    leaf: (
      <>
        <path d="M20 4C10 4 5 9 5 16c5 0 10-2 12-7-1 5-4 8-9 10" />
      </>
    ),
    medal: (
      <>
        <circle cx="12" cy="14" r="5" />
        <path d="m8 3 4 6 4-6M9.5 14l1.6 1.3 3-3" />
      </>
    ),
    message: (
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 4.5 6v5.5c0 4.7 3.2 8 7.5 9.5 4.3-1.5 7.5-4.8 7.5-9.5V6Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    spark: (
      <>
        <path d="m12 2 1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7Z" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4m0 0L7 9m5-5 5 5M5 14v6h14v-6" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-4 2.7-7 6-7s6 3 6 7M16 5.5a3 3 0 0 1 0 5.5M17 14c2.4.7 4 3 4 6" />
      </>
    ),
  };
  return <svg {...common}>{paths[name]}</svg>;
}

const navItems = [
  { label: "Introduction", href: "#about" },
  { label: "Features & tools", href: "#tools", dropdown: true },
  { label: "Diet suggestion", href: "#articles" },
  { label: "Leaderboard", href: "#leaderboard" },
  { label: "Articles", href: "#articles" },
  { label: "More", href: "#more", dropdown: true },
];

const values = [
  ["Care first", "Health guidance should feel humane, encouraging and stigma-free.", "heart"],
  ["Small wins", "We turn overwhelming goals into steady, achievable daily actions.", "target"],
  ["Built for all", "Every body, routine and starting point deserves thoughtful support.", "users"],
] as const;

const gallery = [
  {
    letter: "F",
    title: "Find your pace",
    caption: "Movement that meets you where you are.",
    tone: "coral",
    icon: "target",
  },
  {
    letter: "I",
    title: "Invest in rest",
    caption: "Recovery is a vital part of progress.",
    tone: "blue",
    icon: "heart",
  },
  {
    letter: "T",
    title: "Train with joy",
    caption: "Consistency grows when movement feels good.",
    tone: "gold",
    icon: "spark",
  },
  {
    letter: "N",
    title: "Nourish daily",
    caption: "Simple food choices, never rigid rules.",
    tone: "mint",
    icon: "leaf",
  },
  {
    letter: "E",
    title: "Ease your mind",
    caption: "Pause, breathe and make room to reset.",
    tone: "violet",
    icon: "brain",
  },
  {
    letter: "S",
    title: "Support others",
    caption: "Health gets better when we do it together.",
    tone: "rose",
    icon: "users",
  },
] as const;

const leaderboard = [
  { name: "Mira S.", points: 2480, streak: 18, initials: "MS" },
  { name: "Aarav K.", points: 2320, streak: 14, initials: "AK" },
  { name: "Naina R.", points: 2185, streak: 12, initials: "NR" },
  { name: "Dev P.", points: 1960, streak: 11, initials: "DP" },
];

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Rep Trackers home">
      <span className="logo-mark">
        <Icon name="heart" size={18} />
      </span>
      <span>
        rep<span>trackers</span>
      </span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="nav-shell">
        <Logo />
        <button
          className="menu-button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <Icon name={open ? "close" : "bars"} />
        </button>
        <nav className={open ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
              {item.dropdown && <Icon name="chevron" size={14} />}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href="#pledge">
          Take the pledge
        </a>
      </div>
    </header>
  );
}

function HeroArt() {
  return (
    <div className="hero-art" aria-label="Illustration of an active community">
      <div className="sun" />
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="art-card stat-card">
        <span>Today’s energy</span>
        <strong>8.4</strong>
        <div className="mini-bars">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="art-card habit-card">
        <span className="habit-icon">
          <Icon name="check" size={18} />
        </span>
        <div>
          <strong>Daily check-in</strong>
          <span>4 day rhythm</span>
        </div>
      </div>
      <div className="person person-one">
        <span />
        <i />
      </div>
      <div className="person person-two">
        <span />
        <i />
      </div>
      <div className="ground-line" />
      <span className="floating-leaf leaf-a">
        <Icon name="leaf" size={42} />
      </span>
      <span className="floating-leaf leaf-b">
        <Icon name="leaf" size={30} />
      </span>
      <span className="spark-a">
        <Icon name="spark" size={30} />
      </span>
    </div>
  );
}

function About() {
  return (
    <section className="about section" id="about">
      <div className="about-intro">
        <p className="eyebrow">Introduction to health</p>
        <h2>Wellness isn’t one finish line. It’s how you move through every day.</h2>
      </div>
      <div className="purpose-grid">
        <article className="purpose-card featured">
          <span className="section-number">01</span>
          <div className="purpose-icon">
            <Icon name="target" />
          </div>
          <h3>Our mission</h3>
          <p>
            Make practical, preventive health guidance easy to understand and easier to act on—for
            students, families and communities.
          </p>
        </article>
        <article className="purpose-card">
          <span className="section-number">02</span>
          <div className="purpose-icon">
            <Icon name="spark" />
          </div>
          <h3>Our vision</h3>
          <p>
            A world where everyone has the confidence, tools and support to build a healthier life
            on their own terms.
          </p>
        </article>
        <div className="values-list">
          <p className="eyebrow">The values we keep</p>
          {values.map(([title, text, icon]) => (
            <div className="value-row" key={title}>
              <span>
                <Icon name={icon} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="gallery-section section" aria-labelledby="gallery-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">A gallery of better habits</p>
          <h2 id="gallery-title">Six ideas. One healthier you.</h2>
        </div>
        <p>
          Tap into a more balanced definition of fitness—one that includes how you move, eat, rest,
          think and connect.
        </p>
      </div>
      <div className="gallery-grid">
        {gallery.map((item) => (
          <article className={`gallery-card ${item.tone}`} key={item.letter}>
            <span className="gallery-letter">{item.letter}</span>
            <div className="gallery-symbol">
              <Icon name={item.icon} size={34} />
            </div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.caption}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BmiTool() {
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("65");
  const bmi = useMemo(() => {
    const h = Number(height) / 100;
    const w = Number(weight);
    return h > 0 && w > 0 ? w / (h * h) : 0;
  }, [height, weight]);
  const category =
    bmi < 18.5
      ? "Below healthy range"
      : bmi < 25
        ? "Healthy range"
        : bmi < 30
          ? "Above healthy range"
          : "High range";
  const position = Math.min(94, Math.max(4, ((bmi - 14) / 24) * 100));
  return (
    <div className="tool-panel bmi-panel">
      <div className="panel-copy">
        <span className="tool-kicker">
          <Icon name="calculator" /> Quick health check
        </span>
        <h3>Know your BMI range</h3>
        <p>
          Use this as a starting point—not a diagnosis. Bodies are more nuanced than a single
          number.
        </p>
        <div className="input-pair">
          <label>
            Height <span>cm</span>
            <input
              type="number"
              value={height}
              min="80"
              max="250"
              onChange={(e) => setHeight(e.target.value)}
            />
          </label>
          <label>
            Weight <span>kg</span>
            <input
              type="number"
              value={weight}
              min="20"
              max="300"
              onChange={(e) => setWeight(e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="bmi-result">
        <p>Your result</p>
        <strong>{bmi ? bmi.toFixed(1) : "—"}</strong>
        <span>{bmi ? category : "Enter valid measurements"}</span>
        <div className="bmi-scale">
          <i className="scale-one" />
          <i className="scale-two" />
          <i className="scale-three" />
          <i className="scale-four" />
          <b style={{ left: `${position}%` }} />
        </div>
        <div className="scale-labels">
          <span>Under</span>
          <span>Healthy</span>
          <span>Over</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
}

function BodyTool() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  function handleFile(file?: File) {
    if (!file) return;
    setImage(URL.createObjectURL(file));
    setAnalyzed(false);
  }
  return (
    <div className="tool-panel body-panel">
      <div className="upload-zone" onClick={() => fileRef.current?.click()}>
        {image ? (
          <img src={image} alt="Uploaded for posture preview" />
        ) : (
          <>
            <span>
              <Icon name="upload" size={30} />
            </span>
            <h3>Add a full-body photo</h3>
            <p>Use a clear, front-facing image in good light.</p>
            <button type="button" className="small-button">
              Choose photo
            </button>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      <div className="analysis-copy">
        <span className="tool-kicker">
          <Icon name="body" /> Private on-device preview
        </span>
        <h3>Understand your frame</h3>
        <p>
          This demo checks visual proportions to suggest balanced movement categories. Your image
          never leaves this page.
        </p>
        {image && !analyzed && (
          <button className="primary-button compact" onClick={() => setAnalyzed(true)}>
            Analyze photo <Icon name="arrow" />
          </button>
        )}
        {analyzed && (
          <div className="analysis-result">
            <span>
              <Icon name="check" />
            </span>
            <div>
              <strong>Balanced frame detected</strong>
              <p>
                Try a mix of mobility, functional strength and moderate cardio. Treat this as
                general guidance only.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DietTool() {
  const [goal, setGoal] = useState("steady-energy");
  const [preference, setPreference] = useState("vegetarian");
  const plans: Record<string, { meal: string; note: string }[]> = {
    "steady-energy": [
      { meal: "Breakfast", note: "Vegetable poha, curd and a seasonal fruit" },
      { meal: "Lunch", note: "Dal, brown rice, cucumber salad and roasted vegetables" },
      { meal: "Snack", note: "Roasted chana with lemon water" },
      { meal: "Dinner", note: "Paneer or tofu wrap with greens and mint chutney" },
    ],
    strength: [
      { meal: "Breakfast", note: "Besan chilla, curd and a banana" },
      { meal: "Lunch", note: "Rajma rice bowl with salad and seeds" },
      { meal: "Snack", note: "Peanut chaat with fruit" },
      { meal: "Dinner", note: "Palak paneer or tofu, roti and mixed vegetables" },
    ],
    "feel-lighter": [
      { meal: "Breakfast", note: "Overnight oats with fruit and chia" },
      { meal: "Lunch", note: "Millet khichdi with curd and crunchy salad" },
      { meal: "Snack", note: "Buttermilk and a small handful of nuts" },
      { meal: "Dinner", note: "Vegetable soup with moong chilla" },
    ],
  };
  return (
    <div className="tool-panel diet-panel">
      <div className="diet-controls">
        <span className="tool-kicker">
          <Icon name="leaf" /> Flexible meal ideas
        </span>
        <h3>Build a simple day of eating</h3>
        <p>Choose what matters today. We’ll suggest familiar, balanced meals—not rigid rules.</p>
        <label>
          Your focus
          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="steady-energy">Steady energy</option>
            <option value="strength">Build strength</option>
            <option value="feel-lighter">Feel lighter</option>
          </select>
        </label>
        <label>
          Food preference
          <select value={preference} onChange={(e) => setPreference(e.target.value)}>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan-friendly</option>
            <option value="flexible">Flexible</option>
          </select>
        </label>
      </div>
      <div className="meal-plan">
        <div className="meal-plan-head">
          <div>
            <small>One-day idea</small>
            <strong>
              {preference === "vegan"
                ? "Vegan-friendly"
                : preference === "flexible"
                  ? "Flexible plate"
                  : "Vegetarian plate"}
            </strong>
          </div>
          <span>
            <Icon name="leaf" />
          </span>
        </div>
        {plans[goal].map((item) => (
          <div className="meal-row" key={item.meal}>
            <span>
              <Icon name="check" size={15} />
            </span>
            <div>
              <strong>{item.meal}</strong>
              <p>
                {preference === "vegan"
                  ? item.note
                      .replaceAll("curd", "soy curd")
                      .replaceAll("Paneer", "Tofu")
                      .replaceAll("paneer", "tofu")
                      .replaceAll("Buttermilk", "Coconut water")
                  : item.note}
              </p>
            </div>
          </div>
        ))}
        <p className="diet-note">
          Adjust portions to your appetite, activity and medical needs. Consult a qualified
          dietitian for personalized care.
        </p>
      </div>
    </div>
  );
}

type ChatMessage = { role: "bot" | "user"; text: string };
function ChatTool() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Hi, I’m here to listen. What feels most important today—stress, sleep, motivation, or something else?",
    },
  ]);
  function submit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const lower = text.toLowerCase();
    let reply =
      "Thank you for sharing that. A gentle next step could be to pause, name what you need, and choose one small action for the next ten minutes. What would feel manageable?";
    if (lower.includes("sleep"))
      reply =
        "Sleep can affect everything else. Try dimming screens, keeping tomorrow’s tasks on paper, and taking five slow breaths. Has this been happening for more than a few nights?";
    if (lower.includes("stress") || lower.includes("anxious"))
      reply =
        "That sounds like a lot to carry. Try grounding yourself: notice five things you see, four you feel, and three you hear. You don’t have to solve everything at once.";
    setMessages((m) => [...m, { role: "user", text }, { role: "bot", text: reply }]);
    setInput("");
  }
  return (
    <div className="tool-panel chat-panel">
      <div className="chat-head">
        <div className="bot-avatar">
          <Icon name="brain" />
        </div>
        <div>
          <strong>Mindful companion</strong>
          <span>
            <i /> Here to support you
          </span>
        </div>
        <span className="private-badge">
          <Icon name="shield" size={15} /> Private chat
        </span>
      </div>
      <div className="messages">
        {messages.map((message, index) => (
          <div className={`message ${message.role}`} key={index}>
            {message.text}
          </div>
        ))}
      </div>
      <form className="chat-input" onSubmit={submit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share what’s on your mind…"
          aria-label="Chat message"
        />
        <button aria-label="Send message">
          <Icon name="arrow" />
        </button>
      </form>
      <p className="chat-note">
        For general wellbeing support only. If you may harm yourself or someone else, contact local
        emergency services now.
      </p>
    </div>
  );
}

function Tools() {
  const [active, setActive] = useState<"bmi" | "body" | "diet" | "chat">("bmi");
  return (
    <section className="tools-section section" id="tools">
      <div className="tools-heading">
        <div>
          <p className="eyebrow light">Features & tools</p>
          <h2>Start with what you need today.</h2>
        </div>
        <p>Useful, judgment-free tools designed to give you clarity and a simple next step.</p>
      </div>
      <div className="tool-tabs" role="tablist">
        <button className={active === "bmi" ? "active" : ""} onClick={() => setActive("bmi")}>
          <Icon name="calculator" />
          <span>
            <strong>BMI calculator</strong>
            <small>Check your range</small>
          </span>
        </button>
        <button className={active === "body" ? "active" : ""} onClick={() => setActive("body")}>
          <Icon name="camera" />
          <span>
            <strong>Body type</strong>
            <small>Photo-based preview</small>
          </span>
        </button>
        <button className={active === "diet" ? "active" : ""} onClick={() => setActive("diet")}>
          <Icon name="leaf" />
          <span>
            <strong>Diet suggestion</strong>
            <small>Plan a balanced day</small>
          </span>
        </button>
        <button className={active === "chat" ? "active" : ""} onClick={() => setActive("chat")}>
          <Icon name="message" />
          <span>
            <strong>Wellness chat</strong>
            <small>Talk things through</small>
          </span>
        </button>
      </div>
      {active === "bmi" ? (
        <BmiTool />
      ) : active === "body" ? (
        <BodyTool />
      ) : active === "diet" ? (
        <DietTool />
      ) : (
        <ChatTool />
      )}
    </section>
  );
}

function Community() {
  return (
    <section className="community section" id="leaderboard">
      <div className="community-copy">
        <p className="eyebrow">Community challenge</p>
        <h2>Consistency beats intensity.</h2>
        <p>
          Earn points for healthy actions—taking a walk, drinking water, checking in with yourself,
          or supporting a friend.
        </p>
        <div className="challenge-card">
          <span>
            <Icon name="target" size={28} />
          </span>
          <div>
            <small>This week’s challenge</small>
            <strong>20 mindful minutes</strong>
            <p>1,284 people have joined</p>
          </div>
          <button>
            Join <Icon name="arrow" size={18} />
          </button>
        </div>
      </div>
      <div className="leaderboard-card">
        <div className="leaderboard-title">
          <div>
            <span>
              <Icon name="medal" />
            </span>
            <h3>Healthy habits board</h3>
          </div>
          <small>This week</small>
        </div>
        {leaderboard.map((person, index) => (
          <div className="leader-row" key={person.name}>
            <b>{index + 1}</b>
            <span className="avatar">{person.initials}</span>
            <div>
              <strong>{person.name}</strong>
              <small>{person.streak} day streak</small>
            </div>
            <span>{person.points.toLocaleString()} pts</span>
          </div>
        ))}
        <div className="your-rank">
          <span>38</span>
          <div>
            <strong>You</strong>
            <small>Three actions from the top 30</small>
          </div>
          <b>1,240 pts</b>
        </div>
      </div>
    </section>
  );
}

function Pledge() {
  const [pledged, setPledged] = useState(false);
  return (
    <section className="pledge-section section" id="pledge">
      <div className="pledge-mark">
        <Icon name="heart" size={32} />
      </div>
      <p className="eyebrow light">A promise to yourself</p>
      <h2>
        {pledged
          ? "You chose progress over perfection."
          : "“I will care for my health with patience, curiosity and kindness.”"}
      </h2>
      <p>
        {pledged
          ? "Come back tomorrow and take one more small step."
          : "Join 12,480 people choosing sustainable wellbeing—one day at a time."}
      </p>
      <button className={pledged ? "pledged" : ""} onClick={() => setPledged(!pledged)}>
        {pledged ? (
          <>
            <Icon name="check" /> Pledge taken
          </>
        ) : (
          <>
            Take the pledge <Icon name="arrow" />
          </>
        )}
      </button>
    </section>
  );
}

const articles = [
  {
    category: "Nutrition",
    title: "Building a balanced plate without counting everything",
    time: "6 min read",
    color: "article-green",
    icon: "leaf",
  },
  {
    category: "Mental wellbeing",
    title: "A five-minute reset for overwhelming days",
    time: "4 min read",
    color: "article-purple",
    icon: "brain",
  },
  {
    category: "Movement",
    title: "Why walking still counts as a real workout",
    time: "5 min read",
    color: "article-orange",
    icon: "target",
  },
] as const;

function Articles() {
  return (
    <section className="articles section" id="articles">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Read more</p>
          <h2>Health, explained simply.</h2>
        </div>
        <a href="#more">
          Browse all articles <Icon name="arrow" size={18} />
        </a>
      </div>
      <div className="article-grid">
        {articles.map((article, index) => (
          <article key={article.title}>
            <div className={`article-art ${article.color}`}>
              <span>0{index + 1}</span>
              <Icon name={article.icon} size={54} />
            </div>
            <small>{article.category}</small>
            <h3>{article.title}</h3>
            <div>
              <span>{article.time}</span>
              <a href="#more" aria-label={`Read ${article.title}`}>
                <Icon name="arrow" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function More() {
  return (
    <section className="more-section section" id="more">
      <div className="more-intro">
        <p className="eyebrow light">Trust matters</p>
        <h2>Built responsibly, not just intelligently.</h2>
        <p>
          Our health tools are designed to inform and encourage. They never replace a qualified
          medical professional.
        </p>
      </div>
      <div className="more-grid">
        <article>
          <Icon name="shield" />
          <h3>Privacy policy</h3>
          <p>We minimize data collection and keep photo previews on your device.</p>
          <a href="#top">
            Read policy <Icon name="arrow" size={16} />
          </a>
        </article>
        <article>
          <Icon name="spark" />
          <h3>Ethical AI</h3>
          <p>Clear limitations, human-first language and no hidden medical claims.</p>
          <a href="#top">
            Our approach <Icon name="arrow" size={16} />
          </a>
        </article>
        <article>
          <Icon name="users" />
          <h3>Case studies</h3>
          <p>See how small habit programs help communities build healthy momentum.</p>
          <a href="#top">
            View stories <Icon name="arrow" size={16} />
          </a>
        </article>
        <article>
          <Icon name="target" />
          <h3>Risk register</h3>
          <p>How we identify, review and respond to possible harms in health technology.</p>
          <a href="#top">
            Review risks <Icon name="arrow" size={16} />
          </a>
        </article>
        <article>
          <Icon name="heart" />
          <h3>Code of ethics</h3>
          <p>The principles behind respectful language, inclusive choices and human oversight.</p>
          <a href="#top">
            Read the code <Icon name="arrow" size={16} />
          </a>
        </article>
        <article>
          <Icon name="check" />
          <h3>Action framework</h3>
          <p>A transparent path from ethical analysis to accountable product decisions.</p>
          <a href="#top">
            See framework <Icon name="arrow" size={16} />
          </a>
        </article>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <Logo />
          <p>Small steps. Stronger lives.</p>
        </div>
        <a href="#top">
          Back to top <Icon name="arrow" size={18} />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Rep Trackers</span>
        <span>Wellbeing tools are educational, not medical advice.</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div id="top">
      <Header />
      <main>
        <section className="hero section">
          <div className="hero-copy">
            <div className="hero-tag">
              <span>
                <Icon name="spark" size={14} />
              </span>{" "}
              A kinder way to get healthier
            </div>
            <h1>
              Better health starts with <em>one small step.</em>
            </h1>
            <p>
              Understand your body, build better habits and feel supported—without the pressure to
              be perfect.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#tools">
                Explore your tools <Icon name="arrow" />
              </a>
              <a className="text-link" href="#about">
                Our approach <Icon name="arrow" size={18} />
              </a>
            </div>
            <div className="trust-row">
              <span>
                <Icon name="shield" size={18} /> Privacy-first
              </span>
              <span>
                <Icon name="heart" size={18} /> Judgment-free
              </span>
              <span>
                <Icon name="spark" size={18} /> Built for real life
              </span>
            </div>
          </div>
          <HeroArt />
        </section>
        <About />
        <Gallery />
        <Tools />
        <Community />
        <Pledge />
        <Articles />
        <More />
      </main>
      <Footer />
    </div>
  );
}
