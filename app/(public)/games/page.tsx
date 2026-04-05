import Link from "next/link";
import { getPublishedGames } from "@/lib/data/games";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

const inputClass =
  "mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 backdrop-blur-sm focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30";

const gameCard =
  "group flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg shadow-black/20 backdrop-blur-md transition duration-300 hover:border-fuchsia-400/30 hover:bg-white/[0.07] hover:shadow-fuchsia-500/10";

const tagClass =
  "rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-200/90";

export default async function GamesPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const games = await getPublishedGames(q);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Browse games</h1>
      <p className="mt-2 text-slate-400">
        {games.length} published {games.length === 1 ? "game" : "games"}
        {q?.trim() ? ` matching "${q.trim()}"` : ""}
      </p>

      <form
        className="mt-10 flex max-w-lg flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm sm:flex-row sm:items-end"
        action="/games"
        method="get"
      >
        <div className="min-w-0 flex-1">
          <label htmlFor="q" className="block text-sm font-medium text-slate-300">
            Search
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q ?? ""}
            placeholder="Title, slug, or description..."
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-sky-400"
        >
          Search
        </button>
      </form>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2">
        {games.map((g) => (
          <li key={g.id}>
            <Link href={`/games/${g.slug}`} className={gameCard}>
              <span className="text-lg font-semibold text-white group-hover:text-cyan-100">
                {g.title}
              </span>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{g.shortDesc}</p>
              {g.tags.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {g.tags.map((t) => (
                    <span key={t} className={tagClass}>
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
      {games.length === 0 ? (
        <p className="mt-14 text-center text-slate-500">
          {q?.trim()
            ? "No matches. Try a different search or clear the filter."
            : "No games published yet. Add some from the admin area."}
        </p>
      ) : null}
      {q?.trim() && games.length > 0 ? (
        <p className="mt-8">
          <Link href="/games" className="text-sm font-medium text-fuchsia-400 hover:underline">
            Clear search
          </Link>
        </p>
      ) : null}
    </div>
  );
}
