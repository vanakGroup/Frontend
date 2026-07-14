import { create } from "zustand";
import type { ParkingData } from "@/services/searchService"; // Adjust this path to wherever your types are exported

export interface ParkingState {
  parkings: ParkingData[];
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  minScore: number;
  cityId: number | null;
  date: string;
  startHour: number | null;
  endHour: number | null;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  isLoading: boolean;

  setParkings: (parkings: ParkingData[]) => void;
  setSearchQuery: (query: string) => void;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  setMinScore: (score: number) => void;
  setCityId: (id: number | null) => void;
  setDate: (date: string) => void;
  setStartHour: (hour: number | null) => void;
  setEndHour: (hour: number | null) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setIsLoading: (loading: boolean) => void;
  resetFilters: () => void;
}

export const useParkingStore = create<ParkingState>((set) => ({
  parkings: [],
  searchQuery: "",
  minPrice: 0,
  maxPrice: 60,
  minScore: 0,
  cityId: null,
  date: "",
  startHour: null,
  endHour: null,
  currentPage: 1,
  itemsPerPage: 6,
  totalPages: 1,
  isLoading: false,

  setParkings: (parkings) => set({ parkings }),
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setMinPrice: (price) => set({ minPrice: price, currentPage: 1 }),
  setMaxPrice: (price) => set({ maxPrice: price, currentPage: 1 }),
  setMinScore: (score) => set({ minScore: score, currentPage: 1 }),
  setCityId: (id) => set({ cityId: id, currentPage: 1 }),
  setDate: (date) => set({ date, currentPage: 1 }),
  setStartHour: (hour) => set({ startHour: hour, currentPage: 1 }),
  setEndHour: (hour) => set({ endHour: hour, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  resetFilters: () =>
    set({
      searchQuery: "",
      minPrice: 0,
      maxPrice: 60,
      minScore: 0,
      cityId: null,
      date: "", // CHANGED: Reset back to empty string
      startHour: null,
      endHour: null,
      currentPage: 1,
    }),
}));
