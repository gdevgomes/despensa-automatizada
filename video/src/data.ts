export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Duração de cada cena, em segundos. Total: 138 s (2 min 18 s). */
export const SCENE_SECONDS = {
  intro: 12,
  problem: 14,
  scan: 32,
  expiry: 20,
  list: 28,
  reminder: 20,
  outro: 12,
} as const;

export const SCENE_ORDER = ["intro", "problem", "scan", "expiry", "list", "reminder", "outro"] as const;

export const totalFrames = SCENE_ORDER.reduce((sum, key) => sum + SCENE_SECONDS[key] * FPS, 0);
