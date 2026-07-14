import { useState } from "react";
import { Car, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomDialog } from "@/components/Custom/CustomDialog";
import CustomToast from "@/components/Custom/CustomToast";
import { reservationService } from "@/services/reservationService";
import {
  dateFromStartTime,
  formatJalaliDate,
  formatPrice,
  formatTimeRange,
  statusLabel,
} from "./utils";
import type { ReservationDTO } from "./types";

interface ReservationDialogProps {
  reservation: ReservationDTO | null;
  parkingId: string;
  parkingName: string;
  today: Date;
  onClose: () => void;
  onSettled: () => void;
}

export function ReservationDialog({
  reservation,
  parkingId,
  parkingName,
  today,
  onClose,
  onSettled,
}: ReservationDialogProps) {
  const [settling, setSettling] = useState(false);
  const open = !!reservation;

  const startDate = reservation
    ? dateFromStartTime(reservation.start_time)
    : null;
  const isUpcoming = startDate
    ? startDate.getTime() > today.getTime()
    : false;

  const canSettle = reservation
    ? reservation.end_time * 1000 <= Date.now() &&
      reservation.status !== "completed" &&
      reservation.status !== "cancelled"
    : false;

  const handleSettle = async () => {
    if (!reservation) return;
    setSettling(true);
    try {
      await reservationService.settleReservation(parkingId, reservation.id);
      CustomToast.success("تسویه با موفقیت انجام شد");
      onSettled();
      onClose();
    } catch (err) {
      console.error("Error settling reservation:", err);
    } finally {
      setSettling(false);
    }
  };

  return (
    <CustomDialog
      open={open}
      onOpenChange={(o) => !o && onClose()}
      title="جزئیات رزرو"
      description={
        reservation && startDate
          ? `${parkingName} · ${formatJalaliDate(startDate)}`
          : undefined
      }
    >
      {reservation && startDate && (
        <>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  رزروکننده
                </p>
                <p className="font-medium text-foreground">
                  {reservation.first_name} {reservation.last_name}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">خودرو</p>
                <p className="font-medium text-foreground flex items-center gap-1.5">
                  <Car size={14} className="text-primary" />
                  {reservation.vehicle.car_model}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">پلاک</p>
                <p className="font-medium text-foreground font-mono tracking-wider">
                  {reservation.vehicle.license_plate.slice(3, 6)}&nbsp;
                  {reservation.vehicle.license_plate.slice(6, 8)}&nbsp;
                  {reservation.vehicle.license_plate.slice(2, 3)}&nbsp;
                  {reservation.vehicle.license_plate.slice(0, 2)}&nbsp;
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">تاریخ</p>
                <p className="font-medium text-foreground">
                  {formatJalaliDate(startDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">وضعیت</p>
                {isUpcoming ? (
                  <Badge
                    variant="outline"
                    className="text-primary border-primary/40"
                  >
                    آینده
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    {statusLabel[reservation.status] ?? "ثبت‌شده"}
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1.5">بازه زمانی</p>
              <div className="flex flex-wrap gap-1.5" dir="ltr">
                <Badge variant="secondary">
                  {formatTimeRange(
                    reservation.start_time,
                    reservation.end_time,
                  )}
                </Badge>
              </div>
            </div>

            <div className="border-t border-border pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">قیمت هر ساعت</span>
                <span className="text-foreground">
                  {formatPrice(reservation.base_price)} تومان
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">تعداد ساعت</span>
                <span className="text-foreground">
                  {reservation.hours.toLocaleString("fa-IR")}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-medium text-foreground">مجموع</span>
                <span className="font-bold text-primary">
                  {formatPrice(reservation.total_price)} تومان
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            {/* {canSettle && (
              <Button onClick={handleSettle} disabled={settling} className="flex-1">
                {settling && <Loader2 size={16} className="animate-spin" />}
                تسویه
              </Button>
            )} */}
            <Button
              variant={canSettle ? "outline" : "default"}
              onClick={onClose}
              className={canSettle ? "" : "flex-1"}
            >
              بستن
            </Button>
          </div>
        </>
      )}
    </CustomDialog>
  );
}
