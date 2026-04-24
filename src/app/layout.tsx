import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
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
      className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable} h-full antialiased`}
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
