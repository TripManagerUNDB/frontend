"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { isLoggedIn, getUserInfo, clearAuth } from "@/lib/api";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setUserName(getUserInfo().name);
  }, [pathname]);

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `btn-ghost ${isActive ? "text-gold font-semibold" : "text-foreground/80"}`;
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
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

        {loggedIn ? (
          <>
            <Link href="/profile" className={getLinkClass("/profile")}>
              Minhas viagens
            </Link>
            <Link href="/profile" className="btn-ghost text-[13px] flex items-center gap-1.5">
              <span style={{ fontSize: 14 }}>👤</span>
              {userName}
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('currentTripId');
                localStorage.removeItem('currentTripDest');
                localStorage.removeItem('currentTripCheckIn');
                localStorage.removeItem('currentTripCheckOut');
                window.location.href = '/wizard';
              }}
              className="btn-primary px-4 md:px-5 py-[9px] text-[13px] whitespace-nowrap"
            >
              Planejar agora
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn-ghost text-[13px] whitespace-nowrap">
              Entrar
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('currentTripId');
                localStorage.removeItem('currentTripDest');
                localStorage.removeItem('currentTripCheckIn');
                localStorage.removeItem('currentTripCheckOut');
                window.location.href = '/wizard';
              }}
              className="btn-primary px-4 md:px-5 py-[9px] text-[13px] whitespace-nowrap"
            >
              Planejar agora
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
