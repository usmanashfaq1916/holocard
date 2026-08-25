import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto">
          <span className="text-2xl">404</span>
        </div>
        <h2 className="text-lg font-semibold">Page Not Found</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className={buttonVariants({ variant: "default", className: "mt-4" })}
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
