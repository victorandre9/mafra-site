import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "lenis/dist/lenis.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAFRA Consultoria & Tecnologia — Apps sob medida",
  description:
    "MAFRA Consultoria & Tecnologia: consultoria e implementação de aplicativos. Da necessidade operacional à solução digital.",
  openGraph: {
    title: "MAFRA Consultoria & Tecnologia",
    description: "Consultoria e implementação de aplicativos iOS, Android e Web.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  themeColor: "#061428",
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
