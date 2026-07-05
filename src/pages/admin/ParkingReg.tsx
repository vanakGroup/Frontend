import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, XCircle, MapPin } from "lucide-react";
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

const amenityList = [
  { key: "cctv", label: "دوربین مداربسته (CCTV)", icon: "📷" },
  { key: "evCharger", label: "شارژ خودرو برقی", icon: "⚡" },
  { key: "motorcycle", label: "موتورسیکلت پذیر", icon: "🏍️" },
  { key: "heavyVehicle", label: "اتومبیل‌های سنگین پذیر", icon: "🚛" },
  { key: "wheelchair", label: "رمپ دارد (ویژه معلولین)", icon: "♿" },
  { key: "covered", label: "مسقف", icon: "🏠" },
];

// --- Helpers ---
const hoursToTimeFrames = (hours: number[]) => {
  if (hours.length === 0) return [];
  const sorted = [...hours].sort((a, b) => a - b);
  const frames = [];
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

// --- Mock Data ---
// In a real scenario, you would fetch this data using the useParams id.
const submittedData = {
  name: "پارکینگ طبقاتی طالقانی",
  address: "تهران / خیابان طالقانی، نرسیده به بهار",
  phone: "021-88123456",
  capacity: "120",
  pricePerHour: "20000",
  description: "پارکینگ دارای نگهبانی ۲۴ ساعته است.",
  province: "تهران",
  postalCode: "1561612345",
  latitude: 35.707,
  longitude: 51.425,
  amenities: {
    cctv: true,
    evCharger: false,
    motorcycle: true,
    heavyVehicle: false,
    wheelchair: true,
    covered: true,
  },
  images: [
    "https://placehold.co/400x300/png?text=Parking+Image+1",
    "https://placehold.co/400x300/png?text=Parking+Image+2",
  ],
  documents: [
    { name: "Sanad.jpg", url: "https://placehold.co/400x300/png?text=Doc" },
  ],
  daySlots: [
    {
      id: 1,
      date: "۱۴۰۳/۰۴/۱۵",
      dayName: "شنبه",
      selectedHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    },
  ],
};

export default function ParkingReview() {
  const navigate = useNavigate();
  const { id } = useParams();

  // State for the denial workflow
  const [isDenying, setIsDenying] = useState(false);
  const [denyReason, setDenyReason] = useState("");

  const handleAccept = () => {
    console.log("Accepted parking:", id);
    // navigate("/dashboard/management");
  };

  const handleConfirmDeny = () => {
    if (!denyReason.trim()) return;
    console.log("Denied parking:", id, "Reason:", denyReason);
    // navigate("/dashboard/management");
  };

  return (
    <div className="max-w-2xl mx-auto pt-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 ">
        <button
          onClick={() => navigate("/admin")}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <ArrowRight size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            بررسی درخواست پارکینگ
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            مشاهده اطلاعات و مدارک ارسالی جهت تایید یا رد
          </p>
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
              <label className="text-sm font-medium text-foreground">
                نام پارکینگ
              </label>
              <input
                value={submittedData.name}
                readOnly
                className="w-full px-3 py-2 rounded-lg border border-input bg-muted text-sm cursor-not-allowed text-right"
                dir="rtl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                شماره تماس
              </label>
              <input
                value={submittedData.phone}
                readOnly
                className="w-full px-3 py-2 rounded-lg border border-input bg-muted text-sm cursor-not-allowed"
                dir="ltr"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                ظرفیت پارکینگ
              </label>
              <input
                value={submittedData.capacity}
                readOnly
                className="w-full px-3 py-2 rounded-lg border border-input bg-muted text-sm cursor-not-allowed text-right"
                dir="rtl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                قیمت هر ساعت (تومان)
              </label>
              <input
                value={submittedData.pricePerHour}
                readOnly
                className="w-full px-3 py-2 rounded-lg border border-input bg-muted text-sm cursor-not-allowed text-right"
                dir="rtl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">شهر</label>
              <input
                value={submittedData.province}
                readOnly
                className="w-full px-3 py-2 rounded-lg border border-input bg-muted text-sm cursor-not-allowed text-right"
                dir="rtl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                کد پستی
              </label>
              <input
                value={submittedData.postalCode}
                readOnly
                className="w-full px-3 py-2 rounded-lg border border-input bg-muted text-sm cursor-not-allowed"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              آدرس کامل
            </label>
            <input
              value={submittedData.address}
              readOnly
              className="w-full px-3 py-2 rounded-lg border border-input bg-muted text-sm cursor-not-allowed text-right"
              dir="rtl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              توضیحات
            </label>
            <textarea
              value={submittedData.description}
              readOnly
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-input bg-muted text-sm cursor-not-allowed text-right resize-none"
              dir="rtl"
            />
          </div>
        </div>

        {/* ── Map ── */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="font-semibold text-foreground">موقعیت روی نقشه</h2>
          </div>

          <div className="rounded-xl overflow-hidden border border-border h-64 pointer-events-none relative z-0">
            <MapContainer
              center={[submittedData.latitude, submittedData.longitude]}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
              dragging={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={[submittedData.latitude, submittedData.longitude]}
              />
            </MapContainer>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                طول جغرافیایی
              </label>
              <input
                value={submittedData.longitude}
                readOnly
                className="w-full px-3 py-2 rounded-lg border border-input bg-muted text-sm text-center cursor-not-allowed"
                dir="ltr"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                عرض جغرافیایی
              </label>
              <input
                value={submittedData.latitude}
                readOnly
                className="w-full px-3 py-2 rounded-lg border border-input bg-muted text-sm text-center cursor-not-allowed"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* ── Images ── */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-foreground border-b border-border pb-2">
            تصاویر پارکینگ
          </h2>
          <div className="flex flex-wrap gap-3">
            {submittedData.images.length > 0 ? (
              submittedData.images.map((img, i) => (
                <div
                  key={i}
                  className="relative w-24 h-24 rounded-xl overflow-hidden border border-border"
                >
                  <img
                    src={img}
                    alt="Parking"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                عکسی ارسال نشده است.
              </p>
            )}
          </div>
        </div>

        {/* ── Documents ── */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-foreground border-b border-border pb-2">
            مدارک پارکینگ
          </h2>
          <div className="space-y-2">
            {submittedData.documents.length > 0 ? (
              submittedData.documents.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-end bg-muted rounded-lg px-3 py-2 gap-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
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
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-right">
                مدرکی ارسال نشده است.
              </p>
            )}
          </div>
        </div>

        {/* ── Amenities ── */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-foreground border-b border-border pb-2">
            امکانات پارکینگ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" dir="rtl">
            {amenityList.map((item) => {
              const isSelected =
                submittedData.amenities[
                  item.key as keyof typeof submittedData.amenities
                ];
              return (
                <div
                  key={item.key}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-right ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground opacity-60"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {isSelected && (
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
                    )}
                  </div>
                  <span className="text-sm font-medium">
                    {item.icon} {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Time Slots ── */}
        <div className="space-y-3">
          {submittedData.daySlots.map((daySlot) => (
            <div
              key={daySlot.id}
              className="bg-card border border-border rounded-2xl p-5 space-y-4"
            >
              <div className="flex items-center justify-end border-b border-border pb-3">
                <div className="flex items-center gap-3" dir="rtl">
                  {daySlot.dayName && (
                    <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {daySlot.dayName}
                    </span>
                  )}
                  <div className="px-3 py-1.5 rounded-lg border border-border bg-muted text-sm text-foreground min-w-[120px] text-right">
                    {daySlot.date}
                  </div>
                  <h2 className="font-semibold text-foreground">زمان‌بندی</h2>
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 opacity-80 pointer-events-none">
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <div
                    key={hour}
                    className={`py-2 rounded-lg text-sm font-medium border text-center ${
                      daySlot.selectedHours.includes(hour)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted border-border text-muted-foreground"
                    }`}
                  >
                    {String(hour).padStart(2, "0")}:00
                  </div>
                ))}
              </div>

              {daySlot.selectedHours.length > 0 && (
                <div className="text-right space-y-2 pt-2">
                  <p className="text-sm font-medium text-foreground">
                    بازه‌های زمانی:
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

        {/* ── Action Buttons / Deny Flow ── */}
        <div className="bg-card border border-border rounded-2xl p-5 mt-6">
          {isDenying ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="space-y-1.5 text-right">
                <label className="text-sm font-semibold text-destructive">
                  علت رد درخواست را وارد کنید
                </label>
                <textarea
                  value={denyReason}
                  onChange={(e) => setDenyReason(e.target.value)}
                  placeholder="این پیام برای کاربر ارسال خواهد شد..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-destructive/30 bg-destructive/5 text-sm focus:outline-none focus:ring-2 focus:ring-destructive/50 text-right resize-none"
                  dir="rtl"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsDenying(false)}>
                  انصراف
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmDeny}
                  disabled={!denyReason.trim()}
                >
                  تایید و رد درخواست
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                onClick={() => setIsDenying(true)}
              >
                <XCircle size={18} className="mr-2" />
                رد درخواست
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleAccept}
              >
                <CheckCircle2 size={18} className="mr-2" />
                تایید پارکینگ
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
