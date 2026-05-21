import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diego Videla | Portfolio",
  description: "Cinematic 3D Portfolio of Diego Videla",
};

import LiDARScene from "@/components/canvas/LiDARScene";
import { Navigation } from "@/components/ui/Navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased bg-black`}
    >
      <body className="min-h-full flex flex-col font-sans bg-black selection:bg-white selection:text-black overflow-hidden">
        
        {/* Fondo Global (Persistente entre rutas) */}
        <div className="fixed inset-0 z-0">
          <LiDARScene />
        </div>

        {/* Navegación Compartida */}
        <Navigation />

        {/* Contenido Dinámico de Rutas */}
        <main className="relative z-10 w-full h-full pointer-events-none flex flex-col p-6 md:p-12 pt-32">
          {children}
        </main>
        
      </body>
    </html>
  );
}
