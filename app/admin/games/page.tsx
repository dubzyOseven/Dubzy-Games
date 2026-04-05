import Link from "next/link";
import { deleteGame, verifyGameDownloadLinks } from "@/lib/actions/game";
import { getAllGamesForAdmin } from "@/lib/data/games";

function latestVerified(downloads: { lastVerifiedAt: Date | null }[]) {
  const dates = downloads
    .map((d) => d.lastVerifiedAt)
    .filter((d): d is Date => d != null)
    .map((d) => d.getTime());
  if (!dates.length) return null;
  return new Date(Math.max(...dates));
}

export default async function AdminGamesPage() {
  const games = await getAllGamesForAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Games</h1>
        <Link
          href="/admin/games/new"
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-sky-400"
        >
          New game
        </Link>
      </div>
      <ul className="mt-8 space-y-4">
        {games.map((g) => {
          const verified = latestVerified(g.downloads);
          return (
            <li
              key={g.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-lg shadow-black/10 backdrop-blur-sm transition hover:border-cyan-400/25"
            >
              <div>
                <Link
                  href={`/admin/games/${g.id}/edit`}
                  className="font-semibold text-white hover:text-cyan-200 hover:underline"
                >
                  {g.title}
                </Link>
                <p className="text-sm text-slate-500">
                  /games/{g.slug} · {g.published ? "published" : "draft"}
                </p>
                {verified ? (
                  <p className="text-xs text-slate-600">
                    Last link check: {verified.toLocaleString()}
                  </p>
                ) : (
                  <p className="text-xs text-slate-600">No link verification yet</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/games/${g.slug}`}
                  className="text-sm font-medium text-cyan-400 hover:text-cyan-300 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </Link>
                <form action={verifyGameDownloadLinks.bind(null, g.id)}>
                  <button
                    type="submit"
                    className="text-sm font-medium text-amber-400/95 hover:text-amber-300 hover:underline"
                    title="HEAD/GET each download URL and stamp last verified time if reachable"
                  >
                    Verify links
                  </button>
                </form>
                <form action={deleteGame.bind(null, g.id)}>
                  <button
                    type="submit"
                    className="text-sm font-medium text-red-400/90 hover:text-red-300 hover:underline"
                    title="Permanently delete"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
      {games.length === 0 ? (
        <p className="mt-10 text-center text-slate-500">No games yet. Create one to get started.</p>
      ) : null}
    </div>
  );
}
