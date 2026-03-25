"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/AuthProvider";
import { DesignsGrid } from "@/components/dashboard/DesignsGrid";
import { QuotesList } from "@/components/dashboard/QuotesList";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import type { Design } from "@/types";

type Tab = "designs" | "quotes" | "profile";

const TABS: { id: Tab; label: string }[] = [
  { id: "designs", label: "Mis Diseños" },
  { id: "quotes", label: "Mis Solicitudes" },
  { id: "profile", label: "Mi Perfil" },
];

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("designs");
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loadingDesigns, setLoadingDesigns] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [user, authLoading, router]);

  const fetchDesigns = useCallback(async () => {
    setLoadingDesigns(true);
    setFetchError("");
    try {
      const r = await fetch("/api/my-designs");
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? "Error al cargar");
      setDesigns(Array.isArray(d) ? d : []);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Error al cargar diseños");
    } finally {
      setLoadingDesigns(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchDesigns();
  }, [user, fetchDesigns]);

  const handleDesignUpdated = (designId: string, update: Partial<Design>) => {
    setDesigns((prev) => prev.map((d) => d.id === designId ? { ...d, ...update } : d));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center">
        <div className="w-8 h-8 border border-brand-accent/40 border-t-brand-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-surface-dark">
      <div className="flex pt-20">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:flex flex-col w-56 min-h-[calc(100vh-5rem)] border-r border-line/20 px-6 py-10 flex-shrink-0">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-content-secondary/50 mb-6">
            Mi cuenta
          </p>
          <nav className="flex flex-col gap-1">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`text-left font-body text-sm tracking-widest uppercase py-3 px-3 transition-colors duration-200 ${
                  tab === id
                    ? "text-brand-accent border-l border-brand-accent pl-3"
                    : "text-content-secondary hover:text-content-primary border-l border-transparent pl-3"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 px-6 lg:px-12 py-8 max-w-4xl">
          {/* Mobile tabs */}
          <div className="lg:hidden flex border-b border-line/20 mb-8 -mx-6 px-6">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex-1 font-body text-[10px] sm:text-xs tracking-wide sm:tracking-widest uppercase py-3 transition-colors duration-200 border-b-2 -mb-px truncate px-1 ${
                  tab === id
                    ? "text-brand-accent border-brand-accent"
                    : "text-content-secondary/60 border-transparent"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab: Mis Diseños */}
          {tab === "designs" && (
            <>
              <h1 className="hidden lg:block font-heading text-2xl text-content-primary mb-8">Mis Diseños</h1>
              {fetchError ? (
                <p role="alert" className="text-red-400 text-sm font-body">{fetchError}</p>
              ) : (
                <DesignsGrid
                  designs={designs}
                  loading={loadingDesigns}
                  onDesignUpdated={handleDesignUpdated}
                />
              )}
            </>
          )}

          {/* Tab: Mis Solicitudes */}
          {tab === "quotes" && (
            <>
              <h1 className="hidden lg:block font-heading text-2xl text-content-primary mb-8">Mis Solicitudes</h1>
              {fetchError ? (
                <p role="alert" className="text-red-400 text-sm font-body">{fetchError}</p>
              ) : loadingDesigns ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-20 bg-line/20 animate-pulse" />
                  ))}
                </div>
              ) : (
                <QuotesList designs={designs} />
              )}
            </>
          )}

          {/* Tab: Mi Perfil */}
          {tab === "profile" && <ProfileForm />}
        </main>
      </div>
    </div>
  );
}
