import { UserManager } from "../../../common/components/UserManager";

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">Người dùng</h1>
      <UserManager />
    </div>
  );
}
