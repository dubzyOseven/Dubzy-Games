import { z } from "zod";

export const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and single hyphens (e.g. my-game)",
  );

export function parseTags(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

function isValidHttps(u: string) {
  try {
    const x = new URL(u);
    return x.protocol === "https:";
  } catch {
    return false;
  }
}

const optionalHttps = z
  .string()
  .transform((s) => s.trim())
  .transform((s) => (s === "" ? undefined : s))
  .refine(
    (s) => s === undefined || isValidHttps(s),
    "Must be a valid https:// URL or left empty",
  );

const optionalShort = z
  .string()
  .transform((s) => s.trim())
  .transform((s) => (s === "" ? undefined : s))
  .refine((s) => s === undefined || s.length <= 120, "Max 120 characters");

const optionalMedium = z
  .string()
  .transform((s) => s.trim())
  .transform((s) => (s === "" ? undefined : s))
  .refine((s) => s === undefined || s.length <= 200, "Max 200 characters");

export const gameFormSchema = z
  .object({
    title: z.string().min(1).max(200),
    slug: slugSchema,
    shortDesc: z.string().min(1).max(500),
    longDesc: z.string().min(1).max(50_000),
    tags: z.string(),
    coverUrl: optionalHttps,
    published: z.boolean(),
    licenseSpdx: optionalShort,
    licenseUrl: optionalHttps,
    sourceRepoUrl: optionalHttps,
    officialProjectUrl: optionalHttps,
    copyrightAttribution: z
      .string()
      .transform((s) => s.trim())
      .transform((s) => (s === "" ? undefined : s))
      .refine((s) => !s || s.length <= 20_000, "Too long"),
    authorName: optionalMedium,
    originalProjectName: optionalMedium,
    systemRequirements: z
      .string()
      .transform((s) => s.trim())
      .transform((s) => (s === "" ? undefined : s))
      .refine((s) => !s || s.length <= 10_000, "Too long"),
    windowsUrl: optionalHttps,
    windowsLabel: optionalShort,
    macosUrl: optionalHttps,
    macosLabel: optionalShort,
    linuxUrl: optionalHttps,
    linuxLabel: optionalShort,
  })
  .superRefine((data, ctx) => {
    if (!data.published) return;
    const has =
      !!data.windowsUrl || !!data.macosUrl || !!data.linuxUrl;
    if (!has) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Published games need at least one platform download URL.",
        path: ["windowsUrl"],
      });
    }
  });

export type GameFormInput = z.input<typeof gameFormSchema>;
export type GameFormValues = z.output<typeof gameFormSchema>;

export function buildDownloadsFromForm(values: GameFormValues) {
  const rows: { platform: string; url: string; label?: string }[] = [];
  const triple = [
    { platform: "windows", url: values.windowsUrl, label: values.windowsLabel },
    { platform: "macos", url: values.macosUrl, label: values.macosLabel },
    { platform: "linux", url: values.linuxUrl, label: values.linuxLabel },
  ] as const;
  for (const row of triple) {
    if (row.url) {
      rows.push({
        platform: row.platform,
        url: row.url,
        ...(row.label ? { label: row.label } : {}),
      });
    }
  }
  return rows;
}

export function formDataToGameFields(fd: FormData) {
  return {
    title: String(fd.get("title") ?? ""),
    slug: String(fd.get("slug") ?? ""),
    shortDesc: String(fd.get("shortDesc") ?? ""),
    longDesc: String(fd.get("longDesc") ?? ""),
    tags: String(fd.get("tags") ?? ""),
    coverUrl: String(fd.get("coverUrl") ?? ""),
    published: fd.get("published") === "on",
    licenseSpdx: String(fd.get("licenseSpdx") ?? ""),
    licenseUrl: String(fd.get("licenseUrl") ?? ""),
    sourceRepoUrl: String(fd.get("sourceRepoUrl") ?? ""),
    officialProjectUrl: String(fd.get("officialProjectUrl") ?? ""),
    copyrightAttribution: String(fd.get("copyrightAttribution") ?? ""),
    authorName: String(fd.get("authorName") ?? ""),
    originalProjectName: String(fd.get("originalProjectName") ?? ""),
    systemRequirements: String(fd.get("systemRequirements") ?? ""),
    windowsUrl: String(fd.get("windowsUrl") ?? ""),
    windowsLabel: String(fd.get("windowsLabel") ?? ""),
    macosUrl: String(fd.get("macosUrl") ?? ""),
    macosLabel: String(fd.get("macosLabel") ?? ""),
    linuxUrl: String(fd.get("linuxUrl") ?? ""),
    linuxLabel: String(fd.get("linuxLabel") ?? ""),
  };
}