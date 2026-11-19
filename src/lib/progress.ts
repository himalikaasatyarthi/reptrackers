import { communityBoard } from "@/data/board";

export const ACTIONS = [
  { id: "walk", label: "Take a walk", points: 40, detail: "A short walk counts" },
  { id: "water", label: "Drink water", points: 15, detail: "One glass, once today" },
  { id: "checkin", label: "Daily check-in", points: 25, detail: "Name how you feel" },
  { id: "support", label: "Support someone", points: 30, detail: "A message or shared walk" },
  { id: "mindful", label: "Mindful minutes", points: 35, detail: "Twenty quiet minutes" },
] as const;

export type ActionId = (typeof ACTIONS)[number]["id"];

export type Progress = {
  name: string;
  points: number;
  streak: number;
  lastActiveDate: string | null;
  loggedToday: ActionId[];
  logDate: string | null;
  joinedChallenge: boolean;
  pledgedAt: string | null;
};

export const PROGRESS_KEY = "reptrackers.progress.v1";
export const OPENING_POINTS = 1240;

export function todayKey(date = new Date()): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function yesterdayKey(date = new Date()): string {
  const copy = new Date(date);
  copy.setDate(copy.getDate() - 1);
  return todayKey(copy);
}

export function freshProgress(): Progress {
  return {
    name: "You",
    points: OPENING_POINTS,
    streak: 0,
    lastActiveDate: null,
    loggedToday: [],
    logDate: null,
    joinedChallenge: false,
    pledgedAt: null,
  };
}

function isActionId(value: string): value is ActionId {
  return ACTIONS.some((action) => action.id === value);
}

export function sanitizeProgress(value: unknown): Progress {
  const base = freshProgress();
  if (!value || typeof value !== "object") return base;
  const record = value as Partial<Progress>;
  const points = typeof record.points === "number" && Number.isFinite(record.points) ? record.points : base.points;
  const logged = Array.isArray(record.loggedToday)
    ? record.loggedToday.filter((item): item is ActionId => typeof item === "string" && isActionId(item))
    : [];
  return {
    name: typeof record.name === "string" && record.name.trim() ? record.name.trim().slice(0, 24) : base.name,
    points: Math.min(100000, Math.max(0, Math.round(points))),
    streak: typeof record.streak === "number" && record.streak >= 0 ? Math.min(3650, Math.round(record.streak)) : 0,
    lastActiveDate: typeof record.lastActiveDate === "string" ? record.lastActiveDate : null,
    loggedToday: logged,
    logDate: typeof record.logDate === "string" ? record.logDate : null,
    joinedChallenge: Boolean(record.joinedChallenge),
    pledgedAt: typeof record.pledgedAt === "string" ? record.pledgedAt : null,
  };
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return freshProgress();
    return sanitizeProgress(JSON.parse(raw));
  } catch {
    return freshProgress();
  }
}

export function saveProgress(progress: Progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function loggedOn(progress: Progress, day = todayKey()): ActionId[] {
  return progress.logDate === day ? progress.loggedToday : [];
}

export function applyAction(progress: Progress, id: ActionId, now = new Date()): { progress: Progress; added: boolean } {
  const today = todayKey(now);
  const already = loggedOn(progress, today);
  if (already.includes(id)) {
    return { progress: { ...progress, logDate: today, loggedToday: already }, added: false };
  }
  const action = ACTIONS.find((item) => item.id === id);
  if (!action) return { progress, added: false };
  const streak =
    progress.lastActiveDate === today
      ? progress.streak
      : progress.lastActiveDate === yesterdayKey(now)
        ? progress.streak + 1
        : 1;
  return {
    added: true,
    progress: {
      ...progress,
      points: progress.points + action.points,
      streak,
      lastActiveDate: today,
      logDate: today,
      loggedToday: [...already, id],
    },
  };
}

export type RankSummary = {
  rank: number;
  field: number;
  gapToTop30: number;
  actionsToTop30: number;
  note: string;
};

const ACTION_VALUES = [...ACTIONS].map((action) => action.points).sort((a, b) => b - a);

export function actionsToClose(gap: number): number {
  if (gap <= 0) return 0;
  let left = gap;
  let count = 0;
  for (const value of ACTION_VALUES) {
    if (left <= 0) break;
    left -= value;
    count += 1;
  }
  if (left > 0) count += Math.ceil(left / ACTION_VALUES[0]);
  return count;
}

export function rankSummary(points: number): RankSummary {
  const higher = communityBoard.filter((entry) => entry.points > points).length;
  const sorted = [...communityBoard].sort((a, b) => b.points - a.points);
  const thirtieth = sorted[29]?.points ?? points;
  const gapToTop30 = Math.max(0, thirtieth - points);
  const actionsToTop30 = actionsToClose(gapToTop30);
  const note =
    gapToTop30 === 0
      ? "You’re inside the top 30 on this week’s sample board."
      : `${actionsToTop30} logged action${actionsToTop30 === 1 ? "" : "s"} (${gapToTop30.toLocaleString()} pts) from the top 30`;
  return {
    rank: higher + 1,
    field: communityBoard.length + 1,
    gapToTop30,
    actionsToTop30,
    note,
  };
}

export function leaders(points: number, name: string, streak: number) {
  const you = { name, initials: initialsFor(name), points, streak, you: true as const };
  const merged = [
    ...communityBoard.map((entry) => ({ ...entry, you: false as const })),
    you,
  ].sort((a, b) => b.points - a.points || (a.you ? -1 : 1));
  return merged.slice(0, 4);
}

export function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "YO";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export type HabitTier = {
  name: string;
  minPoints: number;
  badge: string;
  nextTierPoints: number | null;
};

export const TIERS: HabitTier[] = [
  { name: "Starter", minPoints: 0, badge: "🌱", nextTierPoints: 1300 },
  { name: "Bronze Mover", minPoints: 1300, badge: "🥉", nextTierPoints: 1500 },
  { name: "Silver Steady", minPoints: 1500, badge: "🥈", nextTierPoints: 1800 },
  { name: "Gold Builder", minPoints: 1800, badge: "🥇", nextTierPoints: 2200 },
  { name: "Habit Master", minPoints: 2200, badge: "👑", nextTierPoints: null },
];

export function getHabitTier(points: number): HabitTier {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (points >= TIERS[i].minPoints) return TIERS[i];
  }
  return TIERS[0];
}

export function exportProgressJson(progress: Progress): string {
  return JSON.stringify(progress, null, 2);
}

export function importProgressJson(jsonStr: string): Progress {
  const parsed = JSON.parse(jsonStr);
  return sanitizeProgress(parsed);
}
