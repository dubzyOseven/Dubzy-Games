import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const platformMap: Record<string, string> = {
  win: "windows",
  windows: "windows",
  mac: "macos",
  macos: "macos",
  linux: "linux",
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const raw = req.nextUrl.searchParams.get("platform")?.toLowerCase() ?? "windows";
  const platform = platformMap[raw] ?? raw;

  const game = await prisma.game.findFirst({
    where: { slug, published: true },
    include: { downloads: true },
  });
  if (!game) {
    return new NextResponse("Not found", { status: 404 });
  }
  const target = game.downloads.find((d) => d.platform === platform);
  if (!target) {
    return new NextResponse("No download for that platform", { status: 404 });
  }
  return NextResponse.redirect(target.url, 302);
}