import Link from "next/link";
import { GameCard } from "@/components/GameCard";
import { getPublishedGames } from "@/lib/data/games";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

const inputClass =
  "mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 backdrop-blur-sm focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30";

export default async function GamesPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const games = await getPublishedGames(q);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14 md:py-16">
      <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">Browse games</h1>
      <p className="mt-2 text-sm text-slate-400 sm:text-base">
        {games.length} published {games.length === 1 ? "game" : "games"}
        {q?.trim() ? ` matching "${q.trim()}"` : ""}
      </p>

      <form
        className="mt-8 flex max-w-lg flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm sm:mt-10 sm:flex-row sm:items-end"
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
          className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-sky-400 sm:w-auto sm:shrink-0"
        >
          Search
        </button>
      </form>

      <ul className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5">
        {games.map((g) => (
          <li key={g.id}>
            <GameCard
              slug={g.slug}
              title={g.title}
              shortDesc={g.shortDesc}
              coverUrl={g.coverUrl}
              tags={g.tags}
              variant="browse"
            />
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
