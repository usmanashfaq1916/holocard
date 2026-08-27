"use client";

import { useState, useCallback } from "react";
import {
  Plus,
  Trash2,
  Copy,
  MoveUp,
  MoveDown,
  Type,
  Image,
  Video,
  Box,
  MousePointerClick,
  Volume2,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ARElement {
  id: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "THREE_D" | "BUTTON" | "AUDIO";
  label: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  visible: boolean;
  animation?: {
    type: string;
    duration: number;
    delay: number;
  };
  metadata: Record<string, unknown>;
  order: number;
}

interface ARBuilderProps {
  elements: ARElement[];
  onChange: (elements: ARElement[]) => void;
}

const ELEMENT_TYPES = [
  { type: "TEXT" as const, icon: Type, label: "Text" },
  { type: "IMAGE" as const, icon: Image, label: "Image" },
  { type: "VIDEO" as const, icon: Video, label: "Video" },
  { type: "THREE_D" as const, icon: Box, label: "3D Model" },
  { type: "BUTTON" as const, icon: MousePointerClick, label: "Button" },
  { type: "AUDIO" as const, icon: Volume2, label: "Audio" },
];

const ANIMATIONS = [
  { value: "fade-in", label: "Fade In" },
  { value: "scale-in", label: "Scale In" },
  { value: "slide-in", label: "Slide In" },
  { value: "rotate", label: "Rotate" },
  { value: "float", label: "Float" },
  { value: "bounce", label: "Bounce" },
  { value: "pulse", label: "Pulse" },
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function ARBuilder({ elements, onChange }: ARBuilderProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<ARElement[][]>([elements]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const selectedElement = elements.find((el) => el.id === selectedId);

  const pushHistory = useCallback(
    (newElements: ARElement[]) => {
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), newElements]);
      setHistoryIndex((prev) => prev + 1);
      onChange(newElements);
    },
    [historyIndex, onChange]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      onChange(history[historyIndex - 1]);
    }
  }, [historyIndex, history, onChange]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      onChange(history[historyIndex + 1]);
    }
  }, [historyIndex, history, onChange]);

  const addElement = useCallback(
    (type: ARElement["type"]) => {
      const newElement: ARElement = {
        id: generateId(),
        type,
        label: `${type.charAt(0) + type.slice(1).toLowerCase()} Element`,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        visible: true,
        animation: { type: "fade-in", duration: 0.5, delay: elements.length * 0.3 },
        metadata: {},
        order: elements.length,
      };
      pushHistory([...elements, newElement]);
      setSelectedId(newElement.id);
    },
    [elements, pushHistory]
  );

  const updateElement = useCallback(
    (id: string, updates: Partial<ARElement>) => {
      pushHistory(
        elements.map((el) => (el.id === id ? { ...el, ...updates } : el))
      );
    },
    [elements, pushHistory]
  );

  const deleteElement = useCallback(
    (id: string) => {
      pushHistory(elements.filter((el) => el.id !== id));
      if (selectedId === id) setSelectedId(null);
    },
    [elements, selectedId, pushHistory]
  );

  const duplicateElement = useCallback(
    (id: string) => {
      const original = elements.find((el) => el.id === id);
      if (!original) return;
      const duplicate: ARElement = {
        ...original,
        id: generateId(),
        label: `${original.label} (copy)`,
        order: elements.length,
      };
      pushHistory([...elements, duplicate]);
    },
    [elements, pushHistory]
  );

  const moveElement = useCallback(
    (id: string, direction: "up" | "down") => {
      const idx = elements.findIndex((el) => el.id === id);
      if (idx === -1) return;
      const newElements = [...elements];
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= newElements.length) return;
      [newElements[idx], newElements[swapIdx]] = [newElements[swapIdx], newElements[idx]];
      newElements.forEach((el, i) => (el.order = i));
      pushHistory(newElements);
    },
    [elements, pushHistory]
  );

  const toggleVisibility = useCallback(
    (id: string) => {
      const el = elements.find((e) => e.id === id);
      if (el) updateElement(id, { visible: !el.visible });
    },
    [elements, updateElement]
  );

  return (
    <div className="flex h-[600px] border border-border rounded-xl overflow-hidden">
      {/* Elements Panel */}
      <div className="w-64 border-r border-border bg-muted/30 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Elements</h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex === 0} className="h-7 w-7">
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex === history.length - 1} className="h-7 w-7">
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {ELEMENT_TYPES.map((et) => (
            <Button
              key={et.type}
              variant="outline"
              size="sm"
              onClick={() => addElement(et.type)}
              className="h-auto py-2 flex-col gap-1"
            >
              <et.icon className="h-4 w-4" />
              <span className="text-xs">{et.label}</span>
            </Button>
          ))}
        </div>

        <div className="space-y-1">
          {elements.map((el) => (
            <div
              key={el.id}
              onClick={() => setSelectedId(el.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                selectedId === el.id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted"
              }`}
            >
              <span className="text-xs font-medium truncate flex-1">{el.label}</span>
              <button onClick={(e) => { e.stopPropagation(); toggleVisibility(el.id); }}>
                {el.visible ? <Eye className="h-3 w-3 text-muted-foreground" /> : <EyeOff className="h-3 w-3 text-muted-foreground/50" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-muted/10 flex items-center justify-center relative">
        <div className="w-80 h-48 border-2 border-dashed border-border rounded-xl relative">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            AR Preview
          </div>
          {elements.filter((el) => el.visible).map((el) => (
            <div
              key={el.id}
              onClick={() => setSelectedId(el.id)}
              className={`absolute px-2 py-1 text-xs rounded border cursor-pointer transition-all ${
                selectedId === el.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background/80 hover:border-primary/50"
              }`}
              style={{
                left: `${50 + el.position.x * 30}%`,
                top: `${50 + el.position.y * 30}%`,
                transform: `translate(-50%, -50%)`,
              }}
            >
              {el.label}
            </div>
          ))}
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-72 border-l border-border bg-muted/30 p-4 overflow-y-auto">
        <h3 className="text-sm font-semibold mb-4">Properties</h3>
        {selectedElement ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Label</Label>
              <Input
                value={selectedElement.label}
                onChange={(e) => updateElement(selectedElement.id, { label: e.target.value })}
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Position</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["x", "y", "z"] as const).map((axis) => (
                  <div key={axis}>
                    <Label className="text-xs text-muted-foreground">{axis.toUpperCase()}</Label>
                    <Input
                      type="number"
                      step={0.1}
                      value={selectedElement.position[axis]}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          position: { ...selectedElement.position, [axis]: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Scale</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["x", "y", "z"] as const).map((axis) => (
                  <div key={axis}>
                    <Label className="text-xs text-muted-foreground">{axis.toUpperCase()}</Label>
                    <Input
                      type="number"
                      step={0.1}
                      value={selectedElement.scale[axis]}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          scale: { ...selectedElement.scale, [axis]: parseFloat(e.target.value) || 1 },
                        })
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Animation</Label>
              <select
                value={selectedElement.animation?.type || ""}
                onChange={(e) =>
                  updateElement(selectedElement.id, {
                    animation: { ...selectedElement.animation, type: e.target.value, duration: 0.5, delay: 0 },
                  })
                }
                className="w-full h-8 rounded-lg border border-border bg-background px-2 text-sm"
              >
                <option value="">None</option>
                {ANIMATIONS.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => moveElement(selectedElement.id, "up")}>
                <MoveUp className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => moveElement(selectedElement.id, "down")}>
                <MoveDown className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => duplicateElement(selectedElement.id)}>
                <Copy className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => deleteElement(selectedElement.id)} className="text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Select an element to edit its properties.</p>
        )}
      </div>
    </div>
  );
}
