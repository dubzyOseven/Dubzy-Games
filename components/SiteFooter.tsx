import Link from "next/link";
import { BrandWordmark } from "@/components/BrandWordmark";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-slate-950/60 px-4 py-10 backdrop-blur-sm sm:py-12">
      <div className="mx-auto max-w-5xl space-y-4">
        <p className="text-sm leading-relaxed text-slate-400 sm:text-[0.9375rem]">
          <BrandWordmark className="text-base" /> — curated listings. Downloads open the{" "}
          <strong className="font-semibold text-slate-200">official source</strong> in your browser.
          Files are served by third parties; verify licenses and checksums with each project.
        </p>
        <p className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link
            href="/disclaimer"
            className="font-medium text-cyan-400 transition hover:text-cyan-300 hover:underline"
          >
            Disclaimer
          </Link>
          <Link
            href="/contact"
            className="font-medium text-cyan-400 transition hover:text-cyan-300 hover:underline"
          >
            Contact / takedown
          </Link>
        </p>
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} DubzyGames</p>
      </div>
    </footer>
  );
}
