"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/layout/AuthProvider";

interface QuoteRequestFormProps {
  designId: string;
  onSuccess: () => void;
}

const CONTACT_OPTIONS = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "llamada", label: "Llamada" },
  { id: "email", label: "Email" },
];

export function QuoteRequestForm({ designId, onSuccess }: QuoteRequestFormProps) {
  const { profile } = useAuth();
  const [contactPreference, setContactPreference] = useState("whatsapp");
  const [advisorNotes, setAdvisorNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/request-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designId, contactPreference, advisorNotes }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? "Error al solicitar cotización");
      setSuccess(true);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div role="status" className="text-center py-8">
        <p className="font-heading text-2xl text-content-primary mb-3">Cotización solicitada</p>
        <p className="font-accent text-content-secondary font-light">
          Un asesor Hemenesy se pondrá en contacto contigo personalmente.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {profile && (
        <div className="font-accent text-sm text-content-secondary space-y-1">
          <p>{profile.full_name}</p>
          <p>{profile.email}</p>
          {profile.phone && <p>{profile.phone}</p>}
        </div>
      )}

      {/* Contact preference */}
      <div>
        <p className="font-body text-xs tracking-widest uppercase text-content-secondary mb-3">
          Preferencia de contacto
        </p>
        <div className="flex gap-3">
          {CONTACT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setContactPreference(opt.id)}
              className={`flex-1 py-2 border text-sm font-body tracking-wide uppercase transition-all duration-200 ${
                contactPreference === opt.id
                  ? "border-brand-accent text-brand-accent bg-brand-accent/5"
                  : "border-line text-content-secondary hover:border-brand-accent/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Advisor notes */}
      <div>
        <label className="block font-body text-xs tracking-widest uppercase text-content-secondary mb-2">
          Nota para el asesor (opcional)
        </label>
        <textarea
          value={advisorNotes}
          onChange={(e) => setAdvisorNotes(e.target.value)}
          disabled={loading}
          rows={3}
          className="w-full border-b border-line bg-transparent text-content-primary font-accent text-sm py-2 resize-none focus:outline-none focus:border-brand-accent transition-colors"
          placeholder="Tamaño, fecha especial, presupuesto estimado..."
        />
      </div>

      {error && <p role="alert" className="text-red-400 text-sm font-body">{error}</p>}

      <Button type="submit" variant="primary" disabled={loading} className="w-full">
        {loading ? "Enviando..." : "Confirmar solicitud"}
      </Button>
    </form>
  );
}
