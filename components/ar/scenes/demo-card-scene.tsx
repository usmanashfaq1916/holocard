"use client";

import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import { ARAnchor } from "r3f-mind-ar";
import * as THREE from "three";

const NAVY = "#14304F";
const GOLD = "#D4AF37";
const LIGHT_GOLD = "#C9A227";

function AnimatedGroup({
  visible,
  delay,
  children,
  liftY = 0.06,
}: {
  visible: boolean;
  delay: number;
  children: React.ReactNode;
  liftY?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const startTime = useRef(-1);

  useFrame(() => {
    if (!ref.current) return;
    const now = performance.now() / 1000;
    if (startTime.current < 0) startTime.current = now;
    const elapsed = now - startTime.current;
    const t = visible
      ? Math.min(Math.max((elapsed - delay) / 0.5, 0), 1)
      : 0;
    const ease = t * t * (3 - 2 * t);
    ref.current.visible = t > 0.001;
    ref.current.position.y = THREE.MathUtils.lerp(-liftY, 0, ease);
    ref.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshPhysicalMaterial;
        if ("opacity" in mat) {
          mat.transparent = true;
          mat.opacity = ease;
        }
      }
    });
  });

  return <group ref={ref}>{children}</group>;
}

export function DemoCardScene({
  onInteraction,
  onAnchorFound,
  onAnchorLost,
}: {
  onInteraction: (type: string, url?: string) => void;
  onAnchorFound?: () => void;
  onAnchorLost?: () => void;
}) {
  const [found, setFound] = useState(false);

  return (
    <ARAnchor
      target={0}
      lerp={0.15}
      onAnchorFound={() => {
        setFound(true);
        onAnchorFound?.();
      }}
      onAnchorLost={() => {
        setFound(false);
        onAnchorLost?.();
      }}
    >
      <AnimatedGroup visible={found} delay={0.3}>
        <Text
          position={[0, 0.55, 0.08]}
          fontSize={0.14}
          color={GOLD}
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          MARTIN SAENZ
        </Text>
      </AnimatedGroup>

      <AnimatedGroup visible={found} delay={0.7}>
        <Text
          position={[0, 0.35, 0.08]}
          fontSize={0.07}
          color={LIGHT_GOLD}
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          Modeling Designer
        </Text>
      </AnimatedGroup>

      <AnimatedGroup visible={found} delay={1.0}>
        <mesh position={[0, 0.22, 0.08]}>
          <planeGeometry args={[1.2, 0.003]} />
          <meshBasicMaterial color={GOLD} transparent opacity={0.6} />
        </mesh>
      </AnimatedGroup>

      <AnimatedGroup visible={found} delay={1.3}>
        <group position={[0, 0.0, 0.1]}>
          <group
            position={[-0.45, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onInteraction("phone", "tel:+070675676854");
            }}
          >
            <RoundedBox args={[0.28, 0.14, 0.02]} radius={0.03}>
              <meshPhysicalMaterial
                color={NAVY}
                metalness={0.2}
                roughness={0.4}
              />
            </RoundedBox>
            <Text
              position={[0, 0, 0.02]}
              fontSize={0.04}
              color={GOLD}
              anchorX="center"
            >
              Call
            </Text>
          </group>

          <group
            position={[0, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onInteraction("email", "mailto:yourmail@email.com");
            }}
          >
            <RoundedBox args={[0.28, 0.14, 0.02]} radius={0.03}>
              <meshPhysicalMaterial
                color={NAVY}
                metalness={0.2}
                roughness={0.4}
              />
            </RoundedBox>
            <Text
              position={[0, 0, 0.02]}
              fontSize={0.04}
              color={GOLD}
              anchorX="center"
            >
              Email
            </Text>
          </group>

          <group
            position={[0.45, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onInteraction("website", "https://urlwebsite.name.com");
            }}
          >
            <RoundedBox args={[0.28, 0.14, 0.02]} radius={0.03}>
              <meshPhysicalMaterial
                color={NAVY}
                metalness={0.2}
                roughness={0.4}
              />
            </RoundedBox>
            <Text
              position={[0, 0, 0.02]}
              fontSize={0.04}
              color={GOLD}
              anchorX="center"
            >
              Website
            </Text>
          </group>
        </group>
      </AnimatedGroup>

      <AnimatedGroup visible={found} delay={1.8}>
        <Text
          position={[0, -0.35, 0.08]}
          fontSize={0.04}
          color="#94A3B8"
          anchorX="center"
        >
          Powered by HoloCard
        </Text>
      </AnimatedGroup>
    </ARAnchor>
  );
}
