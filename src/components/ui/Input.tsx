"use client";
import { type InputHTMLAttributes } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function Input({
  label,
  value,
  onChange,
  error,
  disabled,
  required,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="relative mb-6">
      <label className="block text-content-secondary text-sm mb-1 font-body tracking-wide">
        {label}
        {required && <span className="text-brand-accent ml-1" aria-hidden="true">*</span>}
      </label>
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className={`
          w-full border-b border-line bg-transparent text-content-primary
          placeholder-content-secondary font-body text-base py-3
          transition-colors duration-300
          focus:outline-none focus:border-b-brand-accent
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${error ? "border-b-red-400" : ""}
          ${className}
        `.trim()}
      />
      {error && (
        <p role="alert" className="text-red-400 text-sm mt-1 font-body">
          {error}
        </p>
      )}
    </div>
  );
}
