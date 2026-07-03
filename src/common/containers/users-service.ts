import type { AuthUser, User } from "../types/user";
import type { Role } from "../types/role";
import { STORAGE_KEYS } from "../constants/storage-keys";
import { generateId, readCollection, writeCollection } from "./storage";
import { isUserAssignedAsTeacher } from "./courses-service";
import { deleteEnrollmentsForStudent } from "./enrollments-service";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export function listUsers(): User[] {
  return readCollection<User>(STORAGE_KEYS.users);
}

export function getUser(id: string): User | undefined {
  return listUsers().find((u) => u.id === id);
}

export function findUserByEmail(email: string): User | undefined {
  const normalized = email.toLowerCase();
  return listUsers().find((u) => u.email.toLowerCase() === normalized);
}

export function createUser(input: CreateUserInput): User {
  if (findUserByEmail(input.email)) {
    throw new Error("Email này đã được sử dụng.");
  }
  const user: User = {
    ...input,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  writeCollection(STORAGE_KEYS.users, [...listUsers(), user]);
  return user;
}

function countAdmins(users: User[]): number {
  return users.filter((u) => u.role === "admin").length;
}

export function updateUser(
  id: string,
  patch: Partial<Pick<User, "name" | "email" | "role" | "password">>
): User | undefined {
  const users = listUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return undefined;
  const current = users[index];

  if (
    patch.email &&
    users.some(
      (u) => u.id !== id && u.email.toLowerCase() === patch.email!.toLowerCase()
    )
  ) {
    throw new Error("Email này đã được sử dụng.");
  }

  if (patch.role && patch.role !== current.role) {
    if (current.role === "teacher" && isUserAssignedAsTeacher(id)) {
      throw new Error(
        "Vui lòng phân công lại hoặc xóa các khóa học của giảng viên này trước khi đổi vai trò."
      );
    }
    if (current.role === "admin" && countAdmins(users) <= 1) {
      throw new Error("Không thể đổi vai trò của quản trị viên cuối cùng.");
    }
  }

  const updated = { ...current, ...patch };
  users[index] = updated;
  writeCollection(STORAGE_KEYS.users, users);
  return updated;
}

export function deleteUser(id: string): void {
  const user = getUser(id);
  if (!user) return;

  if (isUserAssignedAsTeacher(id)) {
    throw new Error(
      "Vui lòng phân công lại hoặc xóa các khóa học của giảng viên này trước khi xóa tài khoản."
    );
  }

  if (user.role === "admin" && countAdmins(listUsers()) <= 1) {
    throw new Error("Không thể xóa quản trị viên cuối cùng.");
  }

  writeCollection(
    STORAGE_KEYS.users,
    listUsers().filter((u) => u.id !== id)
  );

  if (user.role === "student") {
    deleteEnrollmentsForStudent(id);
  }
}
