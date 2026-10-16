import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import { PROYECTO } from "@/lib/config";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Cinerama · Cartelera y entradas",
    template: "%s · Cinerama",
  },
  description: `Compra tus entradas, elige tu butaca y arma tu combo. ${PROYECTO.aviso}.`,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0e0c0b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-PE" className={`${bricolage.variable} ${geist.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        {children}
      </body>
    </html>
  );
}
