"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";

const steps = {
  scan: {
    title: "Scan or tap",
    body: "Point any phone camera at the QR code, or tap an NFC-enabled card. The 3D card loads straight in the browser \u2014 nobody needs to install anything.",
    hint: "move your cursor over the card",
  },
  tilt: {
    title: "Tilt to explore",
    body: "The card responds to real movement \u2014 on a phone it reads the gyroscope, right here it follows your cursor. Foil, depth, and light shift as you move.",
    hint: "try moving your cursor around the card",
  },
  flip: {
    title: "Tap for details",
    body: "A tap flips the card to reveal contact info, links, and portfolio pieces \u2014 all without leaving the page it was shared on.",
    hint: "click the card to flip it",
  },
  save: {
    title: "Save instantly",
    body: "One tap saves the contact straight to a phone \u2014 no typing a number in by hand, no photographing a paper card and hoping you transcribe it right.",
    hint: 'click "Save contact" on the back of the card',
  },
} as const;

type StepKey = keyof typeof steps;

export function ARWalkthroughCard() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [activeStep, setActiveStep] = useState<StepKey>("scan");
  const [showToast, setShowToast] = useState(false);
  const angleRef = useRef(0);

  const applyTilt = useCallback((px: number, py: number, rect: DOMRect) => {
    const relX = (px - rect.left) / rect.width;
    const relY = (py - rect.top) / rect.height;
    const rotateY = (relX - 0.5) * 24;
    const rotateX = (0.5 - relY) * 18;
    const scene = sceneRef.current;
    if (!scene) return;
    scene.style.setProperty("--mx", `${relX * 100}%`);
    scene.style.setProperty("--my", `${relY * 100}%`);
    scene.querySelectorAll<HTMLElement>(".card-face").forEach((face) => {
      const isBack = face.classList.contains("card-back");
      face.style.transform = isBack
        ? `rotateY(${flipped ? 360 + rotateY : 180 + rotateY}deg) rotateX(${rotateX}deg)`
        : `rotateY(${flipped ? 180 + rotateY : rotateY}deg) rotateX(${rotateX}deg)`;
    });
  }, [flipped]);

  const resetTilt = useCallback(() => {
    sceneRef.current?.querySelectorAll<HTMLElement>(".card-face").forEach((face) => {
      face.style.transform = "";
    });
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const onMove = (e: MouseEvent) => applyTilt(e.clientX, e.clientY, scene.getBoundingClientRect());
    const onLeave = () => resetTilt();
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      applyTilt(t.clientX, t.clientY, scene.getBoundingClientRect());
    };

    scene.addEventListener("mousemove", onMove);
    scene.addEventListener("mouseleave", onLeave);
    scene.addEventListener("touchmove", onTouchMove, { passive: true });
    scene.addEventListener("touchend", resetTilt);

    return () => {
      scene.removeEventListener("mousemove", onMove);
      scene.removeEventListener("mouseleave", onLeave);
      scene.removeEventListener("touchmove", onTouchMove);
      scene.removeEventListener("touchend", resetTilt);
    };
  }, [applyTilt, resetTilt]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf: number;
    const animate = () => {
      angleRef.current = (angleRef.current + 0.15) % 360;
      sceneRef.current?.style.setProperty("--angle", `${angleRef.current}deg`);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleStep = (name: StepKey) => {
    setActiveStep(name);
    if (name === "flip" && !flipped) {
      setFlipped(true);
    } else if (name === "scan" || name === "tilt") {
      setFlipped(false);
    }
  };

  const handleCardClick = () => {
    if (flipped) {
      setFlipped(false);
      setActiveStep("tilt");
    } else {
      setFlipped(true);
      setActiveStep("flip");
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveStep("save");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  const step = steps[activeStep];

  return (
    <div className="walkthrough-wrap">
      {/* Brand */}
      <div className="walkthrough-brand">
        <span className="walkthrough-brand-mark" aria-hidden="true" />
        HoloCard
      </div>

      {/* Hero */}
      <div className="walkthrough-hero">
        <h1>
          Your card, <span>alive.</span>
        </h1>
        <p>Scan it. Tilt it. Flip it. No app to download — just a card that responds like nothing on paper ever could.</p>
      </div>

      {/* 3D Card Stage */}
      <div className="walkthrough-stage">
        <div
          ref={sceneRef}
          className={`card-scene ${flipped ? "flipped" : ""}`}
          role="img"
          aria-label="Interactive demo business card — move your cursor to tilt it"
          onClick={handleCardClick}
        >
          <div className="card-face card-front">
            <div className="foil-sheen" aria-hidden="true" />
            <div>
              <div className="walkthrough-kicker">Product Designer</div>
              <div className="walkthrough-card-name">Alex Rivera</div>
              <div className="walkthrough-title">Studio Nine — Brand &amp; Interaction</div>
            </div>
            <div className="walkthrough-kicker">{step.hint}</div>
          </div>
          <div className="card-face card-back">
            <div className="foil-sheen" aria-hidden="true" />
            <div className="walkthrough-card-name" style={{ fontSize: "16px" }}>Contact</div>
            <div className="walkthrough-back-row">alex@studionine.co</div>
            <div className="walkthrough-back-row">studionine.co/alex</div>
            <button className="walkthrough-save-btn" onClick={handleSave}>Save contact</button>
          </div>
        </div>
      </div>

      {/* Steps Navigation */}
      <div className="walkthrough-steps" role="tablist" aria-label="Demo steps">
        {(["scan", "tilt", "flip", "save"] as StepKey[]).map((key, i) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeStep === key}
            className={`walkthrough-step-btn ${activeStep === key ? "active" : ""}`}
            onClick={() => handleStep(key)}
          >
            <span className="walkthrough-step-num">{String(i + 1).padStart(2, "0")}</span>
            {steps[key].title}
          </button>
        ))}
      </div>

      {/* Step Panel */}
      <div className="walkthrough-panel">
        <h3>{step.title}</h3>
        <p>{step.body}</p>
      </div>

      {/* CTA */}
      <div className="walkthrough-cta">
        <p>This is a live demo, running on this page — not a video.</p>
        <Link href="https://holocard-fawn.vercel.app" target="_blank" rel="noopener" className="walkthrough-cta-btn">
          Try HoloCard free →
        </Link>
      </div>

      {/* Toast */}
      <div className={`walkthrough-toast ${showToast ? "show" : ""}`}>Saved to contacts</div>
    </div>
  );
}
