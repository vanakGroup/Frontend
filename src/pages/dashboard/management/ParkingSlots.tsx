import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getParkingInfo } from "@/services/parkingService";

interface Slot {
  id: number;
  date: string;
  hour: number;
  isBooked: boolean;
}

interface TimeFrame {
  start: number;
  end: number;
}

interface DaySchedule {
  date: string;
  dayName: string;
  timeFrames: TimeFrame[];
}

const buildSchedule = (slots: Slot[]): DaySchedule[] => {
  const byDate = new Map<string, number[]>();

  slots.forEach((slot) => {
    const hours = byDate.get(slot.date) ?? [];
    hours.push(slot.hour);
    byDate.set(slot.date, hours);
  });

  const dayMap: Record<number, string> = {
    0: "شنبه",
    1: "یکشنبه",
    2: "دوشنبه",
    3: "سه‌شنبه",
    4: "چهارشنبه",
    5: "پنجشنبه",
    6: "جمعه",
  };

  const result: DaySchedule[] = [];

  byDate.forEach((hours, date) => {
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

    const dayName = dayMap[new Date(date).getDay()] ?? "";
    result.push({ date, dayName, timeFrames: frames });
  });

  return result.sort((a, b) => a.date.localeCompare(b.date));
};

export default function ParkingSlots() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [parkingName, setParkingName] = useState("");
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getParkingInfo(id)
      .then((res) => {
        const data = res.data;
        setParkingName(data.title);
        setSchedule(buildSchedule(data.slots || []));
      })
      .catch((err) => console.error("get slots error:", err))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center text-muted-foreground">
        در حال بارگذاری زمان‌بندی...
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-foreground">زمان‌بندی</h1>
          <p className="text-muted-foreground text-sm mt-1">{parkingName}</p>
        </div>
      </div>

      {/* Schedule list */}
      {schedule.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-10 text-center">
          <p className="text-muted-foreground text-sm">
            هنوز زمان‌بندی برای این پارکینگ ثبت نشده
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {schedule.map((day, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-5 space-y-4"
            >
              {/* Day header */}
              <div
                className="flex items-center justify-between border-b border-border pb-3"
                dir="rtl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {day.dayName}
                  </span>
                  <span className="text-sm text-muted-foreground" dir="ltr">
                    {day.date}
                  </span>
                </div>
                <h2 className="font-semibold text-foreground">
                  روز {index + 1}
                </h2>
              </div>

              {/* Time frames */}
              <div className="space-y-2" dir="rtl">
                <p className="text-sm font-medium text-foreground">
                  بازه‌های زمانی فعال:
                </p>
                <div className="flex flex-wrap gap-2">
                  {day.timeFrames.map((frame, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2"
                      dir="ltr"
                    >
                      <span className="text-sm font-semibold text-primary">
                        {String(frame.start).padStart(2, "0")}:00
                      </span>
                      <span className="text-muted-foreground text-xs">تا</span>
                      <span className="text-sm font-semibold text-primary">
                        {String(frame.end).padStart(2, "0")}:00
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hours visual */}
              <div className="space-y-2" dir="rtl">
                <p className="text-sm font-medium text-foreground">
                  نمای ساعت‌ها:
                </p>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5">
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => {
                    const isActive = day.timeFrames.some(
                      (f) => hour >= f.start && hour < f.end,
                    );
                    return (
                      <div
                        key={hour}
                        className={`py-1.5 rounded-lg text-xs font-medium text-center border ${
                          isActive
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border text-muted-foreground"
                        }`}
                      >
                        {String(hour).padStart(2, "0")}
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
