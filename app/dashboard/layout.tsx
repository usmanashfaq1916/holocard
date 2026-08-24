import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/shell";
import { ensureUserWorkspace } from "@/lib/db/migrate-workspaces";

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

  return <DashboardShell user={session.user}>{children}</DashboardShell>;
}
