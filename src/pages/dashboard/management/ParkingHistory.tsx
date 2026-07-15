import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
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
  bucketOf,
  customLocale,
  dateFromStartTime,
  rangeEndOf,
} from "./components/parkingHistory/utils";
import type { ChartMode, Period } from "./components/parkingHistory/types";
import type { ReservationDTO } from "@/types/reservation";
import { parkingService } from "@/services/parkingService";
import { reservationService } from "@/services/reservationService";
import { Button } from "@/components/ui/button";

export default function ParkingHistory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const parkingId = id ?? "";

  const [reservations, setReservations] = useState<ReservationDTO[]>([]);
  const [parkingName, setParkingName] = useState("پارکینگ");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ReservationDTO | null>(null);

  const today = startOfToday();

  const loadReservations = useCallback(async () => {
    if (!parkingId) return;
    try {
      setLoading(true);
      setError(null);
      const [detail, list] = await Promise.all([
        parkingService.getParkingDetail(parkingId),
        reservationService.getParkingReservations(parkingId),
      ]);
      if (detail.data?.title) setParkingName(detail.data.title);
      setReservations(list.data ?? []);
    } catch (err) {
      setError("خطا در بارگذاری رزروها");
      console.error("Error loading reservations:", err);
    } finally {
      setLoading(false);
    }
  }, [parkingId]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

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
  const [mode, setMode] = useState<ChartMode>("aggregate");
  const [rangeStart, setRangeStart] = useState<DateObject | null>(defaultFrom);
  const [rangePeriod, setRangePeriod] = useState<Period>("month");

  const fromJs = from?.toDate() ?? null;
  const toJs = to?.toDate() ?? null;
  const rangeStartJs = rangeStart?.toDate() ?? null;
  const rangeEndJs = useMemo(
    () => (rangeStartJs ? rangeEndOf(rangeStartJs, rangePeriod) : null),
    [rangeStartJs, rangePeriod],
  );

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      const d = startOfDay(dateFromStartTime(r.start_time));
      if (mode === "range") {
        if (!rangeStartJs) return false;
        if (d < startOfDay(rangeStartJs)) return false;
        if (rangeEndJs && d >= startOfDay(rangeEndJs)) return false;
        return true;
      }
      if (fromJs && d < startOfDay(fromJs)) return false;
      if (toJs && d > startOfDay(toJs)) return false;
      return true;
    });
  }, [reservations, mode, fromJs, toJs, rangeStartJs, rangeEndJs]);

  const chartData = useMemo(() => {
    const map = new Map<
      string,
      { key: string; label: string; start: Date; revenue: number; upcoming: number }
    >();
    const granularity = mode === "range" ? "day" : period;
    for (const r of filtered) {
      const start = dateFromStartTime(r.start_time);
      const { key, label, start: bucketStart } = bucketOf(start, granularity);
      const existing = map.get(key) ?? {
        key,
        label,
        start: bucketStart,
        revenue: 0,
        upcoming: 0,
      };
      if (start.getTime() > today.getTime()) {
        existing.upcoming += r.total_price;
      } else {
        existing.revenue += r.total_price;
      }
      map.set(key, existing);
    }
    return Array.from(map.values()).sort(
      (a, b) => a.start.getTime() - b.start.getTime(),
    );
  }, [filtered, mode, period, today]);

  const sortedList = useMemo(
    () =>
      [...filtered].sort(
        (a, b) => b.start_time - a.start_time,
      ),
    [filtered],
  );

  const totalRevenue = filtered.reduce(
    (sum, r) =>
      dateFromStartTime(r.start_time).getTime() > today.getTime()
        ? sum
        : sum + r.total_price,
    0,
  );
  const totalUpcoming = filtered.reduce(
    (sum, r) =>
      dateFromStartTime(r.start_time).getTime() > today.getTime()
        ? sum + r.total_price
        : sum,
    0,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-2xl p-10 text-center">
          <p className="text-destructive text-sm">{error}</p>
          <Button variant="outline" className="mt-4" onClick={loadReservations}>
            تلاش مجدد
          </Button>
        </div>
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
            تاریخچه و تحلیل
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{parkingName}</p>
        </div>
      </div>

      <div className="space-y-6">
        <FilterBar
          mode={mode}
          from={from}
          to={to}
          period={period}
          rangeStart={rangeStart}
          rangePeriod={rangePeriod}
          onModeChange={setMode}
          onFromChange={setFrom}
          onToChange={setTo}
          onPeriodChange={setPeriod}
          onRangeStartChange={setRangeStart}
          onRangePeriodChange={setRangePeriod}
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

        <RevenueChart
          data={chartData}
          period={period}
          granularity={mode === "range" ? "روز" : undefined}
        />
      </div>

      <ReservationDialog
        reservation={selected}
        parkingId={parkingId}
        parkingName={parkingName}
        today={today}
        onClose={() => {
          setSelected(null);
          loadReservations();
        }}
        onSettled={loadReservations}
      />
    </div>
  );
}
