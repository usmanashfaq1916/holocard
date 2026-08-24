export type ARSceneState =
  | "INITIALIZING"
  | "WAITING_FOR_TARGET"
  | "TARGET_DETECTED"
  | "PLAYING"
  | "INTERACTIVE"
  | "ERROR";

export interface ARSceneConfig {
  introSequence: IntroStep[];
  defaultDuration: number;
  transitionType: "NONE" | "FADE" | "SLIDE" | "SCALE";
}

export interface IntroStep {
  delay: number;
  elementType: string;
  label: string;
}

export const DEFAULT_AR_SCENE_CONFIG: ARSceneConfig = {
  introSequence: [
    { delay: 0, elementType: "LOGO", label: "Logo animation" },
    { delay: 0.2, elementType: "PROFILE", label: "Profile appears" },
    { delay: 0.8, elementType: "3D", label: "3D object emerges" },
    { delay: 1.2, elementType: "CONTENT", label: "Content cards" },
    { delay: 2.0, elementType: "BUTTONS", label: "CTA buttons appear" },
  ],
  defaultDuration: 10,
  transitionType: "FADE",
};

export interface ARError {
  code: string;
  message: string;
  suggestion: string;
}

export const AR_ERRORS: Record<string, ARError> = {
  CAMERA_DENIED: {
    code: "CAMERA_DENIED",
    message: "Camera access is required for AR.",
    suggestion: "Please allow camera access in your browser settings and try again.",
  },
  CAMERA_UNAVAILABLE: {
    code: "CAMERA_UNAVAILABLE",
    message: "No camera found on this device.",
    suggestion: "Try opening this page on a phone or tablet with a camera.",
  },
  UNSUPPORTED_BROWSER: {
    code: "UNSUPPORTED_BROWSER",
    message: "AR isn't supported on this browser.",
    suggestion: "Try Chrome, Safari, or Samsung Internet on a mobile device.",
  },
  TRACKING_FAILED: {
    code: "TRACKING_FAILED",
    message: "Could not start AR tracking.",
    suggestion: "Make sure your camera is working and try again.",
  },
  TARGET_NOT_FOUND: {
    code: "TARGET_NOT_FOUND",
    message: "Could not detect the business card.",
    suggestion:
      "Move your phone closer to the card. Make sure the entire card is visible and well-lit.",
  },
  SLOW_CONNECTION: {
    code: "SLOW_CONNECTION",
    message: "Loading AR content is taking longer than expected.",
    suggestion: "Check your connection and wait for assets to load.",
  },
  ASSET_LOAD_FAILED: {
    code: "ASSET_LOAD_FAILED",
    message: "Failed to load AR assets.",
    suggestion: "Try refreshing the page.",
  },
};

export function detectARSupport(): {
  supported: boolean;
  error?: ARError;
} {
  if (typeof window === "undefined") {
    return { supported: false, error: AR_ERRORS.UNSUPPORTED_BROWSER };
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    return { supported: false, error: AR_ERRORS.CAMERA_UNAVAILABLE };
  }

  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
  if (!gl) {
    return { supported: false, error: AR_ERRORS.UNSUPPORTED_BROWSER };
  }

  return { supported: true };
}
