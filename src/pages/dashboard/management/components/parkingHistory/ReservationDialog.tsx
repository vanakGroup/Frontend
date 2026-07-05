import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomDialog } from "@/components/Custom/CustomDialog";
import { formatJalaliDate, formatPrice, formatTimeFrame } from "./utils";
import type { Reservation } from "./types";

interface ReservationDialogProps {
  reservation: Reservation | null;
  parkingName: string;
  today: Date;
  onClose: () => void;
}

export function ReservationDialog({
  reservation,
  parkingName,
  today,
  onClose,
}: ReservationDialogProps) {
  const open = !!reservation;
  const isUpcoming = reservation
    ? reservation.date.getTime() > today.getTime()
    : false;

  return (
    <CustomDialog
      open={open}
      onOpenChange={(o) => !o && onClose()}
      title="جزئیات رزرو"
      description={
        reservation
          ? `${parkingName} · ${formatJalaliDate(reservation.date)}`
          : undefined
      }
    >
      {reservation && (
        <>
          <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">رزروکننده</p>
                    <p className="font-medium text-foreground">
                      {reservation.reserverName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">خودرو</p>
                    <p className="font-medium text-foreground flex items-center gap-1.5">
                      <Car size={14} className="text-primary" />
                      {reservation.carName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">تاریخ</p>
                    <p className="font-medium text-foreground">
                      {formatJalaliDate(reservation.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">وضعیت</p>
                    {isUpcoming ? (
                      <Badge variant="outline" className="text-primary border-primary/40">
                        آینده
                      </Badge>
                    ) : (
                      <Badge variant="secondary">ثبت‌شده</Badge>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">
                    بازه‌های زمانی
                  </p>
                  <div className="flex flex-wrap gap-1.5" dir="ltr">
                    {reservation.timeFrames.map((frame, i) => (
                      <Badge key={i} variant="secondary">
                        {formatTimeFrame(frame)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">قیمت هر ساعت</span>
                    <span className="text-foreground">
                      {formatPrice(reservation.pricePerHour)} تومان
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">تعداد ساعت</span>
                    <span className="text-foreground">
                      {reservation.timeFrames
                        .reduce((sum, f) => sum + (f.end - f.start), 0)
                        .toLocaleString("fa-IR")}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="font-medium text-foreground">مجموع</span>
                    <span className="font-bold text-primary">
                      {formatPrice(reservation.totalPrice)} تومان
                    </span>
                  </div>
                </div>
          </div>
          <Button className="mt-4" onClick={onClose}>
            بستن
          </Button>
        </>
      )}
    </CustomDialog>
  );
}
