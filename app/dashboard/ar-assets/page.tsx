"use client";

import { Box, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ARAssetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AR Assets</h1>
          <p className="text-sm text-muted-foreground">
            Manage your 3D models, image targets, and AR resources.
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Asset
        </Button>
      </div>

      <div className="glass flex flex-col items-center justify-center rounded-xl p-12">
        <Box className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 font-semibold">No assets yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload GLB, GLTF, image targets, or videos for your AR experiences.
        </p>
      </div>
    </div>
  );
}
