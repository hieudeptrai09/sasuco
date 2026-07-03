"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Role } from "../types/role";
import type { User } from "../types/user";
import { ROLE_LABELS, ROLES } from "../constants/roles";
import { useAuth } from "../containers/use-auth";
import { createUser, deleteUser, listUsers, updateUser } from "../containers/users-service";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Card } from "./ui/Card";

export function UserManager() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setUsers(listUsers());
  }

  function handleCreate(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      createUser({ name, email, password, role });
      setName("");
      setEmail("");
      setPassword("");
      setRole("student");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tạo người dùng.");
    }
  }

  function handleRoleChange(id: string, nextRole: Role) {
    setError(null);
    try {
      updateUser(id, { role: nextRole });
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật người dùng.");
    }
  }

  function handleDelete(id: string) {
    setError(null);
    try {
      deleteUser(id);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xóa người dùng.");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          Thêm người dùng
        </h2>
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Họ và tên</label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Email</label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Mật khẩu</label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Vai trò</label>
            <Select value={role} onChange={(e) => setRole(e.target.value as Role)}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit">Thêm người dùng</Button>
        </form>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          Danh sách người dùng
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/[.08] text-zinc-500 dark:border-white/[.145] dark:text-zinc-400">
                <th className="py-2 pr-4">Họ và tên</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Vai trò</th>
                <th className="py-2 pr-4" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u.id === currentUser?.id;
                return (
                  <tr key={u.id} className="border-b border-black/[.04] dark:border-white/[.08]">
                    <td className="py-2 pr-4">{u.name}</td>
                    <td className="py-2 pr-4">{u.email}</td>
                    <td className="py-2 pr-4">
                      <Select
                        value={u.role}
                        disabled={isSelf}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </Select>
                    </td>
                    <td className="py-2 pr-4">
                      <Button variant="danger" disabled={isSelf} onClick={() => handleDelete(u.id)}>
                        Xóa
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
