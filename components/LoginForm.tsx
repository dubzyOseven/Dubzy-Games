"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { BrandWordmark } from "@/components/BrandWordmark";

/**
 * Credentials sign-in via same requests as next-auth/react signIn(), but without
 * redirect:false's fragile `new URL(data.url)` path (throws when `url` is missing
 * — e.g. 500/config responses — leaving the UI stuck on "Signing in...").
 */
export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/games";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const safePath =
        callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
          ? callbackUrl
          : "/admin/games";
      const absoluteCallback =
        typeof window !== "undefined" ? `${window.location.origin}${safePath}` : safePath;

      const csrfRes = await fetch("/api/auth/csrf", { credentials: "include" });
      if (!csrfRes.ok) {
        setError("Could not load CSRF token. Check NEXTAUTH_URL and redeploy.");
        return;
      }
      const csrfJson: { csrfToken?: string } = await csrfRes.json().catch(() => ({}));
      if (!csrfJson.csrfToken) {
        setError("Invalid CSRF response. Set NEXTAUTH_SECRET on Vercel and redeploy.");
        return;
      }

      const body = new URLSearchParams({
        csrfToken: csrfJson.csrfToken,
        callbackUrl: absoluteCallback,
        json: "true",
        password,
      });

      const res = await fetch("/api/auth/callback/admin", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
        credentials: "include",
      });

      const data: { url?: string; message?: string } = await res.json().catch(() => ({}));

      if (!res.ok) {
        let errCode: string | null = null;
        if (typeof data.url === "string") {
          try {
            errCode = new URL(data.url).searchParams.get("error");
          } catch {
            /* ignore */
          }
        }
        if (errCode === "CredentialsSignin") {
          setError("Invalid password.");
          return;
        }
        if (data.message) {
          setError(`Server error: ${data.message}`);
          return;
        }
        setError(
          errCode
            ? `Sign-in failed (${errCode}). Check Vercel env vars.`
            : `Sign-in failed (HTTP ${res.status}). Add NEXTAUTH_SECRET, NEXTAUTH_URL, and ADMIN_PASSWORD in Vercel → Settings → Environment Variables, then redeploy.`,
        );
        return;
      }

      if (typeof data.url === "string" && /^https?:\/\//.test(data.url)) {
        window.location.assign(data.url);
        return;
      }
      window.location.assign(safePath);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Network error. Try again or check the browser console.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-sm space-y-6 rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-md"
    >
      <div>
        <p className="text-sm font-medium text-slate-400">Admin</p>
        <h1 className="mt-1 text-2xl font-bold text-white">
          <BrandWordmark />
        </h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to manage listings</p>
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-300">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          autoComplete="current-password"
          required
        />
      </div>
      {error ? <p className="text-sm font-medium text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-sky-400 disabled:opacity-50"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
