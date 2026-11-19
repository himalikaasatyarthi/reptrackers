import type { ReactNode } from "react";

export type IconName =
  | "arrow"
  | "bars"
  | "body"
  | "brain"
  | "calculator"
  | "camera"
  | "check"
  | "chevron"
  | "close"
  | "copy"
  | "download"
  | "heart"
  | "leaf"
  | "link"
  | "medal"
  | "message"
  | "refresh"
  | "shield"
  | "spark"
  | "target"
  | "trash"
  | "upload"
  | "users";

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
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
  const paths: Record<IconName, ReactNode> = {
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
    copy: (
      <>
        <rect width="13" height="13" x="9" y="9" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </>
    ),
    download: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
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
    link: (
      <>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
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
    refresh: (
      <>
        <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
        <path d="M3 21v-5h5" />
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
    trash: (
      <>
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
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
