"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandWordmark } from "@/components/BrandWordmark";

const navLink =
  "rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-cyan-200 md:px-3 md:py-2 md:text-slate-400";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <header className="relative sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:gap-4">
        <Link
          href="/"
          className="group flex min-w-0 shrink items-center gap-2"
          onClick={() => setMenuOpen(false)}
        >
          <BrandWordmark className="truncate text-lg transition group-hover:brightness-110 sm:text-xl" />
        </Link>

        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-200 transition hover:border-cyan-500/30 hover:bg-white/5 hover:text-white md:hidden"
          aria-expanded={menuOpen}
          aria-controls="site-mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <nav
          className="hidden items-center gap-1 md:flex md:gap-2"
          aria-label="Main"
        >
          <Link href="/games" className={navLink}>
            Browse
          </Link>
          <Link href="/disclaimer" className={navLink}>
            Disclaimer
          </Link>
          <Link href="/contact" className={navLink}>
            Contact
          </Link>
          <Link
            href="/admin/login"
            className="ml-0 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/20 md:ml-1"
          >
            Admin
          </Link>
        </nav>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <nav
            id="site-mobile-nav"
            className="absolute left-0 right-0 top-full z-50 border-b border-white/10 bg-slate-950/98 px-4 py-4 shadow-2xl shadow-black/40 backdrop-blur-xl md:hidden"
            aria-label="Mobile"
          >
            <div className="mx-auto flex max-w-5xl flex-col gap-1">
              <Link href="/games" className={navLink} onClick={() => setMenuOpen(false)}>
                Browse
              </Link>
              <Link href="/disclaimer" className={navLink} onClick={() => setMenuOpen(false)}>
                Disclaimer
              </Link>
              <Link href="/contact" className={navLink} onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
              <Link
                href="/admin/login"
                className="mt-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2.5 text-center text-sm font-medium text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/20"
                onClick={() => setMenuOpen(false)}
              >
                Admin
              </Link>
            </div>
          </nav>
        </>
      ) : null}
    </header>
  );
}
