import Link from "next/link";
import { getPublishedGames } from "@/lib/data/games";

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-sky-400 hover:shadow-cyan-400/35";
const btnGhost =
  "inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 backdrop-blur-sm transition hover:border-cyan-400/40 hover:bg-white/10";

const gameCard =
  "group block rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-black/20 backdrop-blur-md transition duration-300 hover:border-cyan-400/35 hover:bg-white/[0.08] hover:shadow-cyan-500/10";

export default async function HomePage() {
  const games = await getPublishedGames();
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] px-6 py-12 shadow-2xl shadow-cyan-500/5 sm:px-10 sm:py-14">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-500/15 blur-3xl"
          aria-hidden
        />
        <p className="relative text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400/90">
          Curated for players
        </p>
        <h1 className="relative mt-4 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          Free PC games,{" "}
          <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">
            straight from the source
          </span>
        </h1>
        <p className="relative mt-5 max-w-xl text-lg leading-relaxed text-slate-400">
          We link to official releases only—no re-hosted installers. Every game page includes
          license details and attribution.
        </p>
        <div className="relative mt-10 flex flex-wrap gap-4">
          <Link href="/games" className={btnPrimary}>
            Browse games
          </Link>
          <Link href="/disclaimer" className={btnGhost}>
            How it works
          </Link>
        </div>
      </div>

      {games.length > 0 ? (
        <section className="mt-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">Featured</h2>
            <Link
              href="/games"
              className="text-sm font-medium text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              View all →
            </Link>
          </div>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {games.slice(0, 4).map((g) => (
              <li key={g.id}>
                <Link href={`/games/${g.slug}`} className={gameCard}>
                  <span className="text-lg font-semibold text-white group-hover:text-cyan-100">
                    {g.title}
                  </span>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400">
                    {g.shortDesc}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
