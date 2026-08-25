import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/shell";
import { ensureUserWorkspace } from "@/lib/db/migrate-workspaces";
import { prisma } from "@/lib/db";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  ensureUserWorkspace(session.user.id).catch(console.error);

  // Onboarding redirect: skip for admin/settings/onboarding routes
  const path = children && typeof children === "object" && "props" in children
    ? (children.props as { segment?: string })?.segment
    : null;

  const isExemptRoute = path === "settings" || path === "onboarding";

  if (!isExemptRoute) {
    const cardCount = await prisma.card.count({
      where: { userId: session.user.id },
    });
    if (cardCount === 0) {
      redirect("/onboarding");
    }
  }

  return <DashboardShell user={session.user}>{children}</DashboardShell>;
}
