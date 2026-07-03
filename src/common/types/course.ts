export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Schedule {
  days: DayOfWeek[];
  startTime: string;
  endTime: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string | null;
  roomId: string | null;
  capacity: number;
  schedule: Schedule;
  createdAt: string;
}
