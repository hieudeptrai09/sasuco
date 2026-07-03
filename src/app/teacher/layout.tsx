import type { ReactNode } from "react";
import type { Role } from "../../common/types/role";
import { RoleGuard } from "../../common/components/RoleGuard";
import { Navbar } from "../../common/components/Navbar";

const ALLOWED_ROLES: Role[] = ["teacher"];

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allow={ALLOWED_ROLES}>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">{children}</main>
    </RoleGuard>
  );
}
