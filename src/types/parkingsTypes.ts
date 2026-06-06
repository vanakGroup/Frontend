export interface Parking {
  id: string;
  name: string;
  location: string;
  pricePerHour: number;
  workingDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
  score: number;
  imageUrl: string;
}

export interface ParkingState {
  parkings: Parking[];
  searchQuery: string;
  maxPrice: number;
  minScore: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;

  setParkings: (parkings: Parking[]) => void;
  setSearchQuery: (query: string) => void;
  setMaxPrice: (price: number) => void;
  setMinScore: (score: number) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  resetFilters: () => void;
}
