"use client";

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Undo2,
  Redo2,
  Download,
  Type,
  Square,
  Minus,
  Image as ImageIcon,
  Trash2,
  FlipHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import type { FabricCanvasHandle } from "./FabricCanvas";
import { CARD_TEMPLATES } from "@/lib/card-templates";

const FabricCanvas = dynamic(() => import("./FabricCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-[1050px] h-[600px] bg-slate-100 rounded-lg animate-pulse flex items-center justify-center">
      <span className="text-slate-400">Loading canvas...</span>
    </div>
  ),
});

interface CardDesignerProps {
  cardId: string;
  cardData?: Record<string, string>;
  onSave?: (frontJson: string, backJson: string) => void;
}

export default function CardDesigner({ cardId, cardData, onSave }: CardDesignerProps) {
  const frontCanvasRef = useRef<FabricCanvasHandle>(null);
  const backCanvasRef = useRef<FabricCanvasHandle>(null);
  const [activeSide, setActiveSide] = useState<"FRONT" | "BACK">("FRONT");
  const [selectedTemplate, setSelectedTemplate] = useState("centered");
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const handleAddText = useCallback(() => {
    const ref = activeSide === "FRONT" ? frontCanvasRef : backCanvasRef;
    ref.current?.addText("New Text", { fontSize: 18, fill: "#000000" });
  }, [activeSide]);

  const handleAddRect = useCallback(() => {
    const ref = activeSide === "FRONT" ? frontCanvasRef : backCanvasRef;
    ref.current?.addRect();
  }, [activeSide]);

  const handleAddLine = useCallback(() => {
    const ref = activeSide === "FRONT" ? frontCanvasRef : backCanvasRef;
    ref.current?.addLine();
  }, [activeSide]);

  const handleDelete = useCallback(() => {
    const ref = activeSide === "FRONT" ? frontCanvasRef : backCanvasRef;
    ref.current?.deleteSelected();
  }, [activeSide]);

  const handleUndo = useCallback(() => {
    const ref = activeSide === "FRONT" ? frontCanvasRef : backCanvasRef;
    ref.current?.undo();
    updateHistoryState();
  }, [activeSide]);

  const handleRedo = useCallback(() => {
    const ref = activeSide === "FRONT" ? frontCanvasRef : backCanvasRef;
    ref.current?.redo();
    updateHistoryState();
  }, [activeSide]);

  const updateHistoryState = useCallback(() => {
    const ref = activeSide === "FRONT" ? frontCanvasRef : backCanvasRef;
    setCanUndo(ref.current?.canUndo() ?? false);
    setCanRedo(ref.current?.canRedo() ?? false);
  }, [activeSide]);

  const handleExport = useCallback(() => {
    const ref = activeSide === "FRONT" ? frontCanvasRef : backCanvasRef;
    const dataUrl = ref.current?.exportPNG(3);
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.download = `holocard-${activeSide.toLowerCase()}.png`;
    link.href = dataUrl;
    link.click();
    toast.success(`${activeSide} exported as PNG`);
  }, [activeSide]);

  const handleSave = useCallback(async () => {
    const frontJson = frontCanvasRef.current?.exportJSON() ?? "";
    const backJson = backCanvasRef.current?.exportJSON() ?? "";
    onSave?.(frontJson, backJson);
    toast.success("Card design saved");
  }, [onSave]);

  const handleTemplateChange = useCallback(
    async (style: string) => {
      setSelectedTemplate(style);
      const template = CARD_TEMPLATES[style];
      if (!template) return;

      const ref = activeSide === "FRONT" ? frontCanvasRef : backCanvasRef;
      await ref.current?.clear();

      for (const el of template.elements) {
        if (el.type === "text" && el.fieldName && cardData?.[el.fieldName]) {
          ref.current?.addText(cardData[el.fieldName], {
            left: el.left,
            top: el.top,
            fontSize: el.fontSize,
            fontFamily: el.fontFamily,
            fill: el.fill,
            fontWeight: el.fontWeight,
            textAlign: el.textAlign,
            width: 400,
            originX: "center",
          });
        } else if (el.type === "text") {
          ref.current?.addText(el.label, {
            left: el.left,
            top: el.top,
            fontSize: el.fontSize,
            fontFamily: el.fontFamily,
            fill: el.fill,
            fontWeight: el.fontWeight,
            textAlign: el.textAlign,
            width: 400,
            originX: "center",
          });
        } else if (el.type === "line") {
          ref.current?.addLine({
            left: el.left,
            top: el.top,
            stroke: el.fill || "#e2e8f0",
          });
        } else if (el.type === "shape") {
          ref.current?.addRect({
            left: el.left,
            top: el.top,
            width: el.width || 100,
            height: el.height || 50,
            fill: el.fill || "#2563EB",
          });
        }
      }
      toast.success(`Applied "${template.name}" template`);
    },
    [activeSide, cardData]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={activeSide === "FRONT" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSide("FRONT")}
          >
            <FlipHorizontal className="w-4 h-4 mr-1" />
            Front
          </Button>
          <Button
            variant={activeSide === "BACK" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSide("BACK")}
          >
            <FlipHorizontal className="w-4 h-4 mr-1" />
            Back
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={handleUndo} disabled={!canUndo}>
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleRedo} disabled={!canRedo}>
            <Redo2 className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Button variant="outline" size="sm" onClick={handleAddText}>
            <Type className="w-4 h-4 mr-1" />
            Text
          </Button>
          <Button variant="outline" size="sm" onClick={handleAddRect}>
            <Square className="w-4 h-4 mr-1" />
            Shape
          </Button>
          <Button variant="outline" size="sm" onClick={handleAddLine}>
            <Minus className="w-4 h-4 mr-1" />
            Line
          </Button>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 overflow-auto flex justify-center">
          <div className={activeSide === "FRONT" ? "block" : "hidden"}>
            <FabricCanvas
              ref={frontCanvasRef}
              cardData={cardData}
              onChange={updateHistoryState}
            />
          </div>
          <div className={activeSide === "BACK" ? "block" : "hidden"}>
            <FabricCanvas
              ref={backCanvasRef}
              backgroundColor="#ffffff"
              onChange={updateHistoryState}
            />
          </div>
        </div>

        <div className="w-64 space-y-4">
          <div className="border rounded-lg p-3">
            <h4 className="text-sm font-medium mb-2">Template</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(CARD_TEMPLATES).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => handleTemplateChange(key)}
                  className={`p-2 rounded border text-xs text-center transition-colors ${
                    selectedTemplate === key
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-3">
            <h4 className="text-sm font-medium mb-2">Card Data</h4>
            <p className="text-xs text-slate-500">
              Text fields are populated from your card profile. Edit them in the card settings.
            </p>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Design
          </Button>
          <Button onClick={handleExport} variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-1" />
            Export PNG
          </Button>
        </div>
      </div>
    </div>
  );
}
