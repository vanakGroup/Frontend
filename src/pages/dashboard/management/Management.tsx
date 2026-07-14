import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Clock,
  ArrowRight,
  MapPin,
  BarChart3,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { parkingService } from "@/services/parkingService";
import type { ParkingListResponse } from "@/types/parking";
import CustomToast from "@/components/Custom/CustomToast";

export default function Management() {
  const navigate = useNavigate();
  const [parkings, setParkings] = useState<ParkingListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadParkings();
  }, []);

  const loadParkings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await parkingService.getUserParkings();
      setParkings(data.data ?? []);
    } catch (err) {
      setError("خطا در بارگذاری پارکینگ‌ها");
      console.error("Error loading parkings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await parkingService.deleteParking(id);
      setParkings((prev) => prev.filter((p) => p.id !== id));
      CustomToast.success("پارکینگ با موفقیت حذف شد");
    } catch (err) {
      console.error("Error deleting parking:", err);
      CustomToast.error("خطا در حذف پارکینگ");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-2xl p-10 text-center">
          <p className="text-destructive text-sm">{error}</p>
          <Button variant="outline" className="mt-4" onClick={loadParkings}>
            تلاش مجدد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">پارکینگ‌ من</h1>
          <p className="text-muted-foreground text-sm mt-1">
            افزودن، ویرایش و حذف پارکینگ‌های شما
          </p>
        </div>
        <Button
          onClick={() => navigate("/dashboard/management/add")}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          افزودن پارکینگ
        </Button>
      </div>

      <div className="space-y-3">
        {parkings.length > 0 ? (
          <div className="space-y-3">
            {parkings.map((parking) => (
              <div
                key={parking.id}
                className="bg-card border border-border rounded-2xl p-4 cursor-pointer hover:border-primary/40 transition-colors"
                onClick={() =>
                  navigate(`/dashboard/management/view/${parking.id}`)
                }
              >
                <div
                  className="hidden sm:flex items-center justify-between gap-4"
                  dir="ltr"
                >
                  <div
                    className="flex items-center gap-2 shrink-0 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deletingId === parking.id}
                      onClick={() => handleDelete(parking.id)}
                      className="flex items-center gap-1.5"
                    >
                      <Trash2 size={14} /> حذف
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/dashboard/management/edit/${parking.id}`)
                      }
                      className="flex items-center gap-1.5"
                    >
                      <Pencil size={14} /> ویرایش
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/dashboard/management/slots/${parking.id}`)
                      }
                      className="flex items-center gap-1.5"
                    >
                      <Clock size={14} /> زمان‌بندی
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/dashboard/management/history/${parking.id}`)
                      }
                      className="flex items-center gap-1.5"
                    >
                      <BarChart3 size={14} /> تاریخچه و تحلیل
                    </Button>
                  </div>

                  <div className="text-right min-w-0">
                    <h3 className="font-semibold text-foreground text-base">
                      {parking.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 justify-end">
                      <p className="text-sm text-muted-foreground truncate">
                        {parking.address.exactAddress}
                      </p>
                      <MapPin size={13} className="text-primary shrink-0" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:hidden">
                  <div className="text-right">
                    <h3 className="font-semibold text-foreground text-base">
                      {parking.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 justify-end">
                      <p className="text-sm text-muted-foreground">
                        {parking.address.exactAddress}
                      </p>
                      <MapPin size={13} className="text-primary shrink-0" />
                    </div>
                  </div>

                  <div className="border-t border-border" />

                  <div
                    className="grid grid-cols-2 gap-2 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deletingId === parking.id}
                      onClick={() => handleDelete(parking.id)}
                      className="flex items-center justify-center gap-1.5"
                    >
                      <Trash2 size={14} /> حذف
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/dashboard/management/edit/${parking.id}`)
                      }
                      className="flex items-center justify-center gap-1.5"
                    >
                      <Pencil size={14} /> ویرایش
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/dashboard/management/slots/${parking.id}`)
                      }
                      className="flex items-center justify-center gap-1.5"
                    >
                      <Clock size={14} /> زمان‌بندی
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/dashboard/management/history/${parking.id}`)
                      }
                      className="flex items-center justify-center gap-1.5"
                    >
                      <BarChart3 size={14} /> تحلیل
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Plus size={50} className="text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">
              هنوز پارکینگی ثبت نشده
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
