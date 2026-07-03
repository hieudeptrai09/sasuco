import type { InputHTMLAttributes } from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-white/[.145] dark:focus:border-zinc-500 ${className}`}
      {...props}
    />
  );
}
