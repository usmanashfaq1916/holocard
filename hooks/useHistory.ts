"use client";

export class HistoryManager {
  private stack: string[] = [];
  private index = -1;
  private isLoadingState = false;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private canvas: { toJSON: () => unknown; loadFromJSON: (json: string, cb: () => void) => void; renderAll: () => void; on: (e: string, cb: () => void) => void };
  private maxStates = 50;

  constructor(canvas: HistoryManager["canvas"]) {
    this.canvas = canvas;
    this.canvas.on("object:added", () => this.debouncedSave());
    this.canvas.on("object:modified", () => this.debouncedSave());
    this.canvas.on("object:removed", () => this.debouncedSave());
    this.saveState();
  }

  private debouncedSave() {
    if (this.isLoadingState) return;
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.saveState(), 150);
  }

  private saveState() {
    if (this.isLoadingState) return;
    const json = JSON.stringify(this.canvas.toJSON());
    this.stack = this.stack.slice(0, this.index + 1);
    this.stack.push(json);
    this.index++;
    if (this.stack.length > this.maxStates) {
      this.stack.shift();
      this.index--;
    }
  }

  undo() {
    if (this.index <= 0) return false;
    this.index--;
    this.loadState(this.stack[this.index]);
    return true;
  }

  redo() {
    if (this.index >= this.stack.length - 1) return false;
    this.index++;
    this.loadState(this.stack[this.index]);
    return true;
  }

  canUndo(): boolean {
    return this.index > 0;
  }

  canRedo(): boolean {
    return this.index < this.stack.length - 1;
  }

  private loadState(json: string) {
    this.isLoadingState = true;
    this.canvas.loadFromJSON(json, () => {
      this.canvas.renderAll();
      this.isLoadingState = false;
    });
  }
}
