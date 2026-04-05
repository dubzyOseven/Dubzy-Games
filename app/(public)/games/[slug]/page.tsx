import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedGameBySlug } from "@/lib/data/games";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await getPublishedGameBySlug(slug);
  if (!game) return { title: "Not found" };
  const ogImages =
    game.coverUrl && game.coverUrl.startsWith("https://")
      ? [{ url: game.coverUrl, alt: game.title }]
      : undefined;
  return {
    title: `${game.title} — DubzyGames`,
    description: game.shortDesc,
    openGraph: {
      title: game.title,
      description: game.shortDesc,
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: ogImages ? "summary_large_image" : "summary",
      title: game.title,
      description: game.shortDesc,
      ...(ogImages ? { images: [ogImages[0].url] } : {}),
    },
  };
}

const platformLabel: Record<string, string> = {
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
};

const dlBtn =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-sky-400 hover:shadow-cyan-400/30";

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = await getPublishedGameBySlug(slug);
  if (!game) notFound();

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
        <div className="flex-1">
          {game.coverUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={game.coverUrl}
                alt=""
                className="w-full max-w-md rounded-2xl border border-white/10 object-cover shadow-2xl shadow-cyan-500/10 ring-1 ring-white/5"
              />
            </>
          ) : (
            <div className="flex h-52 max-w-md items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.03] text-sm text-slate-500 backdrop-blur-sm">
              No cover image
            </div>
          )}
        </div>
        <div className="flex-[2]">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{game.title}</h1>
          <p className="mt-3 text-lg leading-relaxed text-slate-400">{game.shortDesc}</p>
          {game.tags.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {game.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-fuchsia-500/25 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-200/90"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-8 rounded-2xl border border-amber-400/25 bg-gradient-to-br from-amber-500/10 to-orange-500/5 px-5 py-4 text-sm leading-relaxed text-amber-100/95 backdrop-blur-sm">
            <strong className="text-amber-200">You leave DubzyGames to download.</strong> Files come
            from the official project or host. Verify checksums and read their terms before running
            anything.
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {game.downloads.map((d) => (
              <Link
                key={d.id}
                href={`/download/${game.slug}?platform=${d.platform}`}
                className={dlBtn}
              >
                {d.label
                  ? `${d.label} (${platformLabel[d.platform] ?? d.platform})`
                  : `Download for ${platformLabel[d.platform] ?? d.platform}`}
              </Link>
            ))}
          </div>

          {game.officialProjectUrl ? (
            <p className="mt-6 text-sm text-slate-500">
              Official project:{" "}
              <a
                href={game.officialProjectUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                {game.officialProjectUrl}
              </a>
            </p>
          ) : null}
        </div>
      </div>

      <section className="mt-16 max-w-none">
        <h2 className="text-xl font-bold text-white">About</h2>
        <div className="mt-3 whitespace-pre-wrap leading-relaxed text-slate-400">{game.longDesc}</div>
      </section>

      {game.systemRequirements ? (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-white">System requirements</h2>
          <p className="mt-3 whitespace-pre-wrap leading-relaxed text-slate-400">
            {game.systemRequirements}
          </p>
        </section>
      ) : null}

      <section className="mt-14 rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-white/[0.03] to-cyan-500/5 p-6 shadow-xl shadow-violet-500/5 backdrop-blur-md sm:p-8">
        <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-200 to-fuchsia-200 bg-clip-text text-transparent">
          License & attribution
        </h2>
        <dl className="mt-5 space-y-4 text-sm text-slate-400">
          {game.licenseSpdx ? (
            <div>
              <dt className="font-semibold text-slate-500">License</dt>
              <dd className="mt-1 text-slate-200">{game.licenseSpdx}</dd>
            </div>
          ) : null}
          {game.licenseUrl ? (
            <div>
              <dt className="font-semibold text-slate-500">License text</dt>
              <dd className="mt-1">
                <a
                  href={game.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-cyan-400 hover:underline"
                >
                  {game.licenseUrl}
                </a>
              </dd>
            </div>
          ) : null}
          {game.sourceRepoUrl ? (
            <div>
              <dt className="font-semibold text-slate-500">Source</dt>
              <dd className="mt-1">
                <a
                  href={game.sourceRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-cyan-400 hover:underline"
                >
                  {game.sourceRepoUrl}
                </a>
              </dd>
            </div>
          ) : null}
          {game.authorName ? (
            <div>
              <dt className="font-semibold text-slate-500">Author / team</dt>
              <dd className="mt-1 text-slate-200">{game.authorName}</dd>
            </div>
          ) : null}
          {game.originalProjectName ? (
            <div>
              <dt className="font-semibold text-slate-500">Original project</dt>
              <dd className="mt-1 text-slate-200">{game.originalProjectName}</dd>
            </div>
          ) : null}
          {game.copyrightAttribution ? (
            <div>
              <dt className="font-semibold text-slate-500">Attribution</dt>
              <dd className="mt-1 whitespace-pre-wrap text-slate-300">{game.copyrightAttribution}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      <p className="mt-12">
        <Link
          href="/games"
          className="text-sm font-medium text-cyan-400 transition hover:text-cyan-300 hover:underline"
        >
          ← Back to all games
        </Link>
      </p>
    </article>
  );
}
