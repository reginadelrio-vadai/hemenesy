"use client";
import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
}

const VARIANTS = {
  primary:
    "bg-brand-accent text-surface-dark font-medium hover:brightness-110",
  outline:
    "border border-brand-accent text-brand-accent bg-transparent hover:bg-brand-accent hover:text-surface-dark",
  ghost: "text-brand-accent hover:text-brand-accent/80",
};

export function Button({
  variant = "primary",
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`
        px-8 py-3 transition-all duration-300 tracking-wide uppercase text-sm font-body
        ${VARIANTS[variant]}
        ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}
        ${className}
      `.trim()}
    >
      {children}
    </button>
  );
}
