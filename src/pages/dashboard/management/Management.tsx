import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Clock,
  MapPin,
  Info,
  X,
  Car,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getMyParkings, deleteParking } from "@/services/parkingService";

interface ParkingSummary {
  id: string;
  title: string;
  address: {
    exactAddress: string;
    cityId: number;
    postalCode: string;
    unitNumber: number;
  };
  basePrice: number;
  imageUrls?: string[];
  status: string;
}

export default function Management() {
  const navigate = useNavigate();
  const [parkings, setParkings] = useState<ParkingSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [infoParking, setInfoParking] = useState<ParkingSummary | null>(null);

  const fetchParkings = () => {
    setIsLoading(true);
    getMyParkings()
      .then((res) => setParkings(res.data || []))
      .catch((err) => console.error("get parkings error:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchParkings();
  }, []);

  const handleDelete = async (parkingId: string) => {
    if (!confirm("آیا از حذف این پارکینگ مطمئن هستید؟")) return;
    setDeletingId(parkingId);
    try {
      await deleteParking(parkingId);
      setParkings((prev) => prev.filter((p) => p.id !== parkingId));
    } catch (error) {
      console.error("delete error:", error);
      alert("خطا در حذف پارکینگ");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        در حال بارگذاری پارکینگ‌ها...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => navigate("/dashboard/management/add")}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          افزودن پارکینگ
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            مدیریت پارکینگ‌ها
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            افزودن، ویرایش و حذف پارکینگ‌های شما
          </p>
        </div>
      </div>

      {/* Parking list */}
      <div className="space-y-3">
        {parkings.map((parking) => (
          <div
            key={parking.id}
            className="bg-card border border-border rounded-2xl p-4"
          >
            {/* Desktop layout */}
            <div
              className="hidden sm:flex items-center justify-between gap-4"
              dir="ltr"
            >
              <div className="flex items-center gap-2 shrink-0">
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
                  onClick={() => setInfoParking(parking)}
                  className="flex items-center gap-1.5"
                >
                  <Info size={14} />
                </Button>
              </div>

              <div className="text-right min-w-0" dir="rtl">
                <h3 className="font-semibold text-foreground text-base">
                  {parking.title}
                </h3>
                <div
                  className="flex items-center gap-1.5 mt-1 justify-end"
                  dir="rtl"
                >
                  <MapPin size={13} className="text-primary shrink-0" />
                  <p className="text-sm text-muted-foreground truncate">
                    {parking.address?.exactAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile layout */}
            <div className="flex flex-col gap-3 sm:hidden">
              <div className="flex items-start justify-between" dir="rtl">
                <button
                  onClick={() => setInfoParking(parking)}
                  className="p-1.5 rounded-lg hover:bg-accent transition-colors shrink-0"
                >
                  <Info size={18} className="text-primary" />
                </button>
                <div className="text-right">
                  <h3 className="font-semibold text-foreground text-base">
                    {parking.title}
                  </h3>
                  <div
                    className="flex items-center gap-1.5 mt-1 justify-end"
                    dir="rtl"
                  >
                    <MapPin size={13} className="text-primary shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      {parking.address?.exactAddress}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border" />

              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deletingId === parking.id}
                  onClick={() => handleDelete(parking.id)}
                  className="flex-1 flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={14} /> حذف
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(`/dashboard/management/edit/${parking.id}`)
                  }
                  className="flex-1 flex items-center justify-center gap-1.5"
                >
                  <Pencil size={14} /> ویرایش
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(`/dashboard/management/slots/${parking.id}`)
                  }
                  className="flex-1 flex items-center justify-center gap-1.5"
                >
                  <Clock size={14} /> زمان‌بندی
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {parkings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Plus size={50} className="text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            هنوز پارکینگی ثبت نشده
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            اولین پارکینگ خود را اضافه کنید
          </p>
          <Button onClick={() => navigate("/dashboard/management/add")}>
            <Plus size={16} className="ml-2" />
            افزودن پارکینگ
          </Button>
        </div>
      )}

      {/* ── Info Dialog ── */}
      {infoParking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div
            className="bg-card border border-border rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
            dir="rtl"
          >
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card">
              <button
                onClick={() => setInfoParking(null)}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="font-bold text-foreground text-lg">
                جزئیات پارکینگ
              </h2>
            </div>

            <div className="h-44 bg-accent/40 flex items-center justify-center">
              {infoParking.imageUrls?.[0] ? (
                <img
                  src={infoParking.imageUrls[0]}
                  alt={infoParking.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Car size={40} className="text-primary/40" />
                  <span className="text-xs">بدون تصویر</span>
                </div>
              )}
            </div>

            <div className="p-5 space-y-4">
              <h3 className="font-bold text-foreground text-lg text-right">
                {infoParking.title}
              </h3>

              <div className="space-y-2.5">
                <div
                  className="flex items-center gap-2 text-sm text-muted-foreground justify-end"
                  dir="rtl"
                >
                  <MapPin size={14} className="text-primary shrink-0" />
                  <span>{infoParking.address?.exactAddress}</span>
                </div>
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-border">
                <div className="flex items-center gap-1 text-sm">
                  <DollarSign size={14} className="text-primary" />
                  <span className="text-foreground font-medium">
                    {infoParking.basePrice?.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">تومان/ساعت</span>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-border flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setInfoParking(null)}
              >
                بستن
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  navigate(`/dashboard/management/edit/${infoParking.id}`);
                  setInfoParking(null);
                }}
              >
                ویرایش
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
