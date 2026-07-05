import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, X, Trash2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

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

// --- Data ---
const iranProvinces = [
  "تهران",
  "اصفهان",
  "شیراز",
  "مشهد",
  "تبریز",
  "ارومیه",
  "اردبیل",
  "کرج",
  "ایلام",
  "بوشهر",
  "شهرکرد",
  "بیرجند",
  "بجنورد",
  "اهواز",
  "زنجان",
  "سمنان",
  "زاهدان",
  "قزوین",
  "قم",
  "سنندج",
  "کرمان",
  "کرمانشاه",
  "یاسوج",
  "گرگان",
  "رشت",
  "خرم‌آباد",
  "ساری",
  "اراک",
  "بندرعباس",
  "همدان",
  "یزد",
];

const customLocale = {
  ...persian_fa,
  weekDays: [
    ["شنبه", "ش"],
    ["یکشنبه", "ی"],
    ["دوشنبه", "د"],
    ["سه‌شنبه", "س"],
    ["چهارشنبه", "چ"],
    ["پنجشنبه", "پ"],
    ["جمعه", "ج"],
  ],
};

const amenityList = [
  { key: "cctv", label: "دوربین مداربسته (CCTV)" },
  { key: "security", label: "نگهبان" },
  { key: "covered", label: "مسقف" },
];

// --- Mock existing parking data (for edit mode) ---
const mockParkingById: Record<
  number,
  {
    name: string;
    address: string;
    phone: string;
    capacity: string;
    pricePerHour: string;
    description: string;
    province: string;
    postalCode: string;
    latitude: string;
    longitude: string;
    amenities: Amenities;
    images: string[];
    documents: string[];
    daySlots: DaySlot[];
  }
> = {
  1: {
    name: "پارکینگ اول",
    address: "تهران / میدان ونک",
    phone: "021-88112233",
    capacity: "50",
    pricePerHour: "15000",
    description: "پارکینگ سرپوشیده با امنیت بالا در نزدیکی میدان ونک",
    province: "تهران",
    postalCode: "1958765432",
    latitude: "35.7575",
    longitude: "51.4100",
    amenities: { cctv: true, security: true, covered: false },
    images: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=200",
    ],
    documents: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=200",
    ],
    daySlots: [
      {
        id: 1,
        date: "",
        dayName: "شنبه",
        selectedHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      },
    ],
  },
  2: {
    name: "پارکینگ دوم",
    address: "تهران / پارک وی",
    phone: "021-22446688",
    capacity: "30",
    pricePerHour: "12000",
    description: "پارکینگ مسقف با دوربین مداربسته در پارک وی",
    province: "تهران",
    postalCode: "1966778899",
    latitude: "35.7720",
    longitude: "51.4180",
    amenities: { cctv: true, security: false, covered: true },
    images: [],
    documents: [],
    daySlots: [
      {
        id: 1,
        date: "",
        dayName: "یکشنبه",
        selectedHours: [9, 10, 11, 12, 13, 14],
      },
    ],
  },
  3: {
    name: "پارکینگ سوم",
    address: "تهران / میدان رسالت",
    phone: "021-77889900",
    capacity: "20",
    pricePerHour: "10000",
    description: "پارکینگ روباز در میدان رسالت",
    province: "تهران",
    postalCode: "1655443322",
    latitude: "35.7350",
    longitude: "51.4890",
    amenities: { cctv: false, security: false, covered: false },
    images: [],
    documents: [],
    daySlots: [
      {
        id: 1,
        date: "",
        dayName: "دوشنبه",
        selectedHours: [7, 8, 9, 10],
      },
    ],
  },
};

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

interface DateObject {
  weekDay: { index: number };
  toString: () => string;
}

interface Amenities {
  cctv: boolean;
  security: boolean;
  covered: boolean;
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

const getPersianDayName = (dateObject: DateObject | null): string => {
  if (!dateObject) return "";
  const days: Record<number, string> = {
    0: "شنبه",
    1: "یکشنبه",
    2: "دوشنبه",
    3: "سه‌شنبه",
    4: "چهارشنبه",
    5: "پنجشنبه",
    6: "جمعه",
  };
  return days[dateObject.weekDay.index] ?? "";
};

// --- Map click handler ---
function MapClickHandler({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// --- Component ---
export default function ParkingForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    capacity: "",
    pricePerHour: "",
    description: "",
    province: "",
    postalCode: "",
    latitude: "",
    longitude: "",
  });

  const [amenities, setAmenities] = useState<Amenities>({
    cctv: false,
    security: false,
    covered: false,
  });

  const [provinceSearch, setProvinceSearch] = useState("");
  const [showProvinceList, setShowProvinceList] = useState(false);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [daySlots, setDaySlots] = useState<DaySlot[]>([
    { id: 1, date: "", dayName: "", selectedHours: [] },
  ]);

  // --- Pre-fill form with existing parking data when editing ---
  useEffect(() => {
    if (!isEdit) return;
    const existing = mockParkingById[Number(id)];
    if (!existing) return;
    setForm({
      name: existing.name,
      address: existing.address,
      phone: existing.phone,
      capacity: existing.capacity,
      pricePerHour: existing.pricePerHour,
      description: existing.description,
      province: existing.province,
      postalCode: existing.postalCode,
      latitude: existing.latitude,
      longitude: existing.longitude,
    });
    setAmenities(existing.amenities);
    setProvinceSearch(existing.province);
    if (existing.latitude && existing.longitude) {
      setMarkerPos([Number(existing.latitude), Number(existing.longitude)]);
    }
    setImages(existing.images);
    setDocuments(
      existing.documents.map((url) => ({
        name: url.split("/").pop() ?? "document",
        url,
      })),
    );
    setDaySlots(
      existing.daySlots.length
        ? existing.daySlots
        : [{ id: 1, date: "", dayName: "", selectedHours: [] }],
    );
  }, [id, isEdit]);

  // --- Handlers ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProvinceSelect = (province: string) => {
    setForm({ ...form, province });
    setProvinceSearch(province);
    setShowProvinceList(false);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setMarkerPos([lat, lng]);
    setForm((prev) => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((f) => {
      setImages((prev) => [...prev, URL.createObjectURL(f)]);
    });
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((f) => {
      setDocuments((prev) => [
        ...prev,
        { name: f.name, url: URL.createObjectURL(f) },
      ]);
    });
  };

  const toggleAmenity = (key: keyof Amenities) => {
    setAmenities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleHour = (dayId: number, hour: number) => {
    setDaySlots((prev) =>
      prev.map((d) =>
        d.id === dayId
          ? {
              ...d,
              selectedHours: d.selectedHours.includes(hour)
                ? d.selectedHours.filter((h) => h !== hour)
                : [...d.selectedHours, hour],
            }
          : d,
      ),
    );
  };

  const handleDateChange = (
    dayId: number,
    dateObject: DateObject | null,
    dateStr: string,
  ) => {
    setDaySlots((prev) =>
      prev.map((d) =>
        d.id === dayId
          ? { ...d, date: dateStr, dayName: getPersianDayName(dateObject) }
          : d,
      ),
    );
  };

  const addNewDay = () => {
    setDaySlots((prev) => [
      ...prev,
      { id: Date.now(), date: "", dayName: "", selectedHours: [] },
    ]);
  };

  const removeDay = (dayId: number) => {
    setDaySlots((prev) => prev.filter((d) => d.id !== dayId));
  };

  const buildPayload = () => {
    return daySlots.map((d) => ({
      date: d.date,
      dayName: d.dayName,
      timeFrames: hoursToTimeFrames(d.selectedHours),
    }));
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      amenities,
      schedule: buildPayload(),
      images,
      documents: documents.map((d) => d.url),
    };
    console.log("payload:", JSON.stringify(payload, null, 2));
    navigate("/dashboard/management");
  };

  const filteredProvinces = iranProvinces.filter((p) =>
    p.includes(provinceSearch),
  );

  // --- Render ---
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/dashboard/management")}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <ArrowRight size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEdit ? "ویرایش پارکینگ" : "افزودن پارکینگ جدید"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            اطلاعات پارکینگ را وارد کنید
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
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="مثال: پارکینگ ونک"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-right"
                dir="rtl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                شماره تماس
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="021-XXXXXXXX"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                dir="ltr"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                شماره پارکینگ
              </label>
              <input
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                placeholder="مثال: 3"
                type="number"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-right"
                dir="rtl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                قیمت هر ساعت (تومان)
              </label>
              <input
                name="pricePerHour"
                value={form.pricePerHour}
                onChange={handleChange}
                placeholder="مثال: 15000"
                //type="number"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-right"
                dir="rtl"
              />
            </div>

            {/* Province search */}
            <div className="space-y-1.5 relative">
              <label className="text-sm font-medium text-foreground">شهر</label>
              <input
                value={provinceSearch}
                onChange={(e) => {
                  setProvinceSearch(e.target.value);
                  setShowProvinceList(true);
                }}
                onFocus={() => setShowProvinceList(true)}
                onBlur={() => setTimeout(() => setShowProvinceList(false), 150)}
                placeholder="جستجوی شهر..."
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-right"
                dir="rtl"
              />
              {showProvinceList && filteredProvinces.length > 0 && (
                <div className="absolute z-20 w-full bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1">
                  {filteredProvinces.map((province) => (
                    <button
                      key={province}
                      onMouseDown={() => handleProvinceSelect(province)}
                      className="w-full text-right px-3 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      {province}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                کد پستی
              </label>
              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="مثال: 1234567890"
                maxLength={10}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              آدرس کامل
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="تهران / خیابان ..."
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-right"
              dir="rtl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              توضیحات
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="توضیحات اضافی درباره پارکینگ..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-right resize-none"
              dir="rtl"
            />
          </div>
        </div>

        {/* ── Map ── */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="font-semibold text-foreground">موقعیت روی نقشه</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              روی نقشه کلیک کنید تا موقعیت پارکینگ مشخص شود
            </p>
          </div>

          <div className="rounded-xl overflow-hidden border border-border h-64">
            <MapContainer
              center={[35.6892, 51.389]}
              zoom={11}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapClickHandler onSelect={handleLocationSelect} />
              {markerPos && <Marker position={markerPos} />}
            </MapContainer>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                طول جغرافیایی
              </label>
              <input
                value={form.longitude}
                readOnly
                placeholder="از نقشه انتخاب کنید"
                className="w-full px-3 py-2 rounded-lg border border-input bg-muted text-sm text-center cursor-not-allowed"
                dir="ltr"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                عرض جغرافیایی
              </label>
              <input
                value={form.latitude}
                readOnly
                placeholder="از نقشه انتخاب کنید"
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
            {images.map((img, i) => (
              <div
                key={i}
                className="relative w-24 h-24 rounded-xl overflow-hidden border border-border group"
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() =>
                    setImages((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:text-primary transition-colors text-muted-foreground">
              <Plus size={20} />
              <span className="text-xs mt-1">افزودن</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        {/* ── Documents ── */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-foreground border-b border-border pb-2">
            مدارک پارکینگ
          </h2>
          <div className="space-y-2">
            {documents.map((doc, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-muted rounded-lg px-3 py-2 gap-2"
              >
                <button
                  onClick={() =>
                    setDocuments((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                >
                  <X size={16} />
                </button>
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
            <label className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border-2 border-dashed border-border cursor-pointer hover:border-primary hover:text-primary transition-colors text-muted-foreground text-sm">
              <Plus size={16} />
              افزودن مدرک (PNG، JPG، JPEG)
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                multiple
                className="hidden"
                onChange={handleDocumentUpload}
              />
            </label>
          </div>
        </div>

        {/* ── Amenities ── */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-foreground border-b border-border pb-2">
            امکانات پارکینگ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" dir="rtl">
            {amenityList.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleAmenity(item.key as keyof Amenities)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-right ${
                  amenities[item.key as keyof Amenities]
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
                    amenities[item.key as keyof Amenities]
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  {amenities[item.key as keyof Amenities] && (
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
                <span className="text-sm font-medium">
                  {item.icon} {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Time Slots ── */}
        <div className="space-y-3">
          {daySlots.map((daySlot, index) => (
            <div
              key={daySlot.id}
              className="bg-card border border-border rounded-2xl p-5 space-y-4"
            >
              {/* Day header */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  {daySlots.length > 1 && (
                    <button
                      onClick={() => removeDay(daySlot.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3" dir="rtl">
                  {daySlot.dayName && (
                    <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {daySlot.dayName}
                    </span>
                  )}
                  <DatePicker
                    calendar={persian}
                    locale={customLocale}
                    calendarPosition="bottom-right"
                    minDate={new Date()}
                    value={daySlot.date}
                    onChange={(date: DateObject | null) => {
                      handleDateChange(
                        daySlot.id,
                        date,
                        date ? date.toString() : "",
                      );
                    }}
                    render={(value: string, openCalendar: () => void) => (
                      <button
                        type="button"
                        onClick={openCalendar}
                        className="px-3 py-1.5 rounded-lg border border-input bg-background text-sm text-foreground hover:border-primary transition-colors min-w-[120px] text-right"
                        dir="rtl"
                      >
                        {value || "انتخاب تاریخ"}
                      </button>
                    )}
                  />
                  <h2 className="font-semibold text-foreground">زمان‌بندی</h2>
                </div>
              </div>

              <p className="text-sm text-muted-foreground text-right">
                ساعت‌های فعال برای رزرو را انتخاب کنید
              </p>

              {/* Hours grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <button
                    key={hour}
                    onClick={() => toggleHour(daySlot.id, hour)}
                    className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                      daySlot.selectedHours.includes(hour)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {String(hour).padStart(2, "0")}:00
                  </button>
                ))}
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

              {/* Add new day button */}
              {index === daySlots.length - 1 && (
                <button
                  onClick={addNewDay}
                  disabled={daySlots.length >= 7}
                  className="w-full py-2.5 rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                  اضافه کردن روز جدید
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ── Submit ── */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/management")}
          >
            انصراف
          </Button>
          <Button onClick={handleSubmit}>
            {isEdit ? "ذخیره تغییرات" : "ثبت پارکینگ"}
          </Button>
        </div>
      </div>
    </div>
  );
}
