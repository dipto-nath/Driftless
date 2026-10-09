import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PolicyId, UncertaintyType } from "@/data/types";

interface UIState {
  selectedSeed: number | "official" | "all";
  selectedPolicy: PolicyId;
  uncertaintyType: UncertaintyType;
  zPercent: number;
  presentationMode: boolean;
  sidebarCollapsed: boolean;
  showReducedMotion: boolean;

  setSelectedSeed: (seed: number | "official" | "all") => void;
  setSelectedPolicy: (policy: PolicyId) => void;
  setUncertaintyType: (type: UncertaintyType) => void;
  setZPercent: (z: number) => void;
  setPresentationMode: (mode: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setShowReducedMotion: (show: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      selectedSeed: "official",
      selectedPolicy: "P2",
      uncertaintyType: "SD",
      zPercent: 1,
      presentationMode: false,
      sidebarCollapsed: false,
      showReducedMotion: false,

      setSelectedSeed: (seed) => set({ selectedSeed: seed }),
      setSelectedPolicy: (policy) => set({ selectedPolicy: policy }),
      setUncertaintyType: (type) => set({ uncertaintyType: type }),
      setZPercent: (z) => set({ zPercent: z }),
      setPresentationMode: (mode) => set({ presentationMode: mode }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setShowReducedMotion: (show) => set({ showReducedMotion: show }),
    }),
    { name: "qautopilot-ui" }
  )
);