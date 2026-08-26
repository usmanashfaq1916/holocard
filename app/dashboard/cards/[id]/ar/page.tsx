"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Play,
  Pause,
  Eye,
  Upload,
  Save,
  Box,
  Video,
  Image as ImageIcon,
  Type,
  MousePointerClick,
  Volume2,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ARElement {
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
  actions: ARAction[];
}

interface ARAction {
  id?: string;
  type: string;
  payload?: Record<string, unknown>;
  label?: string;
  icon?: string;
  order: number;
}

interface ARScene {
  id?: string;
  name: string;
  order: number;
  duration: number;
  transitionType: string;
  elements: ARElement[];
}

interface ExperienceData {
  id: string;
  name: string;
  status: string;
  target?: { id: string; status: string; quality?: string; imageUrl: string };
  scenes: ARScene[];
}

const ELEMENT_TYPES = [
  { type: "3D", label: "3D Model", icon: Box },
  { type: "VIDEO", label: "Video", icon: Video },
  { type: "IMAGE", label: "Image", icon: ImageIcon },
  { type: "TEXT", label: "Text", icon: Type },
  { type: "BUTTON", label: "Button", icon: MousePointerClick },
  { type: "AUDIO", label: "Audio", icon: Volume2 },
];

const ACTION_TYPES = [
  { type: "OPEN_URL", label: "Open URL" },
  { type: "OPEN_LINKEDIN", label: "LinkedIn" },
  { type: "OPEN_GITHUB", label: "GitHub" },
  { type: "OPEN_INSTAGRAM", label: "Instagram" },
  { type: "OPEN_FACEBOOK", label: "Facebook" },
  { type: "OPEN_TWITTER", label: "X / Twitter" },
  { type: "OPEN_EMAIL", label: "Email" },
  { type: "OPEN_PHONE", label: "Phone" },
  { type: "OPEN_WHATSAPP", label: "WhatsApp" },
  { type: "OPEN_YOUTUBE", label: "YouTube" },
  { type: "SAVE_CONTACT", label: "Save Contact" },
];

export default function ARSceneBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [experience, setExperience] = useState<ExperienceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedScene, setSelectedScene] = useState(0);
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchExperience();
  }, [id]);

  const fetchExperience = async () => {
    try {
      const res = await fetch(`/api/ar/experiences/${id}`);
      if (res.ok) {
        const data = await res.json();
        setExperience(data);
      }
    } catch {
      toast.error("Failed to load experience");
    } finally {
      setLoading(false);
    }
  };

  const currentScene = experience?.scenes[selectedScene];

  const addElement = useCallback(
    (type: string) => {
      if (!experience) return;
      const newElement: ARElement = {
        type,
        position: { x: 0, y: 0, z: 0.3 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        visible: true,
        order: currentScene?.elements.length ?? 0,
        actions: [],
      };

      const updated = { ...experience };
      updated.scenes[selectedScene].elements.push(newElement);
      setExperience(updated);
      setSelectedElement(updated.scenes[selectedScene].elements.length - 1);
    },
    [experience, selectedScene, currentScene]
  );

  const updateElement = useCallback(
    (elementIndex: number, data: Partial<ARElement>) => {
      if (!experience) return;
      const updated = { ...experience };
      Object.assign(updated.scenes[selectedScene].elements[elementIndex], data);
      setExperience(updated);
    },
    [experience, selectedScene]
  );

  const deleteElement = useCallback(
    (elementIndex: number) => {
      if (!experience) return;
      const updated = { ...experience };
      updated.scenes[selectedScene].elements.splice(elementIndex, 1);
      setExperience(updated);
      setSelectedElement(null);
    },
    [experience, selectedScene]
  );

  const addAction = useCallback(
    (elementIndex: number) => {
      if (!experience) return;
      const newAction: ARAction = {
        type: "OPEN_URL",
        order: experience.scenes[selectedScene].elements[elementIndex].actions.length,
      };
      updateElement(elementIndex, {
        actions: [...experience.scenes[selectedScene].elements[elementIndex].actions, newAction],
      });
    },
    [experience, selectedScene, updateElement]
  );

  const addScene = useCallback(() => {
    if (!experience) return;
    const newScene: ARScene = {
      name: `Scene ${experience.scenes.length + 1}`,
      order: experience.scenes.length,
      duration: 5,
      transitionType: "FADE",
      elements: [],
    };
    setExperience({
      ...experience,
      scenes: [...experience.scenes, newScene],
    });
    setSelectedScene(experience.scenes.length);
  }, [experience]);

  const handleTargetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("experienceId", id);

      const uploadRes = await fetch("/api/ar/targets/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");
      const { id: targetId } = await uploadRes.json();

      toast.info("Compiling target image...");
      const compileRes = await fetch("/api/ar/targets/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId }),
      });

      if (!compileRes.ok) throw new Error("Compilation failed");
      const { quality } = await compileRes.json();

      toast.success(`Target ready! Quality: ${quality.rating}`);
      fetchExperience();
    } catch {
      toast.error("Failed to process target image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!experience) return;
    try {
      await fetch(`/api/ar/experiences/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: experience.name,
          scenes: experience.scenes,
        }),
      });
      toast.success("Experience saved");
    } catch {
      toast.error("Failed to save");
    }
  };

  const handlePublish = async () => {
    try {
      const res = await fetch(`/api/ar/experiences/${id}/publish`, {
        method: "POST",
      });
      if (res.ok) {
        toast.success("Experience published!");
        fetchExperience();
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to publish");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Experience not found</h2>
          <Link href="/dashboard/experiences">
            <Button>Go to Experiences</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/experiences">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold">{experience.name}</h1>
            <span className="text-xs text-slate-500">{experience.status}</span>
            {experience.target && (
              <span
                className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                  experience.target.status === "READY"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                Target: {experience.target.quality || experience.target.status}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button size="sm" onClick={handlePublish}>
            Publish
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-57px)]">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r p-4 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Target Image</h3>
            {experience.target?.imageUrl ? (
              <div className="space-y-2">
                <img
                  src={experience.target.imageUrl}
                  alt="Target"
                  className="w-full rounded border"
                />
                <div className="flex gap-2">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleTargetUpload}
                    />
                    <Button variant="outline" size="sm" className="w-full">
                      <Upload className="w-3 h-3 mr-1" />
                      Replace
                    </Button>
                  </label>
                </div>
              </div>
            ) : (
              <label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleTargetUpload}
                  disabled={uploading}
                />
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm text-slate-500">
                    {uploading ? "Processing..." : "Upload card image"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    The printed card becomes the AR marker
                  </p>
                </div>
              </label>
            )}
          </div>

          <Separator className="mb-4" />

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Scenes</h3>
            <div className="space-y-1">
              {experience.scenes.map((scene, i) => (
                <button
                  key={scene.id || i}
                  onClick={() => {
                    setSelectedScene(i);
                    setSelectedElement(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    selectedScene === i
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-slate-50"
                  }`}
                >
                  {scene.name}
                  <span className="text-xs text-slate-400 ml-1">
                    ({scene.elements.length} elements)
                  </span>
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-2" onClick={addScene}>
              <Plus className="w-3 h-3 mr-1" />
              Add Scene
            </Button>
          </div>

          <Separator className="mb-4" />

          <div>
            <h3 className="text-sm font-medium mb-2">Add Elements</h3>
            <div className="grid grid-cols-2 gap-1">
              {ELEMENT_TYPES.map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => addElement(type)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded text-xs hover:bg-slate-100 transition-colors"
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 flex items-center justify-center bg-slate-100 p-8">
          <div className="relative w-[600px] h-[340px] bg-white rounded-lg shadow-lg border-2 border-slate-200 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-slate-300">
              <div className="text-center">
                <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">AR Preview</p>
                <p className="text-xs text-slate-400">
                  {currentScene?.elements.length || 0} elements positioned
                </p>
              </div>
            </div>

            {currentScene?.elements.map((el, i) => (
              <div
                key={el.id || i}
                className={`absolute cursor-pointer border-2 rounded transition-colors ${
                  selectedElement === i
                    ? "border-primary bg-primary/10"
                    : "border-transparent hover:border-primary/50"
                }`}
                style={{
                  left: `${50 + el.position.x * 30}%`,
                  top: `${50 - el.position.y * 30}%`,
                  transform: `translate(-50%, -50%) scale(${el.scale.x})`,
                }}
                onClick={() => setSelectedElement(i)}
              >
                <div className="px-2 py-1 text-xs bg-white/80 rounded shadow-sm">
                  {el.type}: {el.actions[0]?.label || el.type}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-72 bg-white border-l p-4 overflow-y-auto">
          {selectedElement !== null && currentScene?.elements[selectedElement] ? (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Element Properties</h3>

              <div className="space-y-2">
                <Label className="text-xs">Type</Label>
                <div className="text-sm font-medium">
                  {currentScene.elements[selectedElement].type}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Position</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["x", "y", "z"] as const).map((axis) => (
                    <div key={axis}>
                      <Label className="text-xs text-slate-500">{axis.toUpperCase()}</Label>
                      <Input
                        type="number"
                        step={0.1}
                        value={currentScene.elements[selectedElement].position[axis]}
                        onChange={(e) =>
                          updateElement(selectedElement, {
                            position: {
                              ...currentScene.elements[selectedElement].position,
                              [axis]: parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="h-8 text-xs"
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
                      <Label className="text-xs text-slate-500">{axis.toUpperCase()}</Label>
                      <Input
                        type="number"
                        step={0.1}
                        value={currentScene.elements[selectedElement].scale[axis]}
                        onChange={(e) =>
                          updateElement(selectedElement, {
                            scale: {
                              ...currentScene.elements[selectedElement].scale,
                              [axis]: parseFloat(e.target.value) || 1,
                            },
                          })
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs">Actions</Label>
                {currentScene.elements[selectedElement].actions.map((action, ai) => (
                  <div key={ai} className="flex gap-2">
                    <select
                      value={action.type}
                      onChange={(e) => {
                        const updated = { ...currentScene.elements[selectedElement] };
                        updated.actions[ai].type = e.target.value;
                        updateElement(selectedElement, { actions: updated.actions });
                      }}
                      className="flex-1 text-xs border rounded px-2 py-1"
                    >
                      {ACTION_TYPES.map((at) => (
                        <option key={at.type} value={at.type}>
                          {at.label}
                        </option>
                      ))}
                    </select>
                    <Input
                      placeholder="URL or label"
                      value={action.label || ""}
                      onChange={(e) => {
                        const updated = { ...currentScene.elements[selectedElement] };
                        updated.actions[ai].label = e.target.value;
                        updateElement(selectedElement, { actions: updated.actions });
                      }}
                      className="flex-1 h-8 text-xs"
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => addAction(selectedElement)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Action
                </Button>
              </div>

              <Separator />

              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => deleteElement(selectedElement)}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete Element
              </Button>
            </div>
          ) : (
            <div className="text-center text-slate-400 mt-12">
              <MousePointerClick className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Select an element to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
