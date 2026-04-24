import type { Metadata } from "next";
import { Montserrat, Lato, DM_Mono } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lato = Lato({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "TripManager — Planeje sua viagem com IA",
  description: "Planeje sua próxima viagem em segundos com inteligência artificial.",
};

import { Navbar } from "@/components/layout/Navbar";
import { TripProvider } from "@/context/TripContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} ${lato.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pt-16">
        <TripProvider>
          <Navbar />
          {children}
        </TripProvider>
      </body>
    </html>
  );
}
