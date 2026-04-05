# DubzyGames (MVP)

Curated catalog of games with **links only to official releases** (no hosted binaries). Stack: **Next.js 15**, **PostgreSQL** (local, Neon, etc.), **Prisma**, **NextAuth** (password admin).

## Setup

1. Copy `.env.example` to **`.env`** or **`.env.local`** (Next.js loads both) and fill values:
   - `DATABASE_URL` — PostgreSQL connection string
   - `NEXTAUTH_SECRET` — e.g. `openssl rand -base64 32`
   - `NEXTAUTH_URL` — `http://localhost:3000` locally, or your **production** site URL after deploy
   - `ADMIN_PASSWORD` — shared password for `/admin/login`
   - `CONTACT_EMAIL` (optional) — mailto target on `/contact`

2. Push schema and (optionally) seed example data:

```bash
npx prisma db push
npm run db:seed
```

3. **Verify configuration** (checks required env keys + Prisma schema):

```bash
npm run verify
```

4. Run dev server:

```bash
npm run dev
```

5. **Manual smoke test**: Home → Browse → search → open a game → Download (redirect) → Admin login → New/Edit game → Save → **Verify links** on admin games list.

If Prisma shows **EPERM** on Windows when updating `query_engine-windows.dll.node`, stop `npm run dev`, then run `npx prisma generate` again (OneDrive on Desktop can lock files).

## Content & curation

See [CURATION.md](./CURATION.md). Seed data includes three vetted-style examples (Endless Sky, SuperTuxKart, Wesnoth); skip or edit slugs in `prisma/seed.ts` if they already exist.

## Deploy (Vercel + Neon)

Step-by-step guide: **[docs/DEPLOY.md](./docs/DEPLOY.md)** (GitHub push, Neon, Vercel env vars, `prisma db push`, smoke test).

Quick checklist:

1. Push repo to GitHub (see DEPLOY.md).  
2. Create **Postgres** (e.g. Neon) → copy `DATABASE_URL`.  
3. Import repo in **Vercel** → set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (exact live URL), `ADMIN_PASSWORD`, optional `CONTACT_EMAIL`.  
4. Deploy; then run **`npx prisma db push`** locally with production `DATABASE_URL` once.  
5. Smoke-test: catalog, download redirect, admin, **Verify links**.

## Features (this repo)

- **Search** on `/games` (`?q=`).
- **Open Graph / Twitter** metadata on game pages when `coverUrl` is `https`.
- **Admin → Verify links**: HEAD/GET download URLs and set `lastVerifiedAt` when reachable.
- **Contact** page for takedown/corrections (`CONTACT_EMAIL`).

## Download links

Game pages use `/download/[slug]?platform=windows|macos|linux` to **302 redirect** to the URL stored in the database (not an open redirect).

## License

This scaffold is yours to modify. Listed games remain under their upstream licenses.
