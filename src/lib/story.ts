/** One continuous, reversible camera path through an ordinary FitLip day. */
export const STORY = [
  { id: 'begin', label: 'Begin', time: 'YOUR DAY, REIMAGINED', word: 'everyday', title: 'Small steps.', emphasis: 'A fuller life.', body: 'Meals, movement, and your AI coach. Meet the Android fitness app that connects the little things you do every day.', detail: 'Scroll to step inside FitLip', src: '/screens/home.webp', alt: 'FitLip home screen showing meals, calories, macros, and daily activity', color: '#6E3482', background: '#f5f0e8', side: 'left' },
  { id: 'progress', label: 'Progress', time: '01 / LOOK BACK, THEN MOVE FORWARD', word: 'reflect', title: 'Your week.', emphasis: 'Coming into focus.', body: 'See your nutrition consistency, average intake, and weight trend together. A clearer view of the habits you are building.', detail: 'Weekly nutrition · Consistency · Trends', src: '/screens/progress.webp', alt: 'FitLip weekly nutrition progress and logging consistency summary', color: '#6E3482', background: '#eee7f2', side: 'right' },
  { id: 'capture', label: 'Capture', time: '02 / MAKE A LITTLE ROOM FOR LUNCH', word: 'capture', title: 'See your plate.', emphasis: 'Save the moment.', body: 'Point your camera at your meal. Review the foods and portions, make your adjustments, and add it to your day.', detail: 'Photograph → Review → Log', src: '/screens/camera.webp', alt: 'FitLip meal camera with photo capture and gallery options', color: '#976b43', background: '#f0e7d9', side: 'left' },
  { id: 'nutrition', label: 'Nourish', time: '03 / GET TO KNOW YOUR FUEL', word: 'nourish', title: 'More intention.', emphasis: 'Less guesswork.', body: 'See how your meals fit your calorie budget. Explore your plan and keep protein, carbs, and fats in perspective.', detail: 'Meal plans · Calorie budget · Macros', src: '/screens/nutrition.webp', alt: 'FitLip nutrition plan with calorie target and macro breakdown', color: '#637446', background: '#e9edde', side: 'right' },
  { id: 'training', label: 'Train', time: '04 / TURN INTENTION INTO A LITTLE ACTION', word: 'move', title: 'Make your move.', emphasis: 'Your way.', body: 'At home or with equipment, find your training plan for the week. See the exercises for each day and take it one session at a time.', detail: 'Weekly plans · Equipment options · Exercises', src: '/screens/workouts.webp', alt: 'FitLip weekly workout plan and equipment options', color: '#6E3482', background: '#e9e2ef', side: 'left' },
  { id: 'outside', label: 'Go outside', time: '05 / TAKE THE LONG WAY HOME', word: 'explore', title: 'A change of pace.', emphasis: 'A new perspective.', body: 'Head out for a run, a walk, or a ride. Follow your route, pace, and activity as you go. The next turn is yours.', detail: 'Running · Walking · Cycling', src: '/screens/run.webp', alt: 'FitLip outdoor activity tracking screen with route and pace', color: '#477464', background: '#e2ece7', side: 'right' },
  { id: 'activity', label: 'Reflect', time: '06 / THE LITTLE THINGS ADD UP', word: 'notice', title: 'Every step.', emphasis: 'Part of your story.', body: 'Bring your steps, active calories, and sleep into view. Check your daily goals and update your numbers when you need to.', detail: 'Steps · Active calories · Sleep', src: '/screens/tracking.webp', alt: 'FitLip daily activity screen showing steps, calories, and sleep', color: '#96774a', background: '#f0eadf', side: 'left' },
  { id: 'coach', label: 'Connect', time: '07 / BRING IT ALL TOGETHER', word: 'understand', title: 'Your records.', emphasis: 'A little clarity.', body: 'Ask FitLip Coach about the meals and movement you’ve logged. Get your active plan, compare days, and find your next little step.', detail: 'Your AI coach · Your own FitLip records', src: '/screens/coach.webp', alt: 'FitLip Coach showing a personalized active diet plan from FitLip records', color: '#6E3482', background: '#ebe2f0', side: 'right' },
] as const;

export const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (t: number) => t * t * (3 - 2 * t);
export function storyPosition(progress: number) {
  const position = clamp01(progress) * (STORY.length - 1);
  const from = Math.min(STORY.length - 2, Math.floor(position));
  const fraction = position - from;
  const mix = smooth(clamp01((fraction - .2) / .6));
  return { from, to: from + 1, mix, active: mix < .5 ? from : from + 1 };
}

export function chapterVisibility(index: number, progress: number) {
  const { from, to, mix } = storyPosition(progress);
  if (index === from) return 1 - smooth(clamp01(mix * 2.15));
  if (index === to) return smooth(clamp01((mix - .53) * 2.15));
  return 0;
}

export const SHOTS = [
  { x: 1, y: 0, z: 0, yaw: -.36, pitch: .07, roll: -.12, scale: 1.13 },
  { x: -1, y: .02, z: .2, yaw: .26, pitch: -.03, roll: .08, scale: 1.05 },
  { x: 1, y: .1, z: .35, yaw: -.3, pitch: .12, roll: -.09, scale: 1.03 },
  { x: -1, y: -.03, z: 0, yaw: .28, pitch: .04, roll: .04, scale: 1.08 },
  { x: 1, y: .02, z: .1, yaw: -.38, pitch: -.08, roll: -.08, scale: 1.05 },
  { x: -1, y: .05, z: .25, yaw: .27, pitch: .03, roll: .11, scale: 1.02 },
  { x: 1, y: 0, z: .05, yaw: -.27, pitch: -.04, roll: -.04, scale: 1.06 },
  { x: -1, y: .01, z: .3, yaw: .18, pitch: .04, roll: .05, scale: 1.11 },
] as const;
