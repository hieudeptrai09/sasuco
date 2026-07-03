"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Course } from "../types/course";
import type { User } from "../types/user";
import { listUsers } from "../containers/users-service";
import { createCourse, deleteCourse, listCourses, updateCourse } from "../containers/courses-service";
import { countActiveEnrollments } from "../containers/enrollments-service";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Card } from "./ui/Card";

interface CourseFormState {
  id: string | null;
  title: string;
  description: string;
  schedule: string;
  capacity: string;
  teacherId: string;
}

const EMPTY_FORM: CourseFormState = {
  id: null,
  title: "",
  description: "",
  schedule: "",
  capacity: "20",
  teacherId: "",
};

export function CourseManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [form, setForm] = useState<CourseFormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setCourses(listCourses());
    setTeachers(listUsers().filter((u) => u.role === "teacher"));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const capacity = Number.parseInt(form.capacity, 10);
    if (!Number.isFinite(capacity) || capacity < 1) {
      setError("Sĩ số phải là một số dương.");
      return;
    }
    const payload = {
      title: form.title,
      description: form.description,
      schedule: form.schedule,
      capacity,
      teacherId: form.teacherId || null,
    };
    if (form.id) {
      updateCourse(form.id, payload);
    } else {
      createCourse(payload);
    }
    setForm(EMPTY_FORM);
    refresh();
  }

  function handleEdit(course: Course) {
    setForm({
      id: course.id,
      title: course.title,
      description: course.description,
      schedule: course.schedule,
      capacity: String(course.capacity),
      teacherId: course.teacherId ?? "",
    });
  }

  function handleDelete(course: Course) {
    const activeCount = countActiveEnrollments(course.id);
    const confirmed = window.confirm(
      activeCount > 0
        ? `Xóa khóa học "${course.title}"? Thao tác này sẽ xóa ${activeCount} lượt đăng ký đang hoạt động.`
        : `Xóa khóa học "${course.title}"?`
    );
    if (!confirmed) return;
    deleteCourse(course.id);
    if (form.id === course.id) {
      setForm(EMPTY_FORM);
    }
    refresh();
  }

  function teacherName(teacherId: string | null) {
    if (!teacherId) return "Chưa phân công";
    return teachers.find((t) => t.id === teacherId)?.name ?? "Chưa phân công";
  }

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          {form.id ? "Chỉnh sửa khóa học" : "Thêm khóa học"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Tên khóa học</label>
            <Input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Lịch học</label>
            <Input
              required
              value={form.schedule}
              onChange={(e) => setForm({ ...form, schedule: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Mô tả</label>
            <Input
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Sĩ số tối đa</label>
            <Input
              type="number"
              min={1}
              required
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Giảng viên</label>
            <Select
              value={form.teacherId}
              onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
            >
              <option value="">Chưa phân công</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-end gap-3 sm:col-span-2">
            <Button type="submit">{form.id ? "Lưu thay đổi" : "Thêm khóa học"}</Button>
            {form.id && (
              <Button type="button" variant="secondary" onClick={() => setForm(EMPTY_FORM)}>
                Hủy
              </Button>
            )}
          </div>
        </form>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          Danh sách khóa học
        </h2>
        <div className="flex flex-col gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col gap-2 border-b border-black/[.08] pb-4 last:border-none dark:border-white/[.145]"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-medium text-zinc-950 dark:text-zinc-50">{course.title}</h3>
                <div className="flex shrink-0 gap-2">
                  <Button variant="secondary" onClick={() => handleEdit(course)}>
                    Sửa
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(course)}>
                    Xóa
                  </Button>
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{course.description}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {course.schedule} · Giảng viên: {teacherName(course.teacherId)} ·{" "}
                {countActiveEnrollments(course.id)}/{course.capacity} đã đăng ký
              </p>
            </div>
          ))}
          {courses.length === 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Chưa có khóa học nào.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
