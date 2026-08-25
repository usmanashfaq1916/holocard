"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { ARView, ARAnchor } from "r3f-mind-ar";
import type { ARViewHandle } from "r3f-mind-ar";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import { useAR } from "r3f-mind-ar";
import * as THREE from "three";
import {
  ARInstructions,
  ARLoading,
  ARErrorScreen,
  ARStatusOverlay,
} from "./ar-ui";
import { detectARSupport, AR_ERRORS } from "@/lib/ar/ar-types";
import { useARSession } from "@/lib/ar/analytics";
import { DataAnalystScene } from "./scenes/data-analyst-scene";
import { sanitize } from "@/lib/sanitize";

const Fallback3DViewer = dynamic(() => import("./fallback-viewer"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  ),
});

interface ARElementData {
  id?: string;
  type: string;
  assetUrl?: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  visible: boolean;
  animation?: { type: string; duration: number; delay: number };
  metadata?: Record<string, unknown>;
  order: number;
  actions?: { type: string; payload?: Record<string, unknown>; label?: string }[];
}

interface ARSceneData {
  id?: string;
  name: string;
  order: number;
  duration: number;
  transitionType: string;
  elements: ARElementData[];
}

interface ARViewerProps {
  cardSlug: string;
  cardName: string;
  cardDesignation?: string;
  cardCompany?: string;
  mindFileUrl: string;
  socialLinks?: { platform: string; url: string }[];
  buttons?: { label: string; url: string }[];
  phone?: string;
  email?: string;
  whatsapp?: string;
  website?: string;
  linkedin?: string;
  profileImage?: string;
  templateType?: string;
  scenes?: ARSceneData[];
}

type ViewerState =
  | "instructions"
  | "loading"
  | "ar"
  | "error"
  | "fallback-3d"
  | "digital";

function AnimatedGroup({
  visible,
  delay,
  children,
  liftY = 0.08,
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
    const t = visible ? Math.min(Math.max((elapsed - delay) / 0.5, 0), 1) : 0;
    const ease = t * t * (3 - 2 * t);
    ref.current.visible = t > 0.001;
    ref.current.position.y = THREE.MathUtils.lerp(-liftY, 0, ease);
    ref.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshPhysicalMaterial | THREE.MeshBasicMaterial;
        if ("opacity" in mat) {
          mat.transparent = true;
          mat.opacity = ease;
        }
      }
    });
  });

  return (
    <group ref={ref}>
      {children}
    </group>
  );
}

function VideoElement({ url, position, scale, loop = true }: {
  url: string;
  position: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  loop?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = url;
    video.crossOrigin = "anonymous";
    video.loop = loop;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    videoRef.current = video;

    video.play().catch(() => {});

    const tex = new THREE.VideoTexture(video);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    setTexture(tex);

    return () => {
      video.pause();
      video.src = "";
      tex.dispose();
    };
  }, [url, loop]);

  if (!texture) return null;

  return (
    <mesh position={[position.x, position.y, position.z]} scale={[scale.x, scale.y, scale.z]}>
      <planeGeometry args={[1.6, 0.9]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function ImageElement({ url, position, scale }: {
  url: string;
  position: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(url);
    setTexture(tex);
    return () => tex.dispose();
  }, [url]);

  if (!texture) return null;

  return (
    <mesh position={[position.x, position.y, position.z]} scale={[scale.x, scale.y, scale.z]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} transparent />
    </mesh>
  );
}

function SceneElement({ element, onAction }: {
  element: ARElementData;
  onAction?: (type: string, url?: string) => void;
}) {
  if (!element.visible) return null;

  const handleClick = () => {
    if (element.actions?.length && onAction) {
      const action = element.actions[0];
      onAction(action.type, action.payload?.url as string || action.payload?.href as string);
    }
  };

  switch (element.type) {
    case "VIDEO":
      return (
        <group onClick={handleClick}>
          <VideoElement
            url={element.assetUrl || ""}
            position={element.position}
            scale={element.scale}
          />
        </group>
      );
    case "IMAGE":
      return (
        <group onClick={handleClick}>
          <ImageElement
            url={element.assetUrl || ""}
            position={element.position}
            scale={element.scale}
          />
        </group>
      );
    case "TEXT": {
      const text = (element.metadata?.text as string) || "Text";
      const fontSize = (element.metadata?.fontSize as number) || 0.08;
      const color = (element.metadata?.color as string) || "#ffffff";
      return (
        <group onClick={handleClick}>
          <Text
            position={[element.position.x, element.position.y, element.position.z]}
            fontSize={fontSize}
            color={color}
            anchorX="center"
            anchorY="middle"
            rotation={[element.rotation.x, element.rotation.y, element.rotation.z]}
            scale={[element.scale.x, element.scale.y, element.scale.z]}
          >
            {sanitize(text)}
          </Text>
        </group>
      );
    }
    case "BUTTON": {
      const label = (element.metadata?.label as string) || "Button";
      const bgColor = (element.metadata?.bgColor as string) || "#2563EB";
      return (
        <group
          position={[element.position.x, element.position.y, element.position.z]}
          scale={[element.scale.x, element.scale.y, element.scale.z]}
          onClick={handleClick}
        >
          <RoundedBox args={[0.5, 0.2, 0.02]} radius={0.04}>
            <meshPhysicalMaterial color={bgColor} metalness={0.2} roughness={0.4} />
          </RoundedBox>
          <Text position={[0, 0, 0.02]} fontSize={0.06} color="white" anchorX="center">
            {sanitize(label)}
          </Text>
        </group>
      );
    }
    case "3D":
    case "AUDIO":
    default:
      return null;
  }
}

function ARSceneContent({
  name,
  designation,
  company,
  socialLinks,
  buttons,
  phone,
  email,
  whatsapp,
  website,
  linkedin,
  targetFound,
  templateType,
  scenes,
  onInteraction,
}: {
  name: string;
  designation?: string;
  company?: string;
  socialLinks?: { platform: string; url: string }[];
  buttons?: { label: string; url: string }[];
  phone?: string;
  email?: string;
  whatsapp?: string;
  website?: string;
  linkedin?: string;
  targetFound: boolean;
  templateType?: string;
  scenes?: ARSceneData[];
  onInteraction: (type: string, url?: string) => void;
}) {
  useAR();

  if (templateType === "DATA_ANALYST") {
    return <DataAnalystScene onInteraction={onInteraction} />;
  }

  const firstScene = scenes?.[0];
  const hasCustomElements = firstScene?.elements?.length;

  return (
    <ARAnchor
      target={0}
      lerp={0.15}
      onAnchorFound={() => {}}
      onAnchorLost={() => {}}
    >
      {/* Custom scene elements from builder */}
      {hasCustomElements ? (
        <AnimatedGroup visible={targetFound} delay={0.3}>
          {firstScene.elements.map((el) => (
            <SceneElement key={el.id || el.order} element={el} onAction={onInteraction} />
          ))}
        </AnimatedGroup>
      ) : (
        <>
          {/* Default card layout */}
          <AnimatedGroup visible={targetFound} delay={1.2} liftY={0.2}>
            <RoundedBox args={[2.5, 1.4, 0.04]} position={[0, 0, 0]} radius={0.06}>
              <meshPhysicalMaterial
                color="#ffffff"
                metalness={0.1}
                roughness={0.3}
                clearcoat={0.8}
                clearcoatRoughness={0.2}
                opacity={0.95}
                transparent
              />
            </RoundedBox>
          </AnimatedGroup>

          <AnimatedGroup visible={targetFound} delay={0.3}>
            <Text
              position={[0, 0.4, 0.03]}
              fontSize={0.18}
              color="#1a1a1a"
              anchorX="center"
              anchorY="middle"
              maxWidth={2}
              font="/fonts/Inter-Bold.ttf"
            >
              {sanitize(name)}
            </Text>
          </AnimatedGroup>

          <AnimatedGroup visible={targetFound} delay={0.8}>
            {designation && (
              <Text
                position={[0, 0.15, 0.03]}
                fontSize={0.09}
                color="#666666"
                anchorX="center"
                anchorY="middle"
                maxWidth={2}
              >
                {sanitize(designation)}
                {company ? ` at ${sanitize(company)}` : ""}
              </Text>
            )}
            <mesh position={[0, -0.02, 0.03]}>
              <planeGeometry args={[1.5, 0.002]} />
              <meshBasicMaterial color="#e2e8f0" />
            </mesh>
          </AnimatedGroup>

          <AnimatedGroup visible={targetFound} delay={1.8}>
            <group position={[0, -0.35, 0.05]}>
              {linkedin && (
                <group
                  position={[-0.7, 0, 0]}
                  onClick={(e) => {
                    e.stopPropagation();
                    onInteraction("linkedin", linkedin);
                  }}
                >
                  <RoundedBox args={[0.35, 0.18, 0.02]} radius={0.04}>
                    <meshPhysicalMaterial color="#0A66C2" metalness={0.2} roughness={0.4} />
                  </RoundedBox>
                  <Text position={[0, 0, 0.02]} fontSize={0.05} color="white" anchorX="center">
                    LinkedIn
                  </Text>
                </group>
              )}
              {website && (
                <group
                  position={[0, 0, 0]}
                  onClick={(e) => {
                    e.stopPropagation();
                    onInteraction("website", website);
                  }}
                >
                  <RoundedBox args={[0.35, 0.18, 0.02]} radius={0.04}>
                    <meshPhysicalMaterial color="#2563EB" metalness={0.2} roughness={0.4} />
                  </RoundedBox>
                  <Text position={[0, 0, 0.02]} fontSize={0.05} color="white" anchorX="center">
                    Website
                  </Text>
                </group>
              )}
              {email && (
                <group
                  position={[0.7, 0, 0]}
                  onClick={(e) => {
                    e.stopPropagation();
                    onInteraction("email", `mailto:${email}`);
                  }}
                >
                  <RoundedBox args={[0.35, 0.18, 0.02]} radius={0.04}>
                    <meshPhysicalMaterial color="#059669" metalness={0.2} roughness={0.4} />
                  </RoundedBox>
                  <Text position={[0, 0, 0.02]} fontSize={0.05} color="white" anchorX="center">
                    Email
                  </Text>
                </group>
              )}
            </group>

            <group position={[0, -0.6, 0.05]}>
              {phone && (
                <group
                  position={[-0.5, 0, 0]}
                  onClick={(e) => {
                    e.stopPropagation();
                    onInteraction("phone", `tel:${phone}`);
                  }}
                >
                  <RoundedBox args={[0.28, 0.14, 0.02]} radius={0.03}>
                    <meshPhysicalMaterial color="#16A34A" metalness={0.2} roughness={0.4} />
                  </RoundedBox>
                  <Text position={[0, 0, 0.02]} fontSize={0.04} color="white" anchorX="center">
                    Call
                  </Text>
                </group>
              )}
              {whatsapp && (
                <group
                  position={[0, 0, 0]}
                  onClick={(e) => {
                    e.stopPropagation();
                    onInteraction("whatsapp", `https://wa.me/${whatsapp.replace(/\D/g, "")}`);
                  }}
                >
                  <RoundedBox args={[0.28, 0.14, 0.02]} radius={0.03}>
                    <meshPhysicalMaterial color="#25D366" metalness={0.2} roughness={0.4} />
                  </RoundedBox>
                  <Text position={[0, 0, 0.02]} fontSize={0.04} color="white" anchorX="center">
                    WhatsApp
                  </Text>
                </group>
              )}
              <group
                position={[0.5, 0, 0]}
                onClick={(e) => {
                  e.stopPropagation();
                  onInteraction("save-contact");
                }}
              >
                <RoundedBox args={[0.28, 0.14, 0.02]} radius={0.03}>
                  <meshPhysicalMaterial color="#7C3AED" metalness={0.2} roughness={0.4} />
                </RoundedBox>
                <Text position={[0, 0, 0.02]} fontSize={0.04} color="white" anchorX="center">
                  Save
                </Text>
              </group>
            </group>

            <Text
              position={[0, -0.85, 0.03]}
              fontSize={0.04}
              color="#94A3B8"
              anchorX="center"
            >
              Powered by HoloCard
            </Text>
          </AnimatedGroup>
        </>
      )}
    </ARAnchor>
  );
}

function generateVCard(data: {
  name: string;
  designation?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
}): string {
  const parts = data.name.split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ");

  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName};;;`,
    `FN:${data.name}`,
    data.designation ? `TITLE:${data.designation}` : "",
    data.company ? `ORG:${data.company}` : "",
    data.phone ? `TEL:${data.phone}` : "",
    data.email ? `EMAIL:${data.email}` : "",
    data.website ? `URL:${data.website}` : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export default function ARViewer(props: ARViewerProps) {
  const [state, setState] = useState<ViewerState>("instructions");
  const [arError, setArError] = useState<typeof AR_ERRORS.CAMERA_DENIED | null>(null);
  const [targetFound, setTargetFound] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [animPhase, setAnimPhase] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState("Checking AR support...");
  const arRef = useRef<ARViewHandle>(null);
  const { trackEvent } = useARSession(props.cardSlug);

  const handleStartAR = useCallback(() => {
    const support = detectARSupport();
    if (!support.supported) {
      setArError(support.error || AR_ERRORS.UNSUPPORTED_BROWSER);
      setState("error");
      return;
    }

    setState("loading");
    setLoadingProgress("Starting camera...");
    trackEvent("AR_PAGE_OPENED");

    setTimeout(() => {
      setState("ar");
      setIsTracking(true);
      trackEvent("CAMERA_STARTED");
    }, 500);
  }, [trackEvent]);

  const handleAnchorFound = useCallback(() => {
    setTargetFound(true);
    setAnimPhase(0);
    trackEvent("TARGET_DETECTED");
    setTimeout(() => setAnimPhase(1), 300);
    setTimeout(() => setAnimPhase(2), 800);
    setTimeout(() => setAnimPhase(3), 1800);
    setTimeout(() => {
      trackEvent("AR_EXPERIENCE_STARTED");
    }, 2000);
  }, [trackEvent]);

  const handleInteraction = useCallback(
    (type: string, url?: string) => {
      trackEvent("AR_INTERACTION", { type });
      trackEvent("CTA_CLICK", { type });

      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    },
    [trackEvent]
  );

  const handleSaveContact = useCallback(() => {
    const vcard = generateVCard({
      name: props.cardName,
      designation: props.cardDesignation,
      company: props.cardCompany,
      phone: props.phone,
      email: props.email,
      website: props.website,
    });

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${props.cardName.replace(/\s+/g, "-")}.vcf`;
    link.click();
    URL.revokeObjectURL(url);
    trackEvent("AR_INTERACTION", { type: "save-contact" });
  }, [props, trackEvent]);

  if (state === "instructions") {
    return (
      <ARInstructions
        onStart={handleStartAR}
        onView3D={() => setState("fallback-3d")}
        onViewDigital={() => (window.location.href = `/card/${props.cardSlug}`)}
        cardName={props.cardName}
      />
    );
  }

  if (state === "loading") {
    return <ARLoading progress={loadingProgress} />;
  }

  if (state === "error" && arError) {
    return (
      <ARErrorScreen
        error={arError}
        onRetry={handleStartAR}
        onView3D={() => setState("fallback-3d")}
      />
    );
  }

  if (state === "fallback-3d") {
    return (
      <Fallback3DViewer
        name={props.cardName}
        cardSlug={props.cardSlug}
        designation={props.cardDesignation}
        company={props.cardCompany}
        phone={props.phone}
        email={props.email}
        website={props.website}
        linkedin={props.linkedin}
        whatsapp={props.whatsapp}
      />
    );
  }

  if (state === "ar") {
    return (
      <div className="relative w-full h-screen">
        <ARView
          ref={arRef}
          imageTargets={props.mindFileUrl}
          maxTrack={1}
          autoplay={true}
          flipUserCamera={false}
          onReady={() => setLoadingProgress("Ready!")}
          onError={(err) => {
            setArError({
              code: "TRACKING_FAILED",
              message: "AR tracking failed",
              suggestion: err.message,
            });
            setState("error");
          }}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-3, 3, 2]} intensity={0.5} color="#60A5FA" />

          <ARSceneContent
            name={props.cardName}
            designation={props.cardDesignation}
            company={props.cardCompany}
            socialLinks={props.socialLinks}
            buttons={props.buttons}
            phone={props.phone}
            email={props.email}
            whatsapp={props.whatsapp}
            website={props.website}
            linkedin={props.linkedin}
            targetFound={targetFound}
            templateType={props.templateType}
            scenes={props.scenes}
            onInteraction={handleInteraction}
          />
        </ARView>

        <ARStatusOverlay isTracking={isTracking} targetFound={targetFound} animPhase={animPhase} />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50">
          <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm font-medium">
            {props.cardName}
          </div>
          <button
            onClick={() => setState("fallback-3d")}
            className="bg-black/50 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm hover:bg-black/70 transition-colors"
          >
            View in 3D
          </button>
        </div>

        {/* Bottom bar with contact actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-50">
          <div className="flex justify-center gap-2">
            {props.phone && (
              <a
                href={`tel:${props.phone}`}
                onClick={() => trackEvent("CTA_CLICK", { type: "phone" })}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4 py-2 text-sm font-medium transition-colors"
              >
                Call
              </a>
            )}
            {props.email && (
              <a
                href={`mailto:${props.email}`}
                onClick={() => trackEvent("CTA_CLICK", { type: "email" })}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 text-sm font-medium transition-colors"
              >
                Email
              </a>
            )}
            {props.whatsapp && (
              <a
                href={`https://wa.me/${props.whatsapp.replace(/\D/g, "")}`}
                onClick={() => trackEvent("CTA_CLICK", { type: "whatsapp" })}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2 text-sm font-medium transition-colors"
              >
                WhatsApp
              </a>
            )}
            <button
              onClick={handleSaveContact}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-4 py-2 text-sm font-medium transition-colors"
            >
              Save Contact
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
