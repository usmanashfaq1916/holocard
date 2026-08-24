declare module "mind-ar/dist/mindar-image.prod.js" {
  export class Compiler {
    compileImageTargets(
      images: HTMLImageElement[],
      progressCallback?: (progress: number) => void
    ): Promise<unknown[]>;
    exportData(): Uint8Array;
    importData(buffer: ArrayBuffer): unknown[];
  }

  export class Controller {
    constructor(options: Record<string, unknown>);
    addImageTargets(src: string): Promise<{ dimensions: [number, number][] }>;
    addImageTargetsFromBuffer(buffer: ArrayBuffer): Promise<{ dimensions: [number, number][] }>;
    processVideo(video: HTMLVideoElement): void;
    stopProcessVideo(): void;
    getProjectionMatrix(): number[];
    onUpdate: ((data: unknown) => void) | null;
  }
}

declare module "r3f-mind-ar" {
  import { ComponentType, ReactNode, Ref } from "react";

  export interface ARViewHandle {
    startTracking: () => Promise<void>;
    stopTracking: () => void;
    switchCamera: () => void;
  }

  export interface ARViewProps {
    ref?: Ref<ARViewHandle>;
    imageTargets: string;
    maxTrack?: number;
    autoplay?: boolean;
    flipUserCamera?: boolean;
    filterMinCF?: number | null;
    filterBeta?: number | null;
    warmupTolerance?: number | null;
    missTolerance?: number | null;
    onReady?: () => void;
    onError?: (error: Error) => void;
    canvasProps?: Record<string, unknown>;
    children?: ReactNode;
  }

  export interface ARAnchorProps {
    target?: number;
    lerp?: number;
    onAnchorFound?: () => void;
    onAnchorLost?: () => void;
    children?: ReactNode;
  }

  export interface ARContextValue {
    anchors: Map<number, { matrix: number[] | null; visible: boolean }>;
    startTracking: () => Promise<void>;
    stopTracking: () => void;
    switchCamera: () => void;
    isTracking: boolean;
    isReady: boolean;
  }

  export const ARView: ComponentType<ARViewProps>;
  export const ARAnchor: ComponentType<ARAnchorProps>;
  export const ARProvider: ComponentType<{ children?: ReactNode } & Omit<ARViewProps, "canvasProps">>;
  export function useAR(): ARContextValue;
}
