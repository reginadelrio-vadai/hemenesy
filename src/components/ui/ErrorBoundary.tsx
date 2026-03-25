"use client";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] py-20 px-6 text-center">
          <div className="w-px h-12 bg-brand-accent/30 mb-8 mx-auto" />
          <p className="font-body text-xs tracking-[0.3em] uppercase text-brand-accent mb-6">
            Error del sistema
          </p>
          <h3 className="font-heading text-2xl text-content-primary mb-3">
            Algo no salió bien
          </h3>
          <p className="font-accent text-base text-content-secondary font-light mb-8 max-w-xs mx-auto leading-relaxed">
            Ocurrió un error inesperado. Por favor intenta de nuevo o contacta a nuestro equipo.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, message: "" })}
            className="font-body text-sm tracking-widest uppercase border border-brand-accent text-brand-accent px-8 py-3 hover:bg-brand-accent hover:text-surface-dark transition-all duration-300"
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
