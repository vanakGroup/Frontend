"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { Vehicle } from "@/types/vehicleTypes";
import { Eye, Trash2 } from "lucide-react";

interface VehicleCardProps {
  vehicle: Vehicle;
  onView: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

export function VehicleCard({ vehicle, onView, onDelete }: VehicleCardProps) {
  return (
    <Card className="w-full hover:bg-gradient-to-bl from-primary/6 to-primary/1 overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 bg-white border-primary/40 ">
      <CardContent className="p-3 sm:p-4">
        <div className="flex gap-3 sm:gap-4">
          <div className="shrink-0">
            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-lg border border-gray-200 bg-[#d6ecf8] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-9 h-9 sm:w-12 sm:h-12 text-primary"
              >
                <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h3" />
                <circle cx="6.5" cy="16.5" r="2.5" />
                <circle cx="16.5" cy="16.5" r="2.5" />
              </svg>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                {vehicle.car_model}
              </h3>

              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-md text-gray-700">پلاک:</span>
                {(() => {
                  const cleanPlate = (vehicle.license_plate || "").replace(/\s/g, "");
                  return cleanPlate.length >= 8 ? (
                    <span className="text-sm sm:text-md text-gray-700 font-mono tracking-wider">
                      {cleanPlate.slice(0, 2)}&nbsp;{cleanPlate.slice(2, 3)}&nbsp;{cleanPlate.slice(3, 6)}&nbsp;ایران {cleanPlate.slice(6, 8)}
                    </span>
                  ) : (
                    <span className="text-sm sm:text-md text-gray-700 font-mono tracking-wider">
                      {vehicle.license_plate}
                    </span>
                  );
                })()}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-2 border-t border-gray-100">
              <button
                onClick={() => onView(vehicle)}
                className="p-2 text-[#1591dc] hover:bg-[#c4e2f5] rounded-lg transition-colors"
                title="مشاهده جزئیات"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => onDelete(vehicle.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="حذف"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
