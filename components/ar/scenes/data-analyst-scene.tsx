"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import { ARAnchor } from "r3f-mind-ar";
import * as THREE from "three";

const BAR_DATA = [
  { height: 0.4, color: "#2563EB", label: "Q1" },
  { height: 0.7, color: "#3B82F6", label: "Q2" },
  { height: 0.5, color: "#60A5FA", label: "Q3" },
  { height: 0.9, color: "#1D4ED8", label: "Q4" },
  { height: 0.6, color: "#93C5FD", label: "YTD" },
];

const BAR_SPACING = 0.22;
const BAR_WIDTH = 0.16;
const TOTAL_WIDTH = (BAR_DATA.length - 1) * BAR_SPACING;

function AnimatedBar({
  targetHeight,
  color,
  delay,
  startX,
}: {
  targetHeight: number;
  color: string;
  delay: number;
  startX: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const startTime = useRef(-1);

  useFrame(() => {
    if (!ref.current) return;
    const now = performance.now() / 1000;
    if (startTime.current < 0) startTime.current = now;
    const elapsed = now - startTime.current;
    const t = Math.min(Math.max((elapsed - delay) / 0.8, 0), 1);
    const ease = t * t * (3 - 2 * t);
    const h = targetHeight * ease;
    ref.current.scale.y = Math.max(h, 0.001);
    ref.current.position.y = h / 2;
  });

  return (
    <mesh ref={ref} position={[startX, 0, 0]}>
      <boxGeometry args={[BAR_WIDTH, 1, 0.12]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.2}
        roughness={0.4}
        opacity={0.9}
        transparent
      />
    </mesh>
  );
}

export function DataAnalystScene({
  onInteraction,
}: {
  onInteraction: (type: string, url?: string) => void;
}) {
  return (
    <ARAnchor
      target={0}
      lerp={0.15}
      onAnchorFound={() => {}}
      onAnchorLost={() => {}}
    >
      {/* Title */}
      <Text
        position={[0, 0.65, 0.15]}
        fontSize={0.12}
        color="#1a1a1a"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        font="/fonts/Inter-Bold.ttf"
      >
        Data Analytics Portfolio
      </Text>

      {/* Bar chart group */}
      <group position={[0, -0.05, 0.1]}>
        {BAR_DATA.map((bar, i) => (
          <AnimatedBar
            key={bar.label}
            targetHeight={bar.height}
            color={bar.color}
            delay={0.5 + i * 0.15}
            startX={-TOTAL_WIDTH / 2 + i * BAR_SPACING}
          />
        ))}

        {/* Bar labels */}
        {BAR_DATA.map((bar, i) => (
          <Text
            key={`label-${bar.label}`}
            position={[-TOTAL_WIDTH / 2 + i * BAR_SPACING, -0.15, 0.05]}
            fontSize={0.05}
            color="#666666"
            anchorX="center"
            anchorY="top"
          >
            {bar.label}
          </Text>
        ))}

        {/* Base line */}
        <mesh position={[0, -0.12, 0]}>
          <planeGeometry args={[TOTAL_WIDTH + 0.3, 0.003]} />
          <meshBasicMaterial color="#e2e8f0" />
        </mesh>
      </group>

      {/* Action buttons */}
      <group position={[0, -0.55, 0.15]}>
        <group
          position={[-0.5, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onInteraction("linkedin");
          }}
        >
          <RoundedBox args={[0.32, 0.16, 0.02]} radius={0.04}>
            <meshPhysicalMaterial color="#0A66C2" metalness={0.2} roughness={0.4} />
          </RoundedBox>
          <Text position={[0, 0, 0.02]} fontSize={0.045} color="white" anchorX="center">
            LinkedIn
          </Text>
        </group>

        <group
          position={[0, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onInteraction("portfolio");
          }}
        >
          <RoundedBox args={[0.32, 0.16, 0.02]} radius={0.04}>
            <meshPhysicalMaterial color="#2563EB" metalness={0.2} roughness={0.4} />
          </RoundedBox>
          <Text position={[0, 0, 0.02]} fontSize={0.045} color="white" anchorX="center">
            Portfolio
          </Text>
        </group>

        <group
          position={[0.5, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onInteraction("github");
          }}
        >
          <RoundedBox args={[0.32, 0.16, 0.02]} radius={0.04}>
            <meshPhysicalMaterial color="#1a1a1a" metalness={0.2} roughness={0.4} />
          </RoundedBox>
          <Text position={[0, 0, 0.02]} fontSize={0.045} color="white" anchorX="center">
            GitHub
          </Text>
        </group>
      </group>

      {/* HoloCard branding */}
      <Text
        position={[0, -0.85, 0.15]}
        fontSize={0.04}
        color="#94A3B8"
        anchorX="center"
      >
        Powered by HoloCard
      </Text>
    </ARAnchor>
  );
}
