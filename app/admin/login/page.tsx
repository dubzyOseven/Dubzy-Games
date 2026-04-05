import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<p className="text-zinc-500">Loading...</p>}>
      <LoginForm />
    </Suspense>
  );
}