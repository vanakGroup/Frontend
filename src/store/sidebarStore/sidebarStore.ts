import { create } from "zustand";
import type { SidebarState } from "@/types/sidebarType";

export const useSidebarStore = create<SidebarState>((set) => ({
  isExpanded: false,
  toggleSidebar: () => set((state) => ({ isExpanded: !state.isExpanded })),
  expandSidebar: () => set({ isExpanded: true }),
  collapseSidebar: () => set({ isExpanded: false }),
}));
