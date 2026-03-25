"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/layout/AuthProvider";
import { createClient } from "@/lib/supabase/client";

export function ProfileForm() {
  const { user, profile, refetchProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setPhone(profile.phone ?? "");
    }
  }, [profile]);

  // Fade-out success after 3s
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: dbErr } = await supabase
        .from("user_profiles")
        .update({ full_name: fullName.trim(), phone: phone.trim() || null })
        .eq("id", user.id);
      if (dbErr) throw dbErr;
      await refetchProfile();
      setSuccess(true);
    } catch {
      setError("Error al guardar. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm">
      <h2 className="font-heading text-2xl text-content-primary mb-8">Mi perfil</h2>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Email (read-only) */}
        <div>
          <label className="block font-body text-xs tracking-widest uppercase text-content-secondary/50 mb-2">
            Correo electrónico
          </label>
          <input
            type="email"
            value={user?.email ?? ""}
            disabled
            className="w-full border-b border-line/30 bg-transparent text-content-secondary/50 font-accent text-sm py-2 focus:outline-none cursor-not-allowed"
          />
        </div>

        {/* Full name */}
        <div>
          <label className="block font-body text-xs tracking-widest uppercase text-content-secondary mb-2">
            Nombre completo
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
            className="w-full border-b border-line bg-transparent text-content-primary font-accent text-sm py-2 focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-body text-xs tracking-widest uppercase text-content-secondary mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
            placeholder="+57 300 000 0000"
            className="w-full border-b border-line bg-transparent text-content-primary font-accent text-sm py-2 focus:outline-none focus:border-brand-accent transition-colors placeholder-content-secondary/30"
          />
        </div>

        {error && <p role="alert" className="text-red-400 text-sm font-body">{error}</p>}

        <div className="flex items-center gap-6">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
          {success && (
            <p className="font-accent text-sm text-emerald-400 transition-opacity duration-300">
              Perfil actualizado
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
