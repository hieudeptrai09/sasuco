"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../containers/use-auth";
import { ROLE_HOME } from "../constants/roles";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card } from "./ui/Card";

export function LoginForm() {
  const { login, user, status } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && user) {
      router.replace(ROLE_HOME[user.role]);
    }
  }, [status, user, router]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <h1 className="mb-6 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
        Đăng nhập
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm text-zinc-600 dark:text-zinc-400">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm text-zinc-600 dark:text-zinc-400">
            Mật khẩu
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit">Đăng nhập</Button>
      </form>
      <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="font-medium text-zinc-950 dark:text-zinc-50">
          Đăng ký làm học viên
        </Link>
      </p>
    </Card>
  );
}
