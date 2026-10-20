"use client";

import { useEffect, useState } from "react";
import { ArrowRight, History, Loader2, MapPin } from "lucide-react";
import { CustomDialog } from "@/components/Custom/CustomDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Vehicle } from "@/types/vehicleTypes";
import type { ReservationDTO } from "@/types/reservation";
import { reservationService } from "@/services/reservationService";
import {
  dateFromStartTime,
  formatJalaliDate,
  formatPrice,
  formatTimeRange,
  statusLabel,
} from "@/pages/dashboard/management/components/parkingHistory/utils";
import { getVehicleById } from "./vehicle-service";

export function VehicleDetailsDialog({
  open,
  onOpenChange,
  vehicle,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
}) {
  const [vehicleDetails, setVehicleDetails] = useState<Vehicle | null>(vehicle);
  const [view, setView] = useState<"details" | "history">("details");
  const [reservations, setReservations] = useState<ReservationDTO[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [reservationError, setReservationError] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicleDetails = async () => {
      if (!open || !vehicle?.id) return;

      try {
        const data = await getVehicleById(vehicle.id);
        setVehicleDetails(data);
      } catch (error) {
        console.error("Failed to load vehicle details", error);
        setVehicleDetails(vehicle);
      }
    };

    void loadVehicleDetails();
  }, [open, vehicle]);

  useEffect(() => {
    if (!open) {
      setVehicleDetails(vehicle);
      setView("details");
      setReservations([]);
      setReservationError(null);
    }
  }, [open, vehicle]);

  useEffect(() => {
    const loadReservations = async () => {
      if (!open || view !== "history" || !vehicle?.id) return;

      setLoadingReservations(true);
      setReservationError(null);
      try {
        const response = await reservationService.getVehicleReservations(
          vehicle.id,
        );
        setReservations(response.data ?? []);
      } catch (error) {
        console.error("Failed to load vehicle reservations", error);
        setReservationError("خطا در بارگذاری رزروها");
      } finally {
        setLoadingReservations(false);
      }
    };

    void loadReservations();
  }, [open, view, vehicle?.id]);

  if (!vehicle) return null;
  const displayVehicle = vehicleDetails ?? vehicle;
  const now = Date.now();

  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      title={view === "history" ? "تاریخچه رزروها" : "مشاهده جزئیات وسیله نقلیه"}
      showCloseButton={true}
    >
      {view === "details" ? (
        <div className="space-y-4 ">
          {displayVehicle.registration_card && (
            <div className="flex justify-center">
              <img
                src={displayVehicle.registration_card}
                alt="کارت ماشین"
                className="max-h-48 rounded-lg border border-gray-200 object-contain"
              />
            </div>
          )}

          <div className="grid grid-cols-[auto_1fr] sm:grid-cols-2 gap-2 sm:gap-3 text-sm bg-white p-3 sm:p-4 rounded-lg border border-primary">
            <div className="font-medium text-gray-800 text-right">پلاک:</div>
            {(() => {
              const cleanPlate = (displayVehicle.license_plate || "").replace(/\s/g, "");
              return cleanPlate.length >= 8 ? (
                <div className="text-gray-800 font-mono tracking-wider">
                  {cleanPlate.slice(0, 2)}&nbsp;{cleanPlate.slice(2, 3)}&nbsp;{cleanPlate.slice(3, 6)}&nbsp;ایران {cleanPlate.slice(6, 8)}
                </div>
              ) : (
                <div className="text-gray-800 font-mono tracking-wider">
                  {displayVehicle.license_plate}
                </div>
              );
            })()}

            <div className="font-medium text-gray-800 text-right">مدل:</div>
            <div className="text-gray-800 text-right">
              {displayVehicle.car_model}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-2 pt-2">
            <Button
              variant="default"
              onClick={() => setView("history")}
              className="w-full sm:w-auto"
            >
              <History className="size-4" />
              تاریخچه رزروها
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 text-gray-600 hover:bg-gray-50 w-full sm:w-auto"
            >
              بستن
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4" dir="rtl">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView("details")}
              className="size-8"
              aria-label="بازگشت"
            >
              <ArrowRight className="size-4" />
            </Button>
            <span className="text-sm font-semibold text-gray-800">
              {reservations.length > 0
                ? `${reservations.length.toLocaleString("fa-IR")} رزرو`
                : ""}
            </span>
          </div>

          {loadingReservations ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : reservationError ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <p className="text-sm text-red-600">{reservationError}</p>
              <Button
                variant="outline"
                onClick={() => setView("history")}
                className="border-gray-300"
              >
                تلاش مجدد
              </Button>
            </div>
          ) : reservations.length === 0 ? (
            <div className="border border-border rounded-lg p-10 text-center">
              <p className="text-sm text-muted-foreground">
                رزروی برای این وسیله نقلیه ثبت نشده
              </p>
            </div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto space-y-3 [&::-webkit-scrollbar]:w-0">
              {reservations.map((r) => {
                const start = dateFromStartTime(r.start_time);
                const isUpcoming = start.getTime() > now;
                return (
                  <div
                    key={r.id}
                    dir="rtl"
                    className={`bg-card border border-border rounded-lg p-4 ${
                      isUpcoming ? "border-l-4 border-l-primary" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-1.5 min-w-0 text-foreground text-sm font-semibold">
                        <MapPin size={14} className="shrink-0 text-muted-foreground" />
                        <span className="truncate">{r.parking.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isUpcoming && (
                          <Badge
                            variant="outline"
                            className="text-primary border-primary/40"
                          >
                            آینده
                          </Badge>
                        )}
                        <Badge variant="secondary">
                          {statusLabel[r.status] ?? r.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2" dir="ltr">
                      <Badge variant="outline">
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
      )}
    </CustomDialog>
  );
}
