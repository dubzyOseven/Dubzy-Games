import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden text-slate-100">
      <SiteHeader />
      <main className="flex-1 min-w-0">{children}</main>
      <SiteFooter />
    </div>
  );
}