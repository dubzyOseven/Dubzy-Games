"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { BrandWordmark } from "@/components/BrandWordmark";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
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
    <div className="min-h-screen overflow-x-hidden text-slate-100">
      {!isLogin ? (
        <header className="relative z-50 border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <Link
              href="/"
              className="min-w-0 shrink text-sm text-slate-500 hover:text-cyan-400"
              onClick={() => setMenuOpen(false)}
            >
              <BrandWordmark className="truncate text-base" />
            </Link>

            <div className="hidden min-w-0 flex-1 items-center gap-4 md:flex">
              <span className="text-slate-600">|</span>
              <nav className="flex flex-wrap items-center gap-3 text-sm">
                <Link href="/admin/games" className="font-semibold text-white hover:text-cyan-200">
                  Games
                </Link>
                <Link href="/" className="text-slate-400 hover:text-cyan-300">
                  View site
                </Link>
              </nav>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-200 transition hover:border-cyan-500/30 hover:bg-white/5 md:hidden"
                aria-expanded={menuOpen}
                aria-controls="admin-mobile-nav"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpen((o) => !o)}
              >
                {menuOpen ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-400 transition hover:border-fuchsia-400/30 hover:text-fuchsia-200"
              >
                Sign out
              </button>
            </div>
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
                id="admin-mobile-nav"
                className="absolute left-0 right-0 top-full z-50 border-b border-white/10 bg-slate-950/98 px-4 py-3 shadow-xl backdrop-blur-xl md:hidden"
                aria-label="Admin mobile"
              >
                <div className="mx-auto flex max-w-5xl flex-col gap-1">
                  <Link
                    href="/admin/games"
                    className="rounded-lg px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
                    onClick={() => setMenuOpen(false)}
                  >
                    Games
                  </Link>
                  <Link
                    href="/"
                    className="rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-cyan-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    View site
                  </Link>
                </div>
              </nav>
            </>
          ) : null}
        </header>
      ) : null}
      <div className="mx-auto max-w-5xl min-w-0 px-4 py-6 sm:py-8">{children}</div>
    </div>
  );
}
