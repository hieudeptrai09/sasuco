import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]",
  secondary:
    "border border-black/[.08] hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
