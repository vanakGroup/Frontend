import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Mock data — replace with API later
const mockSchedule: Record<
  number,
  {
    date: string;
    dayName: string;
    timeFrames: { start: number; end: number }[];
  }[]
> = {
  1: [
    {
      date: "1405-3-20",
      dayName: "پنجشنبه",
      timeFrames: [
        { start: 8, end: 12 },
        { start: 15, end: 18 },
      ],
    },
    {
      date: "1405-3-21",
      dayName: "جمعه",
      timeFrames: [{ start: 10, end: 14 }],
    },
  ],
  2: [
    {
      date: "1405-3-20",
      dayName: "پنجشنبه",
      timeFrames: [{ start: 9, end: 13 }],
    },
  ],
  3: [],
};

const mockParkingNames: Record<number, string> = {
  1: "پارکینگ اول",
  2: "پارکینگ دوم",
  3: "پارکینگ سوم",
};

export default function ParkingSlots() {
  const navigate = useNavigate();
  const { id } = useParams();
  const parkingId = Number(id);

  const schedule = mockSchedule[parkingId] ?? [];
  const parkingName = mockParkingNames[parkingId] ?? "پارکینگ";

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
