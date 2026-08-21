"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings.
        </p>
      </div>

      <div className="glass max-w-2xl rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input defaultValue="Usman Ashfaq" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue="usman@example.com" disabled />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Company</Label>
            <Input defaultValue="" placeholder="Company name" />
          </div>
          <div className="space-y-2">
            <Label>Designation</Label>
            <Input defaultValue="" placeholder="Your role" />
          </div>
        </div>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
