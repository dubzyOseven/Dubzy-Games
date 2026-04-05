# Curating listings

Use this checklist before marking a game **published**.

1. **Official sources only** — Download URLs must point at the maintainer’s GitHub Releases page, project site, or another host they control (not random mirrors).
2. **License** — Record the SPDX id (or full name) and link to the license text in the upstream repo. Confirm assets (art/audio) match the code license where it matters.
3. **Attribution** — Paste required copyright or credit lines on the game page.
4. **Link rot** — In **Admin → Games**, use **Verify links** after updates; fix or unpublish broken entries.
5. **Draft first** — Leave **Published** off until URLs and license fields are complete.

Re-run `npm run db:seed` only on empty dev DBs; for production, add entries via the admin UI or a dedicated migration.
