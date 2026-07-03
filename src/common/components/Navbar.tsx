"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../containers/use-auth";
import { ROLE_LABELS } from "../constants/roles";
import type { Role } from "../types/role";
import { Button } from "./ui/Button";

const NAV_LINKS: Record<Role, { href: string; label: string }[]> = {
  admin: [
    { href: "/admin", label: "Tổng quan" },
    { href: "/admin/users", label: "Người dùng" },
    { href: "/admin/courses", label: "Khóa học" },
  ],
  manager: [
    { href: "/manager", label: "Tổng quan" },
    { href: "/manager/courses", label: "Khóa học" },
  ],
  teacher: [{ href: "/teacher", label: "Khóa học của tôi" }],
  student: [{ href: "/student", label: "Khóa học" }],
};

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="border-b border-black/[.08] bg-white dark:border-white/[.145] dark:bg-black">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-zinc-950 dark:text-zinc-50">
            Sasuco LMS
          </span>
          <nav className="flex gap-4 text-sm">
            {NAV_LINKS[user.role].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-zinc-500 dark:text-zinc-400">
            {user.name} · {ROLE_LABELS[user.role]}
          </span>
          <Button variant="secondary" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </div>
      </div>
    </header>
  );
}
