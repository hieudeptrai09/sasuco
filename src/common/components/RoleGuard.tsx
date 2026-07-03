"use client";

import type { ReactNode } from "react";
import type { Role } from "../types/role";
import { useRequireRole } from "../containers/use-require-role";

export function RoleGuard({
  allow,
  children,
}: {
  allow: Role[];
  children: ReactNode;
}) {
  const { authorized } = useRequireRole(allow);

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Đang tải…</p>
      </div>
    );
  }

  return <>{children}</>;
}
