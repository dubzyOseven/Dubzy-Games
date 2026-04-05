import { prisma } from "@/lib/prisma";

export function getPublishedGames(search?: string | null) {
  const q = search?.trim();
  return prisma.game.findMany({
    where: {
      published: true,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { shortDesc: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { title: "asc" },
    include: { downloads: true },
  });
}

export function getPublishedGameBySlug(slug: string) {
  return prisma.game.findFirst({
    where: { slug, published: true },
    include: { downloads: true },
  });
}

export function getAllGamesForAdmin() {
  return prisma.game.findMany({
    orderBy: { updatedAt: "desc" },
    include: { downloads: true },
  });
}

export function getGameByIdForAdmin(id: string) {
  return prisma.game.findFirst({
    where: { id },
    include: { downloads: true },
  });
}