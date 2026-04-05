import { AdminShell } from "@/components/AdminShell";
import { Providers } from "@/components/Providers";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AdminShell>{children}</AdminShell>
    </Providers>
  );
}