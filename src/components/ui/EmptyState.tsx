"use client";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  cta?: { label: string; href: string };
}

export function EmptyState({ title, subtitle, cta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Diamond SVG */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-brand-accent/40 mb-6"
        aria-hidden="true"
      >
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
        <line x1="12" y1="2" x2="12" y2="22" />
        <path d="M2 8.5l10 6.5 10-6.5" />
      </svg>

      <h3 className="font-heading text-2xl text-content-primary mb-2">{title}</h3>
      <p className="font-accent text-base text-content-secondary font-light mb-8 max-w-xs leading-relaxed">
        {subtitle}
      </p>

      {cta && (
        <Link
          href={cta.href}
          className="font-body text-sm tracking-widest uppercase border border-brand-accent text-brand-accent px-8 py-3 hover:bg-brand-accent hover:text-surface-dark transition-all duration-300"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
