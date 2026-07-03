import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-[#0a0a0a] ${className}`}
    >
      {children}
    </div>
  );
}
