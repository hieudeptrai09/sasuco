import type { SelectHTMLAttributes } from "react";

export function Select({
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-white/[.145] dark:bg-black dark:focus:border-zinc-500 ${className}`}
      {...props}
    />
  );
}
