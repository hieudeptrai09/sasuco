import { DAY_LABELS } from "../constants/days";
import type { Schedule } from "../types/course";

export function schedulesOverlap(a: Schedule, b: Schedule): boolean {
  const sharesDay = a.days.some((day) => b.days.includes(day));
  if (!sharesDay) return false;
  return a.startTime < b.endTime && b.startTime < a.endTime;
}

export function formatSchedule(schedule: Schedule): string {
  const days = schedule.days.map((day) => DAY_LABELS[day]).join(", ");
  return `${days} · ${schedule.startTime} - ${schedule.endTime}`;
}
