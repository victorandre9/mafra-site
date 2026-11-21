import type { Metadata, Viewport } from "next";
import "@fontsource-variable/syne";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/inter";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./theme-claro.css";

export const metadata: Metadata = {
  title: "MAFRA Consultoria & Tecnologia — Eficiência operacional com tecnologia",
  description:
    "Consultoria em processos e software de gestão sob medida para empresas: menos retrabalho, informação certa para quem decide e equipes mais produtivas.",
  metadataBase: new URL("https://mafra-site.vercel.app"),
  // Cartão da prévia (WhatsApp, Instagram, LinkedIn): imagem horizontal 1200×630 com a logo original.
  // O WhatsApp guarda a prévia antiga por um tempo; o "?v=2" força a imagem nova.
  openGraph: {
    title: "MAFRA Consultoria & Tecnologia",
    description: "Processos mais inteligentes. Equipes mais produtivas. Empresa mais lucrativa.",
    type: "website",
    locale: "pt_BR",
    siteName: "MAFRA Consultoria & Tecnologia",
    url: "/",
    images: [{ url: "/og-image.jpg?v=3", width: 1200, height: 630, alt: "MAFRA Consultoria & Tecnologia — Transformo processos em resultados que movem." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAFRA Consultoria & Tecnologia",
    description: "Processos mais inteligentes. Equipes mais produtivas. Empresa mais lucrativa.",
    images: ["/og-image.jpg?v=3"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f3f6f9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="is-loading">{children}</body>
    </html>
  );
}
