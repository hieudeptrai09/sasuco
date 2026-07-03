import type { Course } from "../types/course";
import type { Enrollment } from "../types/enrollment";
import { STORAGE_KEYS } from "../constants/storage-keys";
import { generateId, readCollection, writeCollection } from "./storage";
import { schedulesOverlap } from "./schedule";

type RegisterResult = { ok: true } | { ok: false; error: string };

function readEnrollments(): Enrollment[] {
  return readCollection<Enrollment>(STORAGE_KEYS.enrollments);
}

function readCourses(): Course[] {
  return readCollection<Course>(STORAGE_KEYS.courses);
}

export function listEnrollmentsByStudent(studentId: string): Enrollment[] {
  return readEnrollments().filter((e) => e.studentId === studentId);
}

export function listEnrollmentsByCourse(courseId: string): Enrollment[] {
  return readEnrollments().filter((e) => e.courseId === courseId);
}

export function countActiveEnrollments(courseId: string): number {
  return readEnrollments().filter(
    (e) => e.courseId === courseId && e.status === "active"
  ).length;
}

export function registerForCourse(
  studentId: string,
  courseId: string
): RegisterResult {
  const course = readCourses().find((c) => c.id === courseId);
  if (!course) {
    return { ok: false, error: "Không tìm thấy khóa học." };
  }

  const enrollments = readEnrollments();
  const existing = enrollments.find(
    (e) => e.studentId === studentId && e.courseId === courseId
  );
  if (existing?.status === "active") {
    return { ok: false, error: "Bạn đã đăng ký khóa học này rồi." };
  }

  const activeCount = enrollments.filter(
    (e) => e.courseId === courseId && e.status === "active"
  ).length;
  if (activeCount >= course.capacity) {
    return { ok: false, error: "Khóa học đã đầy." };
  }

  const courses = readCourses();
  const otherActiveCourseIds = enrollments
    .filter((e) => e.studentId === studentId && e.status === "active" && e.courseId !== courseId)
    .map((e) => e.courseId);
  const conflict = courses.find(
    (c) => otherActiveCourseIds.includes(c.id) && schedulesOverlap(c.schedule, course.schedule)
  );
  if (conflict) {
    return {
      ok: false,
      error: `Lịch học trùng với khóa học "${conflict.title}" bạn đã đăng ký.`,
    };
  }

  if (existing) {
    existing.status = "active";
    existing.enrolledAt = new Date().toISOString();
  } else {
    enrollments.push({
      id: generateId(),
      studentId,
      courseId,
      status: "active",
      enrolledAt: new Date().toISOString(),
    });
  }

  writeCollection(STORAGE_KEYS.enrollments, enrollments);
  return { ok: true };
}

export function dropEnrollment(studentId: string, courseId: string): void {
  const enrollments = readEnrollments();
  const existing = enrollments.find(
    (e) => e.studentId === studentId && e.courseId === courseId
  );
  if (existing && existing.status === "active") {
    existing.status = "dropped";
    writeCollection(STORAGE_KEYS.enrollments, enrollments);
  }
}

export function deleteEnrollmentsForCourse(courseId: string): void {
  const remaining = readEnrollments().filter((e) => e.courseId !== courseId);
  writeCollection(STORAGE_KEYS.enrollments, remaining);
}

export function deleteEnrollmentsForStudent(studentId: string): void {
  const remaining = readEnrollments().filter((e) => e.studentId !== studentId);
  writeCollection(STORAGE_KEYS.enrollments, remaining);
}
