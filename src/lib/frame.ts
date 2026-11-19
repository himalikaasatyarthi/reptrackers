export type Silhouette = "narrow" | "even" | "broad";
export type Build = "lean" | "athletic" | "solid";
export type Change = "hard-gain" | "adapts" | "holds";
export type MixId = "ease-in" | "balanced" | "strength";

export type FrameAnswers = {
  silhouette: Silhouette | "";
  build: Build | "";
  change: Change | "";
};

export type PhotoHint = {
  shoulderToHip: number;
  silhouette: Silhouette;
};

export type FrameMix = {
  id: MixId;
  title: string;
  summary: string;
  moves: string[];
  photoNote: string | null;
};

const MIXES: Record<MixId, Omit<FrameMix, "photoNote">> = {
  "ease-in": {
    id: "ease-in",
    title: "Ease-in mix",
    summary:
      "Your check points toward a lighter build. Short walks, mobility, and strength you can recover from fit better than all-out sessions. Eat enough to support that work.",
    moves: [
      "Walk twice on most days, even for ten minutes",
      "Full-body strength twice a week, stopping with a rep still in reserve",
      "Open the hips and upper back after long sitting",
    ],
  },
  balanced: {
    id: "balanced",
    title: "Balanced mix",
    summary:
      "A rotation of strength, easy cardio, and mobility matches this check. Spread them through the week instead of hunting for one perfect workout.",
    moves: [
      "Two strength sessions that cover legs, push, pull, and core",
      "One longer easy walk or cycle",
      "Five unhurried minutes of breathing or stretching on busy days",
    ],
  },
  strength: {
    id: "strength",
    title: "Strength-and-walk mix",
    summary:
      "Keep strength work you enjoy, and put walking or cycling next to it so joints and mood get a say. Meals with protein and plants support that mix.",
    moves: [
      "Strength train three days, with at least one full rest day",
      "Walk most days at a pace where you can still talk",
      "Include protein and vegetables at two meals",
    ],
  },
};

function bucket(silhouette: Silhouette): MixId {
  if (silhouette === "narrow") return "ease-in";
  if (silhouette === "broad") return "strength";
  return "balanced";
}

export function mixFromCheck(answers: FrameAnswers, photo: PhotoHint | null): FrameMix | null {
  const scores: Record<MixId, number> = { "ease-in": 0, balanced: 0, strength: 0 };
  if (answers.silhouette) scores[bucket(answers.silhouette)] += 2;
  if (answers.build === "lean") scores["ease-in"] += 2;
  if (answers.build === "athletic") scores.balanced += 2;
  if (answers.build === "solid") scores.strength += 2;
  if (answers.change === "hard-gain") scores["ease-in"] += 2;
  if (answers.change === "adapts") scores.balanced += 2;
  if (answers.change === "holds") scores.strength += 2;
  if (photo) scores[bucket(photo.silhouette)] += 1;

  const total = scores["ease-in"] + scores.balanced + scores.strength;
  if (total === 0) return null;

  const ranked: MixId[] = ["balanced", "ease-in", "strength"];
  ranked.sort((a, b) => scores[b] - scores[a]);
  const winner = ranked[0];
  const base = MIXES[winner];
  const photoNote = photo
    ? `The photo added a low-confidence silhouette hint (shoulder width about ${photo.shoulderToHip.toFixed(2)}× hip width). Clothes, lighting, and background change that ratio, so your answers count for more.`
    : null;
  return { ...base, photoNote };
}

export async function readSilhouette(src: string): Promise<PhotoHint | null> {
  const image = new Image();
  image.src = src;
  try {
    await image.decode();
  } catch {
    return null;
  }
  const canvas = document.createElement("canvas");
  const maxEdge = 180;
  const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  context.drawImage(image, 0, 0, width, height);
  const { data } = context.getImageData(0, 0, width, height);
  const pixel = (x: number, y: number) => {
    const index = (y * width + x) * 4;
    return [data[index], data[index + 1], data[index + 2]] as const;
  };
  const corners = [pixel(0, 0), pixel(width - 1, 0), pixel(0, height - 1), pixel(width - 1, height - 1)];
  const background = [0, 1, 2].map(
    (channel) => corners.reduce((sum, sample) => sum + sample[channel], 0) / corners.length,
  );
  const mask = new Uint8Array(width * height);
  let count = 0;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sample = pixel(x, y);
      const distance = Math.hypot(
        sample[0] - background[0],
        sample[1] - background[1],
        sample[2] - background[2],
      );
      if (distance <= 38) continue;
      const index = y * width + x;
      mask[index] = 1;
      count += 1;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (count < width * height * 0.05 || maxY <= minY + 20) return null;

  const bandWidth = (start: number, end: number) => {
    let left = width;
    let right = 0;
    let seen = 0;
    for (let y = start; y <= end; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (!mask[y * width + x]) continue;
        seen += 1;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
    return seen ? right - left + 1 : 0;
  };

  const span = maxY - minY;
  const shoulder = bandWidth(minY + Math.floor(span * 0.18), minY + Math.floor(span * 0.34));
  const hip = bandWidth(minY + Math.floor(span * 0.5), minY + Math.floor(span * 0.66));
  if (!shoulder || !hip) return null;
  const shoulderToHip = shoulder / hip;
  const silhouette: Silhouette =
    shoulderToHip > 1.12 ? "broad" : shoulderToHip < 0.9 ? "narrow" : "even";
  return { shoulderToHip, silhouette };
}
