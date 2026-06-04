import type { Vehicle } from "@/types/vehicleTypes";

export const mockVehicles: Vehicle[] = [
  {
    id: "1",
    license_plate: "۱۲ب۸۵۵|۱۱",
    car_model: "پراید",
    registration_card: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    license_plate: "۱۵ج۱۲۳|۲۲",
    car_model: "۲۰۶",
    registration_card: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    license_plate: "۲۰ص۴۵۶|۳۳",
    car_model: "تیبا",
    registration_card: "https://via.placeholder.com/150",
  },
  {
    id: "4",
    license_plate: "۱۳ل۶۳|۵۵",
    car_model: "پژو ۴۰۵",
    registration_card: "https://via.placeholder.com/150",
  },
  {
    id: "5",
    license_plate: "۱۲ب۸۵۵|۱۱",
    car_model: "پراید",
    registration_card: "https://via.placeholder.com/150",
  },
  {
    id: "6",
    license_plate: "۱۵ج۱۲۳|۲۲",
    car_model: "۲۰۶",
    registration_card: "https://via.placeholder.com/150",
  },
  {
    id: "7",
    license_plate: "۲۰ص۴۵۶|۳۳",
    car_model: "تیبا",
    registration_card: "https://via.placeholder.com/150",
  },
  {
    id: "8",
    license_plate: "۱۳ل۶۳|۵۵",
    car_model: "پژو ۴۰۵",
    registration_card: "https://via.placeholder.com/150",
  },
];

export const fetchVehicles = (): Promise<Vehicle[]> =>
  new Promise((resolve) => setTimeout(() => resolve(mockVehicles), 500));
