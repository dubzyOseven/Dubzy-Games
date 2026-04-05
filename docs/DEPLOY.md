# Deploy DubzyGames (Vercel + Neon)

This guide matches the hosting plan: **Next.js on Vercel** + **PostgreSQL** (Neon recommended).

## Prerequisites

- GitHub (or GitLab/Bitbucket) account  
- [Vercel](https://vercel.com) account  
- [Neon](https://neon.tech) account (or another Postgres provider)

Never commit `.env` or real secrets. `.gitignore` already excludes `.env*`.

---

## 1. Push code to GitHub

If this folder is not a Git repo yet:

```bash
cd path/to/cursor-project-1
git init
git add .
git commit -m "Initial commit: DubzyGames"
```

On GitHub: **New repository** → create empty repo (no README). Then:

```bash
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## 2. Create Postgres (Neon)

1. Sign in at [neon.tech](https://neon.tech).  
2. **Create project** → choose region close to your users.  
3. Copy the **connection string** (URI). It should look like  
   `postgresql://USER:PASSWORD@HOST/DB?sslmode=require`  
4. Keep it secret — you will paste it into Vercel as `DATABASE_URL`.

---

## 3. Import project on Vercel

1. [vercel.com](https://vercel.com) → **Add New** → **Project**.  
2. **Import** your GitHub repo.  
3. Framework Preset: **Next.js** (auto-detected).  
4. **Deploy** once with defaults (it may fail until env vars are set — you can add env first, then redeploy).

---

## 4. Environment variables (Vercel)

**Project → Settings → Environment Variables**

Add for **Production** (and **Preview** if you use preview deployments):

| Name | Example / notes |
|------|------------------|
| `DATABASE_URL` | Full Neon connection string |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` (or any long random string) |
| `NEXTAUTH_URL` | **Exact** public URL, e.g. `https://your-app.vercel.app` — must match the browser URL (no trailing slash). Update if you add a custom domain. |
| `ADMIN_PASSWORD` | Strong password for `/admin/login` |
| `CONTACT_EMAIL` | Optional — shows mailto on `/contact` |

Redeploy after saving variables (**Deployments → … → Redeploy**).

---

## 5. Apply schema to production database (once)

From your computer (with Node/npm and this repo):

**Windows PowerShell:**

```powershell
$env:DATABASE_URL = "postgresql://YOUR_NEON_CONNECTION_STRING"
npx prisma db push
```

**macOS / Linux:**

```bash
export DATABASE_URL="postgresql://YOUR_NEON_CONNECTION_STRING"
npx prisma db push
```

This creates tables (`games`, `download_targets`, etc.). Do **not** commit the URL.

Optional seed (dev-style sample games):

```bash
npx prisma db seed
```

---

## 6. Smoke test (production)

Open your live URL and verify:

- [ ] Home and **Browse** load  
- [ ] Search works on `/games`  
- [ ] Game detail page loads  
- [ ] **Download** redirects to your stored HTTPS URL  
- [ ] `/admin/login` works with `ADMIN_PASSWORD`  
- [ ] Create or edit a game and save  
- [ ] **Verify links** in admin updates “last link check” when URLs respond  

---

## Troubleshooting

- **Auth / login fails in production** — `NEXTAUTH_URL` must exactly match the site URL (including `https`).  
- **Prisma errors about connection** — Check `DATABASE_URL`, Neon project running, and IP allowlist (Neon usually allows all).  
- **Build fails on Vercel** — Check build logs; `postinstall` runs `prisma generate`. Ensure `package.json` is committed.  

---

## Alternatives

Same env vars and `prisma db push` apply for **Railway**, **Render**, or **Fly.io**: deploy as a Node web service + managed Postgres.
