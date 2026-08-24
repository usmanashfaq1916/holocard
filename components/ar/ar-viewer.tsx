"use client";

import { useState, useRef, useCallback, Suspense } from "react";
import { ARView, ARAnchor } from "r3f-mind-ar";
import type { ARViewHandle } from "r3f-mind-ar";
import { Canvas } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import { useAR } from "r3f-mind-ar";
import {
  ARInstructions,
  ARLoading,
  ARErrorScreen,
  ARStatusOverlay,
} from "./ar-ui";
import { detectARSupport, AR_ERRORS } from "@/lib/ar/ar-types";
import { trackAREvent, useARSession } from "@/lib/ar/analytics";

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
}

type ViewerState =
  | "instructions"
  | "loading"
  | "ar"
  | "error"
  | "fallback-3d"
  | "digital";

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
  onInteraction: (type: string, url?: string) => void;
}) {
  const { isTracking } = useAR();

  return (
    <ARAnchor
      target={0}
      lerp={0.15}
      onAnchorFound={() => {}}
      onAnchorLost={() => {}}
    >
      {/* Floating card base */}
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

      {/* Name */}
      <Text
        position={[0, 0.4, 0.03]}
        fontSize={0.18}
        color="#1a1a1a"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        font="/fonts/Inter-Bold.ttf"
      >
        {name}
      </Text>

      {/* Designation */}
      {designation && (
        <Text
          position={[0, 0.15, 0.03]}
          fontSize={0.09}
          color="#666666"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {designation}
          {company ? ` at ${company}` : ""}
        </Text>
      )}

      {/* Divider */}
      <mesh position={[0, -0.02, 0.03]}>
        <planeGeometry args={[1.5, 0.002]} />
        <meshBasicMaterial color="#e2e8f0" />
      </mesh>

      {/* Floating action buttons */}
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

      {/* Contact buttons row */}
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

      {/* HoloCard branding */}
      <Text
        position={[0, -0.85, 0.03]}
        fontSize={0.04}
        color="#94A3B8"
        anchorX="center"
      >
        Powered by HoloCard
      </Text>
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
      trackEvent("CAMERA_STARTED");
    }, 500);
  }, [trackEvent]);

  const handleAnchorFound = useCallback(() => {
    setTargetFound(true);
    trackEvent("TARGET_DETECTED");
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
            onInteraction={handleInteraction}
          />
        </ARView>

        <ARStatusOverlay isTracking={true} targetFound={targetFound} />

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
