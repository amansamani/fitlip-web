export type Step = { id: string; label: string; src: string; title: string; body: string };

export const STEPS: Step[] = [
  { id: 'home', label: 'Home', src: '/screens/home.webp', title: 'Everything for today, on one screen.', body: "Calories left, macros, today's meals and steps, the moment you open FitLip." },
  { id: 'diet', label: 'Diet', src: '/screens/nutrition.webp', title: 'A meal plan with a calorie budget.', body: "See your target, your macros and today's meals. Tap a meal when you've eaten it." },
  { id: 'coach', label: 'Coach', src: '/screens/coach.webp', title: 'Ask your coach.', body: 'Ask for a seven-day calorie chart and it answers from your logged meals, not a guess.' },
  { id: 'camera', label: 'Camera', src: '/screens/camera.webp', title: 'Log a meal with a photo.', body: 'Photograph your plate, review the foods and portions, then log it.' },
  { id: 'exercise', label: 'Exercise', src: '/screens/workouts.webp', title: 'A training plan for the week.', body: 'Six days of workouts, with or without equipment. Each day lists its exercises.' },
  { id: 'track', label: 'Track', src: '/screens/tracking.webp', title: 'Steps, burn and sleep.', body: "See how much of today's goals you've finished, and update your numbers any time." },
  { id: 'run', label: 'Run', src: '/screens/run.webp', title: 'Track every run.', body: 'Follow your route, pace and calories live. Walking and cycling work too.' },
];

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const N = STEPS.length;

/** Smootherstep — zero jerk at both ends, glides instead of snapping. */
const smoother = (m: number) => m * m * m * (m * (6 * m - 15) + 10);

/**
 * SAFE keeps the resting phone fully inside the viewport (no top/bottom cut).
 * The swoop dips below the fold on purpose — that's the transition, not a clip.
 */
const SAFE = 0.2;

export function pose(progress: number, reduce = false) {
  const u = clamp(progress) * N;
  const i = Math.min(N - 1, Math.floor(u));
  const t = u - i;
  const last = i === N - 1;
  const side = i % 2 ? 1 : -1;
  const m = last ? 0 : clamp((t - 0.72) / 0.28);
  const e = smoother(m);
  const dip = Math.sin(Math.PI * m);
  const rest = last ? clamp(t) : clamp(t / 0.72);

  return {
    i, t, last,
    img: last ? i : m > 0.5 ? i + 1 : i,
    xn: side * (1 - 2 * e),
    // Rests between +0.2 and -0.2 (fully visible); dips only while swooping.
    y: SAFE - 0.4 * rest + (last ? 0 : 0.4 * e - 0.9 * dip),
    yaw: reduce ? 0 : dip * -side * 0.8,
    pitch: reduce ? 0 : dip * 0.15,
    roll: reduce ? 0 : dip * -side * 0.18,
  };
}

export function textOpacity(index: number, progress: number) {
  const q = pose(progress);
  if (q.i !== index) return 0;
  const fadeIn = index === 0 ? 1 : clamp(q.t / 0.15);
  const fadeOut = q.last ? 1 : clamp((0.8 - q.t) / 0.15);
  return fadeIn * fadeOut;
}

export function textShift(index: number, progress: number) {
  const q = pose(progress);
  return q.i === index ? -(q.t - 0.4) * 40 : 0;
}