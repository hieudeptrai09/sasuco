"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Course, DayOfWeek } from "../types/course";
import type { User } from "../types/user";
import { DAYS_OF_WEEK, DAY_LABELS } from "../constants/days";
import { listUsers } from "../containers/users-service";
import { createCourse, deleteCourse, listCourses, updateCourse } from "../containers/courses-service";
import { listRooms } from "../containers/rooms-service";
import { countActiveEnrollments } from "../containers/enrollments-service";
import { formatSchedule } from "../containers/schedule";
import type { Room } from "../types/room";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Card } from "./ui/Card";

interface CourseFormState {
  id: string | null;
  title: string;
  description: string;
  days: DayOfWeek[];
  startTime: string;
  endTime: string;
  capacity: string;
  teacherId: string;
  roomId: string;
}

const EMPTY_FORM: CourseFormState = {
  id: null,
  title: "",
  description: "",
  days: [],
  startTime: "",
  endTime: "",
  capacity: "20",
  teacherId: "",
  roomId: "",
};

export function CourseManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form, setForm] = useState<CourseFormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setCourses(listCourses());
    setTeachers(listUsers().filter((u) => u.role === "teacher"));
    setRooms(listRooms());
  }

  function toggleDay(day: DayOfWeek) {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const capacity = Number.parseInt(form.capacity, 10);
    if (!Number.isFinite(capacity) || capacity < 1) {
      setError("Sĩ số phải là một số dương.");
      return;
    }
    if (form.days.length === 0) {
      setError("Vui lòng chọn ít nhất một ngày học.");
      return;
    }
    if (!form.startTime || !form.endTime || form.startTime >= form.endTime) {
      setError("Giờ kết thúc phải sau giờ bắt đầu.");
      return;
    }
    const payload = {
      title: form.title,
      description: form.description,
      schedule: { days: form.days, startTime: form.startTime, endTime: form.endTime },
      capacity,
      teacherId: form.teacherId || null,
      roomId: form.roomId || null,
    };
    try {
      if (form.id) {
        updateCourse(form.id, payload);
      } else {
        createCourse(payload);
      }
      setForm(EMPTY_FORM);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể lưu khóa học.");
    }
  }

  function handleEdit(course: Course) {
    setForm({
      id: course.id,
      title: course.title,
      description: course.description,
      days: course.schedule.days,
      startTime: course.schedule.startTime,
      endTime: course.schedule.endTime,
      capacity: String(course.capacity),
      teacherId: course.teacherId ?? "",
      roomId: course.roomId ?? "",
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

  function roomName(roomId: string | null) {
    if (!roomId) return "Chưa xếp phòng";
    return rooms.find((r) => r.id === roomId)?.name ?? "Chưa xếp phòng";
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
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Mô tả</label>
            <Input
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Ngày học</label>
            <div className="flex flex-wrap gap-3">
              {DAYS_OF_WEEK.map((day) => (
                <label
                  key={day}
                  className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400"
                >
                  <input
                    type="checkbox"
                    checked={form.days.includes(day)}
                    onChange={() => toggleDay(day)}
                  />
                  {DAY_LABELS[day]}
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Giờ bắt đầu</label>
            <Input
              type="time"
              required
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Giờ kết thúc</label>
            <Input
              type="time"
              required
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
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
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Phòng học</label>
            <Select
              value={form.roomId}
              onChange={(e) => setForm({ ...form, roomId: e.target.value })}
            >
              <option value="">Chưa xếp phòng</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
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
                {formatSchedule(course.schedule)} · Giảng viên: {teacherName(course.teacherId)} ·{" "}
                Phòng: {roomName(course.roomId)} ·{" "}
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
