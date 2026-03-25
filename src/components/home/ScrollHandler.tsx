"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ScrollHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const section = searchParams.get("section");
    if (!section) return;
    const el = document.getElementById(section);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
  }, [searchParams]);

  return null;
}
