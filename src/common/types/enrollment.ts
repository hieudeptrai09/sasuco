export type EnrollmentStatus = "active" | "dropped";

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  enrolledAt: string;
}
