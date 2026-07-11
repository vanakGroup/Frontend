import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getData } from "@/services/services";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapPin,
  Phone,
  Car,
  DollarSign,
  Shield,
  Home,
  ArrowRight,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Hash,
  Info,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface Slot {
  date: string;
  hour: number;
  id: number;
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

// TODO: Remove this mock data once the API is fully populated
const MOCK_FALLBACK_DATA: ParkingData = {
  id: "1",
  title: "پارکینگ ونک",
  address: {
    cityId: 1,
    exactAddress: "تهران / میدان ونک / خیابان ولیعصر",
    postalCode: "۱۴۳۹۷۵۶۷۸۹",
    unitNumber: 1,
  },
  attributeIds: [1, 2, 3],
  basePrice: 15000,
  documentUrl: "",
  imageUrls: [
    "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800",
    "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800",
    "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?w=800",
  ],
  latitude: 35.7564,
  longitude: 51.4072,
  slots: Array.from({ length: 24 }, (_, i) => ({
    date: "2026-06-20",
    hour: i,
    id: i,
    isBooked: Math.random() < 0.3,
  })),
  status: "ACTIVE",
};

export default function ParkingProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<ParkingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentImage, setCurrentImage] = useState(0);
  const [showReserveDialog, setShowReserveDialog] = useState(false);
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchParking = async () => {
      try {
        setIsLoading(true);
        const fetchId = id || "1";
        // Using base client instead of absolute URL
        const response = await getData({ endPoint: `/v1/parking/parkingInfo/${fetchId}` });
        setData(response.data);
      } catch (err) {
        console.warn("API failed, using mock data for now", err);
        // Fallback to mock data to keep UI visible while API has no data
        setData(MOCK_FALLBACK_DATA);
        // setError("خطا در دریافت اطلاعات پارکینگ");
      } finally {
        setIsLoading(false);
      }
    };
    fetchParking();
  }, [id]);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
        <p className="text-muted-foreground font-semibold">
          در حال دریافت اطلاعات...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-muted flex flex-col items-center justify-center space-y-4">
        <p className="text-destructive font-bold text-lg">
          {error || "پارکینگ یافت نشد"}
        </p>
        <Button onClick={() => navigate(-1)} variant="outline">
          بازگشت
        </Button>
      </div>
    );
  }

  const parking = {
    id: data.id,
    name: data.title || "بدون نام",
    address: data.address?.exactAddress || "آدرس نامشخص",
    phone: "نامشخص", // No phone in API
    province: `شهر ${data.address?.cityId || ""}`,
    postalCode: data.address?.postalCode || "نامشخص",
    capacity: data.slots?.length || 0,
    pricePerHour: data.basePrice || 0,
    description: "", // No description in API
    latitude: data.latitude || 35.6892,
    longitude: data.longitude || 51.389,
    amenities: {
      cctv: data.attributeIds?.includes(1) || false,
      security: data.attributeIds?.includes(2) || false,
      covered: data.attributeIds?.includes(3) || false,
    },
    images:
      data.imageUrls?.length > 0
        ? data.imageUrls
        : [
            "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800",
          ],
    score: 4.5,
    reviewCount: 128,
  };

  const timeSlots =
    data.slots?.map((s) => ({
      hour: s.hour,
      available: !s.isBooked,
    })) || [];

  const toggleHour = (hour: number) => {
    const slot = timeSlots.find((s) => s.hour === hour);
    if (!slot?.available) return;
    setSelectedHours((prev) =>
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour],
    );
  };

  const hoursToTimeFrames = (hours: number[]) => {
    if (hours.length === 0) return [];
    const sorted = [...hours].sort((a, b) => a - b);
    const frames: { start: number; end: number }[] = [];
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

  const totalPrice = selectedHours.length * parking.pricePerHour;

  const handleReserve = () => {
    setShowReserveDialog(true);
  };

  const handleConfirmReserve = () => {
    const payload = {
      parkingId: id,
      timeFrames: hoursToTimeFrames(selectedHours),
      totalPrice,
    };
    console.log("reserve payload:", payload);
    setShowReserveDialog(false);
    setSelectedHours([]);
  };

  const totalImages = parking.images.length;
  const prevIndex = (currentImage - 1 + totalImages) % totalImages;
  const nextIndex = (currentImage + 1) % totalImages;

  const handleNextImage = () => {
    if (isTransitioning) return;
    setSlideDirection("right");
    setIsTransitioning(true);
    setCurrentImage(nextIndex);
  };

  const handlePrevImage = () => {
    if (isTransitioning) return;
    setSlideDirection("left");
    setIsTransitioning(true);
    setCurrentImage(prevIndex);
  };

  return (
    <div className="min-h-screen bg-muted" dir="rtl">
      {/* Dynamic Keyframes for bidirectional slider transition (snappy 300ms) */}
      <style>{`
        @keyframes slideInFromRight {
          from { transform: translateX(80px) scale(0.95); opacity: 0.3; }
          to { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-80px) scale(0.95); opacity: 0.3; }
          to { transform: translateX(0) scale(1); opacity: 1; }
        }
        .animate-slide-right {
          animation: slideInFromRight 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-slide-left {
          animation: slideInFromLeft 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>

      {/* Back button */}
      <div className="bg-background border-b border-border px-4 py-3 text-right">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors justify-start"
        >
          <ArrowRight size={16} />
          <span>بازگشت به لیست پارکینگ‌ها</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* ── Beautiful Stacked Card Deck Image Gallery ── */}
        <div className="relative flex flex-col items-center justify-center py-6">
          <div className="relative w-full max-w-3xl h-[320px] md:h-[460px] flex items-center justify-center overflow-visible">
            {/* Left stacked card with left protrusion */}
            <div
              onClick={handlePrevImage}
              className="absolute left-0 w-1/5 h-[85%] rounded-3xl overflow-hidden shadow-md border border-border/50 opacity-40 -rotate-3 -translate-x-[12%] z-10 transition-all duration-300 hover:opacity-60 cursor-pointer select-none"
            >
              <img
                src={parking.images[prevIndex]}
                alt="Previous"
                className="w-full h-full object-cover blur-[0.5px]"
              />
              <div className="absolute inset-0 bg-black/25" />
            </div>

            {/* Active focused center card */}
            <div
              className={`relative w-[65%] md:w-[70%] h-full rounded-3xl overflow-hidden shadow-2xl border border-border/80 z-20 transition-all duration-300
                ${
                  isTransitioning
                    ? slideDirection === "right"
                      ? "animate-slide-right"
                      : "animate-slide-left"
                    : "scale-100 opacity-100"
                }
              `}
            >
              <img
                src={parking.images[currentImage]}
                alt={parking.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Right stacked card with right protrusion */}
            <div
              onClick={handleNextImage}
              className="absolute right-0 w-1/5 h-[85%] rounded-3xl overflow-hidden shadow-md border border-border/50 opacity-40 rotate-3 translate-x-[12%] z-10 transition-all duration-300 hover:opacity-60 cursor-pointer select-none"
            >
              <img
                src={parking.images[nextIndex]}
                alt="Next"
                className="w-full h-full object-cover blur-[0.5px]"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Slider control arrows */}
            <div className="absolute inset-x-2 md:inset-x-8 top-1/2 -translate-y-1/2 flex justify-between z-30 pointer-events-none">
              <button
                onClick={handlePrevImage}
                className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-black/50 hover:bg-black/75 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <ChevronRight size={24} />
              </button>
              <button
                onClick={handleNextImage}
                className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-black/50 hover:bg-black/75 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <ChevronLeft size={24} />
              </button>
            </div>
          </div>

          {/* Indicators */}
          <div className="flex gap-2 mt-5 z-30">
            {parking.images.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (i !== currentImage) {
                    setSlideDirection(i > currentImage ? "right" : "left");
                    setCurrentImage(i);
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 ${i === currentImage ? "w-8 bg-primary" : "w-2 bg-border-foreground/30 hover:bg-border-foreground/50"}`}
              />
            ))}
          </div>
        </div>

        {/* ── Basic Info with swapped columns & fixed arrow placement ── */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Name, Score & Address block positioned on the RIGHT column (swapped layout) */}
            <div className="text-center md:text-right space-y-2.5 w-full md:w-auto">
              <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                  {parking.name}
                </h1>

                {/* Score badge safely relocated beside the name */}
                <div className="bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <span className="text-amber-500">★</span>
                  <span>{parking.score}</span>
                  <span className="opacity-80">
                    ({parking.reviewCount} نظر)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-center md:justify-start">
                {/* Arrow icon properly positioned on the RIGHT of the address */}
                <MapPin size={16} className="text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">
                  {parking.address}
                </span>
              </div>
            </div>

            {/* Button positioned on the LEFT column (swapped layout) */}
            <div className="w-full md:w-auto shrink-0 flex justify-center">
              <Button
                onClick={handleReserve}
                size="lg"
                className="w-full md:w-auto py-6 px-10 text-base font-bold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-100 transition-all"
              >
                <Clock size={18} className="ml-2" />
                <span>رزرو پارکینگ</span>
              </Button>
            </div>
          </div>

          {/* ── Info Cards Grid with Postal Code & Hover effect ── */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 border-t border-border">
            {/* Contact Phone Card with functional tel link integration */}
            <a
              href={`tel:${parking.phone}`}
              className="bg-muted/40 rounded-xl p-3.5 text-center border border-transparent hover:border-primary/20 hover:bg-card hover:shadow-md hover:-translate-y-1 transition-all duration-300 group block text-right"
            >
              <Phone
                size={20}
                className="text-primary mx-auto mb-1.5 transition-transform group-hover:scale-110"
              />
              <p className="text-xs text-muted-foreground mb-0.5 text-center">
                تماس
              </p>
              <p
                className="text-sm font-semibold text-foreground text-center"
                dir="ltr"
              >
                {parking.phone}
              </p>
            </a>

            <div className="bg-muted/40 rounded-xl p-3.5 text-center border border-transparent hover:border-primary/20 hover:bg-card hover:shadow-md hover:-translate-y-1 transition-all duration-300 group text-right">
              <Car
                size={20}
                className="text-primary mx-auto mb-1.5 transition-transform group-hover:scale-110"
              />
              <p className="text-xs text-muted-foreground mb-0.5 text-center">
                ظرفیت
              </p>
              <p className="text-sm font-semibold text-foreground text-center">
                {parking.capacity} خودرو
              </p>
            </div>

            <div className="bg-muted/40 rounded-xl p-3.5 text-center border border-transparent hover:border-primary/20 hover:bg-card hover:shadow-md hover:-translate-y-1 transition-all duration-300 group text-right">
              <DollarSign
                size={20}
                className="text-primary mx-auto mb-1.5 transition-transform group-hover:scale-110"
              />
              <p className="text-xs text-muted-foreground mb-0.5 text-center">
                قیمت
              </p>
              <p className="text-sm font-semibold text-foreground text-center">
                {parking.pricePerHour.toLocaleString()} ت / ساعت
              </p>
            </div>

            <div className="bg-muted/40 rounded-xl p-3.5 text-center border border-transparent hover:border-primary/20 hover:bg-card hover:shadow-md hover:-translate-y-1 transition-all duration-300 group text-right">
              <MapPin
                size={20}
                className="text-primary mx-auto mb-1.5 transition-transform group-hover:scale-110"
              />
              <p className="text-xs text-muted-foreground mb-0.5 text-center">
                استان
              </p>
              <p className="text-sm font-semibold text-foreground text-center">
                {parking.province}
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-muted/40 rounded-xl p-3.5 text-center border border-transparent hover:border-primary/20 hover:bg-card hover:shadow-md hover:-translate-y-1 transition-all duration-300 group text-right">
              <Hash
                size={20}
                className="text-primary mx-auto mb-1.5 transition-transform group-hover:scale-110"
              />
              <p className="text-xs text-muted-foreground mb-0.5 text-center">
                کد پستی
              </p>
              <p
                className="text-sm font-semibold text-foreground text-center"
                dir="ltr"
              >
                {parking.postalCode}
              </p>
            </div>
          </div>
        </div>

        {/* ── Description Header & Block ── */}
        {parking.description && (
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3 text-right">
            <div className="flex items-center gap-2 border-b border-border pb-2.5 justify-start">
              <Info size={18} className="text-primary" />
              <h2 className="font-bold text-foreground text-base">
                توضیحات پارکینگ
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed text-right">
              {parking.description}
            </p>
          </div>
        )}

        {/* ── Elegant Amenities Section with Status Dots ── */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm text-right">
          <div className="flex items-center gap-2 border-b border-border pb-2.5 justify-start">
            <Shield size={18} className="text-primary" />
            <h2 className="font-bold text-foreground text-base">
              امکانات امنیتی و رفاهی
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* CCTV Security Display */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                parking.amenities.cctv
                  ? "bg-primary/5 border-primary/20 shadow-sm"
                  : "border-border bg-muted/30 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Eye
                  className={`h-5 w-5 ${parking.amenities.cctv ? "text-primary animate-pulse" : "text-muted-foreground"}`}
                />
                <span className="font-bold text-sm text-foreground">
                  دوربین مداربسته
                </span>
              </div>
              <span
                className={`h-2.5 w-2.5 rounded-full ${parking.amenities.cctv ? "bg-emerald-500 animate-ping" : "bg-muted-foreground/30"}`}
              />
            </div>

            {/* Physical Security Guard Display */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                parking.amenities.security
                  ? "bg-primary/5 border-primary/20 shadow-sm"
                  : "border-border bg-muted/30 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield
                  className={`h-5 w-5 ${parking.amenities.security ? "text-primary animate-pulse" : "text-muted-foreground"}`}
                />
                <span className="font-bold text-sm text-foreground">
                  نگهبان مستقر
                </span>
              </div>
              <span
                className={`h-2.5 w-2.5 rounded-full ${parking.amenities.security ? "bg-emerald-500 animate-ping" : "bg-muted-foreground/30"}`}
              />
            </div>

            {/* Covered Roof Display */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                parking.amenities.covered
                  ? "bg-primary/5 border-primary/20 shadow-sm"
                  : "border-border bg-muted/30 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Home
                  className={`h-5 w-5 ${parking.amenities.covered ? "text-primary animate-pulse" : "text-muted-foreground"}`}
                />
                <span className="font-bold text-sm text-foreground">
                  محیط سقف‌دار
                </span>
              </div>
              <span
                className={`h-2.5 w-2.5 rounded-full ${parking.amenities.covered ? "bg-emerald-500 animate-ping" : "bg-muted-foreground/30"}`}
              />
            </div>
          </div>
        </div>

        {/* ── Original Leaflet Map── */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3 text-right">
          <h2 className="font-semibold text-foreground border-b border-border pb-2 text-right">
            موقعیت روی نقشه
          </h2>
          <div className="rounded-xl overflow-hidden border border-border h-64 relative z-0">
            <MapContainer
              key={`${parking.latitude}-${parking.longitude}`}
              center={[parking.latitude, parking.longitude]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[parking.latitude, parking.longitude]} />
            </MapContainer>
          </div>
          {/* Map Footer: Right-aligned text with MapPin icon on the RIGHT */}
          <div
            dir="rtl"
            className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 p-3 rounded-xl border border-border/40 font-semibold"
          >
            <MapPin size={16} className="text-primary shrink-0" />
            <span className="text-right flex-1">{parking.address}</span>
          </div>
        </div>
      </div>

      {/* ── ORIGINAL UNTOUCHED RESERVE DIALOG ── */}
      {showReserveDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Dialog header */}
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card">
              <button
                onClick={() => {
                  setShowReserveDialog(false);
                  setSelectedHours([]);
                }}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="font-bold text-foreground text-lg">
                انتخاب زمان رزرو
              </h2>
            </div>

            <div className="p-5 space-y-5">
              <p className="text-sm text-muted-foreground text-right">
                ساعت‌های مورد نظر را انتخاب کنید. ساعت‌های خاکستری رزرو شده‌اند.
              </p>

              {/* Time slots grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.hour}
                    onClick={() => toggleHour(slot.hour)}
                    disabled={!slot.available}
                    className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                      !slot.available
                        ? "bg-muted border-border text-muted-foreground/40 cursor-not-allowed line-through"
                        : selectedHours.includes(slot.hour)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {String(slot.hour).padStart(2, "0")}:00
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground justify-end">
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

              {/* Selected time frames */}
              {selectedHours.length > 0 && (
                <div className="bg-muted rounded-xl p-4 space-y-3 text-right">
                  <p className="text-sm font-medium text-foreground">
                    بازه‌های انتخابی:
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
                      {parking.pricePerHour.toLocaleString()} تومان
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dialog footer */}
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
                disabled={selectedHours.length === 0}
                onClick={handleConfirmReserve}
              >
                تایید رزرو
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
