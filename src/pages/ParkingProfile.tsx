import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapPin,
  Phone,
  Car,
  DollarSign,
  Shield,
  Zap,
  Bike,
  Truck,
  Accessibility,
  Home,
  ArrowRight,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getData } from "@/services/services";
import { getMyVehicles } from "@/services/vehicleService";
import type { Vehicle } from "@/services/vehicleService";
import { createReservation } from "@/services/reservationService";
import useUserStore from "@/store/userStore/userStore";

// Fix leaflet icon
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Types ---
interface Slot {
  id: number;
  date: string;
  hour: number;
  isBooked: boolean;
}

interface ParkingData {
  id: string;
  title: string;
  address: {
    cityId: number;
    exactAddress: string;
    postalCode: string;
    unitNumber: number;
  };
  attributeIds: number[];
  basePrice: number;
  documentUrl: string;
  imageUrls: string[];
  latitude: number;
  longitude: number;
  slots: Slot[];
  status: string;
}

// amenity config
const amenityConfig: Record<
  number,
  { label: string; icon: React.ElementType }
> = {
  1: { label: "دوربین مداربسته", icon: Shield },
  2: { label: "شارژ برقی", icon: Zap },
  3: { label: "موتورسیکلت", icon: Bike },
  4: { label: "خودروهای سنگین", icon: Truck },
  5: { label: "ویژه معلولین", icon: Accessibility },
  6: { label: "سقف‌دار", icon: Home },
};

// --- Helpers ---
interface TimeFrame {
  start: number;
  end: number;
}

const hoursToTimeFrames = (hours: number[]): TimeFrame[] => {
  if (hours.length === 0) return [];
  const sorted = [...hours].sort((a, b) => a - b);
  const frames: TimeFrame[] = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === prev + 1) {
      prev = sorted[i];
    } else {
      frames.push({ start, end: prev + 1 });
      start = sorted[i];
      prev = sorted[i];
    }
  }
  frames.push({ start, end: prev + 1 });
  return frames;
};

const isContiguous = (hours: number[]): boolean => {
  if (hours.length <= 1) return true;
  const sorted = [...hours].sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1] + 1) return false;
  }
  return true;
};

// --- Component ---
export default function ParkingProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { phone } = useUserStore();
  const isLoggedIn = !!phone;

  const [parking, setParking] = useState<ParkingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  const [showReserveDialog, setShowReserveDialog] = useState(false);
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reserveError, setReserveError] = useState<string>("");

  // fetch parking info
  useEffect(() => {
    if (!id) return;
    getData({ endPoint: `/v1/parking/parkingInfo/${id}` })
      .then((res: unknown) => {
        // res ممکنه { data: ParkingData } یا مستقیم ParkingData باشه
        const data = res as { data?: ParkingData } & ParkingData;
        setParking(data.data ?? data);
      })
      .catch((err: unknown) => console.error("parking info error:", err))
      .finally(() => setIsLoading(false));
  }, [id]);

  // fetch vehicles when dialog opens
  useEffect(() => {
    if (showReserveDialog && isLoggedIn) {
      getMyVehicles()
        .then(setVehicles)
        .catch((err: unknown) => console.error("vehicles error:", err));
    }
  }, [showReserveDialog, isLoggedIn]);

  // reset when dialog opens
  useEffect(() => {
    if (showReserveDialog) {
      setSelectedDate("");
      setSelectedHours([]);
      setSelectedVehicleId("");
      setReserveError("");
    }
  }, [showReserveDialog]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!parking) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">پارکینگ یافت نشد</p>
      </div>
    );
  }

  const slotsForDate = parking.slots.filter(
    (s) => !selectedDate || s.date === selectedDate,
  );

  const isHourBooked = (hour: number): boolean => {
    if (!selectedDate) return false;
    return slotsForDate.some((s) => s.hour === hour && s.isBooked);
  };

  const isHourAvailable = (hour: number): boolean => {
    if (!selectedDate) return false;
    return slotsForDate.some((s) => s.hour === hour && !s.isBooked);
  };

  const toggleHour = (hour: number) => {
    if (isHourBooked(hour) || !isHourAvailable(hour)) return;
    setSelectedHours((prev) => {
      if (prev.length === 0) return [hour];
      if (prev.includes(hour)) {
        const newSel = prev.filter((h) => h !== hour);
        if (!isContiguous(newSel)) return [];
        return newSel;
      }
      const newSel = [...prev, hour].sort((a, b) => a - b);
      if (!isContiguous(newSel)) return [hour];
      return newSel;
    });
  };

  const totalPrice = selectedHours.length * (parking.basePrice || 0);

  const handleReserve = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setShowReserveDialog(true);
  };

  const handleConfirmReserve = async () => {
    if (!selectedDate) {
      setReserveError("لطفا تاریخ را انتخاب کنید");
      return;
    }
    if (selectedHours.length === 0) {
      setReserveError("لطفا ساعت‌های مورد نظر را انتخاب کنید");
      return;
    }
    if (!selectedVehicleId) {
      setReserveError("لطفا خودرو را انتخاب کنید");
      return;
    }

    const sorted = [...selectedHours].sort((a, b) => a - b);
    const startHour = sorted[0];
    const endHour = sorted[sorted.length - 1] + 1;

    const baseDate = new Date(selectedDate);
    const startTime = Math.floor(
      new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        startHour,
      ).getTime() / 1000,
    );
    const endTime = Math.floor(
      new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        endHour,
      ).getTime() / 1000,
    );

    setIsSubmitting(true);
    setReserveError("");

    try {
      await createReservation({
        parking_id: parking.id,
        vehicle_id: selectedVehicleId,
        start_time: startTime,
        end_time: endTime,
      });
      setShowReserveDialog(false);
      setSelectedHours([]);
      setSelectedDate("");
      setSelectedVehicleId("");
      alert("رزرو با موفقیت انجام شد! ✅");
    } catch (err: unknown) {
      console.error("reservation error:", err);
      setReserveError("خطا در ثبت رزرو. لطفا دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableDates = [...new Set(parking.slots.map((s) => s.date))].sort();

  return (
    <div className="min-h-screen bg-muted" dir="rtl">
      {/* Back */}
      <div className="bg-background border-b border-border px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowRight size={16} />
          بازگشت به لیست پارکینگ‌ها
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
        {/* ── Image Gallery ── */}
        {parking.imageUrls && parking.imageUrls.length > 0 && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="relative h-64 md:h-96">
              <img
                src={parking.imageUrls[currentImage]}
                alt={parking.title}
                className="w-full h-full object-cover"
              />
              {parking.imageUrls.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImage((prev) =>
                        prev === 0 ? parking.imageUrls.length - 1 : prev - 1,
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImage((prev) =>
                        prev === parking.imageUrls.length - 1 ? 0 : prev + 1,
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {parking.imageUrls.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${i === currentImage ? "bg-white" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {parking.imageUrls.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {parking.imageUrls.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === currentImage ? "border-primary" : "border-transparent"}`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Basic Info ── */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <Button onClick={handleReserve} size="lg" className="shrink-0">
              <Clock size={16} className="ml-2" />
              رزرو پارکینگ
            </Button>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-foreground">
                {parking.title}
              </h1>
              <div className="flex items-center gap-1.5 mt-1 justify-end">
                <span className="text-sm text-muted-foreground">
                  {parking.address?.exactAddress}
                </span>
                <MapPin size={14} className="text-primary shrink-0" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border">
            <div className="bg-muted rounded-xl p-3 text-center">
              <Phone size={18} className="text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground mb-0.5">تماس</p>
              <p className="text-sm font-medium" dir="ltr">
                نامشخص
              </p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <Car size={18} className="text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground mb-0.5">
                شماره پارکینگ
              </p>
              <p className="text-sm font-medium">
                {parking.address?.unitNumber ?? "—"}
              </p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <DollarSign size={18} className="text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground mb-0.5">قیمت</p>
              <p className="text-sm font-medium">
                {parking.basePrice?.toLocaleString()} ت/ساعت
              </p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <Hash size={18} className="text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground mb-0.5">کد پستی</p>
              <p className="text-sm font-medium">
                {parking.address?.postalCode || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Amenities ── */}
        {parking.attributeIds && parking.attributeIds.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <h2 className="font-semibold text-foreground border-b border-border pb-2">
              امکانات
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {parking.attributeIds.map((attrId) => {
                const config = amenityConfig[attrId];
                if (!config) return null;
                const Icon = config.icon;
                return (
                  <div
                    key={attrId}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-primary/30 bg-primary/10 text-primary text-sm"
                  >
                    <Icon size={16} className="shrink-0" />
                    <span>{config.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Map ── */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <h2 className="font-semibold text-foreground border-b border-border pb-2">
            موقعیت روی نقشه
          </h2>
          <div
            className="rounded-xl overflow-hidden border border-border h-64"
            style={{ zIndex: 0, position: "relative" }}
          >
            <MapContainer
              center={[parking.latitude, parking.longitude]}
              zoom={15}
              style={{ height: "100%", width: "100%", zIndex: 0 }}
              dragging={false}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[parking.latitude, parking.longitude]} />
            </MapContainer>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground justify-end">
            <span>{parking.address?.exactAddress}</span>
            <MapPin size={14} className="text-primary" />
          </div>
        </div>
      </div>

      {/* ── Reserve Dialog ── */}
      {showReserveDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
              <button
                onClick={() => setShowReserveDialog(false)}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="font-bold text-foreground text-lg">
                انتخاب زمان رزرو
              </h2>
            </div>

            <div className="p-5 space-y-5">
              <div className="space-y-1 text-right">
                <p className="text-sm text-muted-foreground">
                  ساعت‌های مورد نظر را انتخاب کنید. ساعت‌های خاکستری رزرو
                  شده‌اند.
                </p>
                <p className="text-xs text-amber-600 font-medium">
                  ⚠️ فقط یک بازه زمانی پیوسته قابل انتخاب است
                </p>
              </div>

              {/* تاریخ */}
              <div className="space-y-1.5" dir="rtl">
                <label className="text-sm font-medium text-foreground">
                  تاریخ رزرو
                </label>
                {availableDates.length > 0 ? (
                  <select
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedHours([]);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-right"
                    dir="rtl"
                  >
                    <option value="">انتخاب تاریخ...</option>
                    {availableDates.map((date) => (
                      <option key={date} value={date}>
                        {date}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-destructive">
                    هیچ تاریخ فعالی وجود ندارد
                  </p>
                )}
              </div>

              {/* خودرو */}
              <div className="space-y-1.5" dir="rtl">
                <label className="text-sm font-medium text-foreground">
                  خودرو
                </label>
                {vehicles.length === 0 ? (
                  <p className="text-sm text-destructive">
                    هیچ خودرویی ثبت نشده —{" "}
                    <button
                      onClick={() => navigate("/vehicles")}
                      className="text-primary underline"
                    >
                      افزودن خودرو
                    </button>
                  </p>
                ) : (
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-right"
                    dir="rtl"
                  >
                    <option value="">انتخاب خودرو...</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={String(v.id)}>
                        {v.car_model} — {v.license_plate}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* گرید ساعت‌ها */}
              {selectedDate && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => {
                    const booked = isHourBooked(hour);
                    const available = isHourAvailable(hour);
                    const selected = selectedHours.includes(hour);
                    return (
                      <button
                        key={hour}
                        onClick={() => toggleHour(hour)}
                        disabled={booked || !available}
                        className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                          booked
                            ? "bg-muted border-border text-muted-foreground/40 cursor-not-allowed line-through"
                            : !available
                              ? "bg-muted/50 border-border text-muted-foreground/30 cursor-not-allowed"
                              : selected
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        {String(hour).padStart(2, "0")}:00
                      </button>
                    );
                  })}
                </div>
              )}

              {/* legend */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground justify-end flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded border border-border bg-muted opacity-40" />
                  <span>رزرو شده</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded border border-border bg-background" />
                  <span>آزاد</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span>انتخاب شده</span>
                </div>
              </div>

              {/* بازه + قیمت */}
              {selectedHours.length > 0 && (
                <div className="bg-muted rounded-xl p-4 space-y-3 text-right">
                  <p className="text-sm font-medium text-foreground">
                    بازه انتخابی:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {hoursToTimeFrames(selectedHours).map((frame, i) => (
                      <span
                        key={i}
                        className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium"
                        dir="ltr"
                      >
                        {String(frame.start).padStart(2, "0")}:00 –{" "}
                        {String(frame.end).padStart(2, "0")}:00
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-lg font-bold text-primary">
                      {totalPrice.toLocaleString()} تومان
                    </span>
                    <div className="text-sm text-muted-foreground">
                      {selectedHours.length} ساعت ×{" "}
                      {parking.basePrice?.toLocaleString()} تومان
                    </div>
                  </div>
                </div>
              )}

              {reserveError && (
                <p className="text-sm text-destructive text-right font-medium">
                  {reserveError}
                </p>
              )}
            </div>

            <div className="p-5 border-t border-border flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowReserveDialog(false);
                  setSelectedHours([]);
                }}
              >
                انصراف
              </Button>
              <Button
                className="flex-1"
                disabled={selectedHours.length === 0 || isSubmitting}
                onClick={handleConfirmReserve}
              >
                {isSubmitting ? "در حال ثبت..." : "تایید رزرو"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
