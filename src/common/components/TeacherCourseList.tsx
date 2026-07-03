"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Course, DayOfWeek } from "../types/course";
import type { User } from "../types/user";
import { DAYS_OF_WEEK, DAY_LABELS } from "../constants/days";
import { useAuth } from "../containers/use-auth";
import { listCoursesByTeacher, updateCourse } from "../containers/courses-service";
import { listEnrollmentsByCourse } from "../containers/enrollments-service";
import { listUsers } from "../containers/users-service";
import { listRooms } from "../containers/rooms-service";
import { formatSchedule } from "../containers/schedule";
import type { Room } from "../types/room";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card } from "./ui/Card";

export function TeacherCourseList() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [days, setDays] = useState<DayOfWeek[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) refresh(user.id);
  }, [user]);

  function refresh(teacherId: string) {
    setCourses(listCoursesByTeacher(teacherId));
    setStudents(listUsers().filter((u) => u.role === "student"));
    setRooms(listRooms());
  }

  function toggleDay(day: DayOfWeek) {
    setDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  function startEdit(course: Course) {
    setError(null);
    setEditingId(course.id);
    setDescription(course.description);
    setDays(course.schedule.days);
    setStartTime(course.schedule.startTime);
    setEndTime(course.schedule.endTime);
  }

  function handleSave(event: FormEvent, courseId: string) {
    event.preventDefault();
    setError(null);
    if (days.length === 0) {
      setError("Vui lòng chọn ít nhất một ngày học.");
      return;
    }
    if (!startTime || !endTime || startTime >= endTime) {
      setError("Giờ kết thúc phải sau giờ bắt đầu.");
      return;
    }
    try {
      updateCourse(courseId, { description, schedule: { days, startTime, endTime } });
      setEditingId(null);
      if (user) refresh(user.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể lưu khóa học.");
    }
  }

  function roomName(roomId: string | null) {
    if (!roomId) return "Chưa xếp phòng";
    return rooms.find((r) => r.id === roomId)?.name ?? "Chưa xếp phòng";
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
                  <label className="text-sm text-zinc-600 dark:text-zinc-400">Ngày học</label>
                  <div className="flex flex-wrap gap-3">
                    {DAYS_OF_WEEK.map((day) => (
                      <label
                        key={day}
                        className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400"
                      >
                        <input
                          type="checkbox"
                          checked={days.includes(day)}
                          onChange={() => toggleDay(day)}
                        />
                        {DAY_LABELS[day]}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-1 flex-col gap-1.5">
                    <label className="text-sm text-zinc-600 dark:text-zinc-400">Giờ bắt đầu</label>
                    <Input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <label className="text-sm text-zinc-600 dark:text-zinc-400">Giờ kết thúc</label>
                    <Input
                      type="time"
                      required
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit">Lưu</Button>
                  <Button type="button" variant="secondary" onClick={() => setEditingId(null)}>
                    Hủy
                  </Button>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </form>
            ) : (
              <>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{course.description}</p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {formatSchedule(course.schedule)} · Phòng: {roomName(course.roomId)}
                </p>
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
