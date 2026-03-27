import { Suspense } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { HistorySection } from "@/components/home/HistorySection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { GallerySection } from "@/components/home/GallerySection";
import { CertificationsSection } from "@/components/home/CertificationsSection";
import { DesignerTeaser } from "@/components/home/DesignerTeaser";
import { ContactSection } from "@/components/home/ContactSection";
import { ScrollHandler } from "@/components/home/ScrollHandler";

export default function HomePage() {
  return (
    <>
      <Suspense fallback={null}>
        <ScrollHandler />
      </Suspense>
      <HeroSection />
      <DesignerTeaser />
      <ProcessSection />
      <ContactSection />
      <GallerySection />
      <HistorySection />
      <CertificationsSection />
    </>
  );
}
