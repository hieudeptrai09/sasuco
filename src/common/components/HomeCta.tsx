"use client";

import Link from "next/link";
import { useAuth } from "../containers/use-auth";
import { ROLE_HOME } from "../constants/roles";

export function HomeCta() {
  const { user, status } = useAuth();

  if (status === "authenticated" && user) {
    return (
      <Link
        href={ROLE_HOME[user.role]}
        className="flex h-12 w-full items-center justify-center rounded-full bg-foreground px-6 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-auto"
      >
        Đến trang của bạn
      </Link>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Link
        href="/login"
        className="flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Đăng nhập
      </Link>
      <Link
        href="/register"
        className="flex h-12 items-center justify-center rounded-full border border-black/[.08] px-6 transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
      >
        Tạo tài khoản học viên
      </Link>
    </div>
  );
}
