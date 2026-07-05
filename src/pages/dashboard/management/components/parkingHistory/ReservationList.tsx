import { Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatJalaliDate, formatPrice, formatTimeFrame } from "./utils";
import type { Reservation } from "./types";

interface ReservationListProps {
  reservations: Reservation[];
  today: Date;
  onSelect: (reservation: Reservation) => void;
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
            const isUpcoming = r.date.getTime() > today.getTime();
            const hoursCount = r.timeFrames.reduce(
              (sum, f) => sum + (f.end - f.start),
              0,
            );
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
                      {r.reserverName}
                    </span>
                    {isUpcoming && (
                      <Badge variant="outline" className="text-primary border-primary/40">
                        آینده
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm shrink-0">
                    <Car size={14} />
                    {r.carName}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2" dir="ltr">
                  {r.timeFrames.map((frame, i) => (
                    <Badge key={i} variant="secondary">
                      {formatTimeFrame(frame)}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-xs text-muted-foreground">
                    {formatJalaliDate(r.date)} · {hoursCount} ساعت
                  </span>
                  <span className="font-bold text-primary">
                    {formatPrice(r.totalPrice)} تومان
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
