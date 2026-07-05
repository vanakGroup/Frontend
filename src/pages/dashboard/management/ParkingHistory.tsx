import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import persian from "react-date-object/calendars/persian";
import DateObject from "react-date-object";
import { startOfDay, startOfToday } from "date-fns-jalali";

import {
  FilterBar,
  ReservationDialog,
  ReservationList,
  RevenueChart,
  StatsCards,
} from "./components/parkingHistory";
import {
  buildMockReservations,
  customLocale,
  mockParkingNames,
  bucketOf,
} from "./components/parkingHistory/utils";
import type { Period, Reservation } from "./components/parkingHistory/types";

export default function ParkingHistory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const parkingId = Number(id);
  const parkingName = mockParkingNames[parkingId] ?? "پارکینگ";

  const allReservations = useMemo(
    () => buildMockReservations(parkingId),
    [parkingId],
  );

  const today = startOfToday();

  const defaultFrom = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - 180);
    return new DateObject({ date: d, calendar: persian, locale: customLocale });
  }, [today]);
  const defaultTo = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 45);
    return new DateObject({ date: d, calendar: persian, locale: customLocale });
  }, [today]);

  const [from, setFrom] = useState<DateObject | null>(defaultFrom);
  const [to, setTo] = useState<DateObject | null>(defaultTo);
  const [period, setPeriod] = useState<Period>("month");
  const [selected, setSelected] = useState<Reservation | null>(null);

  const fromJs = from?.toDate() ?? null;
  const toJs = to?.toDate() ?? null;

  const filtered = useMemo(() => {
    return allReservations.filter((r) => {
      const d = startOfDay(r.date);
      if (fromJs && d < startOfDay(fromJs)) return false;
      if (toJs && d > startOfDay(toJs)) return false;
      return true;
    });
  }, [allReservations, fromJs, toJs]);

  const chartData = useMemo(() => {
    const map = new Map<
      string,
      { key: string; label: string; start: Date; revenue: number; upcoming: number }
    >();
    for (const r of filtered) {
      const { key, label, start } = bucketOf(r.date, period);
      const existing = map.get(key) ?? {
        key,
        label,
        start,
        revenue: 0,
        upcoming: 0,
      };
      if (start.getTime() > today.getTime()) {
        existing.upcoming += r.totalPrice;
      } else {
        existing.revenue += r.totalPrice;
      }
      map.set(key, existing);
    }
    return Array.from(map.values()).sort(
      (a, b) => a.start.getTime() - b.start.getTime(),
    );
  }, [filtered, period, today]);

  const sortedList = useMemo(
    () => [...filtered].sort((a, b) => b.date.getTime() - a.date.getTime()),
    [filtered],
  );

  const totalRevenue = filtered.reduce(
    (sum, r) => (r.date.getTime() > today.getTime() ? sum : sum + r.totalPrice),
    0,
  );
  const totalUpcoming = filtered.reduce(
    (sum, r) => (r.date.getTime() > today.getTime() ? sum + r.totalPrice : sum),
    0,
  );

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
            تاریخچه و تحلیل
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{parkingName}</p>
        </div>
      </div>

      <div className="space-y-6">
        <FilterBar
          from={from}
          to={to}
          period={period}
          onFromChange={setFrom}
          onToChange={setTo}
          onPeriodChange={setPeriod}
        />

        <StatsCards
          totalRevenue={totalRevenue}
          totalUpcoming={totalUpcoming}
        />

        <ReservationList
          reservations={sortedList}
          today={today}
          onSelect={setSelected}
        />

        <RevenueChart data={chartData} period={period} />
      </div>

      <ReservationDialog
        reservation={selected}
        parkingName={parkingName}
        today={today}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
