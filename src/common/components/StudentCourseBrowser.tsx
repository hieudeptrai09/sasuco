"use client";

import { useEffect, useState } from "react";
import type { Course } from "../types/course";
import { useAuth } from "../containers/use-auth";
import { listCourses } from "../containers/courses-service";
import {
  countActiveEnrollments,
  dropEnrollment,
  listEnrollmentsByStudent,
  registerForCourse,
} from "../containers/enrollments-service";
import { listUsers } from "../containers/users-service";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

export function StudentCourseBrowser() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [teacherNames, setTeacherNames] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) refresh(user.id);
  }, [user]);

  function refresh(studentId: string) {
    setCourses(listCourses());
    const active = listEnrollmentsByStudent(studentId).filter((e) => e.status === "active");
    setEnrolledCourseIds(new Set(active.map((e) => e.courseId)));
    const teachers = listUsers().filter((u) => u.role === "teacher");
    setTeacherNames(Object.fromEntries(teachers.map((t) => [t.id, t.name])));
  }

  function handleRegister(courseId: string) {
    if (!user) return;
    setError(null);
    const result = registerForCourse(user.id, courseId);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    refresh(user.id);
  }

  function handleDrop(courseId: string) {
    if (!user) return;
    dropEnrollment(user.id, courseId);
    refresh(user.id);
  }

  if (!user) return null;

  const myCourses = courses.filter((c) => enrolledCourseIds.has(c.id));

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          Khóa học của tôi
        </h2>
        {myCourses.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Bạn chưa đăng ký khóa học nào.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {myCourses.map((course) => (
              <li
                key={course.id}
                className="flex items-center justify-between gap-4 border-b border-black/[.08] pb-3 last:border-none dark:border-white/[.145]"
              >
                <div>
                  <p className="font-medium text-zinc-950 dark:text-zinc-50">{course.title}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{course.schedule}</p>
                </div>
                <Button variant="danger" onClick={() => handleDrop(course.id)}>
                  Hủy đăng ký
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          Khám phá khóa học
        </h2>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <ul className="flex flex-col gap-4">
          {courses.map((course) => {
            const activeCount = countActiveEnrollments(course.id);
            const isFull = activeCount >= course.capacity;
            const isEnrolled = enrolledCourseIds.has(course.id);
            return (
              <li
                key={course.id}
                className="flex items-center justify-between gap-4 border-b border-black/[.08] pb-4 last:border-none dark:border-white/[.145]"
              >
                <div>
                  <p className="font-medium text-zinc-950 dark:text-zinc-50">{course.title}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{course.description}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {course.schedule} · Giảng viên:{" "}
                    {course.teacherId ? teacherNames[course.teacherId] ?? "Chưa phân công" : "Chưa phân công"} ·{" "}
                    {activeCount}/{course.capacity} đã đăng ký
                  </p>
                </div>
                <Button disabled={isEnrolled || isFull} onClick={() => handleRegister(course.id)}>
                  {isEnrolled ? "Đã đăng ký" : isFull ? "Đã đầy" : "Đăng ký"}
                </Button>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
