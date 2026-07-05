import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Pencil, Clock, BarChart3 } from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet marker icon
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
interface TimeFrame {
  start: number;
  end: number;
}

interface DaySlot {
  id: number;
  date: string;
  dayName: string;
  selectedHours: number[];
}

interface DocumentFile {
  name: string;
  url: string;
}

interface Amenities {
  cctv: boolean;
  security: boolean;
  covered: boolean;
}

interface ParkingView {
  id: number;
  name: string;
  phone: string;
  capacity: string;
  pricePerHour: string;
  province: string;
  postalCode: string;
  address: string;
  description: string;
  latitude: string;
  longitude: string;
  amenities: Amenities;
  images: string[];
  documents: DocumentFile[];
  daySlots: DaySlot[];
}

// --- Helpers ---
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

// --- Data ---
const amenityList = [
  { key: "cctv" as const, label: "دوربین مداربسته (CCTV)" },
  { key: "security" as const, label: "نگهبان" },
  { key: "covered" as const, label: "مسقف" },
];

const mockParkingViews: Record<number, ParkingView> = {
  1: {
    id: 1,
    name: "پارکینگ اول",
    phone: "021-88123456",
    capacity: "50",
    pricePerHour: "15000",
    province: "تهران",
    postalCode: "1234567890",
    address: "تهران / میدان ونک",
    description: "پارکینگ سرپوشیده با دسترسی آسان به مترو ونک.",
    latitude: "35.757400",
    longitude: "51.410700",
    amenities: { cctv: true, security: true, covered: false },
    images: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=300",
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=300",
    ],
    documents: [
      {
        name: "سند مالکیت.png",
        url: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=100",
      },
    ],
    daySlots: [
      {
        id: 1,
        date: "1405-3-20",
        dayName: "پنجشنبه",
        selectedHours: [8, 9, 10, 11, 15, 16, 17],
      },
      {
        id: 2,
        date: "1405-3-21",
        dayName: "جمعه",
        selectedHours: [10, 11, 12, 13],
      },
    ],
  },
  2: {
    id: 2,
    name: "پارکینگ دوم",
    phone: "021-22009988",
    capacity: "30",
    pricePerHour: "12000",
    province: "تهران",
    postalCode: "1963765432",
    address: "تهران / پارک وی",
    description: "نزدیک پارک ملت، مناسب برای روزهای تعطیل.",
    latitude: "35.776800",
    longitude: "51.417000",
    amenities: { cctv: true, security: false, covered: true },
    images: [
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=300",
    ],
    documents: [],
    daySlots: [
      {
        id: 1,
        date: "1405-3-20",
        dayName: "پنجشنبه",
        selectedHours: [9, 10, 11, 12],
      },
    ],
  },
  3: {
    id: 3,
    name: "پارکینگ سوم",
    phone: "021-77889900",
    capacity: "20",
    pricePerHour: "10000",
    province: "تهران",
    postalCode: "1654812390",
    address: "تهران / میدان رسالت",
    description: "دسترسی سریع به اتوبان رسالت.",
    latitude: "35.743000",
    longitude: "51.498000",
    amenities: { cctv: false, security: false, covered: false },
    images: [],
    documents: [],
    daySlots: [],
  },
};

export default function ParkingView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const parkingId = Number(id);
  const parking = mockParkingViews[parkingId];

  if (!parking) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-2xl p-10 text-center">
          <p className="text-muted-foreground text-sm">
            پارکینگ مورد نظر یافت نشد
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/dashboard/management")}
          >
            بازگشت
          </Button>
        </div>
      </div>
    );
  }

  const markerPos: [number, number] | null =
    parking.latitude && parking.longitude
      ? [Number(parking.latitude), Number(parking.longitude)]
      : null;

  const mapCenter: [number, number] = markerPos ?? [35.6892, 51.389];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-6">
        {/* Top row: back button + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard/management")}
            className="p-2 rounded-lg hover:bg-accent transition-colors shrink-0"
          >
            <ArrowRight size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground">مشاهده پارکینگ</h1>
            <p className="text-muted-foreground text-sm mt-1 truncate">
              {parking.name}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(`/dashboard/management/history/${parking.id}`)
            }
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5"
          >
            <BarChart3 size={14} /> تاریخچه
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(`/dashboard/management/slots/${parking.id}`)
            }
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5"
          >
            <Clock size={14} /> زمان‌بندی
          </Button>
          <Button
            size="sm"
            onClick={() =>
              navigate(`/dashboard/management/edit/${parking.id}`)
            }
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5"
          >
            <Pencil size={14} /> ویرایش
          </Button>
        </div>
      </div>

      <div className="space-y-5 pb-10">
        {/* ── Basic Info ── */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-foreground border-b border-border pb-2">
            اطلاعات پایه
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                نام پارکینگ
              </label>
              <p className="px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm text-foreground text-right" dir="rtl">
                {parking.name}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                شماره تماس
              </label>
              <p className="px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm text-foreground" dir="ltr">
                {parking.phone}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                شماره پارکینگ
              </label>
              <p className="px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm text-foreground text-right" dir="rtl">
                {parking.capacity}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                قیمت هر ساعت (تومان)
              </label>
              <p className="px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm text-foreground text-right" dir="rtl">
                {parking.pricePerHour}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                شهر
              </label>
              <p className="px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm text-foreground text-right" dir="rtl">
                {parking.province}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                کد پستی
              </label>
              <p className="px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm text-foreground" dir="ltr">
                {parking.postalCode}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              آدرس کامل
            </label>
            <p className="px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm text-foreground text-right" dir="rtl">
              {parking.address}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              توضیحات
            </label>
            <p className="px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm text-foreground text-right min-h-[60px]" dir="rtl">
              {parking.description || "—"}
            </p>
          </div>
        </div>

        {/* ── Map ── */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="font-semibold text-foreground">موقعیت روی نقشه</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              موقعیت پارکینگ روی نقشه
            </p>
          </div>

          <div className="rounded-xl overflow-hidden border border-border h-64">
            <MapContainer
              center={mapCenter}
              zoom={markerPos ? 13 : 11}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {markerPos && <Marker position={markerPos} />}
            </MapContainer>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                طول جغرافیایی
              </label>
              <p className="w-full px-3 py-2 rounded-lg border border-input bg-muted text-sm text-foreground text-center" dir="ltr">
                {parking.longitude || "—"}
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                عرض جغرافیایی
              </label>
              <p className="w-full px-3 py-2 rounded-lg border border-input bg-muted text-sm text-foreground text-center" dir="ltr">
                {parking.latitude || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Images ── */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-foreground border-b border-border pb-2">
            تصاویر پارکینگ
          </h2>
          {parking.images.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {parking.images.map((img, i) => (
                <div
                  key={i}
                  className="w-24 h-24 rounded-xl overflow-hidden border border-border"
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-right">
              تصویری ثبت نشده
            </p>
          )}
        </div>

        {/* ── Documents ── */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-foreground border-b border-border pb-2">
            مدارک پارکینگ
          </h2>
          {parking.documents.length > 0 ? (
            <div className="space-y-2">
              {parking.documents.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-muted rounded-lg px-3 py-2 gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm text-foreground truncate">
                      {doc.name}
                    </span>
                    <img
                      src={doc.url}
                      alt={doc.name}
                      className="w-10 h-10 object-cover rounded-md border border-border shrink-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-right">
              مدرکی ثبت نشده
            </p>
          )}
        </div>

        {/* ── Amenities ── */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-foreground border-b border-border pb-2">
            امکانات پارکینگ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" dir="rtl">
            {amenityList.map((item) => {
              const enabled = parking.amenities[item.key];
              return (
                <div
                  key={item.key}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-right ${
                    enabled
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center ${
                      enabled ? "border-primary bg-primary" : "border-muted-foreground"
                    }`}
                  >
                    {enabled && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Time Slots ── */}
        {parking.daySlots.length > 0 ? (
          <div className="space-y-3">
            {parking.daySlots.map((daySlot) => (
              <div
                key={daySlot.id}
                className="bg-card border border-border rounded-2xl p-5 space-y-4"
              >
                {/* Day header */}
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm text-muted-foreground">
                    {daySlot.date}
                  </span>
                  <div className="flex items-center gap-3" dir="rtl">
                    {daySlot.dayName && (
                      <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {daySlot.dayName}
                      </span>
                    )}
                    <h2 className="font-semibold text-foreground">زمان‌بندی</h2>
                  </div>
                </div>

                {/* Hours grid (read-only) */}
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => {
                    const active = daySlot.selectedHours.includes(hour);
                    return (
                      <div
                        key={hour}
                        className={`py-2 rounded-lg text-sm font-medium border text-center ${
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border text-muted-foreground"
                        }`}
                      >
                        {String(hour).padStart(2, "0")}:00
                      </div>
                    );
                  })}
                </div>

                {/* Time frames */}
                {daySlot.selectedHours.length > 0 && (
                  <div className="text-right space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      بازه‌های زمانی انتخاب شده:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {hoursToTimeFrames(daySlot.selectedHours).map(
                        (frame, i) => (
                          <span
                            key={i}
                            className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium"
                            dir="ltr"
                          >
                            {String(frame.start).padStart(2, "0")}:00 –{" "}
                            {String(frame.end).padStart(2, "0")}:00
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <p className="text-muted-foreground text-sm">
              هنوز زمان‌بندی برای این پارکینگ ثبت نشده
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
