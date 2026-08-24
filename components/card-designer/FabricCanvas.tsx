"use client";

import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import { HistoryManager } from "@/hooks/useHistory";

export interface FabricCanvasHandle {
  getCanvas: () => import("fabric").Canvas | null;
  addText: (text: string, options?: Record<string, unknown>) => void;
  addImage: (url: string) => void;
  addRect: (options?: Record<string, unknown>) => void;
  addLine: (options?: Record<string, unknown>) => void;
  deleteSelected: () => void;
  undo: () => boolean;
  redo: () => boolean;
  canUndo: () => boolean;
  canRedo: () => boolean;
  exportPNG: (multiplier?: number) => string;
  exportJSON: () => string;
  loadFromJSON: (json: string) => Promise<void>;
  clear: () => void;
}

interface FabricCanvasProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  cardData?: Record<string, string>;
  onChange?: () => void;
}

const FabricCanvas = forwardRef<FabricCanvasHandle, FabricCanvasProps>(
  ({ width = 1050, height = 600, backgroundColor = "#ffffff", cardData, onChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<import("fabric").Canvas | null>(null);
    const historyRef = useRef<HistoryManager | null>(null);

    const initCanvas = useCallback(async () => {
      if (!canvasRef.current || fabricRef.current) return;

      const { Canvas, Textbox, Rect, Line } = await import("fabric");

      const canvas = new Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor,
        selection: true,
      });

      fabricRef.current = canvas;
      historyRef.current = new HistoryManager(canvas);

      canvas.on("selection:created", () => onChange?.());
      canvas.on("selection:updated", () => onChange?.());
      canvas.on("selection:cleared", () => onChange?.());

      // Add default elements
      const nameText = new Textbox(cardData?.name || "Your Name", {
        left: width / 2,
        top: 120,
        fontSize: 36,
        fontFamily: "Arial",
        fill: "#1a1a1a",
        fontWeight: "bold",
        textAlign: "center",
        originX: "center",
        width: 400,
        name: "name",
      });

      const titleText = new Textbox(cardData?.designation || "Your Title", {
        left: width / 2,
        top: 175,
        fontSize: 18,
        fontFamily: "Arial",
        fill: "#666666",
        textAlign: "center",
        originX: "center",
        width: 400,
        name: "designation",
      });

      const companyText = new Textbox(cardData?.company || "Company", {
        left: width / 2,
        top: 210,
        fontSize: 16,
        fontFamily: "Arial",
        fill: "#999999",
        textAlign: "center",
        originX: "center",
        width: 400,
        name: "company",
      });

      const divider = new Line([375, 250, 675, 250], {
        stroke: "#e2e8f0",
        strokeWidth: 1,
      });

      const phoneText = new Textbox(cardData?.phone || "+1 (555) 123-4567", {
        left: width / 2,
        top: 280,
        fontSize: 14,
        fontFamily: "Arial",
        fill: "#555555",
        textAlign: "center",
        originX: "center",
        width: 400,
        name: "phone",
      });

      const emailText = new Textbox(cardData?.email || "email@example.com", {
        left: width / 2,
        top: 310,
        fontSize: 14,
        fontFamily: "Arial",
        fill: "#555555",
        textAlign: "center",
        originX: "center",
        width: 400,
        name: "email",
      });

      const websiteText = new Textbox(cardData?.website || "https://example.com", {
        left: width / 2,
        top: 340,
        fontSize: 14,
        fontFamily: "Arial",
        fill: "#2563EB",
        textAlign: "center",
        originX: "center",
        width: 400,
        name: "website",
      });

      const qrPlaceholder = new Rect({
        left: width - 180,
        top: height - 170,
        width: 120,
        height: 120,
        fill: "#f1f5f9",
        stroke: "#e2e8f0",
        strokeWidth: 1,
        rx: 8,
        ry: 8,
      });

      canvas.add(nameText, titleText, companyText, divider, phoneText, emailText, websiteText, qrPlaceholder);
      canvas.renderAll();
    }, [width, height, backgroundColor, cardData, onChange]);

    useEffect(() => {
      initCanvas();
      return () => {
        fabricRef.current?.dispose();
        fabricRef.current = null;
      };
    }, [initCanvas]);

    useImperativeHandle(ref, () => ({
      getCanvas: () => fabricRef.current,
      addText: async (text, options = {}) => {
        const { Textbox } = await import("fabric");
        const canvas = fabricRef.current;
        if (!canvas) return;
        const obj = new Textbox(text, {
          left: width / 2,
          top: height / 2,
          fontSize: 18,
          fontFamily: "Arial",
          fill: "#000000",
          textAlign: "center",
          originX: "center",
          width: 300,
          ...options,
        });
        canvas.add(obj);
        canvas.setActiveObject(obj);
        canvas.renderAll();
      },
      addImage: async (url) => {
        const { FabricImage } = await import("fabric");
        const canvas = fabricRef.current;
        if (!canvas) return;
        const img = await FabricImage.fromURL(url);
        img.scaleToWidth(150);
        img.set({ left: width / 2, top: height / 2, originX: "center", originY: "center" });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      },
      addRect: async (options = {}) => {
        const { Rect } = await import("fabric");
        const canvas = fabricRef.current;
        if (!canvas) return;
        const rect = new Rect({
          left: width / 2 - 50,
          top: height / 2 - 25,
          width: 100,
          height: 50,
          fill: "#2563EB",
          rx: 8,
          ry: 8,
          ...options,
        });
        canvas.add(rect);
        canvas.setActiveObject(rect);
        canvas.renderAll();
      },
      addLine: async (options = {}) => {
        const { Line } = await import("fabric");
        const canvas = fabricRef.current;
        if (!canvas) return;
        const line = new Line([200, height / 2, 600, height / 2], {
          stroke: "#e2e8f0",
          strokeWidth: 1,
          ...options,
        });
        canvas.add(line);
        canvas.setActiveObject(line);
        canvas.renderAll();
      },
      deleteSelected: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const active = canvas.getActiveObjects();
        active.forEach((obj) => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.renderAll();
      },
      undo: () => historyRef.current?.undo() ?? false,
      redo: () => historyRef.current?.redo() ?? false,
      canUndo: () => historyRef.current?.canUndo() ?? false,
      canRedo: () => historyRef.current?.canRedo() ?? false,
      exportPNG: (multiplier = 2) => {
        const canvas = fabricRef.current;
        if (!canvas) return "";
        return canvas.toDataURL({ format: "png", quality: 1, multiplier });
      },
      exportJSON: () => {
        const canvas = fabricRef.current;
        if (!canvas) return "";
        return JSON.stringify(canvas.toJSON());
      },
      loadFromJSON: (json) => {
        const canvas = fabricRef.current;
        if (!canvas) return Promise.resolve();
        return new Promise((resolve) => {
          canvas.loadFromJSON(json, () => {
            canvas.renderAll();
            resolve();
          });
        });
      },
      clear: () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        canvas.clear();
        canvas.backgroundColor = backgroundColor;
        canvas.renderAll();
      },
    }));

    return (
      <canvas
        ref={canvasRef}
        className="border border-slate-200 rounded-lg shadow-sm"
      />
    );
  }
);

FabricCanvas.displayName = "FabricCanvas";
export default FabricCanvas;
