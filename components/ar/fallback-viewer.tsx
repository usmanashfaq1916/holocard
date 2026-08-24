"use client";

import { Canvas } from "@react-three/fiber";
import { RoundedBox, Text, OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";

interface FallbackViewerProps {
  name: string;
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
  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Canvas camera={{ position: [0, 0, 5], fov: 42 }} gl={{ antialias: true, alpha: true }}>
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

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-white/60 text-sm mb-4">
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
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 text-sm font-medium transition-colors"
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
