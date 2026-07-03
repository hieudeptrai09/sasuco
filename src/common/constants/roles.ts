import type { Role } from "../types/role";

export const ROLES: Role[] = ["admin", "manager", "teacher", "student"];

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Quản trị viên",
  manager: "Quản lý",
  teacher: "Giảng viên",
  student: "Học viên",
};

export const ROLE_HOME: Record<Role, string> = {
  admin: "/admin",
  manager: "/manager",
  teacher: "/teacher",
  student: "/student",
};
