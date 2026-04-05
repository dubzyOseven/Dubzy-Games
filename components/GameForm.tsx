"use client";

import { useActionState } from "react";
import type { DownloadTarget, Game } from "@prisma/client";
import { saveCatalogEntry, type GameActionState } from "@/lib/actions/game";

type GameWithDownloads = Game & { downloads: DownloadTarget[] };

function downloadFor(game: GameWithDownloads | undefined, platform: string) {
  return game?.downloads.find((d) => d.platform === platform);
}

const inputClass =
  "mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30";
const labelClass = "block text-sm font-medium text-slate-300";
const sectionTitle = "text-lg font-bold text-white";
const panelClass = "rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm";

export function GameForm({ game }: { game?: GameWithDownloads }) {
  const [state, formAction, isPending] = useActionState(
    saveCatalogEntry,
    null as GameActionState,
  );

  const w = downloadFor(game, "windows");
  const m = downloadFor(game, "macos");
  const l = downloadFor(game, "linux");

  return (
    <form action={formAction} className="mx-auto max-w-3xl space-y-8 pb-16">
      <input type="hidden" name="gameId" value={game?.id ?? ""} />

      {state?.error ? (
        <div
          className="rounded-xl border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-200"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}

      <section className={`space-y-4 ${panelClass}`}>
        <h2 className={sectionTitle}>Basics</h2>
        <div>
          <label className={labelClass} htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            className={inputClass}
            defaultValue={game?.title}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="slug">
            URL slug
          </label>
          <input
            id="slug"
            name="slug"
            required
            className={inputClass}
            placeholder="e.g. endless-sky"
            defaultValue={game?.slug}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="shortDesc">
            Short description
          </label>
          <input
            id="shortDesc"
            name="shortDesc"
            required
            className={inputClass}
            defaultValue={game?.shortDesc}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="longDesc">
            Full description
          </label>
          <textarea
            id="longDesc"
            name="longDesc"
            required
            rows={8}
            className={inputClass}
            defaultValue={game?.longDesc}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="tags">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            name="tags"
            className={inputClass}
            placeholder="action, space, foss"
            defaultValue={game?.tags?.join(", ")}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="coverUrl">
            Cover image URL (https, optional)
          </label>
          <input
            id="coverUrl"
            name="coverUrl"
            type="url"
            className={inputClass}
            defaultValue={game?.coverUrl ?? ""}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            name="published"
            value="on"
            defaultChecked={game?.published ?? false}
            className="size-4 rounded border-white/20 bg-white/10 text-cyan-500 focus:ring-cyan-500/40"
          />
          Published (visible on public site)
        </label>
      </section>

      <section className={`space-y-4 ${panelClass}`}>
        <h2 className={sectionTitle}>Official downloads (https only)</h2>
        <p className="text-sm text-slate-500">
          Paste links to the official release page or direct asset URL from the project maintainers.
        </p>
        <div className="grid gap-6 sm:grid-cols-1">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-cyan-200/90">Windows</h3>
            <input
              name="windowsUrl"
              type="url"
              placeholder="https://..."
              className={`${inputClass} mt-2`}
              defaultValue={w?.url ?? ""}
            />
            <input
              name="windowsLabel"
              placeholder="Label (e.g. Installer)"
              className={`${inputClass} mt-2`}
              defaultValue={w?.label ?? ""}
            />
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-fuchsia-200/90">macOS</h3>
            <input
              name="macosUrl"
              type="url"
              placeholder="https://..."
              className={`${inputClass} mt-2`}
              defaultValue={m?.url ?? ""}
            />
            <input
              name="macosLabel"
              placeholder="Label"
              className={`${inputClass} mt-2`}
              defaultValue={m?.label ?? ""}
            />
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-sky-200/90">Linux</h3>
            <input
              name="linuxUrl"
              type="url"
              placeholder="https://..."
              className={`${inputClass} mt-2`}
              defaultValue={l?.url ?? ""}
            />
            <input
              name="linuxLabel"
              placeholder="Label"
              className={`${inputClass} mt-2`}
              defaultValue={l?.label ?? ""}
            />
          </div>
        </div>
      </section>

      <section className={`space-y-4 ${panelClass}`}>
        <h2 className={sectionTitle}>License & attribution</h2>
        <div>
          <label className={labelClass} htmlFor="licenseSpdx">
            License (e.g. MIT, GPL-3.0)
          </label>
          <input
            id="licenseSpdx"
            name="licenseSpdx"
            className={inputClass}
            defaultValue={game?.licenseSpdx ?? ""}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="licenseUrl">
            License text URL
          </label>
          <input
            id="licenseUrl"
            name="licenseUrl"
            type="url"
            className={inputClass}
            defaultValue={game?.licenseUrl ?? ""}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="sourceRepoUrl">
            Source repository URL
          </label>
          <input
            id="sourceRepoUrl"
            name="sourceRepoUrl"
            type="url"
            className={inputClass}
            defaultValue={game?.sourceRepoUrl ?? ""}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="officialProjectUrl">
            Official project / home URL
          </label>
          <input
            id="officialProjectUrl"
            name="officialProjectUrl"
            type="url"
            className={inputClass}
            defaultValue={game?.officialProjectUrl ?? ""}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="authorName">
            Author / team name
          </label>
          <input
            id="authorName"
            name="authorName"
            className={inputClass}
            defaultValue={game?.authorName ?? ""}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="originalProjectName">
            Original project name (if different)
          </label>
          <input
            id="originalProjectName"
            name="originalProjectName"
            className={inputClass}
            defaultValue={game?.originalProjectName ?? ""}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="copyrightAttribution">
            Copyright / attribution notice
          </label>
          <textarea
            id="copyrightAttribution"
            name="copyrightAttribution"
            rows={4}
            className={inputClass}
            defaultValue={game?.copyrightAttribution ?? ""}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="systemRequirements">
            System requirements (optional)
          </label>
          <textarea
            id="systemRequirements"
            name="systemRequirements"
            rows={3}
            className={inputClass}
            defaultValue={game?.systemRequirements ?? ""}
          />
        </div>
      </section>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-8 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
