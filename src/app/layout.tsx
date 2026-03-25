import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { AuthProvider } from "@/components/layout/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-accent",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hemenesy — Esmeraldas de Lujo",
  description:
    "Descubre esmeraldas únicas y diseña tu joya perfecta con tecnología AI.",
  openGraph: {
    title: "Hemenesy — Esmeraldas de Lujo",
    description:
      "Descubre esmeraldas únicas y diseña tu joya perfecta con tecnología AI.",
    locale: "es_MX",
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${playfair.variable} ${inter.variable} ${cormorant.variable} bg-surface-dark text-content-primary antialiased`}
      >
        <AuthProvider>
          <ClientLayout>
            <Navbar />
            <main>{children}</main>
          </ClientLayout>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
