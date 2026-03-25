"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/";
  const authError = params.get("error");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) throw new Error(err.message);
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });
      if (err) throw new Error(err.message);
      setForgotSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar el correo");
    } finally {
      setForgotLoading(false);
    }
  };

  // ── Forgot password view ──
  if (forgotMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-dark px-6">
        <div className="w-full max-w-sm">
          {forgotSent ? (
            <div className="text-center">
              <h1 className="font-heading text-3xl text-content-primary mb-4">Correo enviado</h1>
              <p className="font-accent text-content-secondary font-light mb-8">
                Revisa tu bandeja de entrada y sigue el enlace para restablecer tu contraseña.
              </p>
              <button
                onClick={() => { setForgotMode(false); setForgotSent(false); }}
                className="font-body text-sm tracking-widest uppercase text-brand-accent hover:text-brand-accent/80 transition-colors"
              >
                Volver al inicio de sesión
              </button>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-3xl text-content-primary mb-2 text-center">
                Recuperar contraseña
              </h1>
              <p className="font-accent text-content-secondary text-center mb-10 font-light">
                Te enviaremos un enlace para restablecer tu contraseña.
              </p>
              <form onSubmit={handleForgot} noValidate>
                <Input
                  label="Correo electrónico"
                  type="email"
                  value={forgotEmail}
                  onChange={setForgotEmail}
                  required
                  disabled={forgotLoading}
                  autoComplete="email"
                />
                {error && (
                  <p role="alert" className="text-red-400 text-sm mb-4 font-body">{error}</p>
                )}
                <Button type="submit" variant="primary" disabled={forgotLoading} className="w-full">
                  {forgotLoading ? "Enviando..." : "Enviar enlace"}
                </Button>
              </form>
              <button
                onClick={() => { setForgotMode(false); setError(""); }}
                className="block font-body text-sm text-content-secondary text-center mt-6 hover:text-content-primary transition-colors w-full"
              >
                Volver al inicio de sesión
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Login view ──
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-dark px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-heading text-3xl text-content-primary mb-2 text-center">
          Iniciar sesión
        </h1>
        <p className="font-accent text-content-secondary text-center mb-10 font-light">
          Bienvenido de vuelta a Hemenesy
        </p>

        {authError && (
          <p role="alert" className="text-red-400 text-sm mb-6 font-body text-center">
            Error de autenticación. Intenta de nuevo.
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
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
            label="Contraseña"
            type="password"
            value={password}
            onChange={setPassword}
            required
            disabled={loading}
            autoComplete="current-password"
          />

          <div className="text-right -mt-3 mb-6">
            <button
              type="button"
              onClick={() => { setForgotMode(true); setForgotEmail(email); setError(""); }}
              className="font-body text-xs text-content-secondary hover:text-brand-accent transition-colors tracking-wide"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {error && (
            <p role="alert" className="text-red-400 text-sm mb-4 font-body">{error}</p>
          )}

          <Button type="submit" variant="primary" disabled={loading} className="w-full">
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>

        <p className="font-body text-sm text-content-secondary text-center mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/auth/register" className="text-brand-accent hover:text-brand-accent/80 transition-colors">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
