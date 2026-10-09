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

/**
 * Scroll path of the phone. Each step owns 1/N of the scroll.
 * First 70%: the phone slowly descends on its side. Last 30%: it swoops down and across
 * to the other side (the screen swaps at the lowest point), then rises into place.
 * xn: -1 = left, +1 = right. y is in world units (positive = up).
 */
export function pose(progress: number, reduce = false) {
  const u = clamp(progress) * N;
  const i = Math.min(N - 1, Math.floor(u));
  const t = u - i;
  const last = i === N - 1;
  const side = i % 2 ? 1 : -1;
  const m = last ? 0 : clamp((t - 0.7) / 0.3);
  const e = m * m * (3 - 2 * m);
  const dip = Math.sin(Math.PI * m);
  const rest = last ? clamp(t) : clamp(t / 0.7);
  return {
    i, t, last,
    img: last ? i : m > 0.5 ? i + 1 : i,
    xn: side * (1 - 2 * e),
    y: 0.4 - 0.8 * rest + (last ? 0 : 0.8 * e - 0.8 * dip),
    yaw: reduce ? 0 : dip * -side,
    pitch: reduce ? 0 : dip * 0.25,
    roll: reduce ? 0 : dip * -side * 0.3,
  };
}

export function textOpacity(index: number, progress: number) {
  const q = pose(progress);
  if (q.i !== index) return 0;
  const fadeIn = index === 0 ? 1 : clamp(q.t / 0.12);
  const fadeOut = q.last ? 1 : clamp((0.78 - q.t) / 0.12);
  return fadeIn * fadeOut;
}

export function textShift(index: number, progress: number) {
  const q = pose(progress);
  return q.i === index ? -(q.t - 0.4) * 70 : 0;
}
