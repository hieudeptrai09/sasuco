import type { User } from "../types/user";
import type { Course } from "../types/course";
import type { Room } from "../types/room";

const SEED_DATE = "2026-01-01T00:00:00.000Z";

export const DEMO_USERS: User[] = [
  {
    id: "user-admin-demo",
    name: "Nguyễn Văn An",
    email: "admin@demo.com",
    password: "admin123",
    role: "admin",
    createdAt: SEED_DATE,
  },
  {
    id: "user-manager-demo",
    name: "Trần Thị Bình",
    email: "manager@demo.com",
    password: "manager123",
    role: "manager",
    createdAt: SEED_DATE,
  },
  {
    id: "user-teacher-demo",
    name: "Lê Văn Cường",
    email: "teacher@demo.com",
    password: "teacher123",
    role: "teacher",
    createdAt: SEED_DATE,
  },
  {
    id: "user-student-demo",
    name: "Phạm Thị Dung",
    email: "student@demo.com",
    password: "student123",
    role: "student",
    createdAt: SEED_DATE,
  },
];

export const DEMO_ROOMS: Room[] = [
  {
    id: "room-a101-demo",
    name: "Phòng A101",
    capacity: 30,
    createdAt: SEED_DATE,
  },
  {
    id: "room-a102-demo",
    name: "Phòng A102",
    capacity: 20,
    createdAt: SEED_DATE,
  },
];

export const DEMO_COURSES: Course[] = [
  {
    id: "course-webdev-demo",
    title: "Nhập môn Phát triển Web",
    description: "Học các kiến thức nền tảng về HTML, CSS và JavaScript.",
    teacherId: "user-teacher-demo",
    roomId: "room-a101-demo",
    capacity: 20,
    schedule: { days: [1, 3], startTime: "09:00", endTime: "11:00" },
    createdAt: SEED_DATE,
  },
  {
    id: "course-datastructures-demo",
    title: "Cấu trúc Dữ liệu & Giải thuật",
    description:
      "Các cấu trúc dữ liệu cơ bản, phân tích độ phức tạp và kỹ năng giải quyết vấn đề.",
    teacherId: "user-teacher-demo",
    roomId: "room-a102-demo",
    capacity: 15,
    schedule: { days: [2, 4], startTime: "13:00", endTime: "15:00" },
    createdAt: SEED_DATE,
  },
];
