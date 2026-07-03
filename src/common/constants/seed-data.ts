import type { User } from "../types/user";
import type { Course } from "../types/course";

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

export const DEMO_COURSES: Course[] = [
  {
    id: "course-webdev-demo",
    title: "Nhập môn Phát triển Web",
    description: "Học các kiến thức nền tảng về HTML, CSS và JavaScript.",
    teacherId: "user-teacher-demo",
    capacity: 20,
    schedule: "Thứ 2 & Thứ 4, 9:00 - 11:00",
    createdAt: SEED_DATE,
  },
  {
    id: "course-datastructures-demo",
    title: "Cấu trúc Dữ liệu & Giải thuật",
    description:
      "Các cấu trúc dữ liệu cơ bản, phân tích độ phức tạp và kỹ năng giải quyết vấn đề.",
    teacherId: "user-teacher-demo",
    capacity: 15,
    schedule: "Thứ 3 & Thứ 5, 13:00 - 15:00",
    createdAt: SEED_DATE,
  },
];
