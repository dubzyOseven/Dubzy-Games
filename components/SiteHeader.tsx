import Link from "next/link";
import { BrandWordmark } from "@/components/BrandWordmark";

const navLink =
  "rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-cyan-200";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2 text-lg">
          <BrandWordmark className="text-xl transition group-hover:brightness-110" />
        </Link>
        <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
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
            className="ml-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/20"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
