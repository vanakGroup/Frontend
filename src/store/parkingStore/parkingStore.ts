import { create } from "zustand";
import type { ParkingState } from "@/types/parkingsTypes";

export const useParkingStore = create<ParkingState>((set) => ({
  parkings: [],
  searchQuery: "",
  maxPrice: 60,
  minScore: 0,
  currentPage: 1,
  itemsPerPage: 6,
  totalPages: 1,

  setParkings: (parkings) => set({ parkings }),
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setMaxPrice: (price) => set({ maxPrice: price, currentPage: 1 }),
  setMinScore: (score) => set({ minScore: score, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),

  resetFilters: () =>
    set({
      searchQuery: "",
      maxPrice: 60,
      minScore: 0,
      currentPage: 1,
    }),
}));
