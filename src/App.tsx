import { FormEvent, useEffect, useRef, useState, type ReactNode } from "react";
import { SAMPLE_CHALLENGE_JOINED, SAMPLE_PLEDGE_COUNT } from "@/data/board";
import {
  articleById,
  articles,
  docById,
  docs,
  gallery,
  values,
  type Block,
} from "@/data/library";
import { Icon } from "@/icons";
import {
  assessBmi,
  formatWeight,
  imperialToMetric,
  metricToImperial,
  parseMeasurement,
  toMetric,
  type UnitSystem,
} from "@/lib/bmi";
import { localAnswer, SUGGESTED_PROMPTS } from "@/lib/companion";
import {
  VARIANT_COUNT,
  buildDay,
  formatMealPlanText,
  type ActivityLevel,
  type DietGoal,
  type DietPreference,
} from "@/lib/diet";
import {
  mixFromCheck,
  readSilhouette,
  type Build,
  type Change,
  type FrameAnswers,
  type Silhouette,
} from "@/lib/frame";
import {
  PROVIDER_PRESETS,
  askModel,
  explainModelError,
  type LLMProviderId,
} from "@/lib/model";
import {
  ACTIONS,
  exportProgressJson,
  getHabitTier,
  importProgressJson,
  leaders,
  rankSummary,
  todayKey,
} from "@/lib/progress";
import { StoreProvider, useStore, type ToolId } from "@/store";

const CHAT_KEY = "reptrackers.chat.v2";

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
  const [menu, setMenu] = useState(false);
  const [drop, setDrop] = useState<"tools" | "more" | null>(null);
  function shut() {
    setMenu(false);
    setDrop(null);
  }
  return (
    <header className="site-header">
      <div className="nav-shell">
        <Logo />
        <button
          className="menu-button"
          type="button"
          onClick={() => setMenu((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={menu}
        >
          <Icon name={menu ? "close" : "bars"} />
        </button>
        <nav className={menu ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
          <a href="#about" onClick={shut}>
            Introduction
          </a>
          <div className={drop === "tools" ? "nav-drop is-open" : "nav-drop"}>
            <button
              className="nav-link"
              type="button"
              aria-expanded={drop === "tools"}
              onClick={() => setDrop((current) => (current === "tools" ? null : "tools"))}
            >
              Features & tools <Icon name="chevron" size={14} />
            </button>
            <div className="nav-menu">
              <a href="#tool-bmi" onClick={shut}>
                BMI calculator
              </a>
              <a href="#tool-body" onClick={shut}>
                Body movement mix
              </a>
              <a href="#tool-diet" onClick={shut}>
                Diet suggestion
              </a>
              <a href="#tool-chat" onClick={shut}>
                Wellness chat
              </a>
            </div>
          </div>
          <a href="#tool-diet" onClick={shut}>
            Diet suggestion
          </a>
          <a href="#leaderboard" onClick={shut}>
            Leaderboard
          </a>
          <a href="#articles" onClick={shut}>
            Articles
          </a>
          <div className={drop === "more" ? "nav-drop is-open" : "nav-drop"}>
            <button
              className="nav-link"
              type="button"
              aria-expanded={drop === "more"}
              onClick={() => setDrop((current) => (current === "more" ? null : "more"))}
            >
              Trust & Docs <Icon name="chevron" size={14} />
            </button>
            <div className="nav-menu">
              {docs.map((doc) => (
                <a key={doc.id} href={`#doc-${doc.id}`} onClick={shut}>
                  {doc.title}
                </a>
              ))}
            </div>
          </div>
        </nav>
        <a className="nav-cta" href="#pledge">
          Take the pledge
        </a>
      </div>
    </header>
  );
}

function HeroArt() {
  const { loggedToday, progress } = useStore();
  const energy = (6 + loggedToday.length * 0.8).toFixed(1);
  return (
    <div className="hero-art" aria-label="Illustration of an active community">
      <div className="sun" />
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="art-card stat-card">
        <span title="Starts at 6.0 and rises by 0.8 for each action logged today on this device.">
          Today’s energy
        </span>
        <strong>{energy}</strong>
        <div className="mini-bars">
          <i style={{ opacity: loggedToday.length > 0 ? 1 : undefined }} />
          <i style={{ opacity: loggedToday.length > 1 ? 1 : 0.35 }} />
          <i style={{ opacity: loggedToday.length > 2 ? 1 : 0.35 }} />
          <i style={{ opacity: loggedToday.length > 3 ? 1 : 0.35 }} />
          <i style={{ opacity: loggedToday.length > 4 ? 1 : 0.35 }} />
        </div>
      </div>
      <div className="art-card habit-card">
        <span className="habit-icon">
          <Icon name="check" size={18} />
        </span>
        <div>
          <strong>Daily check-in</strong>
          <span>{progress.streak > 0 ? `${progress.streak} day rhythm` : "Log one action"}</span>
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
            students, families and communities with complete privacy.
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
            on their own terms, without shame or rigid dogma.
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
  const { logAction, loggedToday } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const guide = gallery.find((item) => item.letter === open);
  const action = ACTIONS.find((item) => item.id === guide?.action);
  const logged = guide ? loggedToday.includes(guide.action) : false;
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
              <button
                className="gallery-open"
                type="button"
                aria-expanded={open === item.letter}
                onClick={() => setOpen((current) => (current === item.letter ? null : item.letter))}
              >
                {open === item.letter ? "Hide practice" : "Try this"}
              </button>
            </div>
          </article>
        ))}
      </div>
      {guide && action && (
        <div className="gallery-detail">
          <div>
            <strong>{guide.title}</strong>
            <p>{guide.practice}</p>
          </div>
          <button type="button" disabled={logged} onClick={() => logAction(guide.action)}>
            {logged ? "Logged today ✓" : `Log it · +${action.points} pts`}
          </button>
          <a className="primary-button compact" href={`#tool-${guide.tool}`}>
            Open tool <Icon name="arrow" />
          </a>
        </div>
      )}
    </section>
  );
}

function BmiTool() {
  const { logAction, loggedToday } = useStore();
  const [unit, setUnit] = useState<UnitSystem>("metric");
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("65");
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("7");
  const [pounds, setPounds] = useState("143");

  function handleUnitToggle(nextUnit: UnitSystem) {
    if (nextUnit === unit) return;
    if (nextUnit === "imperial") {
      const h = parseMeasurement(height);
      const w = parseMeasurement(weight);
      if (h !== null && w !== null) {
        const imp = metricToImperial(h, w);
        setFeet(imp.feet);
        setInches(imp.inches);
        setPounds(imp.pounds);
      }
    } else {
      const f = parseMeasurement(feet);
      const i = parseMeasurement(inches);
      const p = parseMeasurement(pounds);
      if (f !== null && i !== null && p !== null) {
        const met = imperialToMetric(f, i, p);
        setHeight(met.heightCm);
        setWeight(met.weightKg);
      }
    }
    setUnit(nextUnit);
  }

  const metric = toMetric({
    unit,
    heightCm: parseMeasurement(height),
    weightKg: parseMeasurement(weight),
    feet: parseMeasurement(feet),
    inches: parseMeasurement(inches),
    pounds: parseMeasurement(pounds),
  });
  const result = metric ? assessBmi(metric.heightCm, metric.weightKg) : null;
  const isLogged = loggedToday.includes("checkin");

  return (
    <div className="tool-panel bmi-panel">
      <div className="panel-copy">
        <span className="tool-kicker">
          <Icon name="calculator" /> Quick health check
        </span>
        <h3>Know your BMI range</h3>
        <p>
          Adult screening ranges from the World Health Organization (WHO), calculated 100% on this
          device. BMI is a population screening tool, not a measure of body composition or fitness.
        </p>
        <div className="unit-toggle" role="group" aria-label="Measurement units">
          <button
            type="button"
            className={unit === "metric" ? "active" : ""}
            onClick={() => handleUnitToggle("metric")}
          >
            Metric (cm / kg)
          </button>
          <button
            type="button"
            className={unit === "imperial" ? "active" : ""}
            onClick={() => handleUnitToggle("imperial")}
          >
            Imperial (ft / lb)
          </button>
        </div>
        <div className="input-pair">
          {unit === "metric" ? (
            <>
              <label>
                Height <span>cm</span>
                <input
                  type="number"
                  value={height}
                  min="80"
                  max="250"
                  onChange={(event) => setHeight(event.target.value)}
                />
              </label>
              <label>
                Weight <span>kg</span>
                <input
                  type="number"
                  value={weight}
                  min="20"
                  max="300"
                  onChange={(event) => setWeight(event.target.value)}
                />
              </label>
            </>
          ) : (
            <>
              <label>
                Height <span>ft</span>
                <input
                  type="number"
                  value={feet}
                  min="3"
                  max="8"
                  onChange={(event) => setFeet(event.target.value)}
                />
              </label>
              <label>
                Inches <span>in</span>
                <input
                  type="number"
                  value={inches}
                  min="0"
                  max="11"
                  onChange={(event) => setInches(event.target.value)}
                />
              </label>
              <label className="span-2">
                Weight <span>lb</span>
                <input
                  type="number"
                  value={pounds}
                  min="44"
                  max="660"
                  onChange={(event) => setPounds(event.target.value)}
                />
              </label>
            </>
          )}
        </div>
        <div className="tool-action-row">
          <button
            type="button"
            className="tool-inline-btn"
            disabled={isLogged}
            onClick={() => logAction("checkin")}
          >
            <Icon name="check" size={15} />
            {isLogged ? "Daily Check-in Logged" : "Log Check-in · +25 pts"}
          </button>
        </div>
      </div>
      <div className="bmi-result">
        <p>Your result</p>
        <strong>{result ? result.bmi.toFixed(1) : "—"}</strong>
        <span className={result ? `bmi-status-tag ${result.band.badgeClass}` : ""}>
          {result ? result.band.label : "Enter a valid adult range"}
        </span>
        <div className="bmi-scale" aria-hidden="true">
          <i className="scale-one" />
          <i className="scale-two" />
          <i className="scale-three" />
          <i className="scale-four" />
          <b style={{ left: `${result ? result.marker : 4}%` }} />
        </div>
        <div className="scale-labels">
          <span>Under (&lt;18.5)</span>
          <span>Healthy (18.5–24.9)</span>
          <span>Over (25–29.9)</span>
          <span>High (30+)</span>
        </div>
        {result && (
          <div className="bmi-delta-box">
            {result.status === "healthy" ? (
              <span className="delta-success">✓ Within standard healthy weight range</span>
            ) : (
              <span className="delta-note">
                {result.status === "below" ? "Below" : "Above"} threshold by about{" "}
                <strong>{formatWeight(result.deltaKg, unit)}</strong>
              </span>
            )}
          </div>
        )}
        <p className="bmi-extra">
          {result
            ? `${result.band.note} At this height, healthy adult weights sit between ${formatWeight(result.healthyMinKg, unit)} and ${formatWeight(result.healthyMaxKg, unit)}.`
            : "Height needs to sit between 80 and 250 cm (about 3 to 8 ft), and weight between 20 and 300 kg."}
        </p>
      </div>
    </div>
  );
}

function BodyTool() {
  const { logAction, loggedToday } = useStore();
  const [image, setImage] = useState<string | null>(null);
  const [answers, setAnswers] = useState<FrameAnswers>({ silhouette: "", build: "", change: "" });
  const [photoNote, setPhotoNote] = useState<string | null>(null);
  const [result, setResult] = useState<ReturnType<typeof mixFromCheck>>(null);
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  function handleFile(file?: File) {
    if (!file) return;
    setImage(URL.createObjectURL(file));
    setChecked(false);
    setResult(null);
    setPhotoNote(null);
  }

  function clearPhoto(e: React.MouseEvent) {
    e.stopPropagation();
    if (image) URL.revokeObjectURL(image);
    setImage(null);
    setPhotoNote(null);
    setChecked(false);
  }

  async function analyze() {
    setBusy(true);
    let hint = null;
    let note: string | null = null;
    if (image) {
      hint = await readSilhouette(image);
      if (!hint) {
        note =
          "This photo didn’t yield a clear full-body silhouette. A plain, high-contrast background helps. The check still used your answers.";
      }
    }
    const mix = mixFromCheck(answers, hint);
    setPhotoNote(mix?.photoNote ?? note);
    setResult(mix);
    setChecked(true);
    setBusy(false);
  }

  const isMoveLogged = loggedToday.includes("walk");

  return (
    <div className="tool-panel body-panel">
      <div className="upload-zone" onClick={() => fileRef.current?.click()}>
        {image ? (
          <div className="photo-preview-wrap">
            <img src={image} alt="Uploaded for private on-device silhouette check" />
            <button
              type="button"
              className="photo-remove-btn"
              onClick={clearPhoto}
              title="Remove photo"
            >
              <Icon name="close" size={14} /> Remove
            </button>
          </div>
        ) : (
          <>
            <span>
              <Icon name="upload" size={30} />
            </span>
            <h3>Add a full-body photo</h3>
            <p>Optional. Analyzed inside your browser canvas; never uploaded to any server.</p>
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
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      </div>
      <div className="analysis-copy">
        <span className="tool-kicker">
          <Icon name="body" /> Private on-device check
        </span>
        <h3>Choose a movement mix</h3>
        <p>
          Answer from what you observe in the mirror. A photo, if you add one, only nudges the
          suggestion. This is not a clinical diagnosis.
        </p>
        <div className="stack-fields">
          <label>
            Shoulders compared with hips
            <select
              value={answers.silhouette}
              onChange={(event) =>
                setAnswers((current) => ({
                  ...current,
                  silhouette: event.target.value as Silhouette | "",
                }))
              }
            >
              <option value="">Choose one</option>
              <option value="narrow">Narrower shoulders (triangular / pear)</option>
              <option value="even">About the same width (balanced frame)</option>
              <option value="broad">Broader shoulders (athletic V / inverted)</option>
            </select>
          </label>
          <label>
            How you describe your natural build
            <select
              value={answers.build}
              onChange={(event) =>
                setAnswers((current) => ({ ...current, build: event.target.value as Build | "" }))
              }
            >
              <option value="">Choose one</option>
              <option value="lean">Lean — finer joints, lighter frame</option>
              <option value="athletic">Athletic — responsive musculature</option>
              <option value="solid">Solid — broader bone structure, naturally sturdy</option>
            </select>
          </label>
          <label>
            How your weight responds to routine changes
            <select
              value={answers.change}
              onChange={(event) =>
                setAnswers((current) => ({ ...current, change: event.target.value as Change | "" }))
              }
            >
              <option value="">Choose one</option>
              <option value="hard-gain">I struggle to gain weight or muscle</option>
              <option value="adapts">Training and eating change me steadily</option>
              <option value="holds">I hold on to weight easily</option>
            </select>
          </label>
        </div>
        <div className="action-button-row">
          <button className="primary-button compact" type="button" onClick={analyze} disabled={busy}>
            {busy ? "Checking on device…" : "Build my movement mix"} <Icon name="arrow" />
          </button>
        </div>
        {checked && !result && (
          <p className="tool-inline-note">Please answer at least one question or add a clear full-body photo.</p>
        )}
        {result && (
          <div className="analysis-result">
            <span>
              <Icon name="check" />
            </span>
            <div>
              <strong>{result.title}</strong>
              <p>{result.summary}</p>
              <ul className="mix-list">
                {result.moves.map((move) => (
                  <li key={move}>{move}</li>
                ))}
              </ul>
              {photoNote && <p className="photo-note-text">{photoNote}</p>}
              <div className="tool-action-row mt-12">
                <button
                  type="button"
                  className="tool-inline-btn"
                  disabled={isMoveLogged}
                  onClick={() => logAction("walk")}
                >
                  <Icon name="check" size={15} />
                  {isMoveLogged ? "Movement Logged Today" : "Log Movement · +40 pts"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DietTool() {
  const { logAction, loggedToday, setToast } = useStore();
  const [goal, setGoal] = useState<DietGoal>("steady-energy");
  const [preference, setPreference] = useState<DietPreference>("vegetarian");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [variant, setVariant] = useState(0);
  const [copied, setCopied] = useState(false);

  const plan = buildDay(goal, preference, activity, variant % VARIANT_COUNT);
  const isWaterLogged = loggedToday.includes("water");

  function copyPlan() {
    const text = formatMealPlanText(plan, goal, preference);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setToast("📋 Meal plan copied to clipboard!");
    setTimeout(() => setCopied(false), 2400);
  }

  return (
    <div className="tool-panel diet-panel">
      <div className="diet-controls">
        <span className="tool-kicker">
          <Icon name="leaf" /> Flexible meal ideas
        </span>
        <h3>Build a simple day of eating</h3>
        <p>Every meal idea is bundled inside this static page. Adjust goals, preferences, or randomize variants.</p>
        <label>
          Your wellness focus
          <select value={goal} onChange={(event) => setGoal(event.target.value as DietGoal)}>
            <option value="steady-energy">Steady energy through the day</option>
            <option value="strength">Build strength & muscle</option>
            <option value="feel-lighter">Feel lighter & digestive ease</option>
          </select>
        </label>
        <label>
          Food preference
          <select
            value={preference}
            onChange={(event) => setPreference(event.target.value as DietPreference)}
          >
            <option value="vegetarian">Vegetarian (with dairy)</option>
            <option value="vegan">Vegan-friendly (plant-based)</option>
            <option value="flexible">Flexible (includes eggs/fish/chicken)</option>
          </select>
        </label>
        <label>
          Activity level today
          <select value={activity} onChange={(event) => setActivity(event.target.value as ActivityLevel)}>
            <option value="light">Light — mostly seated / desk work</option>
            <option value="moderate">Moderate — walking or standard training</option>
            <option value="high">High — long, demanding session or sports</option>
          </select>
        </label>
        <div className="diet-button-row">
          <button
            className="small-button diet-shuffle"
            type="button"
            onClick={() => setVariant((value) => value + 1)}
          >
            <Icon name="refresh" size={14} /> Another idea
          </button>
          <button className="small-button" type="button" onClick={copyPlan}>
            <Icon name="copy" size={14} /> {copied ? "Copied!" : "Copy plan"}
          </button>
        </div>
      </div>
      <div className="meal-plan">
        <div className="meal-plan-head">
          <div>
            <small>{plan.range} · educational estimate</small>
            <strong>{plan.title}</strong>
          </div>
          <span>
            <Icon name="leaf" />
          </span>
        </div>
        <div className="macro-bar">
          <span className="macro-pill">Carbs: ~{plan.macros.carbs}%</span>
          <span className="macro-pill">Protein: ~{plan.macros.protein}%</span>
          <span className="macro-pill">Fats: ~{plan.macros.fats}%</span>
          <span className="macro-pill water">💧 Water: {plan.macros.waterLiters}</span>
        </div>
        {plan.meals.map((item) => (
          <div className="meal-row" key={item.slot}>
            <span>
              <Icon name="check" size={15} />
            </span>
            <div>
              <strong>{item.slot}</strong>
              <p>{item.note}</p>
            </div>
          </div>
        ))}
        <p className="diet-note">
          {plan.portion} Adjust for appetite, culture, and individual health needs.
        </p>
        <div className="diet-footer-row">
          <a className="diet-read" href="#article-plate">
            Read plate guide <Icon name="arrow" size={14} />
          </a>
          <button
            type="button"
            className="tool-inline-btn"
            disabled={isWaterLogged}
            onClick={() => logAction("water")}
          >
            <Icon name="check" size={14} />
            {isWaterLogged ? "Hydration Logged" : "Log Water · +15 pts"}
          </button>
        </div>
      </div>
    </div>
  );
}

type ChatMessage = {
  role: "bot" | "user";
  text: string;
  sources?: { id: string; title: string }[];
  mode?: "local" | "model" | "fallback";
  modelName?: string;
};

const OPENING_CHAT: ChatMessage = {
  role: "bot",
  text: "Hi, I’m here to listen. What feels most important today—stress, sleep, gentle movement, balanced meals, or building a small habit?",
  mode: "local",
};

function loadChat(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_KEY) || localStorage.getItem("reptrackers.chat.v1");
    if (!raw) return [OPENING_CHAT];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [OPENING_CHAT];
    const messages = parsed.filter(
      (item): item is ChatMessage =>
        Boolean(item) &&
        typeof item === "object" &&
        ((item as ChatMessage).role === "bot" || (item as ChatMessage).role === "user") &&
        typeof (item as ChatMessage).text === "string",
    );
    return messages.length > 0 ? messages.slice(-40) : [OPENING_CHAT];
  } catch {
    return [OPENING_CHAT];
  }
}

function ChatTool() {
  const { model, setModel, openArticle, setToast } = useStore();
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([OPENING_CHAT]);
  const [hydrated, setHydrated] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(loadChat());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-40)));
  }, [messages, hydrated]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [messages, pending]);

  async function handleSend(textToSend: string) {
    const text = textToSend.trim();
    if (!text || pending) return;
    const history = messages;
    setMessages((current) => [...current, { role: "user", text }]);
    setInput("");
    setPending(true);
    const local = localAnswer(text, history);

    try {
      if (local.crisis || !model.useModel || !model.apiKey.trim()) {
        setMessages((current) => [
          ...current,
          { role: "bot", text: local.text, sources: local.sources, mode: "local" },
        ]);
        return;
      }
      try {
        const answer = await askModel(model, [...history, { role: "user", text }], local.context);
        setMessages((current) => [
          ...current,
          {
            role: "bot",
            text: answer,
            sources: local.sources,
            mode: "model",
            modelName: model.model,
          },
        ]);
      } catch (error) {
        const reason = explainModelError(error, model);
        setMessages((current) => [
          ...current,
          {
            role: "bot",
            text: `${local.text}\n\n[Connected model note: ${reason}. Reply provided by the built-in offline wellness engine.]`,
            sources: local.sources,
            mode: "fallback",
          },
        ]);
      }
    } finally {
      setPending(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    handleSend(input);
  }

  async function runTestConnection() {
    setTesting(true);
    setTestResult(null);
    try {
      const ping = await askModel(
        model,
        [{ role: "user", text: "Say 'Ready' in one word." }],
        "System connectivity check.",
      );
      setTestResult({
        ok: true,
        msg: `Connection successful! Model response: "${ping.slice(0, 40)}"`,
      });
    } catch (err) {
      setTestResult({
        ok: false,
        msg: explainModelError(err, model),
      });
    } finally {
      setTesting(false);
    }
  }

  function copyTranscript() {
    const lines = messages.map(
      (m) => `${m.role === "user" ? "You" : "Mindful Companion"}: ${m.text}`,
    );
    navigator.clipboard.writeText(lines.join("\n\n"));
    setToast("💬 Conversation copied to clipboard!");
  }

  const currentPreset = PROVIDER_PRESETS.find((p) => p.id === model.provider);
  const badgeLabel = model.useModel && model.apiKey.trim() ? "Online LLM Active" : "Static Companion Active";

  return (
    <div className="tool-panel chat-panel">
      <div className="chat-head">
        <div className="bot-avatar">
          <Icon name="brain" />
        </div>
        <div>
          <strong>Mindful companion</strong>
          <span>
            <i /> {model.useModel && model.apiKey.trim() ? `Connected: ${model.model}` : "100% On this page (Offline & Private)"}
          </span>
        </div>
        <div className="chat-head-actions">
          <button
            type="button"
            className="chat-icon-btn"
            onClick={copyTranscript}
            title="Copy conversation"
          >
            <Icon name="copy" size={14} />
          </button>
          <span className="private-badge">
            <Icon name="shield" size={15} /> {badgeLabel}
          </span>
        </div>
      </div>

      <div className="messages" ref={threadRef} aria-live="polite">
        {messages.map((message, index) => (
          <div className={`message ${message.role}`} key={`${message.role}-${index}`}>
            <div className="message-content">{message.text}</div>
            {message.role === "bot" && message.mode && (
              <div className="message-meta">
                {message.mode === "model"
                  ? `✦ ${message.modelName || "Connected model"}`
                  : message.mode === "fallback"
                    ? "Offline companion (model unreachable)"
                    : "Included static companion"}
              </div>
            )}
            {message.sources && message.sources.length > 0 && (
              <div className="source-row">
                <span className="source-label">Related guide:</span>
                {message.sources.map((source) => (
                  <button key={source.id} type="button" onClick={() => openArticle(source.id)}>
                    <Icon name="link" size={12} /> {source.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {pending && <div className="message bot pending-pulse">Reflecting thoughtfully…</div>}
      </div>

      <div className="quick-prompts-row" aria-label="Quick question prompts">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="quick-chip"
            disabled={pending}
            onClick={() => handleSend(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      <form className="chat-input" onSubmit={submit}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Share what’s on your mind (e.g., sleep, stress, walking)..."
          aria-label="Chat message"
          disabled={pending}
        />
        <button aria-label="Send message" disabled={pending || !input.trim()}>
          <Icon name="arrow" />
        </button>
      </form>

      <details className="chat-settings">
        <summary>
          <span>
            <Icon name="spark" size={15} /> Connect Your Own LLM Model (Optional)
          </span>
          <small>{model.useModel ? "Configured" : "Offline mode"}</small>
        </summary>
        <div className="settings-body">
          <p className="settings-desc">
            The page ships with a comprehensive built-in wellness coach that requires no API keys or
            network. You can optionally connect your own LLM provider. Your browser calls the endpoint
            directly; keys remain in your browser’s local storage.
          </p>

          <label className="check-row">
            <input
              type="checkbox"
              checked={model.useModel}
              onChange={(event) => setModel({ useModel: event.target.checked })}
            />
            <span>Enable connected LLM for conversation responses</span>
          </label>

          <label>
            Provider Preset
            <select
              value={model.provider}
              onChange={(event) => {
                const id = event.target.value as LLMProviderId;
                const preset = PROVIDER_PRESETS.find((p) => p.id === id);
                if (preset && id !== "custom") {
                  setModel({
                    provider: id,
                    baseUrl: preset.baseUrl,
                    model: preset.model,
                  });
                } else {
                  setModel({ provider: id });
                }
                setTestResult(null);
              }}
            >
              {PROVIDER_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          {currentPreset && (
            <div className="preset-info-banner">
              <span>{currentPreset.description}</span>
              {currentPreset.keyUrl && (
                <a
                  href={currentPreset.keyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="preset-key-link"
                >
                  Get API Key ↗
                </a>
              )}
            </div>
          )}

          <label>
            Endpoint URL
            <input
              value={model.baseUrl}
              autoComplete="off"
              placeholder="https://api.groq.com/openai/v1"
              onChange={(event) => setModel({ baseUrl: event.target.value })}
            />
          </label>

          <label>
            Model Identifier
            <input
              value={model.model}
              placeholder="e.g. llama-3.3-70b-versatile or gemini-2.0-flash"
              onChange={(event) => setModel({ model: event.target.value })}
            />
          </label>

          <label>
            API Key
            <div className="key-input-wrap">
              <input
                type={showKey ? "text" : "password"}
                value={model.apiKey}
                autoComplete="off"
                placeholder={model.provider === "ollama" ? "Not required for local Ollama" : "sk-..."}
                onChange={(event) => setModel({ apiKey: event.target.value })}
              />
              <button
                type="button"
                className="key-toggle-btn"
                onClick={() => setShowKey((s) => !s)}
              >
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <div className="settings-actions">
            <button
              className="small-button"
              type="button"
              disabled={testing || (!model.apiKey.trim() && model.provider !== "ollama")}
              onClick={runTestConnection}
            >
              {testing ? "Testing…" : "Test API Connection"}
            </button>
            <button
              className="small-button text-danger"
              type="button"
              onClick={() => {
                if (window.confirm("Clear this chat conversation?")) {
                  setMessages([OPENING_CHAT]);
                  localStorage.removeItem(CHAT_KEY);
                  setToast("Chat cleared.");
                }
              }}
            >
              <Icon name="trash" size={13} /> Clear chat
            </button>
          </div>

          {testResult && (
            <div className={`test-result-box ${testResult.ok ? "is-ok" : "is-err"}`}>
              {testResult.msg}
            </div>
          )}
        </div>
      </details>

      <p className="chat-note">
        For general wellbeing encouragement only. In an emergency or crisis, please contact local
        emergency services immediately (988 in the US / AASRA 98204 66726 in India).
      </p>
    </div>
  );
}

const toolTabs: {
  id: ToolId;
  icon: "calculator" | "camera" | "leaf" | "message";
  title: string;
  detail: string;
}[] = [
  { id: "bmi", icon: "calculator", title: "BMI calculator", detail: "Check your range" },
  { id: "body", icon: "camera", title: "Body movement mix", detail: "On-device check" },
  { id: "diet", icon: "leaf", title: "Diet suggestion", detail: "Plan a balanced day" },
  { id: "chat", icon: "message", title: "Wellness chat", detail: "Talk things through" },
];

function Tools() {
  const { tool, selectTool } = useStore();
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
        {toolTabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tool === item.id}
            className={tool === item.id ? "active" : ""}
            onClick={() => selectTool(item.id)}
          >
            <Icon name={item.icon} />
            <span>
              <strong>{item.title}</strong>
              <small>{item.detail}</small>
            </span>
          </button>
        ))}
      </div>
      {tool === "bmi" ? (
        <BmiTool />
      ) : tool === "body" ? (
        <BodyTool />
      ) : tool === "diet" ? (
        <DietTool />
      ) : (
        <ChatTool />
      )}
    </section>
  );
}

function Community() {
  const {
    progress,
    loggedToday,
    setName,
    logAction,
    toggleChallenge,
    resetProgress,
    importProgress,
    setToast,
  } = useStore();
  const summary = rankSummary(progress.points);
  const board = leaders(progress.points, progress.name || "You", progress.streak);
  const tier = getHabitTier(progress.points);

  function exportBackup() {
    const json = exportProgressJson(progress);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reptrackers-backup-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast("💾 On-device backup file downloaded!");
  }

  function importBackup() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const imported = importProgressJson(text);
        importProgress(imported);
      } catch {
        alert("Invalid backup JSON file.");
      }
    };
    input.click();
  }

  return (
    <section className="community section" id="leaderboard">
      <div className="community-copy">
        <p className="eyebrow">Community challenge</p>
        <h2>Consistency beats intensity.</h2>
        <p>
          Log a healthy action on this device. Points, streaks, and your pledge stay in the browser.
          The names beside you are a sample board shipped with the site.
        </p>
        <div className="challenge-card">
          <span>
            <Icon name="target" size={28} />
          </span>
          <div>
            <small>This week’s challenge</small>
            <strong>20 mindful minutes</strong>
            <p>
              {progress.joinedChallenge
                ? "Saved on this device ✓"
                : `${SAMPLE_CHALLENGE_JOINED.toLocaleString()} people in the published sample`}
            </p>
          </div>
          <button type="button" aria-pressed={progress.joinedChallenge} onClick={toggleChallenge}>
            {progress.joinedChallenge ? "Joined" : "Join"}{" "}
            {progress.joinedChallenge ? <Icon name="check" size={16} /> : <Icon name="arrow" size={18} />}
          </button>
        </div>

        <div className="daily-meter-box">
          <div className="daily-meter-head">
            <span>Today’s Habit Progress</span>
            <strong>
              {loggedToday.length} of {ACTIONS.length} completed ({Math.round((loggedToday.length / ACTIONS.length) * 100)}%)
            </strong>
          </div>
          <div className="daily-meter-track">
            <div
              className="daily-meter-fill"
              style={{ width: `${(loggedToday.length / ACTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="action-grid">
          {ACTIONS.map((action) => {
            const done = loggedToday.includes(action.id);
            return (
              <button key={action.id} type="button" disabled={done} onClick={() => logAction(action.id)}>
                {action.label}
                <small>{done ? "Logged today ✓" : `+${action.points} · ${action.detail}`}</small>
              </button>
            );
          })}
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
          <div className="tier-tag">
            <span>{tier.badge}</span>
            <small>{tier.name}</small>
          </div>
        </div>
        {board.map((person, index) => (
          <div className={person.you ? "leader-row is-you" : "leader-row"} key={`${person.name}-${index}`}>
            <b>{index + 1}</b>
            <span className="avatar">{person.initials}</span>
            <div>
              <strong>{person.you ? `${person.name} (you)` : person.name}</strong>
              <small>{person.streak} day streak</small>
            </div>
            <span>{person.points.toLocaleString()} pts</span>
          </div>
        ))}
        <div className="your-rank">
          <span>{summary.rank}</span>
          <div>
            <input
              className="name-input"
              aria-label="Name stored on this device"
              value={progress.name}
              maxLength={24}
              onChange={(event) => setName(event.target.value)}
            />
            <small>
              {summary.note}. #{summary.rank} of {summary.field}
            </small>
          </div>
          <b>{progress.points.toLocaleString()} pts</b>
        </div>
        <div className="leaderboard-footer-actions">
          <button className="text-button" type="button" onClick={exportBackup}>
            <Icon name="download" size={13} /> Export Backup
          </button>
          <button className="text-button" type="button" onClick={importBackup}>
            <Icon name="upload" size={13} /> Import Backup
          </button>
          <button
            className="text-button danger"
            type="button"
            onClick={() => {
              if (window.confirm("Reset the on-device score, streak, challenge, and pledge?")) resetProgress();
            }}
          >
            Reset on-device score
          </button>
        </div>
      </div>
    </section>
  );
}

function Pledge() {
  const { progress, togglePledge } = useStore();
  const pledged = Boolean(progress.pledgedAt);
  const date = progress.pledgedAt
    ? new Date(progress.pledgedAt).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
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
          ? `Saved on this device${date ? ` on ${date}` : ""}. Come back tomorrow and take one more small step.`
          : `Join ${SAMPLE_PLEDGE_COUNT.toLocaleString()} people choosing sustainable wellbeing—one day at a time.`}
      </p>
      <button className={pledged ? "pledged" : ""} type="button" onClick={togglePledge}>
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

function Articles() {
  const [all, setAll] = useState(false);
  const visible = all ? articles : articles.filter((article) => article.featured);
  return (
    <section className="articles section" id="articles">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Read more</p>
          <h2>Health, explained simply.</h2>
        </div>
        <button type="button" onClick={() => setAll((value) => !value)}>
          {all ? "Show the featured three" : "Browse all articles"} <Icon name="arrow" size={18} />
        </button>
      </div>
      <div className="article-grid">
        {visible.map((article) => (
          <article key={article.id}>
            <div className={`article-art ${article.color}`}>
              <span>{article.id.slice(0, 2).toUpperCase()}</span>
              <Icon name={article.icon} size={54} />
            </div>
            <small>{article.category}</small>
            <h3>{article.title}</h3>
            <div>
              <span>{article.time}</span>
              <a href={`#article-${article.id}`} aria-label={`Read ${article.title}`}>
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
          These notes ship with the page. The tools inform and encourage. They never replace a
          qualified clinician.
        </p>
      </div>
      <div className="more-grid">
        {docs.map((doc) => (
          <article key={doc.id}>
            <Icon name={doc.icon} />
            <h3>{doc.title}</h3>
            <p>{doc.summary}</p>
            <a href={`#doc-${doc.id}`}>
              Read <Icon name="arrow" size={16} />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose">
      {blocks.map((block, index) => {
        if (block.type === "h") return <h3 key={index}>{block.text}</h3>;
        if (block.type === "p") return <p key={index}>{block.text}</p>;
        const List = block.type === "ol" ? "ol" : "ul";
        return (
          <List key={index}>
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </List>
        );
      })}
    </div>
  );
}

function Sheet({ title, kicker, children }: { title: string; kicker: string; children: ReactNode }) {
  const { closeOverlay } = useStore();
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeOverlay();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [closeOverlay]);
  return (
    <div className="overlay" onClick={closeOverlay}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sheet-head">
          <div>
            <p className="eyebrow">{kicker}</p>
            <h2>{title}</h2>
          </div>
          <button ref={closeRef} className="sheet-close" type="button" onClick={closeOverlay} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}

function Reader() {
  const { articleId, docId } = useStore();
  if (!articleId && !docId) return null;
  const article = articleId ? articleById(articleId) : undefined;
  const doc = docId ? docById(docId) : undefined;
  if (articleId) {
    return (
      <Sheet title={article?.title ?? "That article isn’t in this build"} kicker={article?.category ?? "Articles"}>
        {article ? (
          <>
            <p className="sheet-summary">{article.summary}</p>
            <Blocks blocks={article.blocks} />
          </>
        ) : (
          <p className="prose">The link doesn’t match an article included with this page.</p>
        )}
      </Sheet>
    );
  }
  return (
    <Sheet title={doc?.title ?? "That note isn’t in this build"} kicker="Trust">
      {doc ? <Blocks blocks={doc.blocks} /> : <p className="prose">The link doesn’t match a note included with this page.</p>}
    </Sheet>
  );
}

function ToastBanner() {
  const { toast, setToast } = useStore();
  if (!toast) return null;
  return (
    <div className="toast-banner" role="status" aria-live="polite">
      <span>{toast}</span>
      <button type="button" onClick={() => setToast(null)} aria-label="Close toast">
        <Icon name="close" size={13} />
      </button>
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <Logo />
          <p>Small steps. Stronger lives. 100% Static web experience with on-device privacy.</p>
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

function Shell() {
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
                <Icon name="shield" size={18} /> 100% Static & Private
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
      <Reader />
      <ToastBanner />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
