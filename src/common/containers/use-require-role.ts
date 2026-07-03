"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "../types/role";
import { ROLE_HOME } from "../constants/roles";
import { useAuth } from "./use-auth";

export function useRequireRole(allow: Role[]) {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (user && !allow.includes(user.role)) {
      router.replace(ROLE_HOME[user.role]);
    }
  }, [status, user, router, allow]);

  const authorized = status === "authenticated" && !!user && allow.includes(user.role);
  return { user, status, authorized };
}
