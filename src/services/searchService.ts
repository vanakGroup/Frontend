import { postData } from "@/services/services"; // Assuming you have postData next to getData

// ==========================================
// 1. Request Payload / Query Parameter Types
// ==========================================

export interface ParkingSearchPayload {
  page?: number;
  pageSize?: number;
  address?: string;
  maxPrice?: number;
  minPrice?: number;
  cityId?: number;
  date?: string;
  startHour?: number;
  endHour?: number;
}

// ==========================================
// 2. Response Data Types
// ==========================================

export interface ParkingAddress {
  cityId: number;
  exactAddress: string;
  postalCode: string;
  unitNumber: number;
}

export interface ParkingSlot {
  date: string;
  hour: number;
  id: number;
  isBooked: boolean;
}

// Renamed from ParkingItem to ParkingData to match the Zustand store
export interface ParkingData {
  id: string;
  title: string;
  status: string;
  basePrice: number;
  latitude: number;
  longitude: number;
  documentUrl?: string;
  address: ParkingAddress;
  attributeIds: number[];
  imageUrls: string[];
  slots?: ParkingSlot[];
}

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Kept the more detailed Response interface and removed the duplicate
export interface ParkingSearchResponse {
  statusCode: number;
  message: string;
  data: {
    data: ParkingData[];
    pagination?: PaginationMeta;
  };
}

// ==========================================
// 3. Service Function
// ==========================================

export const searchParkingService = async (
  payload: ParkingSearchPayload,
): Promise<ParkingSearchResponse> => {
  // Clean payload: Remove null, undefined, or empty strings so the API gets a clean JSON
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) => value !== null && value !== undefined && value !== "",
    ),
  );

  return postData({
    endPoint: `/v1/Generalparking/search`,
    data: cleanPayload, // Passed as 'data' for JSON body instead of 'params' for URL queries
  });
};
