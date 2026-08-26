"use client";

import { Canvas } from "@react-three/fiber";
import { RoundedBox, Text, OrbitControls, Environment } from "@react-three/drei";
import { Suspense, useState, useEffect, useCallback, useRef } from "react";

interface FallbackViewerProps {
  name: string;
  cardSlug?: string;
  designation?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  linkedin?: string;
  whatsapp?: string;
}

function CardContent({
  name,
  designation,
  company,
  phone,
  email,
  website,
  linkedin,
  whatsapp,
}: FallbackViewerProps) {
  return (
    <group>
      <RoundedBox args={[3.5, 2, 0.05]} position={[0, 0, 0]} radius={0.12}>
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.1}
          roughness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={0.5}
        />
      </RoundedBox>

      <Text
        position={[0, 0.5, 0.03]}
        fontSize={0.22}
        color="#1a1a1a"
        anchorX="center"
        maxWidth={2.8}
      >
        {name}
      </Text>

      {designation && (
        <Text
          position={[0, 0.2, 0.03]}
          fontSize={0.11}
          color="#666666"
          anchorX="center"
          maxWidth={2.8}
        >
          {designation}
          {company ? ` at ${company}` : ""}
        </Text>
      )}

      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[2, 0.002]} />
        <meshBasicMaterial color="#e2e8f0" />
      </mesh>

      {email && (
        <Text position={[0, -0.2, 0.03]} fontSize={0.08} color="#555555" anchorX="center">
          {email}
        </Text>
      )}

      {phone && (
        <Text position={[0, -0.35, 0.03]} fontSize={0.08} color="#555555" anchorX="center">
          {phone}
        </Text>
      )}

      {website && (
        <Text position={[0, -0.5, 0.03]} fontSize={0.08} color="#2563EB" anchorX="center">
          {website}
        </Text>
      )}

      <Text position={[0, -0.8, 0.03]} fontSize={0.06} color="#94A3B8" anchorX="center">
        Powered by HoloCard
      </Text>
    </group>
  );
}

export default function Fallback3DViewer(props: FallbackViewerProps) {
  const [contextLost, setContextLost] = useState(false);
  const [contextFailed, setContextFailed] = useState(false);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, []);

  const handleContextLost = useCallback(() => {
    setContextLost(true);
    fallbackTimerRef.current = setTimeout(() => {
      setContextFailed(true);
    }, 10000);
  }, []);

  const handleContextRestored = useCallback(() => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    setContextLost(false);
  }, []);

  if (contextFailed) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <div className="text-center px-6">
          <h3 className="text-foreground text-lg font-semibold mb-2">3D View Unavailable</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Your device is low on graphics memory. Please view the digital card instead.
          </p>
          <a
            href={`/card/${props.cardSlug || props.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-2 text-sm font-medium transition-colors"
          >
            View Digital Card
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-background to-muted/30">
      <Canvas camera={{ position: [0, 0, 5], fov: 42 }} gl={{ antialias: true, alpha: true, powerPreference: "default" }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-3, 3, 2]} intensity={0.5} color="#60A5FA" />
        <Suspense fallback={null}>
          <CardContent {...props} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>

      {contextLost && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="text-center px-6">
            <div className="animate-spin h-6 w-6 border-2 border-border border-t-primary rounded-full mx-auto mb-3" />
            <p className="text-foreground text-sm font-medium">3D view paused — restoring...</p>
            <p className="text-muted-foreground text-xs mt-1">Your device may be low on graphics memory.</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-muted-foreground text-sm mb-4">
          Drag to rotate • Scroll to zoom
        </p>
        <div className="flex gap-3 justify-center">
          {props.phone && (
            <a
              href={`tel:${props.phone}`}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2 text-sm font-medium transition-colors"
            >
              Call
            </a>
          )}
          {props.email && (
            <a
              href={`mailto:${props.email}`}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-2 text-sm font-medium transition-colors"
            >
              Email
            </a>
          )}
          {props.linkedin && (
            <a
              href={props.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-700 hover:bg-blue-800 text-white rounded-full px-6 py-2 text-sm font-medium transition-colors"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
