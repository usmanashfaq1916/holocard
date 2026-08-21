"use client";

import { DashboardSidebar, DashboardTopbar } from "@/components/dashboard/layout";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardTopbar user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
