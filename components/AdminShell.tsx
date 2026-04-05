"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BrandWordmark } from "@/components/BrandWordmark";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  return (
    <div className="min-h-screen text-slate-100">
      {!isLogin ? (
        <header className="border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/" className="text-sm text-slate-500 hover:text-cyan-400">
                <BrandWordmark className="text-base" />
              </Link>
              <span className="hidden text-slate-600 sm:inline">|</span>
              <nav className="flex flex-wrap items-center gap-3 text-sm">
                <Link href="/admin/games" className="font-semibold text-white hover:text-cyan-200">
                  Games
                </Link>
                <Link href="/" className="text-slate-400 hover:text-cyan-300">
                  View site
                </Link>
              </nav>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-400 transition hover:border-fuchsia-400/30 hover:text-fuchsia-200"
            >
              Sign out
            </button>
          </div>
        </header>
      ) : null}
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  );
}
