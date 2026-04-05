import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer — DubzyGames",
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:py-16">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-xl shadow-black/20 backdrop-blur-md sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Disclaimer</h1>
        <div className="mt-8 space-y-5 leading-relaxed text-slate-400">
          <p>
            <strong className="text-slate-200">DubzyGames</strong> lists third-party games and software.
            We do not host downloadable binaries; links send you to official releases maintained by the
            respective authors or their chosen hosts.
          </p>
          <p>
            Information (license names, descriptions, URLs) is provided in good faith but may contain
            errors or become outdated. Always confirm licensing, authenticity, and safety with the
            upstream project before installing or redistributing anything.
          </p>
          <p>
            If you are a rights holder and believe a listing should be corrected or removed, use the{" "}
            <Link href="/contact" className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline">
              contact page
            </Link>{" "}
            (set <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-slate-300">CONTACT_EMAIL</code>{" "}
            in production so a mailto appears there).
          </p>
          <p>
            Download links are checked only when an operator runs <strong className="text-slate-300">Verify links</strong>{" "}
            in the admin area; listings can still break if upstream URLs change.
          </p>
          <p className="text-sm text-slate-600">This text is not legal advice.</p>
        </div>
      </div>
    </div>
  );
}
