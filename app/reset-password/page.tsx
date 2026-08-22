"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <Card className="glass relative z-10 w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <Link href="/" className="mb-4 inline-block text-2xl font-bold">
            <span className="text-gradient">Holo</span>Card
          </Link>
          <CardTitle className="text-xl">Invalid Link</CardTitle>
          <CardDescription className="text-muted-foreground">
            This password reset link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/forgot-password" className={buttonVariants({ variant: "outline" }) + " w-full"}>
            Request a New Link
          </Link>
        </CardContent>
      </Card>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass relative z-10 w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <Link href="/" className="mb-4 inline-block text-2xl font-bold">
          <span className="text-gradient">Holo</span>Card
        </Link>
        <CardTitle className="text-xl">Reset your password</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your new password below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="space-y-4 text-center">
            <div className="rounded-lg border border-primary/50 bg-primary/10 p-3 text-sm text-primary">
              Your password has been reset successfully.
            </div>
            <Link href="/login" className={buttonVariants({ variant: "outline" }) + " w-full"}>
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="pl-9"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Reset Password
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-grid px-4">
      <div className="absolute inset-0 bg-radial" />
      <Suspense
        fallback={
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
