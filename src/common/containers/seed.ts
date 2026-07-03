import type { User } from "../types/user";
import type { Course } from "../types/course";
import { STORAGE_KEYS } from "../constants/storage-keys";
import { DEMO_USERS, DEMO_COURSES } from "../constants/seed-data";
import { readCollection, writeCollection } from "./storage";

export function ensureSeedData(): void {
  const users = readCollection<User>(STORAGE_KEYS.users);
  if (users.length === 0) {
    writeCollection<User>(STORAGE_KEYS.users, DEMO_USERS);
  }

  const courses = readCollection<Course>(STORAGE_KEYS.courses);
  if (courses.length === 0) {
    writeCollection<Course>(STORAGE_KEYS.courses, DEMO_COURSES);
  }
}
