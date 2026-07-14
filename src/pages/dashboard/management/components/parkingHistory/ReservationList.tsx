import { Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  dateFromStartTime,
  formatJalaliDate,
  formatPrice,
  formatTimeRange,
} from "./utils";
import type { ReservationDTO } from "./types";

interface ReservationListProps {
  reservations: ReservationDTO[];
  today: Date;
  onSelect: (reservation: ReservationDTO) => void;
}

export function ReservationList({
  reservations,
  today,
  onSelect,
}: ReservationListProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground mb-3">
        رزروها ({reservations.length.toLocaleString("fa-IR")})
      </h2>
      {reservations.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-10 text-center">
          <p className="text-muted-foreground text-sm">
            هنوز رزرو‌ای در این بازه ثبت نشده
          </p>
        </div>
      ) : (
        <div className="max-h-[420px] overflow-y-auto space-y-3 [&::-webkit-scrollbar]:w-0 bg-card border border-border rounded-2xl p-4">
          {reservations.map((r) => {
            const start = dateFromStartTime(r.start_time);
            const isUpcoming = start.getTime() > today.getTime();
            return (
              <div
                key={r.id}
                onClick={() => onSelect(r)}
                dir="rtl"
                className={`bg-card min-w-full border border-border rounded-2xl p-4 cursor-pointer hover:border-primary/50 transition-colors ${
                  isUpcoming ? "border-l-4 border-l-primary" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold text-foreground truncate">
                      {r.first_name} {r.last_name}
                    </span>
                    {isUpcoming && (
                      <Badge variant="outline" className="text-primary border-primary/40">
                        آینده
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm shrink-0">
                    <Car size={14} />
                    {r.vehicle.car_model}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2" dir="ltr">
                  <Badge variant="secondary">
                    {formatTimeRange(r.start_time, r.end_time)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-xs text-muted-foreground">
                    {formatJalaliDate(start)} ·{" "}
                    {r.hours.toLocaleString("fa-IR")} ساعت
                  </span>
                  <span className="font-bold text-primary">
                    {formatPrice(r.total_price)} تومان
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
