import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Pencil, Clock, BarChart3, Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { parkingService } from "@/services/parkingService";
import type { ParkingDetailResponse, StaticItem } from "@/types/parking";
import { translateNumber } from "@/utils/translateNumber";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface TimeFrame {
  start: number;
  end: number;
}

interface GroupedSlot {
  date: string;
  persianDate: string;
  dayName: string;
  hours: number[];
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

const getPersianDayName = (dateString: string): string => {
  const date = new Date(dateString);
  const days = [
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
    "شنبه",
  ];
  return days[date.getDay()];
};

const isoToPersianDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const groupSlotsByDate = (
  slots: { date: string; hour: number }[],
): GroupedSlot[] => {
  const grouped: Record<string, number[]> = {};

  slots.forEach((slot) => {
    if (!grouped[slot.date]) {
      grouped[slot.date] = [];
    }
    grouped[slot.date].push(slot.hour);
  });

  return Object.entries(grouped).map(([date, hours]) => ({
    date,
    persianDate: isoToPersianDate(date),
    dayName: getPersianDayName(date),
    hours,
  }));
};

export default function ParkingView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [parking, setParking] = useState<ParkingDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<StaticItem[]>([]);
  const [cities, setCities] = useState<StaticItem[]>([]);

  useEffect(() => {
    if (id) {
      loadParkingData(id);
    }
  }, [id]);

  const loadParkingData = async (parkingId: string) => {
    try {
      setLoading(true);
      setError(null);
      const [parkingData, attributesData, citiesData] = await Promise.all([
        parkingService.getParkingDetail(parkingId),
        parkingService.getAttributes(),
        parkingService.getCities(),
      ]);
      setParking(parkingData.data);
      setAttributes(attributesData.data ?? []);
      setCities(citiesData.data ?? []);
    } catch (err) {
      setError("خطا در بارگذاری اطلاعات پارکینگ");
      console.error("Error loading parking:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  if (error || !parking) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-2xl p-10 text-center">
          <p className="text-muted-foreground text-sm">
            {error || "پارکینگ مورد نظر یافت نشد"}
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

  const markerPos: [number, number] = [parking.latitude, parking.longitude];
  const mapCenter: [number, number] = markerPos;
  const cityName =
    cities.find((c) => c.id === parking.address.cityId)?.name || "—";
  const groupedSlots = groupSlotsByDate(parking.slots ?? []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard/management")}
            className="p-2 rounded-lg hover:bg-accent transition-colors shrink-0"
          >
            <ArrowRight size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground">
              مشاهده پارکینگ
            </h1>
            <p className="text-muted-foreground text-sm mt-1 truncate">
              {parking.title}
            </p>
          </div>
        </div>

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
            onClick={() => navigate(`/dashboard/management/edit/${parking.id}`)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5"
          >
            <Pencil size={14} /> ویرایش
          </Button>
        </div>
      </div>

      <div className="space-y-5 pb-10">
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-foreground border-b border-border pb-2">
            اطلاعات پایه
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                نام پارکینگ
              </label>
              <p
                className="px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm text-foreground text-right"
                dir="rtl"
              >
                {parking.title}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                قیمت هر ساعت (تومان)
              </label>
              <p
                className="px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm text-foreground text-right"
                dir="rtl"
              >
                {parking.basePrice.toLocaleString("fa-IR")}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                شهر
              </label>
              <p
                className="px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm text-foreground text-right"
                dir="rtl"
              >
                {cityName}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                کد پستی
              </label>
              <p
                className="px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm text-foreground"
                dir="ltr"
              >
                {translateNumber(parking.address.postalCode)}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              آدرس کامل
            </label>
            <p
              className="px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm text-foreground text-right"
              dir="rtl"
            >
              {parking.address.exactAddress}
            </p>
          </div>
        </div>

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
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={markerPos} />
            </MapContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-foreground border-b border-border pb-2">
            تصاویر پارکینگ
          </h2>
          {parking.imageUrls && parking.imageUrls.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {parking.imageUrls.map((img, i) => (
                <div
                  key={i}
                  className="w-24 h-24 rounded-xl overflow-hidden border border-border"
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-right">
              تصویری ثبت نشده
            </p>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-foreground border-b border-border pb-2">
            مدارک پارکینگ
          </h2>
          {parking.documentUrl ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-muted rounded-lg px-3 py-2 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm text-foreground truncate">
                    مدرک پارکینگ
                  </span>
                  <a
                    href={parking.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm hover:underline"
                  >
                    مشاهده
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-right">
              مدرکی ثبت نشده
            </p>
          )}
        </div>

        {parking.attributeIds && parking.attributeIds.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <h2 className="font-semibold text-foreground border-b border-border pb-2">
              امکانات پارکینگ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" dir="rtl">
              {parking.attributeIds.map((attrId) => {
                const attr = attributes.find((a) => a.id === attrId);
                return attr ? (
                  <div
                    key={attr.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-right border-primary bg-primary/10 text-primary"
                  >
                    <div className="w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center border-primary bg-primary">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">{attr.name}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        {groupedSlots.length > 0 ? (
          <div className="space-y-3">
            {groupedSlots.map((daySlot, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm text-muted-foreground">
                    {daySlot.persianDate || translateNumber(daySlot.date)}
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

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => {
                    const active = daySlot.hours.includes(hour);
                    return (
                      <div
                        key={hour}
                        className={`py-2 rounded-lg text-sm font-medium border text-center ${
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border text-muted-foreground"
                        }`}
                      >
                        {translateNumber(String(hour).padStart(2, "0") + ":00")}
                      </div>
                    );
                  })}
                </div>

                {daySlot.hours.length > 0 && (
                  <div className="text-right space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      بازه‌های زمانی انتخاب شده:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {hoursToTimeFrames(daySlot.hours).map((frame, i) => (
                        <span
                          key={i}
                          className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium"
                          dir="ltr"
                        >
                          {translateNumber(
                            `${String(frame.start).padStart(2, "0")}:00 – ${String(frame.end).padStart(2, "0")}:00`,
                          )}
                        </span>
                      ))}
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
