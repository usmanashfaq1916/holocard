import * as THREE from "three";

export type AnimationType =
  | "fade-in"
  | "scale-in"
  | "slide-in"
  | "rotate"
  | "float"
  | "bounce"
  | "pulse";

export interface AnimationConfig {
  type: AnimationType;
  duration: number;
  delay: number;
  loop?: boolean;
  trigger?: "target-detected" | "tap" | "button-click" | "timed-delay";
}

export function applyAnimation(
  group: THREE.Group,
  config: AnimationConfig,
  startTime: number,
  currentTime: number
): void {
  const elapsed = currentTime - startTime - config.delay;
  const progress = Math.min(Math.max(elapsed / config.duration, 0), 1);
  const eased = easeOutCubic(progress);

  switch (config.type) {
    case "fade-in":
      applyFadeIn(group, eased);
      break;
    case "scale-in":
      applyScaleIn(group, eased);
      break;
    case "slide-in":
      applySlideIn(group, eased);
      break;
    case "rotate":
      applyRotate(group, elapsed);
      break;
    case "float":
      applyFloat(group, elapsed);
      break;
    case "bounce":
      applyBounce(group, elapsed);
      break;
    case "pulse":
      applyPulse(group, elapsed);
      break;
  }
}

function applyFadeIn(group: THREE.Group, progress: number): void {
  group.visible = progress > 0.001;
  group.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const mat = child.material as THREE.MeshPhysicalMaterial | THREE.MeshBasicMaterial;
      if ("opacity" in mat) {
        mat.transparent = true;
        mat.opacity = progress;
      }
    }
  });
}

function applyScaleIn(group: THREE.Group, progress: number): void {
  group.visible = progress > 0.001;
  const scale = progress;
  group.scale.set(scale, scale, scale);
}

function applySlideIn(group: THREE.Group, progress: number): void {
  group.visible = progress > 0.001;
  const startY = 0.5;
  group.position.y = THREE.MathUtils.lerp(startY, 0, progress);
  group.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const mat = child.material as THREE.MeshPhysicalMaterial | THREE.MeshBasicMaterial;
      if ("opacity" in mat) {
        mat.transparent = true;
        mat.opacity = progress;
      }
    }
  });
}

function applyRotate(group: THREE.Group, elapsed: number): void {
  group.visible = true;
  group.rotation.y = elapsed * 0.5;
}

function applyFloat(group: THREE.Group, elapsed: number): void {
  group.visible = true;
  group.position.y = Math.sin(elapsed * 2) * 0.05;
}

function applyBounce(group: THREE.Group, elapsed: number): void {
  group.visible = true;
  const bounce = Math.abs(Math.sin(elapsed * 3)) * 0.1;
  group.position.y = bounce;
}

function applyPulse(group: THREE.Group, elapsed: number): void {
  group.visible = true;
  const pulse = 1 + Math.sin(elapsed * 4) * 0.05;
  group.scale.set(pulse, pulse, pulse);
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function createAnimationSequence(
  elements: { order: number; animation?: AnimationConfig }[]
): { order: number; startDelay: number }[] {
  return elements
    .sort((a, b) => a.order - b.order)
    .map((el, i) => ({
      order: el.order,
      startDelay: el.animation?.delay ?? i * 0.3,
    }));
}
