export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string | null;
  capacity: number;
  schedule: string;
  createdAt: string;
}
