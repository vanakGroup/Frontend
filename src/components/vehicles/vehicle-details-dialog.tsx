"use client";

import { useEffect, useState } from "react";
import { CustomDialog } from "@/components/Custom/CustomDialog";
import { Button } from "@/components/ui/button";
import type { Vehicle } from "@/types/vehicleTypes";
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
    }
  }, [open, vehicle]);

  if (!vehicle) return null;
  const displayVehicle = vehicleDetails ?? vehicle;

  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      title="مشاهده جزئیات وسیله نقلیه"
      showCloseButton={true}
    >
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
          <div className="text-gray-800 text-right font-mono tracking-wider">
            {displayVehicle.license_plate}
          </div>

          <div className="font-medium text-gray-800 text-right">مدل:</div>
          <div className="text-gray-800 text-right">
            {displayVehicle.car_model}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 text-gray-600 hover:bg-gray-50 w-full sm:w-auto"
          >
            بستن
          </Button>
        </div>
      </div>
    </CustomDialog>
  );
}
