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
    "Consultoria em processos e aplicativos de gestão sob medida para empresas: menos retrabalho, informação certa para quem decide e equipes mais produtivas.",
  openGraph: {
    title: "MAFRA Consultoria & Tecnologia",
    description: "Processos mais inteligentes. Equipes mais produtivas. Empresa mais lucrativa.",
    type: "website",
    locale: "pt_BR",
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
