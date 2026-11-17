import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "lenis/dist/lenis.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mafra — Consultoria e Implementação de Aplicativos",
  description:
    "Mafra: consultoria, design e desenvolvimento de aplicativos sob medida. Da ideia ao app publicado nas lojas.",
  openGraph: {
    title: "Mafra — Apps que movem negócios",
    description: "Consultoria e implementação de aplicativos iOS, Android e Web.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  themeColor: "#07070c",
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
