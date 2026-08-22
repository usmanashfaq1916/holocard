import dynamic from "next/dynamic";

export const LazyARModelViewer = dynamic(
  () => import("@/components/ar/model-viewer").then(mod => ({ default: mod.ARModelViewer })),
  { ssr: false, loading: () => <div className="flex h-96 items-center justify-center rounded-xl bg-muted"><span className="text-sm text-muted-foreground">Loading 3D viewer...</span></div> }
);

export const LazyAnalyticsCharts = dynamic(
  () => import("recharts").then(mod => ({ default: mod.ResponsiveContainer })),
  { ssr: false }
);

export const LazyCardEditor = dynamic(
  () => import("@/components/cards/card-editor").then(mod => ({ default: mod.CardEditor })),
  { ssr: false, loading: () => <div className="flex h-64 items-center justify-center"><span className="text-sm text-muted-foreground">Loading editor...</span></div> }
);
