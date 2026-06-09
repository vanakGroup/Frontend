"use client";

import { useEffect, useState } from "react";
import type { Vehicle } from "@/types/vehicleTypes";
import { VehicleFormDialog } from "./vehicle-form-dialog";
import { VehicleDetailsDialog } from "./vehicle-details-dialog";
import { VehicleCard } from "./vehicle-card";
import { Button } from "@/components/ui/button";
import { Car, Plus } from "lucide-react";
import ConfirmDialog, { ActionTypes } from "../Share/ConfirmDialog";
import { Label } from "../ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { deleteVehicle, getVehicles } from "./vehicle-service";

export function VehiclesList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [vehicleIdToDelete, setVehicleIdToDelete] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await getVehicles();
        setVehicles(data);
      } catch (error) {
        console.error("Failed to load vehicles", error);
      }
    };

    void loadVehicles();
  }, []);

  const handleAdd = (data: { license_plate: string; car_model: string }) => {
    const newVehicle: Vehicle = {
      ...data,
      id: Date.now().toString(),
    };
    setVehicles([newVehicle, ...vehicles]);
  };

  const handleDeleteClick = (id: string) => {
    setVehicleIdToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmAction = async (action: ActionTypes) => {
    if (action === ActionTypes.ok && vehicleIdToDelete) {
      try {
        await deleteVehicle(vehicleIdToDelete);
        setVehicles((currentVehicles) =>
          currentVehicles.filter((vehicle) => vehicle.id !== vehicleIdToDelete),
        );
      } catch (error) {
        console.error("Failed to delete vehicle", error);
      }
    }
    setVehicleIdToDelete(null);
    setConfirmOpen(false);
  };

  return (
    <div className="space-y-4 max-w-[60vw] mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
            <Car className="h-5 w-5" />
          </div>
          <Label className="text-lg font-bold"> وسایل نقلیه من</Label>
        </div>
        <Button
          onClick={() => setFormDialogOpen(true)}
          className="bg-primary hover:bg-secondary text-white transition-colors gap-2"
        >
          <Plus size={18} /> افزودن وسیله
        </Button>
      </div>

      <div
        className="space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto pb-4 
        [&::-webkit-scrollbar]:w-0"
      >
        {vehicles.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
            <p>هیچ وسیله نقلیه‌ای ثبت نشده است</p>
            <Button
              variant="link"
              onClick={() => setFormDialogOpen(true)}
              className="text-[#1591dc] mt-2"
            >
              اولین وسیله را اضافه کنید
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
              >
                <VehicleCard
                  vehicle={vehicle}
                  onView={(v) => {
                    setSelectedVehicle(v);
                    setDetailsDialogOpen(true);
                  }}
                  onDelete={handleDeleteClick}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <VehicleFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSave={async (data) => handleAdd(data)}
      />

      <VehicleDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        vehicle={selectedVehicle}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          setVehicleIdToDelete(null);
          setConfirmOpen(false);
        }}
        title=""
        message="آیا از حذف این وسیله نقلیه مطمئن هستید؟"
        setAction={handleConfirmAction}
        actions={[ActionTypes.ok, ActionTypes.cancle]}
      />
    </div>
  );
}
