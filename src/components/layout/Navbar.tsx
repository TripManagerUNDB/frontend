"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

export function Navbar() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `btn-ghost ${isActive ? "text-gold font-semibold" : "text-foreground/80"}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-4 md:px-12 h-16 bg-[rgba(18,33,46,0.92)] border-b border-white/5 backdrop-blur-[20px]">
      <Link href="/" className="flex items-center gap-2.5">
        <Logo size={24} />
        <span className="text-xl font-semibold text-foreground tracking-tight font-body">
          TripManager
        </span>
      </Link>
      <div className="flex items-center gap-1 md:gap-4">
        <Link href="/" className={getLinkClass("/")}>
          Home
        </Link>
        <Link href="/profile" className={getLinkClass("/profile")}>
          Minhas viagens
        </Link>
        <Link
          href="/wizard"
          className="btn-primary px-4 md:px-5 py-[9px] text-[13px] whitespace-nowrap"
        >
          Planejar agora
        </Link>
      </div>
    </nav>
  );
}
