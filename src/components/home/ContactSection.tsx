"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FADE_UP, LUXURY } from "@/utils/animations";
import type { ContactRequest } from "@/types";

// ─── Card definitions ────────────────────────────────────────────────────────

const CARDS: {
  value: ContactRequest["request_type"];
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "showroom",
    label: "Visitar Showroom",
    desc: "Agenda una visita a nuestro atelier y conoce nuestra colección en persona.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    value: "cotizacion",
    label: "Solicitar Cotización",
    desc: "Cuéntanos tu proyecto y recibe una propuesta personalizada de nuestros asesores.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
        <line x1="12" y1="2" x2="12" y2="22" />
        <path d="M2 8.5l10 6.5 10-6.5" />
      </svg>
    ),
  },
  {
    value: "asesoria_virtual",
    label: "Asesoría Virtual",
    desc: "Consulta con uno de nuestros gemólogos expertos desde cualquier parte del mundo.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    value: "contacto_general",
    label: "Contacto General",
    desc: "Cualquier consulta, comentario o propuesta. Respondemos en menos de 24 horas.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(form: Omit<ContactRequest, "request_type">) {
  const errs: Record<string, string> = {};
  if (!form.full_name.trim()) errs.full_name = "Campo requerido";
  if (!form.email.trim()) errs.email = "Campo requerido";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errs.email = "Ingresa un email válido";
  if (!form.phone.trim()) errs.phone = "Campo requerido";
  else if (form.phone.replace(/\D/g, "").length < 10)
    errs.phone = "Mínimo 10 dígitos";
  return errs;
}

// ─── Section ─────────────────────────────────────────────────────────────────

type FormState = { full_name: string; email: string; phone: string; message: string };

export function ContactSection() {
  const titleRef = useScrollAnimation(FADE_UP);

  const [selectedType, setSelectedType] =
    useState<ContactRequest["request_type"] | null>(null);
  const [form, setForm] = useState<FormState>({
    full_name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formContainerRef = useRef<HTMLDivElement>(null);
  const formWrapRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const prevTypeRef = useRef<ContactRequest["request_type"] | null>(null);

  // Slide form in on first card selection
  useEffect(() => {
    if (selectedType && !prevTypeRef.current && formContainerRef.current) {
      gsap.from(formContainerRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: LUXURY.ease.transition,
        clearProps: "height",
        onComplete: () => {
          formContainerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        },
      });
    } else if (selectedType && prevTypeRef.current && formContainerRef.current) {
      formContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    prevTypeRef.current = selectedType;
  }, [selectedType]);

  // Fade in success message after submitted state
  useEffect(() => {
    if (submitted && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: LUXURY.ease.content }
      );
    }
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.full_name,
          email: form.email,
          phone: form.phone,
          requestType: selectedType ?? "contacto_general",
          message: form.message,
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        setErrors({ _api: d.error ?? "Error al enviar" });
        setLoading(false);
        return;
      }
    } catch {
      setErrors({ _api: "Error de conexión. Inténtalo de nuevo." });
      setLoading(false);
      return;
    }

    // GSAP fade-out form, then show success
    if (formWrapRef.current) {
      gsap.to(formWrapRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: LUXURY.ease.content,
        onComplete: () => {
          setLoading(false);
          setSubmitted(true);
        },
      });
    } else {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const set = (key: keyof FormState) => (v: string) => {
    setForm((f) => ({ ...f, [key]: v }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  return (
    <section
      id="contacto"
      className="bg-surface-medium py-24 lg:py-32"
      aria-label="Contacto Hemenesy"
    >
      <div className="max-w-content mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-brand-accent mb-4">
            Contáctanos
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-content-primary mb-4">
            Hablemos
          </h2>
          <p className="font-accent text-lg text-content-secondary font-light">
            Estamos aquí para asesorarte en cada paso de tu experiencia Hemenesy.
          </p>
        </div>

        {/* 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-0">
          {CARDS.map((card) => (
            <button
              key={card.value}
              type="button"
              onClick={() => setSelectedType(card.value)}
              aria-pressed={selectedType === card.value}
              className={`
                p-6 lg:p-8 border text-left transition-all duration-300 group cursor-pointer
                hover:scale-[1.02] hover:-translate-y-1
                ${
                  selectedType === card.value
                    ? "border-brand-accent bg-brand-accent/5"
                    : "border-line hover:border-brand-accent hover:bg-white/[0.02]"
                }
              `}
            >
              <div
                className={`mb-5 transition-colors duration-300 ${
                  selectedType === card.value
                    ? "text-brand-accent"
                    : "text-content-secondary group-hover:text-brand-accent"
                }`}
              >
                {card.icon}
              </div>
              <h3 className="font-heading text-base text-content-primary mb-2">
                {card.label}
              </h3>
              <p className="font-accent text-sm text-content-secondary font-light leading-relaxed">
                {card.desc}
              </p>
              <span className={`
                inline-block mt-4 font-body text-xs tracking-widest uppercase transition-all duration-300
                ${
                  selectedType === card.value
                    ? "text-brand-accent translate-x-1"
                    : "text-content-secondary/60 group-hover:text-brand-accent group-hover:translate-x-1"
                }
              `}>
                Seleccionar →
              </span>
            </button>
          ))}
        </div>

        {/* Form — slides in after card selection */}
        {selectedType && (
          <div ref={formContainerRef} className="overflow-hidden">
            <div className="max-w-xl mx-auto pt-12">
              {submitted ? (
                <div
                  ref={successRef}
                  role="status"
                  className="text-center py-16"
                  style={{ opacity: 0 }}
                >
                  <h3 className="font-heading text-3xl text-content-primary">
                    Gracias, {form.full_name.trim().split(" ")[0] || "estimado cliente"}.
                  </h3>
                  <p className="font-accent italic text-lg text-content-secondary mt-2 font-light">
                    Un asesor Hemenesy se pondrá en contacto contigo personalmente.
                  </p>
                </div>
              ) : (
                <div ref={formWrapRef}>
                  <p className="font-body text-xs tracking-[0.3em] uppercase text-brand-accent mb-4 text-center">
                    {CARDS.find((c) => c.value === selectedType)?.label}
                  </p>
                  <div className="w-8 h-px bg-brand-accent mx-auto mb-8" />

                  <form onSubmit={handleSubmit} noValidate>
                    <Input
                      label="Nombre completo"
                      value={form.full_name}
                      onChange={set("full_name")}
                      error={errors.full_name}
                      required
                      disabled={loading}
                      autoComplete="name"
                    />
                    <Input
                      label="Correo electrónico"
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      error={errors.email}
                      required
                      disabled={loading}
                      autoComplete="email"
                    />
                    <Input
                      label="Teléfono"
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      error={errors.phone}
                      required
                      disabled={loading}
                      autoComplete="tel"
                      placeholder="Incluye código de país"
                    />
                    <Input
                      label="Mensaje (opcional)"
                      value={form.message}
                      onChange={set("message")}
                      disabled={loading}
                    />

                    {errors._api && (
                      <p role="alert" className="text-red-400 text-sm mb-4 font-body">{errors._api}</p>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      className="w-full mt-2"
                    >
                      {loading ? "Enviando..." : "Enviar"}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
