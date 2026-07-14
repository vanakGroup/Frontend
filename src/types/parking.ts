export interface ParkingListResponse {
  id: string;
  title: string;
  base_price: number;
  status: string;
  address: AddressDetail;
  attribute_ids: number[];
  image_urls: string[];
}

export interface ParkingDetailResponse {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  basePrice: number;
  status: string;
  documentUrl: string;
  imageUrls: string[];
  address: AddressDetail;
  slots: SlotDetail[] | null;
  attributeIds: number[] | null;
}

export interface AddressDetail {
  cityId: number;
  postalCode: string;
  unitNumber: number;
  exactAddress: string;
}

export interface SlotDetail {
  id: number;
  date: string;
  hour: number;
  isBooked: boolean;
}

export interface StaticItem {
  id: number;
  name: string;
}

export interface SlotRequest {
  Date: string;
  StartHour: number;
  EndHour: number;
}

export interface CreateParkingRequest {
  title: string;
  latitude: number;
  longitude: number;
  basePrice: number;
  "address.cityId": number;
  "address.postalCode": string;
  "address.unitNumber": number;
  "address.exactAddress": string;
  attributeIds?: number[];
  slots?: string;
  documentFile: File;
  images?: File[];
}

export interface UpdateParkingRequest extends CreateParkingRequest {
  parkingId: string;
}
