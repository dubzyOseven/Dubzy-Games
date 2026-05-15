"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const navLink =
  "rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-cyan-200 md:px-3 md:py-2 md:text-slate-400";

const signOutBtn =
  "rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-200 md:px-3 md:py-2";

type Props = {
  onNavigate?: () => void;
  layout?: "desktop" | "mobile";
};

export function HeaderAuth({ onNavigate, layout = "desktop" }: Props) {
  const { data: session, status } = useSession();
  const isMobile = layout === "mobile";

  if (status === "loading") {
    return (
      <span
        className={
          isMobile ? "px-3 py-2.5 text-sm text-slate-600" : "px-3 py-2 text-sm text-slate-600"
        }
        aria-hidden
      >
        …
      </span>
    );
  }

  if (session?.user) {
    const label = session.user.name ?? session.user.email ?? "Signed in";

    return (
      <div
        className={
          isMobile
            ? "mt-2 flex flex-col gap-1 border-t border-white/10 pt-3"
            : "flex items-center gap-2 md:ml-1"
        }
      >
        <div
          className={
            isMobile
              ? "flex items-center gap-3 px-3 py-2"
              : "flex max-w-[11rem] items-center gap-2"
          }
        >
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- OAuth avatar URLs are external
            <img
              src={session.user.image}
              alt=""
              className="h-8 w-8 shrink-0 rounded-full border border-white/10 object-cover"
            />
          ) : null}
          <span
            className={
              isMobile
                ? "truncate text-sm font-medium text-slate-200"
                : "truncate text-sm font-medium text-slate-300"
            }
            title={session.user.email ?? label}
          >
            {label}
          </span>
        </div>
        <button
          type="button"
          className={isMobile ? `${signOutBtn} w-full` : signOutBtn}
          onClick={() => {
            onNavigate?.();
            void signOut({ callbackUrl: "/" });
          }}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth/signin"
      className={isMobile ? navLink : `${navLink} md:ml-1`}
      onClick={onNavigate}
    >
      Sign in
    </Link>
  );
}
