import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="glass mx-auto max-w-md rounded-2xl p-8 text-center glow-md">
        <div className="mb-4 text-6xl font-bold text-gradient">404</div>
        <h1 className="mb-2 text-2xl font-bold">Page Not Found</h1>
        <p className="mb-6 text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className={buttonVariants({ variant: "default" })}>
            Go Home
          </Link>
          <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
