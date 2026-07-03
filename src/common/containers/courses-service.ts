import type { Course } from "../types/course";
import { STORAGE_KEYS } from "../constants/storage-keys";
import { generateId, readCollection, writeCollection } from "./storage";
import { countActiveEnrollments, deleteEnrollmentsForCourse } from "./enrollments-service";
import { schedulesOverlap } from "./schedule";

export type CourseInput = Omit<Course, "id" | "createdAt">;

export function listCourses(): Course[] {
  return readCollection<Course>(STORAGE_KEYS.courses);
}

export function getCourse(id: string): Course | undefined {
  return listCourses().find((c) => c.id === id);
}

export function listCoursesByTeacher(teacherId: string): Course[] {
  return listCourses().filter((c) => c.teacherId === teacherId);
}

export function isUserAssignedAsTeacher(userId: string): boolean {
  return listCourses().some((c) => c.teacherId === userId);
}

export function isRoomAssigned(roomId: string): boolean {
  return listCourses().some((c) => c.roomId === roomId);
}

function assertNoScheduleConflicts(
  courses: Course[],
  candidate: Pick<Course, "id" | "teacherId" | "roomId" | "schedule">
): void {
  const others = courses.filter((c) => c.id !== candidate.id);

  if (candidate.teacherId) {
    const conflict = others.find(
      (c) => c.teacherId === candidate.teacherId && schedulesOverlap(c.schedule, candidate.schedule)
    );
    if (conflict) {
      throw new Error(`Giảng viên đã có lịch dạy trùng với khóa học "${conflict.title}".`);
    }
  }

  if (candidate.roomId) {
    const conflict = others.find(
      (c) => c.roomId === candidate.roomId && schedulesOverlap(c.schedule, candidate.schedule)
    );
    if (conflict) {
      throw new Error(
        `Phòng học đã được sử dụng cho khóa học "${conflict.title}" vào cùng thời gian.`
      );
    }
  }
}

export function createCourse(input: CourseInput): Course {
  const courses = listCourses();
  assertNoScheduleConflicts(courses, {
    id: "",
    teacherId: input.teacherId,
    roomId: input.roomId,
    schedule: input.schedule,
  });

  const course: Course = {
    ...input,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  writeCollection(STORAGE_KEYS.courses, [...courses, course]);
  return course;
}

export function updateCourse(
  id: string,
  patch: Partial<CourseInput>
): Course | undefined {
  const courses = listCourses();
  const index = courses.findIndex((c) => c.id === id);
  if (index === -1) return undefined;

  if (patch.capacity !== undefined && patch.capacity < countActiveEnrollments(id)) {
    throw new Error("Sĩ số tối đa không được nhỏ hơn số học viên đang đăng ký.");
  }

  const updated = { ...courses[index], ...patch };
  assertNoScheduleConflicts(courses, {
    id: updated.id,
    teacherId: updated.teacherId,
    roomId: updated.roomId,
    schedule: updated.schedule,
  });

  courses[index] = updated;
  writeCollection(STORAGE_KEYS.courses, courses);
  return updated;
}

export function deleteCourse(id: string): void {
  writeCollection(
    STORAGE_KEYS.courses,
    listCourses().filter((c) => c.id !== id)
  );
  deleteEnrollmentsForCourse(id);
}
