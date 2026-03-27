"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length < 10) {
      setPhoneError("El teléfono es obligatorio (mínimo 10 dígitos)");
      return;
    }
    setPhoneError("");
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, phone } },
      });
      if (err) throw new Error(err.message);

      // Notificar a N8N sobre el nuevo cliente
      fetch("/api/auth/new-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone }),
      }).catch(() => {}); // Fire and forget — no bloquear el registro si falla

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center max-w-sm">
        <h1 className="font-heading text-3xl text-content-primary mb-4">Cuenta creada</h1>
        <p className="font-accent text-content-secondary font-light mb-8">
          Revisa tu correo para confirmar tu cuenta y luego inicia sesión.
        </p>
        <Link
          href={`/auth/login?redirect=${encodeURIComponent(redirect)}`}
          className="font-body text-sm tracking-widest uppercase text-brand-accent hover:text-brand-accent/80 transition-colors"
        >
          Ir al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-heading text-3xl text-content-primary mb-2 text-center">
        Crear cuenta
      </h1>
      <p className="font-accent text-content-secondary text-center mb-10 font-light">
        Únete a la experiencia Hemenesy
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Nombre completo"
          value={fullName}
          onChange={setFullName}
          required
          disabled={loading}
          autoComplete="name"
        />
        <Input
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={setEmail}
          required
          disabled={loading}
          autoComplete="email"
        />
        <Input
          label="Teléfono"
          type="tel"
          value={phone}
          onChange={(v) => { setPhone(v); if (phoneError) setPhoneError(""); }}
          required
          disabled={loading}
          autoComplete="tel"
          error={phoneError}
        />
        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={setPassword}
          required
          disabled={loading}
          autoComplete="new-password"
        />

        {error && (
          <p role="alert" className="text-red-400 text-sm mb-4 font-body">{error}</p>
        )}

        <Button type="submit" variant="primary" disabled={loading} className="w-full">
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>

      <p className="font-body text-sm text-content-secondary text-center mt-6">
        ¿Ya tienes cuenta?{" "}
        <Link href={`/auth/login?redirect=${encodeURIComponent(redirect)}`} className="text-brand-accent hover:text-brand-accent/80 transition-colors">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-dark px-6 py-20">
      <Suspense fallback={<div className="w-full max-w-sm text-center text-content-secondary font-accent">Cargando...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
