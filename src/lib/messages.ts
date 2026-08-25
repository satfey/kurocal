function pick(arr: string[], seed: number): string {
  return arr[seed % arr.length];
}

const OVER_GOAL = [
  "Oopsie! You went a little over today ♡",
  "A little extra today — tomorrow's a fresh page ♡",
  "You went over, but that's okay! Balance is sweet ✦",
];

const ALMOST_THERE = [
  "Almost there! ♡",
  "So close to your goal ✦",
  "Just a little more, you're doing great ♡",
];

const GOAL_COMPLETE = [
  "Daily goal complete! ✦♡✦",
  "Yay, you hit your goal today ♡",
  "Perfectly on track ✦",
];

const ON_TRACK = [
  "You're doing great today ✦",
  "Yay! Keep it up ♡",
  "Looking good so far ✦",
];

const NOT_STARTED = [
  "Ready for your first meal? ♡",
  "Nothing logged yet — let's start! ✦",
  "Your diary is waiting for you ♡",
];

function daySeed(): number {
  return new Date().getDate();
}

export function getStatusMessage(totalCalories: number, goal: number): string {
  if (totalCalories <= 0) return pick(NOT_STARTED, daySeed());
  const percent = goal > 0 ? (totalCalories / goal) * 100 : 0;
  if (totalCalories > goal) return pick(OVER_GOAL, daySeed());
  if (percent >= 98) return pick(GOAL_COMPLETE, daySeed());
  if (percent >= 85) return pick(ALMOST_THERE, daySeed());
  return pick(ON_TRACK, daySeed());
}

export function getRemainingHeadline(totalCalories: number, goal: number): string {
  const remaining = goal - totalCalories;
  if (remaining < 0) return `Oopsie! You went a little over today ♡`;
  return `Yay! You still have ${remaining.toLocaleString()} kcal left ✦`;
}
