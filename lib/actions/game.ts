"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  buildDownloadsFromForm,
  formDataToGameFields,
  gameFormSchema,
  parseTags,
} from "@/lib/validations/game";

export type GameActionState = { error?: string } | null;

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
}

export async function createGame(
  _prev: GameActionState,
  formData: FormData,
): Promise<GameActionState> {
  await requireAdmin();
  const raw = formDataToGameFields(formData);
  const parsed = gameFormSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((e) => e.message).join("; ");
    return { error: msg || "Invalid form" };
  }
  const v = parsed.data;
  const downloads = buildDownloadsFromForm(v);
  try {
    await prisma.game.create({
      data: {
        title: v.title,
        slug: v.slug,
        shortDesc: v.shortDesc,
        longDesc: v.longDesc,
        tags: parseTags(v.tags),
        coverUrl: v.coverUrl,
        published: v.published,
        licenseSpdx: v.licenseSpdx,
        licenseUrl: v.licenseUrl,
        sourceRepoUrl: v.sourceRepoUrl,
        officialProjectUrl: v.officialProjectUrl,
        copyrightAttribution: v.copyrightAttribution,
        authorName: v.authorName,
        originalProjectName: v.originalProjectName,
        systemRequirements: v.systemRequirements,
        downloads: {
          create: downloads.map((d) => ({
            platform: d.platform,
            url: d.url,
            label: d.label,
          })),
        },
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not save";
    if (msg.includes("Unique constraint")) {
      return { error: "That slug is already in use." };
    }
    return { error: msg };
  }
  revalidatePath("/games");
  revalidatePath("/");
  redirect("/admin/games");
}

export async function updateGame(
  gameId: string,
  _prev: GameActionState,
  formData: FormData,
): Promise<GameActionState> {
  await requireAdmin();
  const raw = formDataToGameFields(formData);
  const parsed = gameFormSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((e) => e.message).join("; ");
    return { error: msg || "Invalid form" };
  }
  const v = parsed.data;
  const downloads = buildDownloadsFromForm(v);
  try {
    await prisma.$transaction([
      prisma.downloadTarget.deleteMany({ where: { gameId } }),
      prisma.game.update({
        where: { id: gameId },
        data: {
          title: v.title,
          slug: v.slug,
          shortDesc: v.shortDesc,
          longDesc: v.longDesc,
          tags: parseTags(v.tags),
          coverUrl: v.coverUrl,
          published: v.published,
          licenseSpdx: v.licenseSpdx,
          licenseUrl: v.licenseUrl,
          sourceRepoUrl: v.sourceRepoUrl,
          officialProjectUrl: v.officialProjectUrl,
          copyrightAttribution: v.copyrightAttribution,
          authorName: v.authorName,
          originalProjectName: v.originalProjectName,
          systemRequirements: v.systemRequirements,
          downloads: {
            create: downloads.map((d) => ({
              platform: d.platform,
              url: d.url,
              label: d.label,
            })),
          },
        },
      }),
    ]);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not save";
    if (msg.includes("Unique constraint")) {
      return { error: "That slug is already in use." };
    }
    return { error: msg };
  }
  revalidatePath("/games");
  revalidatePath("/");
  revalidatePath(`/games/${v.slug}`);
  redirect("/admin/games");
}

export async function deleteGame(gameId: string, formData: FormData) {
  void formData;
  await requireAdmin();
  await prisma.game.delete({ where: { id: gameId } });
  revalidatePath("/games");
  revalidatePath("/");
  redirect("/admin/games");
}

async function urlLooksReachable(url: string): Promise<boolean> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 15_000);
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { Range: "bytes=0-0" },
      });
    }
    return res.ok || (res.status >= 300 && res.status < 400);
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

export async function verifyGameDownloadLinks(gameId: string, formData: FormData) {
  void formData;
  await requireAdmin();
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { downloads: true },
  });
  if (!game) return;

  const now = new Date();
  for (const d of game.downloads) {
    const ok = await urlLooksReachable(d.url);
    if (ok) {
      await prisma.downloadTarget.update({
        where: { id: d.id },
        data: { lastVerifiedAt: now },
      });
    }
  }

  revalidatePath("/admin/games");
  revalidatePath(`/games/${game.slug}`);
}

export async function saveCatalogEntry(
  _prev: GameActionState,
  formData: FormData,
): Promise<GameActionState> {
  const rawId = formData.get("gameId");
  const id = typeof rawId === "string" && rawId.trim() ? rawId.trim() : null;
  if (id) {
    return updateGame(id, _prev, formData);
  }
  return createGame(_prev, formData);
}