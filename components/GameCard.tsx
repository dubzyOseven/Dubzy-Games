import Link from "next/link";

const tagClass =
  "rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-200/90";

const shells = {
  featured:
    "group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-lg shadow-black/20 backdrop-blur-md transition duration-300 hover:border-cyan-400/35 hover:bg-white/[0.08] hover:shadow-cyan-500/10",
  browse:
    "group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-lg shadow-black/20 backdrop-blur-md transition duration-300 hover:border-fuchsia-400/30 hover:bg-white/[0.07] hover:shadow-fuchsia-500/10",
} as const;

const bodyPadding = {
  featured: "p-4 sm:p-5",
  browse: "p-4 sm:p-6",
} as const;

type Props = {
  slug: string;
  title: string;
  shortDesc: string;
  coverUrl: string | null;
  tags?: string[];
  variant?: "featured" | "browse";
};

function showCover(url: string | null): url is string {
  return !!url && url.startsWith("https://");
}

export function GameCard({
  slug,
  title,
  shortDesc,
  coverUrl,
  tags,
  variant = "featured",
}: Props) {
  const shell = shells[variant];
  const pad = bodyPadding[variant];
  const monogram = title.trim().charAt(0).toUpperCase() || "?";

  return (
    <Link href={`/games/${slug}`} className={shell}>
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-slate-900/50">
        {showCover(coverUrl) ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary https URLs from catalog */}
            <img
              src={coverUrl}
              alt={title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </>
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/15 via-white/[0.04] to-fuchsia-500/10"
            aria-hidden
          >
            <span className="text-4xl font-bold tabular-nums text-white/25">{monogram}</span>
          </div>
        )}
      </div>
      <div className={`flex min-h-0 flex-1 flex-col ${pad}`}>
        <span className="text-lg font-semibold text-white group-hover:text-cyan-100">{title}</span>
        <p
          className={
            variant === "featured"
              ? "mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400"
              : "mt-2 text-sm leading-relaxed text-slate-400"
          }
        >
          {shortDesc}
        </p>
        {tags && tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className={tagClass}>
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
