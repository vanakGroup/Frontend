export type { ReservationDTO, ReservationStatus } from "@/types/reservation";

export type Period = "day" | "week" | "month" | "year";

export type ChartMode = "aggregate" | "range";

export interface Bucket {
  key: string;
  label: string;
  start: Date;
  revenue: number;
  upcoming: number;
}
