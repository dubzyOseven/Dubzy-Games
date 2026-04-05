import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seeds = [
  {
    slug: "endless-sky",
    title: "Endless Sky",
    shortDesc:
      "2D space trading and combat sim inspired by the classic Escape Velocity series.",
    longDesc:
      "Explore star systems, trade, take missions, and upgrade your ship. Listings link to the project’s official GitHub Releases; pick the build for your OS there.",
    tags: ["space", "sim", "foss"],
    coverUrl: "https://endless-sky.github.io/images/splash.jpg",
    licenseSpdx: "GPL-3.0-only",
    licenseUrl: "https://github.com/endless-sky/endless-sky/blob/master/license.txt",
    sourceRepoUrl: "https://github.com/endless-sky/endless-sky",
    officialProjectUrl: "https://endless-sky.github.io/",
    authorName: "Endless Sky community",
    originalProjectName: "Endless Sky",
    copyrightAttribution:
      "Endless Sky is GPLv3. See the upstream repository for current copyright notices.",
    systemRequirements: "See GitHub Releases for supported platforms.",
    downloads: [
      {
        platform: "windows",
        url: "https://github.com/endless-sky/endless-sky/releases/latest",
        label: "GitHub Releases (official)",
      },
      {
        platform: "linux",
        url: "https://github.com/endless-sky/endless-sky/releases/latest",
        label: "GitHub Releases (official)",
      },
      {
        platform: "macos",
        url: "https://github.com/endless-sky/endless-sky/releases/latest",
        label: "GitHub Releases (official)",
      },
    ],
  },
  {
    slug: "supertuxkart",
    title: "SuperTuxKart",
    shortDesc: "Free kart racer with mascots, tracks, and multiplayer.",
    longDesc:
      "SuperTuxKart is a libre kart racing game. Official builds are published on GitHub Releases and the project site—always download from those sources.",
    tags: ["racing", "multiplayer", "foss"],
    coverUrl: "https://supertuxkart.net/images/logo.png",
    licenseSpdx: "GPL-3.0-or-later",
    licenseUrl: "https://github.com/supertuxkart/stk-code/blob/master/LICENSE.txt",
    sourceRepoUrl: "https://github.com/supertuxkart/stk-code",
    officialProjectUrl: "https://supertuxkart.net/",
    authorName: "SuperTuxKart team",
    originalProjectName: "SuperTuxKart",
    copyrightAttribution:
      "SuperTuxKart is free software under the GPL. See the repository for full attribution.",
    systemRequirements: "See official downloads for OS builds.",
    downloads: [
      {
        platform: "windows",
        url: "https://github.com/supertuxkart/stk-code/releases/latest",
        label: "GitHub Releases (official)",
      },
      {
        platform: "linux",
        url: "https://github.com/supertuxkart/stk-code/releases/latest",
        label: "GitHub Releases (official)",
      },
      {
        platform: "macos",
        url: "https://github.com/supertuxkart/stk-code/releases/latest",
        label: "GitHub Releases (official)",
      },
    ],
  },
  {
    slug: "wesnoth",
    title: "The Battle for Wesnoth",
    shortDesc: "Turn-based strategy in a fantasy world.",
    longDesc:
      "Wesnoth is a turn-based tactical strategy game. Use the official download page or GitHub Releases from the main project—verify checksums on their site when provided.",
    tags: ["strategy", "turn-based", "foss"],
    licenseSpdx: "GPL-2.0-or-later",
    licenseUrl: "https://github.com/wesnoth/wesnoth/blob/master/COPYING",
    sourceRepoUrl: "https://github.com/wesnoth/wesnoth",
    officialProjectUrl: "https://www.wesnoth.org/",
    authorName: "Wesnoth contributors",
    originalProjectName: "The Battle for Wesnoth",
    copyrightAttribution:
      "Wesnoth is GPLv2+. See COPYING and artwork credits in the upstream repository.",
    systemRequirements: "See wesnoth.org/downloads for platform support.",
    downloads: [
      {
        platform: "windows",
        url: "https://github.com/wesnoth/wesnoth/releases/latest",
        label: "GitHub Releases (official)",
      },
      {
        platform: "linux",
        url: "https://www.wesnoth.org/#download",
        label: "Official download page",
      },
      {
        platform: "macos",
        url: "https://github.com/wesnoth/wesnoth/releases/latest",
        label: "GitHub Releases (official)",
      },
    ],
  },
];

async function main() {
  for (const row of seeds) {
    const { downloads, ...gameData } = row;
    const existing = await prisma.game.findUnique({ where: { slug: row.slug } });
    if (existing) {
      console.log(`Seed skip (exists): ${row.slug}`);
      continue;
    }
    await prisma.game.create({
      data: {
        ...gameData,
        published: true,
        downloads: { create: downloads },
      },
    });
    console.log(`Seeded: ${row.slug}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
