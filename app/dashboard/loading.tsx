import { DashboardSkeleton } from "@/components/skeletons";

export default function DashboardLoading() {
  return (
    <div className="p-6">
      <div className="mb-6 h-8 w-48 animate-pulse rounded-lg bg-muted" />
      <DashboardSkeleton />
    </div>
  );
}
