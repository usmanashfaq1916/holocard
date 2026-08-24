"use client";

import { Suspense, useRef, useState, useCallback, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  Center,
  RoundedBox,
  ContactShadows,
  Text,
} from "@react-three/drei";
import { Loader2, Eye } from "lucide-react";
import * as THREE from "three";
import { ErrorBoundary } from "@/components/error-boundary";

/* ──────────── Tilt tracking ──────────── */

function TiltGroup({
  children,
  onFlip,
}: {
  children: React.ReactNode;
  onFlip?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  const handlePointerMove = useCallback(
    (e: { clientX: number; clientY: number; target: HTMLElement }) => {
      const rect = (e.target as HTMLElement)?.getBoundingClientRect?.();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetRotation.current = { x: y * 0.25, y: x * 0.35 };
    },
    []
  );

  const handlePointerLeave = useCallback(() => {
    targetRotation.current = { x: 0, y: 0 };
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    const { x, y } = targetRotation.current;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      x,
      0.08
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      y,
      0.08
    );
  });

  return (
    <group
      ref={groupRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onFlip}
    >
      {children}
    </group>
  );
}

/* ──────────── Light sweep ──────────── */

function LightSweep() {
  const lightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    const t = state.clock.elapsedTime * 0.4;
    lightRef.current.position.x = Math.sin(t) * 4;
    lightRef.current.position.y = Math.cos(t * 0.7) * 2 + 2;
    lightRef.current.position.z = 3;
  });

  return (
    <spotLight
      ref={lightRef}
      intensity={0.8}
      angle={0.4}
      penumbra={0.8}
      color="#a0d4ff"
      distance={12}
      castShadow={false}
    />
  );
}

/* ──────────── Holographic material ──────────── */

function HolographicMaterial({ baseColor = "#2563EB" }: { baseColor?: string }) {
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  useFrame((state) => {
    if (!materialRef.current) return;
    const t = state.clock.elapsedTime;
    materialRef.current.iridescence = 0.3 + Math.sin(t * 0.5) * 0.1;
    materialRef.current.iridescenceIOR = 1.3 + Math.sin(t * 0.3) * 0.2;
  });

  return (
    <meshPhysicalMaterial
      ref={materialRef}
      color={baseColor}
      metalness={0.6}
      roughness={0.15}
      clearcoat={1}
      clearcoatRoughness={0.05}
      transmission={0.05}
      ior={1.5}
      iridescence={0.3}
      iridescenceIOR={1.3}
      iridescenceThicknessRange={[100, 400]}
      envMapIntensity={1.2}
      transparent
      opacity={0.97}
    />
  );
}

/* ──────────── Front face content ──────────── */

function CardFront({
  name,
  designation,
  company,
  profileImage,
  socialLinks,
}: {
  name: string;
  designation?: string;
  company?: string;
  profileImage?: string;
  socialLinks?: { platform: string; url: string }[];
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <group position={[0, 0, 0.026]}>
      {/* Avatar circle */}
      <mesh position={[-1.1, 0.45, 0]}>
        <circleGeometry args={[0.28, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.1}
          roughness={0.4}
          clearcoat={0.5}
        />
      </mesh>

      {/* Avatar initials */}
      <Text
        position={[-1.1, 0.45, 0.01]}
        fontSize={0.16}
        color="#2563EB"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {initials}
      </Text>

      {/* Name */}
      <Text
        position={[0.15, 0.5, 0.01]}
        fontSize={0.18}
        color="#0f172a"
        anchorX="left"
        anchorY="middle"
        maxWidth={2.2}
        font={undefined}
        fontWeight="bold"
      >
        {name}
      </Text>

      {/* Designation */}
      {designation && (
        <Text
          position={[0.15, 0.25, 0.01]}
          fontSize={0.1}
          color="#475569"
          anchorX="left"
          anchorY="middle"
          maxWidth={2.2}
          font={undefined}
        >
          {designation}
          {company ? ` at ${company}` : ""}
        </Text>
      )}

      {/* Divider line */}
      <mesh position={[0, 0.05, 0.005]}>
        <planeGeometry args={[2.8, 0.005]} />
        <meshBasicMaterial color="#e2e8f0" transparent opacity={0.6} />
      </mesh>

      {/* Skill tags placeholder */}
      <group position={[-1.2, -0.2, 0.005]}>
        {["Profile", "Contact", "Connect"].map((label, i) => (
          <group key={i} position={[i * 0.9, 0, 0]}>
            <mesh>
              <planeGeometry args={[0.75, 0.22]} />
              <meshBasicMaterial color="#eff6ff" transparent opacity={0.8} />
            </mesh>
            <Text
              position={[0, 0, 0.005]}
              fontSize={0.07}
              color="#2563EB"
              anchorX="center"
              anchorY="middle"
              font={undefined}
            >
              {label}
            </Text>
          </group>
        ))}
      </group>

      {/* Social icon circles */}
      <group position={[0.8, -0.55, 0.005]}>
        {(socialLinks || []).slice(0, 4).map((_, i) => (
          <mesh key={i} position={[i * 0.38, 0, 0]}>
            <circleGeometry args={[0.13, 32]} />
            <meshPhysicalMaterial
              color="#2563EB"
              metalness={0.3}
              roughness={0.3}
              clearcoat={0.8}
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}
        {(socialLinks || []).length === 0 &&
          [0, 1, 2].map((i) => (
            <mesh key={i} position={[i * 0.38, 0, 0]}>
              <circleGeometry args={[0.13, 32]} />
              <meshPhysicalMaterial
                color="#2563EB"
                metalness={0.3}
                roughness={0.3}
                clearcoat={0.8}
                transparent
                opacity={0.85}
              />
            </mesh>
          ))}
      </group>

      {/* Bottom accent line */}
      <mesh position={[0, -0.85, 0.005]}>
        <planeGeometry args={[2.8, 0.02]} />
        <meshBasicMaterial color="#2563EB" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

/* ──────────── Back face content ──────────── */

function CardBack({ slug }: { slug: string }) {
  return (
    <group position={[0, 0, -0.026]} rotation={[0, Math.PI, 0]}>
      {/* QR placeholder */}
      <mesh position={[0, 0.2, 0.01]}>
        <planeGeometry args={[0.9, 0.9]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.2, 0.015]}>
        <ringGeometry args={[0.38, 0.42, 32]} />
        <meshBasicMaterial color="#2563EB" transparent opacity={0.3} />
      </mesh>

      {/* Scan text */}
      <Text
        position={[0, -0.45, 0.01]}
        fontSize={0.12}
        color="#475569"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        Scan to view profile
      </Text>

      {/* HoloCard branding */}
      <Text
        position={[0, -0.65, 0.01]}
        fontSize={0.09}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        Powered by HoloCard
      </Text>
    </group>
  );
}

/* ──────────── Complete card ──────────── */

function HoloCardBody({
  name,
  designation,
  company,
  profileImage,
  socialLinks,
  slug,
  cardColor,
}: {
  name: string;
  designation?: string;
  company?: string;
  profileImage?: string;
  socialLinks?: { platform: string; url: string }[];
  slug: string;
  cardColor?: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const target = flipped ? Math.PI : 0;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      target,
      0.06
    );
  });

  return (
    <Center>
      <group ref={groupRef}>
        <TiltGroup onFlip={() => setFlipped((f) => !f)}>
          {/* Card body */}
          <RoundedBox args={[3.5, 2, 0.05]} radius={0.12} smoothness={4}>
            <HolographicMaterial baseColor={cardColor || "#2563EB"} />
          </RoundedBox>

          {/* Front content */}
          {!flipped && (
            <CardFront
              name={name}
              designation={designation}
              company={company}
              profileImage={profileImage}
              socialLinks={socialLinks}
            />
          )}

          {/* Back content */}
          {flipped && <CardBack slug={slug} />}
        </TiltGroup>
      </group>
    </Center>
  );
}

/* ──────────── Scene ──────────── */

function HoloCardScene({
  name,
  designation,
  company,
  profileImage,
  socialLinks,
  slug,
  cardColor,
}: {
  name: string;
  designation?: string;
  company?: string;
  profileImage?: string;
  socialLinks?: { platform: string; url: string }[];
  slug: string;
  cardColor?: string;
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-3, 2, 4]} intensity={0.3} color="#a0d4ff" />
      <LightSweep />

      <Suspense fallback={null}>
        <Environment preset="city" />
        <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
          <HoloCardBody
            name={name}
            designation={designation}
            company={company}
            profileImage={profileImage}
            socialLinks={socialLinks}
            slug={slug}
            cardColor={cardColor}
          />
        </Float>
        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.25}
          scale={8}
          blur={2.5}
          far={3}
          color="#2563EB"
        />
      </Suspense>
    </>
  );
}

/* ──────────── Public exports ──────────── */

export interface HoloCardProps {
  name: string;
  designation?: string | null;
  company?: string | null;
  profileImage?: string | null;
  cardColor?: string;
  socialLinks?: { platform: string; url: string }[];
  slug: string;
  className?: string;
}

export function ARModelViewer({
  name = "User",
  designation,
  company,
  profileImage,
  cardColor,
  socialLinks,
  slug,
  className = "",
}: HoloCardProps) {
  const [webglSupported, setWebglSupported] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }

    // Fallback: dismiss loading spinner after 15s if onCreated never fires
    const timeout = setTimeout(() => setLoading(false), 15000);
    return () => clearTimeout(timeout);
  }, []);

  if (!webglSupported) {
    return <ARModelViewerFallback />;
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <ErrorBoundary fallback={<ARModelViewerFallback />}>
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ background: "transparent" }}
          dpr={[1, 2]}
          onCreated={() => setLoading(false)}
        >
          <HoloCardScene
            name={name}
            designation={designation || undefined}
            company={company || undefined}
            profileImage={profileImage || undefined}
            socialLinks={socialLinks}
            slug={slug}
            cardColor={cardColor}
          />
        </Canvas>
      </ErrorBoundary>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">Loading 3D experience...</span>
          </div>
        </div>
      )}

      {/* Interaction hint overlay */}
      <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center">
        <span className="rounded-full bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
          Drag to rotate &bull; Click to flip
        </span>
      </div>
    </div>
  );
}

export function ARModelViewerFallback() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-12">
      <Eye className="mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="text-lg font-semibold">3D Preview</h3>
      <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
        Your device does not support the full 3D experience. You can still view the
        card content below.
      </p>
    </div>
  );
}
