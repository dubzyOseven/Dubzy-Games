"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { BrandWordmark } from "@/components/BrandWordmark";

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
    const res = await signIn("admin", {
      password,
      redirect: false,
      callbackUrl,
    });
    setPending(false);
    if (res?.error) {
      setError(
        res.error === "CredentialsSignin"
          ? "Invalid password."
          : `Sign-in failed (${res.error}). Check NEXTAUTH_URL and NEXTAUTH_SECRET on the server.`,
      );
      return;
    }
    if (!res?.ok) {
      setError("Sign-in failed. Try again.");
      return;
    }
    // Full navigation so the session cookie from the API response is always visible to middleware
    // (client router transitions can miss the cookie timing on some hosts).
    const safeCallback =
      callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
        ? callbackUrl
        : "/admin/games";
    window.location.assign(safeCallback);
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
