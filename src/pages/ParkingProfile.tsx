import { useState } from "react";
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
  Flag,
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

// --- Mock data (replace with API later) ---
const mockParking = {
  id: 1,
  name: "پارکینگ ونک",
  address: "تهران / میدان ونک / خیابان ولیعصر",
  phone: "021-88001234",
  province: "تهران",
  postalCode: "1234567890",
  capacity: 50,
  pricePerHour: 15000,
  description:
    "پارکینگ مرکزی ونک با امکانات کامل و دسترسی آسان به مترو و اتوبوس. دارای سیستم هوشمند مدیریت پارکینگ.",
  latitude: 35.7564,
  longitude: 51.4072,
  amenities: {
    cctv: true,
    security: false,
    covered: true,
  },
  images: [
    "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800",
    "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800",
    "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?w=800",
  ],
  score: 4.5,
  reviewCount: 128,
};

// Mock time slots — replace with API later
const mockTimeSlots = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  available: Math.random() > 0.3, // random availability for demo
}));

const amenityConfig = [
  { key: "cctv", label: "دوربین مداربسته" },
  { key: "security", label: "نگهبان" },
  { key: "covered", label: "سقف‌دار" },
];

interface TimeSlot {
  hour: number;
  available: boolean;
}

export default function ParkingProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  // In real app: fetch parking by id
  const parking = mockParking;

  const [currentImage, setCurrentImage] = useState(0);
  const [showReserveDialog, setShowReserveDialog] = useState(false);
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const [timeSlots] = useState<TimeSlot[]>(mockTimeSlots);

  const isLoggedIn = false; // replace with userStore later

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
    //if (!isLoggedIn) {
    //  navigate("/login");
    //  return;
    //}
    setShowReserveDialog(true);
  };

  const handleConfirmReserve = () => {
    const payload = {
      parkingId: id,
      timeFrames: hoursToTimeFrames(selectedHours),
      totalPrice,
    };
    console.log("reserve payload:", payload);
    // TODO: axios.post('/api/reserve', payload)
    setShowReserveDialog(false);
    setSelectedHours([]);
  };

  return (
    <div className="min-h-screen bg-muted" dir="rtl">
      {/* Back button */}
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
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="relative h-64 md:h-96">
            <img
              src={parking.images[currentImage]}
              alt={parking.name}
              className="w-full h-full object-cover"
            />

            {/* Image navigation */}
            {parking.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImage((prev) =>
                      prev === 0 ? parking.images.length - 1 : prev - 1,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
                <button
                  onClick={() =>
                    setCurrentImage((prev) =>
                      prev === parking.images.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {parking.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${i === currentImage ? "bg-white" : "bg-white/50"}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Score badge */}
            <div className="absolute top-3 left-3 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1">
              <span>★</span>
              <span>{parking.score}</span>
              <span className="text-white/70 text-xs">
                ({parking.reviewCount})
              </span>
            </div>
          </div>

          {/* Thumbnail strip */}
          {parking.images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {parking.images.map((img, i) => (
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

        {/* ── Basic Info ── */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <Button onClick={handleReserve} size="lg" className="shrink-0">
              <Clock size={16} className="ml-2" />
              رزرو پارکینگ
            </Button>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-foreground">
                {parking.name}
              </h1>
              <div className="flex items-center gap-1.5 mt-1 justify-end">
                <span className="text-sm text-muted-foreground">
                  {parking.address}
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
                {parking.phone}
              </p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <Car size={18} className="text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground mb-0.5">ظرفیت</p>
              <p className="text-sm font-medium">{parking.capacity} خودرو</p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <DollarSign size={18} className="text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground mb-0.5">قیمت</p>
              <p className="text-sm font-medium">
                {parking.pricePerHour.toLocaleString()} ت/ساعت
              </p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <MapPin size={18} className="text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground mb-0.5">استان</p>
              <p className="text-sm font-medium">{parking.province}</p>
            </div>
          </div>

          {parking.description && (
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {parking.description}
              </p>
            </div>
          )}
        </div>

        {/* ── Amenities ── */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <h2 className="font-semibold text-foreground border-b border-border pb-2">
            امکانات
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {amenityConfig.map((item) => {
              const active =
                parking.amenities[item.key as keyof typeof parking.amenities];
              return (
                <div
                  key={item.key}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm ${
                    active
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground opacity-50"
                  }`}
                >
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Map ── */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <h2 className="font-semibold text-foreground border-b border-border pb-2">
            موقعیت روی نقشه
          </h2>
          <div className="rounded-xl overflow-hidden border border-border h-64">
            <MapContainer
              center={[parking.latitude, parking.longitude]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              dragging={false}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[parking.latitude, parking.longitude]} />
            </MapContainer>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground justify-end">
            <span>{parking.address}</span>
            <MapPin size={14} className="text-primary" />
          </div>
        </div>
      </div>

      {/* ── Reserve Dialog ── */}
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
