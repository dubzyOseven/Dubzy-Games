import Link from "next/link";
import { Suspense } from "react";
import { OAuthSignInButtons } from "@/components/OAuthSignInButtons";

type Props = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

const errorMessages: Record<string, string> = {
  OAuthSignin: "Could not start sign-in. Try again.",
  OAuthCallback: "Sign-in was cancelled or failed after redirect.",
  OAuthCreateAccount: "Could not create an account for this sign-in.",
  EmailCreateAccount: "Could not create an account.",
  Callback: "Something went wrong during sign-in.",
  OAuthAccountNotLinked:
    "This email is already used with another sign-in method. Use the original provider.",
  SessionRequired: "You need to be signed in to view that page.",
  Default: "Sign-in failed. Try again.",
};

export default async function UserSignInPage({ searchParams }: Props) {
  const { callbackUrl, error } = await searchParams;
  const google =
    Boolean(process.env.GOOGLE_CLIENT_ID?.trim()) &&
    Boolean(process.env.GOOGLE_CLIENT_SECRET?.trim());
  const github =
    Boolean(process.env.GITHUB_ID?.trim()) && Boolean(process.env.GITHUB_SECRET?.trim());

  const errorText = error ? (errorMessages[error] ?? errorMessages.Default) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20 backdrop-blur-md sm:p-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Sign in</h1>
        <p className="mt-2 text-sm text-slate-400 sm:text-base">
          Use Google or GitHub. For the catalog admin area, use{" "}
          <Link href="/admin/login" className="font-medium text-cyan-400 hover:underline">
            Admin login
          </Link>{" "}
          with the site password.
        </p>
        {errorText ? (
          <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errorText}
          </p>
        ) : null}
        <div className="mt-6">
          <Suspense
            fallback={
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
                Loading…
              </div>
            }
          >
            <OAuthSignInButtons google={google} github={github} />
          </Suspense>
        </div>
        {callbackUrl && callbackUrl !== "/" ? (
          <p className="mt-4 text-xs text-slate-500">
            After sign-in you will be redirected back to the app.
          </p>
        ) : null}
      </section>
    </div>
  );
}
