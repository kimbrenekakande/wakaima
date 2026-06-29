import { create } from "zustand";

interface BooleanState {
  isGenerating: boolean;
  setGenerating: (value: boolean) => void;
}

export const useGenerating = create<BooleanState>((set) => ({
  isGenerating: false,
  setGenerating: (value: boolean) => set({ isGenerating: value }),
}));
