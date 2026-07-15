import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { parkingService } from "@/services/parkingService";
import type { ParkingDetailResponse } from "@/types/parking";
import { Button } from "@/components/ui/button";
import { translateNumber } from "@/utils/translateNumber";

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

export default function ParkingSlots() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [parking, setParking] = useState<ParkingDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadParkingData(id);
    }
  }, [id]);

  const loadParkingData = async (parkingId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await parkingService.getParkingDetail(parkingId);
      setParking(data.data);
    } catch (err) {
      setError("خطا در بارگذاری زمان‌بندی");
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
            {error || "خطا در بارگذاری اطلاعات"}
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

  const groupedSlots = groupSlotsByDate(parking.slots ?? []);

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
          <h1 className="text-2xl font-bold text-foreground">زمان‌بندی</h1>
          <p className="text-muted-foreground text-sm mt-1">{parking.title}</p>
        </div>
      </div>

      {groupedSlots.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-10 text-center">
          <p className="text-muted-foreground text-sm">
            هنوز زمان‌بندی برای این پارکینگ ثبت نشده
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedSlots.map((day, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-5 space-y-4"
            >
              <div
                className="flex items-center justify-between border-b border-border pb-3"
                dir="rtl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {day.dayName}
                  </span>
                  <span className="text-sm text-muted-foreground" dir="rtl">
                    {day.persianDate || day.date}
                  </span>
                </div>
                <h2 className="font-semibold text-foreground">
                  روز {translateNumber(index + 1)}
                </h2>
              </div>

              <div className="space-y-2" dir="rtl">
                <p className="text-sm font-medium text-foreground">
                  بازه‌های زمانی فعال:
                </p>
                <div className="flex flex-wrap gap-2">
                  {hoursToTimeFrames(day.hours).map((frame, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2"
                      dir="ltr"
                    >
                      <span className="text-sm font-semibold text-primary">
                        {translateNumber(
                          String(frame.start).padStart(2, "0") + ":00",
                        )}
                      </span>
                      <span className="text-muted-foreground text-xs">تا</span>
                      <span className="text-sm font-semibold text-primary">
                        {translateNumber(
                          String(frame.end).padStart(2, "0") + ":00",
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2" dir="rtl">
                <p className="text-sm font-medium text-foreground">
                  نمای ساعت‌ها:
                </p>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5">
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => {
                    const isActive = day.hours.includes(hour);
                    return (
                      <div
                        key={hour}
                        className={`py-1.5 rounded-lg text-xs font-medium text-center border ${
                          isActive
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border text-muted-foreground"
                        }`}
                      >
                        {translateNumber(String(hour).padStart(2, "0"))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
