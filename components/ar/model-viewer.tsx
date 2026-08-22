"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  Float,
  Text3D,
  Center,
  RoundedBox,
} from "@react-three/drei";
import { Loader2, Maximize2, RotateCcw, Eye } from "lucide-react";
import * as THREE from "three";

function CardModel({ color = "#2563EB" }: { color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Center>
      <group ref={meshRef}>
        <RoundedBox args={[3.5, 2, 0.05]} radius={0.1} smoothness={4}>
          <meshPhysicalMaterial
            color={color}
            metalness={0.3}
            roughness={0.4}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transparent
            opacity={0.95}
          />
        </RoundedBox>

        {/* Card content */}
        <group position={[0, 0.4, 0.03]}>
          <RoundedBox args={[0.5, 0.5, 0.01]} radius={0.25} smoothness={4} position={[-1.2, 0, 0]}>
            <meshPhysicalMaterial color="#ffffff" metalness={0.1} roughness={0.5} />
          </RoundedBox>
        </group>

        {/* Text lines */}
        {[-0.2, -0.45, -0.7].map((y, i) => (
          <mesh key={i} position={[-0.3, y, 0.03]}>
            <planeGeometry args={[1.8 - i * 0.3, 0.08]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6 - i * 0.15} />
          </mesh>
        ))}

        {/* Social icons */}
        <group position={[0.8, -0.7, 0.03]}>
          {[0, 0.35, 0.7].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]}>
              <circleGeometry args={[0.12, 32]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
            </mesh>
          ))}
        </group>
      </group>
    </Center>
  );
}

function GLTFModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

interface ARModelViewerProps {
  modelUrl?: string;
  poster?: string;
  arEnabled?: boolean;
  cardColor?: string;
  autoRotate?: boolean;
  className?: string;
}

export function ARModelViewer({
  modelUrl,
  arEnabled = true,
  cardColor = "#2563EB",
  autoRotate = true,
  className = "",
}: ARModelViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="oklch(0.65 0.15 195)" />

        <Suspense fallback={null}>
          <Environment preset="city" />
          {modelUrl ? (
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <GLTFModel url={modelUrl} />
            </Float>
          ) : (
            <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
              <CardModel color={cardColor} />
            </Float>
          )}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            autoRotate={autoRotate}
            autoRotateSpeed={1}
            minDistance={3}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>

      {/* Controls overlay */}
      <div className="absolute bottom-3 right-3 flex gap-2">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-background"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function ARModelViewerFallback() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/50 p-12">
      <Eye className="mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="text-lg font-semibold">3D Preview</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        AR is not supported on this device. You can still view the interactive 3D card.
      </p>
    </div>
  );
}
