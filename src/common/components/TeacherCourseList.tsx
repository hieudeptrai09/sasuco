"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Course } from "../types/course";
import type { User } from "../types/user";
import { useAuth } from "../containers/use-auth";
import { listCoursesByTeacher, updateCourse } from "../containers/courses-service";
import { listEnrollmentsByCourse } from "../containers/enrollments-service";
import { listUsers } from "../containers/users-service";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card } from "./ui/Card";

export function TeacherCourseList() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState("");

  useEffect(() => {
    if (user) refresh(user.id);
  }, [user]);

  function refresh(teacherId: string) {
    setCourses(listCoursesByTeacher(teacherId));
    setStudents(listUsers().filter((u) => u.role === "student"));
  }

  function startEdit(course: Course) {
    setEditingId(course.id);
    setDescription(course.description);
    setSchedule(course.schedule);
  }

  function handleSave(event: FormEvent, courseId: string) {
    event.preventDefault();
    updateCourse(courseId, { description, schedule });
    setEditingId(null);
    if (user) refresh(user.id);
  }

  function rosterFor(courseId: string) {
    return listEnrollmentsByCourse(courseId)
      .filter((e) => e.status === "active")
      .map((e) => students.find((s) => s.id === e.studentId))
      .filter((s): s is User => Boolean(s));
  }

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      {courses.map((course) => {
        const roster = rosterFor(course.id);
        return (
          <Card key={course.id}>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                {course.title}
              </h2>
              {editingId !== course.id && (
                <Button variant="secondary" onClick={() => startEdit(course)}>
                  Sửa
                </Button>
              )}
            </div>

            {editingId === course.id ? (
              <form onSubmit={(e) => handleSave(e, course.id)} className="mt-4 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-zinc-600 dark:text-zinc-400">Mô tả</label>
                  <Input
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-zinc-600 dark:text-zinc-400">Lịch học</label>
                  <Input required value={schedule} onChange={(e) => setSchedule(e.target.value)} />
                </div>
                <div className="flex gap-3">
                  <Button type="submit">Lưu</Button>
                  <Button type="button" variant="secondary" onClick={() => setEditingId(null)}>
                    Hủy
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{course.description}</p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{course.schedule}</p>
              </>
            )}

            <div className="mt-4">
              <h3 className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Danh sách học viên ({roster.length}/{course.capacity})
              </h3>
              <ul className="mt-2 flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                {roster.map((s) => (
                  <li key={s.id}>
                    {s.name} · {s.email}
                  </li>
                ))}
                {roster.length === 0 && <li>Chưa có học viên nào đăng ký.</li>}
              </ul>
            </div>
          </Card>
        );
      })}
      {courses.length === 0 && (
        <Card>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Bạn chưa được phân công khóa học nào.
          </p>
        </Card>
      )}
    </div>
  );
}
