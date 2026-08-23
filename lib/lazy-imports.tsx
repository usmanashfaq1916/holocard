import dynamic from "next/dynamic";

export const LazyARModelViewer = dynamic(
  () => import("@/components/ar/model-viewer").then(mod => ({ default: mod.ARModelViewer })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-2xl bg-muted/30">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading 3D experience...</span>
        </div>
      </div>
    ),
  }
);

export const LazyAnalyticsCharts = dynamic(
  () => import("recharts").then(mod => ({ default: mod.ResponsiveContainer })),
  { ssr: false }
);

export const LazyCardEditor = dynamic(
  () => import("@/components/cards/card-editor").then(mod => ({ default: mod.CardEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading editor...</span>
        </div>
      </div>
    ),
  }
);
