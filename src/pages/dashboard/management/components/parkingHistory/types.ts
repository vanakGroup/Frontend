export interface TimeFrame {
  start: number;
  end: number;
}

export interface Reservation {
  id: number;
  parkingId: number;
  reserverName: string;
  carName: string;
  date: Date;
  timeFrames: TimeFrame[];
  pricePerHour: number;
  totalPrice: number;
}

export type Period = "day" | "week" | "month" | "year";

export interface Bucket {
  key: string;
  label: string;
  start: Date;
  revenue: number;
  upcoming: number;
}
