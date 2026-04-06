import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — DubzyGames",
};

export default function ContactPage() {
  const email = process.env.CONTACT_EMAIL?.trim();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14 md:py-16">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-white/[0.03] to-fuchsia-500/10 p-6 shadow-xl shadow-cyan-500/10 backdrop-blur-md sm:rounded-3xl sm:p-10">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
          Contact & takedowns
        </h1>
        <div className="mt-8 space-y-5 leading-relaxed text-slate-400">
          <p>
            If you maintain a project listed here and want a correction, or if you believe a listing
            infringes your rights, reach out with the game title, URL of the catalog page, and what
            should change.
          </p>
          {email ? (
            <p>
              Email:{" "}
              <a
                href={`mailto:${email}`}
                className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                {email}
              </a>
            </p>
          ) : (
            <p className="text-sm text-slate-500">
              Set{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-slate-300">CONTACT_EMAIL</code> in
              your environment (e.g. <code className="rounded bg-white/10 px-1.5 py-0.5 text-slate-300">.env</code>{" "}
              or Vercel project settings) to show a mailto link here.
            </p>
          )}
          <p className="text-sm text-slate-600">This is not legal advice.</p>
        </div>
      </div>
    </div>
  );
}
