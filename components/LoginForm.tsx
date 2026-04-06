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

      // redirect: "manual" — avoid following 302 with a non-JSON body edge cases.
      const res = await fetch("/api/auth/callback/admin", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
        credentials: "include",
        redirect: "manual",
      });

      const ct = res.headers.get("content-type") || "";
      let data: { url?: string; message?: string } = {};
      if (ct.includes("application/json")) {
        data = await res.json().catch(() => ({}));
      }

      const rawUrl =
        (typeof data.url === "string" && data.url.trim()) || res.headers.get("Location") || "";

      const toAbsolute = (u: string) => {
        if (u.startsWith("https://") || u.startsWith("http://")) return u;
        if (u.startsWith("/")) return `${window.location.origin}${u}`;
        return `${window.location.origin}${safePath}`;
      };

      const absoluteTarget = rawUrl ? toAbsolute(rawUrl) : "";

      const authErrorParams = (() => {
        if (!absoluteTarget) return null;
        try {
          return new URL(absoluteTarget).searchParams.get("error");
        } catch {
          return null;
        }
      })();

      // NextAuth often returns JSON { url } with HTTP 302; res.ok is false for 302, so we must
      // not treat that as failure when url is a normal post-login destination.
      if (absoluteTarget && !authErrorParams) {
        window.location.href = absoluteTarget;
        return;
      }

      if (authErrorParams === "CredentialsSignin") {
        setError("Invalid password.");
        return;
      }
      if (data.message) {
        setError(`Server error: ${data.message}`);
        return;
      }
      if (authErrorParams) {
        setError(`Sign-in failed (${authErrorParams}). Check Vercel env vars.`);
        return;
      }

      // No URL in body: rare; try going to admin if status looks OK.
      if (res.ok || res.status === 0 || res.status === 302 || res.status === 303) {
        window.location.href = `${window.location.origin}${safePath}`;
        return;
      }

      setError(
        `Sign-in failed (HTTP ${res.status}). Add NEXTAUTH_SECRET, NEXTAUTH_URL, and ADMIN_PASSWORD in Vercel → Environment Variables, then redeploy.`,
      );
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
