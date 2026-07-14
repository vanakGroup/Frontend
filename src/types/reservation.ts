export interface ReservationAddressDTO {
  cityId: number;
  postalCode: string;
  unitNumber: number;
  exactAddress: string;
}

export interface ParkingReservationDTO {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  address: ReservationAddressDTO;
}

export interface VehicleDTO {
  id: string;
  license_plate: string;
  car_model: string;
}

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface ReservationDTO {
  id: string;
  first_name: string;
  last_name: string;
  total_price: number;
  start_time: number;
  end_time: number;
  hours: number;
  status: ReservationStatus;
  base_price: number;
  parking: ParkingReservationDTO;
  vehicle: VehicleDTO;
}
