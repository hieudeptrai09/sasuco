import type { Role } from "./role";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: string;
}

export type AuthUser = Omit<User, "password">;
