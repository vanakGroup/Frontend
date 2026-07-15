import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, X, Trash2, Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { parkingService } from "@/services/parkingService";
import type { ParkingDetailResponse, StaticItem } from "@/types/parking";
import CustomToast from "@/components/Custom/CustomToast";
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

interface TimeFrame {
  start: number;
  end: number;
}

interface DaySlot {
  id: number;
  date: string;
  dateISO: string;
  dayName: string;
  selectedHours: number[];
}

interface ImageFile {
  file: File;
  preview: string;
}

interface DocumentFile {
  file: File;
  name: string;
  url: string;
}

interface DateObject {
  weekDay: { index: number };
  toString: () => string;
  toDate: () => Date;
}

const fetchUrlAsFile = async (
  url: string,
  filename: string,
): Promise<File | null> => {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || "image/png" });
  } catch (err) {
    console.error("Failed to fetch file from url:", url, err);
    return null;
  }
};

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

const getPersianDayNameFromISO = (dateString: string): string => {
  if (!dateString) return "";
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
  if (isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const dateObjectToISO = (dateObject: DateObject | null): string => {
  if (!dateObject || typeof dateObject.toDate !== "function") return "";
  const native = dateObject.toDate();
  if (isNaN(native.getTime())) return "";
  return native.toISOString();
};

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

export default function ParkingForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    postalCode: "",
    unitNumber: "",
    pricePerHour: "",
    cityId: "",
  });

  const [selectedAttributeIds, setSelectedAttributeIds] = useState<number[]>(
    [],
  );
  const [citySearch, setCitySearch] = useState("");
  const [showCityList, setShowCityList] = useState(false);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [documentFile, setDocumentFile] = useState<DocumentFile | null>(null);
  const [daySlots, setDaySlots] = useState<DaySlot[]>([
    { id: 1, date: "", dateISO: "", dayName: "", selectedHours: [] },
  ]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<StaticItem[]>([]);
  const [attributes, setAttributes] = useState<StaticItem[]>([]);

  useEffect(() => {
    if (isEdit && id) {
      loadEditData(id);
    } else {
      loadStaticData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const loadStaticData = async () => {
    try {
      const [citiesData, attributesData] = await Promise.all([
        parkingService.getCities(),
        parkingService.getAttributes(),
      ]);
      setCities(citiesData.data ?? []);
      setAttributes(attributesData.data ?? []);
      return {
        cities: citiesData.data ?? [],
        attributes: attributesData.data ?? [],
      };
    } catch (err) {
      console.error("Error loading static data:", err);
      return { cities: [], attributes: [] };
    }
  };

  const loadEditData = async (parkingId: string) => {
    setLoading(true);
    try {
      const { cities: loadedCities } = await loadStaticData();
      const parkingRes = await parkingService.getParkingDetail(parkingId);
      const parking = parkingRes.data;
      if (parking) {
        await applyParkingData(parking, loadedCities);
      }
    } catch (err) {
      setError("خطا در بارگذاری اطلاعات پارکینگ");
      console.error("Error loading parking:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyParkingData = async (
    parking: ParkingDetailResponse,
    allCities: StaticItem[],
  ) => {
    setForm({
      name: parking.title,
      address: parking.address.exactAddress,
      latitude: parking.latitude.toString(),
      longitude: parking.longitude.toString(),
      postalCode: parking.address.postalCode,
      unitNumber: parking.address.unitNumber.toString(),
      pricePerHour: parking.basePrice.toString(),
      cityId: parking.address.cityId.toString(),
    });

    setSelectedAttributeIds(parking.attributeIds ?? []);

    const cityName =
      allCities.find((c) => c.id === parking.address.cityId)?.name ?? "";
    setCitySearch(cityName);
    setShowCityList(false);

    if (parking.latitude && parking.longitude) {
      setMarkerPos([parking.latitude, parking.longitude]);
    }

    if (parking.imageUrls && parking.imageUrls.length > 0) {
      const fetched = await Promise.all(
        parking.imageUrls.map((url, i) =>
          fetchUrlAsFile(url, `image-${i}`).then((file) => ({ url, file, i })),
        ),
      );
      setImages(
        fetched
          .filter((x): x is { url: string; file: File; i: number } => !!x.file)
          .map(({ file, url }) => ({ file, preview: url })),
      );
    }

    if (parking.documentUrl) {
      setDocumentFile({
        file: null as any, // نیازی به دانلود فایل واقعی نیست، فقط برای نمایش آدرسش رو می‌خوایم
        name: "مدرک بارگذاری‌شده قبلی",
        url: parking.documentUrl,
      });
    }

    const slotsByDate: Record<string, number[]> = {};
    parking.slots?.forEach((slot) => {
      if (!slotsByDate[slot.date]) {
        slotsByDate[slot.date] = [];
      }
      slotsByDate[slot.date].push(slot.hour);
    });

    const newDaySlots = Object.entries(slotsByDate).map(([date, hours], i) => ({
      id: Date.now() + i,
      date: isoToPersianDate(date),
      dateISO: new Date(date).toISOString(),
      dayName: getPersianDayNameFromISO(date),
      selectedHours: hours,
    }));

    setDaySlots(
      newDaySlots.length > 0
        ? newDaySlots
        : [{ id: 1, date: "", dateISO: "", dayName: "", selectedHours: [] }],
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCitySelect = (cityId: number, cityName: string) => {
    setForm({ ...form, cityId: cityId.toString() });
    setCitySearch(cityName);
    setShowCityList(false);
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
      setImages((prev) => [
        ...prev,
        { file: f, preview: URL.createObjectURL(f) },
      ]);
    });
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setDocumentFile({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    });
  };

  const toggleAttribute = (attributeId: number) => {
    setSelectedAttributeIds((prev) =>
      prev.includes(attributeId)
        ? prev.filter((id) => id !== attributeId)
        : [...prev, attributeId],
    );
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

  const handleDateChange = (dayId: number, dateObject: DateObject | null) => {
    setDaySlots((prev) =>
      prev.map((d) =>
        d.id === dayId
          ? {
              ...d,
              date: dateObject ? dateObject.toString() : "",
              dateISO: dateObjectToISO(dateObject),
              dayName: getPersianDayName(dateObject),
            }
          : d,
      ),
    );
  };

  const addNewDay = () => {
    setDaySlots((prev) => [
      ...prev,
      { id: Date.now(), date: "", dateISO: "", dayName: "", selectedHours: [] },
    ]);
  };

  const removeDay = (dayId: number) => {
    setDaySlots((prev) => prev.filter((d) => d.id !== dayId));
  };

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("title", form.name);
    formData.append("latitude", form.latitude);
    formData.append("longitude", form.longitude);
    formData.append("basePrice", form.pricePerHour);
    formData.append("address.cityId", form.cityId);
    formData.append("address.postalCode", form.postalCode);
    formData.append("address.unitNumber", form.unitNumber);
    formData.append("address.exactAddress", form.address);

    if (selectedAttributeIds.length > 0) {
      selectedAttributeIds.forEach((attrId) => {
        formData.append("attributeIds", attrId.toString());
      });
    }

    const slots: Array<{ Date: string; StartHour: number; EndHour: number }> =
      [];
    daySlots.forEach((daySlot) => {
      if (daySlot.dateISO && daySlot.selectedHours.length > 0) {
        const timeFrames = hoursToTimeFrames(daySlot.selectedHours);
        timeFrames.forEach((frame) => {
          slots.push({
            Date: daySlot.dateISO,
            StartHour: frame.start,
            EndHour: frame.end,
          });
        });
      }
    });

    formData.append("slots", JSON.stringify(slots));

    if (documentFile && documentFile.file.size > 0) {
      formData.append("documentFile", documentFile.file);
    }

    const newImages = images.filter((img) => img.file.size > 0);
    newImages.forEach((img) => {
      formData.append("images", img.file);
    });

    if (isEdit && id) {
      formData.append("parkingId", id);
    }

    return formData;
  };

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.address ||
      !form.latitude ||
      !form.longitude ||
      !form.pricePerHour ||
      !form.cityId ||
      !form.postalCode ||
      !form.unitNumber
    ) {
      setError("لطفاً تمام فیلدهای اجباری را پر کنید");
      CustomToast.error("لطفاً تمام فیلدهای اجباری را پر کنید");
      return;
    }

    if (!documentFile) {
      setError("بارگذاری مدرک پارکینگ الزامی است");
      CustomToast.error("بارگذاری مدرک پارکینگ الزامی است");
      return;
    }

    if (form.postalCode.length !== 10) {
      setError("کد پستی باید دقیقاً ۱۰ رقم باشد");
      CustomToast.error("کد پستی باید دقیقاً ۱۰ رقم باشد");
      return;
    }

    const invalidSlot = daySlots.find(
      (d) =>
        (d.selectedHours.length > 0 && !d.dateISO) ||
        (d.dateISO && d.selectedHours.length === 0),
    );
    if (invalidSlot) {
      const msg =
        invalidSlot.selectedHours.length > 0
          ? "برای ساعت‌های انتخاب‌شده باید تاریخ را مشخص کنید"
          : "برای تاریخ انتخاب‌شده باید حداقل یک ساعت انتخاب کنید";
      setError(msg);
      CustomToast.error(msg);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const formData = buildFormData();

      if (isEdit) {
        await parkingService.updateParking(formData);
        CustomToast.success("پارکینگ با موفقیت ویرایش شد");
      } else {
        await parkingService.createParking(formData);
        CustomToast.success("پارکینگ با موفقیت ثبت شد");
      }

      navigate("/dashboard/management");
    } catch (err) {
      setError("خطا در ذخیره پارکینگ");
      CustomToast.error("خطا در ذخیره پارکینگ");
      console.error("Error saving parking:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCities = cities.filter((c) => c.name.includes(citySearch));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
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

      {error && (
        <div className="mb-6 bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-right">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-5 pb-10">
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-foreground border-b border-border pb-2">
            اطلاعات پایه
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                نام پارکینگ <span className="text-destructive">*</span>
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
                قیمت هر ساعت (تومان) <span className="text-destructive">*</span>
              </label>
              <input
                name="pricePerHour"
                value={form.pricePerHour}
                onChange={handleChange}
                placeholder="مثال: 15000"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-right"
                dir="rtl"
              />
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-sm font-medium text-foreground">
                شهر <span className="text-destructive">*</span>
              </label>
              <input
                value={citySearch}
                onChange={(e) => {
                  setCitySearch(e.target.value);
                  setShowCityList(true);
                }}
                onFocus={() => setShowCityList(true)}
                onBlur={() => setTimeout(() => setShowCityList(false), 150)}
                placeholder="جستجوی شهر..."
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-right"
                dir="rtl"
              />
              {showCityList && filteredCities.length > 0 && (
                <div className="absolute z-20 w-full bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1">
                  {filteredCities.map((city) => (
                    <button
                      key={city.id}
                      onMouseDown={() => handleCitySelect(city.id, city.name)}
                      className="w-full text-right px-3 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                کد پستی <span className="text-destructive">*</span>
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

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                شماره واحد <span className="text-destructive">*</span>
              </label>
              <input
                name="unitNumber"
                value={form.unitNumber}
                onChange={handleChange}
                placeholder="مثال: 1"
                type="number"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-right"
                dir="rtl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              آدرس کامل <span className="text-destructive">*</span>
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
        </div>

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
                value={translateNumber(form.longitude)}
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
                value={translateNumber(form.latitude)}
                readOnly
                placeholder="از نقشه انتخاب کنید"
                className="w-full px-3 py-2 rounded-lg border border-input bg-muted text-sm text-center cursor-not-allowed"
                dir="ltr"
              />
            </div>
          </div>
        </div>

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
                <img
                  src={img.preview}
                  alt=""
                  className="w-full h-full object-cover"
                />
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

        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-foreground border-b border-border pb-2">
            مدارک پارکینگ <span className="text-destructive">*</span>
          </h2>
          {documentFile ? (
            <div className="space-y-2">
              <div
                className="relative flex items-center justify-between bg-muted rounded-lg p-2 min-h-[56px]"
                dir="rtl"
              >
                {/* بخش تصویر یا آیکون مدرک (سمت راست) */}
                <div className="w-10 h-10 rounded-md border border-border bg-background flex items-center justify-center overflow-hidden shrink-0 z-10">
                  {documentFile.url ? (
                    <img
                      src={documentFile.url}
                      alt={documentFile.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // اگر عکس لود نشد، تصویر مخفی بشه تا آیکون زاپاس دیده بشه
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <FileText size={18} className="text-muted-foreground" />
                  )}
                </div>

                {/* متن مدرک که کاملاً وسط‌چین شده است */}
                <span className="absolute inset-x-0 text-center text-sm text-foreground font-medium truncate px-16 pointer-events-none">
                  {documentFile.name}
                </span>

                {/* دکمه حذف مدرک (سمت چپ) */}
                <button
                  onClick={() => setDocumentFile(null)}
                  className="text-muted-foreground hover:text-destructive transition-colors shrink-0 z-10 p-1.5 rounded-md hover:bg-background/50"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border-2 border-dashed border-border cursor-pointer hover:border-primary hover:text-primary transition-colors text-muted-foreground text-sm">
              <Plus size={16} />
              افزودن مدرک (PNG، JPG، JPEG) - الزامی
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleDocumentUpload}
              />
            </label>
          )}
        </div>

        {attributes.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <h2 className="font-semibold text-foreground border-b border-border pb-2">
              امکانات پارکینگ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" dir="rtl">
              {attributes.map((attr) => {
                const selected = selectedAttributeIds.includes(attr.id);
                return (
                  <button
                    key={attr.id}
                    type="button"
                    onClick={() => toggleAttribute(attr.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-right ${
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
                        selected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {selected && (
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
                    <span className="text-sm font-medium">{attr.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {daySlots.map((daySlot, index) => (
            <div
              key={daySlot.id}
              className="bg-card border border-border rounded-2xl p-5 space-y-4"
            >
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
                    <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full text-center">
                      {daySlot.dayName}
                    </span>
                  )}
                  <DatePicker
                    calendar={persian}
                    locale={customLocale}
                    calendarPosition="bottom-right"
                    minDate={new Date()}
                    value={daySlot.dateISO}
                    onChange={(date: DateObject | null) => {
                      handleDateChange(daySlot.id, date);
                    }}
                    render={(value: string, openCalendar: () => void) => (
                      <button
                        type="button"
                        onClick={openCalendar}
                        className="flex items-center justify-center px-3 py-1.5 rounded-lg border border-input bg-background text-sm text-foreground hover:border-primary transition-colors min-w-[120px] text-center"
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
                    {translateNumber(String(hour).padStart(2, "0") + ":00")}
                  </button>
                ))}
              </div>

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
                          {translateNumber(
                            `${String(frame.start).padStart(2, "0")}:00 – ${String(frame.end).padStart(2, "0")}:00`,
                          )}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}

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

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/management")}
            disabled={submitting}
          >
            انصراف
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={16} className="ml-2 animate-spin" />
                در حال ذخیره...
              </>
            ) : isEdit ? (
              "ذخیره تغییرات"
            ) : (
              "ثبت پارکینگ"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
