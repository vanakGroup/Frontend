import {
  addDays,
  addMonths,
  addYears,
  format,
  getISOWeek,
  getISOWeekYear,
  startOfDay,
  startOfISOWeek,
  startOfMonth,
  startOfYear,
} from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import persian_fa from "react-date-object/locales/persian_fa";

import type { Period } from "./types";

export const customLocale = {
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

export const periodLabel: Record<Period, string> = {
  day: "روز",
  week: "هفته",
  month: "ماه",
  year: "سال",
};

export const bucketOf = (
  date: Date,
  period: Period,
): { key: string; label: string; start: Date } => {
  if (period === "day") {
    const start = startOfDay(date);
    return {
      key: format(start, "yyyy-MM-dd"),
      label: format(start, "d MMMM", { locale: faIR }),
      start,
    };
  }
  if (period === "week") {
    const start = startOfISOWeek(date);
    const week = getISOWeek(date);
    const weekYear = getISOWeekYear(date);
    return {
      key: `${weekYear}-W${String(week).padStart(2, "0")}`,
      label: `هفته ${week}`,
      start,
    };
  }
  if (period === "month") {
    const start = startOfMonth(date);
    return {
      key: format(start, "yyyy-MM"),
      label: format(start, "MMMM yyyy", { locale: faIR }),
      start,
    };
  }
  const start = startOfYear(date);
  return {
    key: format(start, "yyyy"),
    label: format(start, "yyyy", { locale: faIR }),
    start,
  };
};

export const formatJalaliDate = (date: Date) =>
  format(date, "d MMMM yyyy", { locale: faIR });

export const formatPrice = (value: number) => value.toLocaleString("fa-IR");

const TEHRAN_TIME_FORMATTER = new Intl.DateTimeFormat("fa-IR", {
  timeZone: "Asia/Tehran",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const formatHourMinute = (unixSeconds: number) =>
  TEHRAN_TIME_FORMATTER.format(new Date(unixSeconds * 1000));

export const formatTimeRange = (startTime: number, endTime: number) =>
  `${formatHourMinute(startTime)} – ${formatHourMinute(endTime)}`;

export const dateFromStartTime = (startTime: number) =>
  new Date(startTime * 1000);

export const statusLabel: Record<string, string> = {
  pending: "در انتظار",
  confirmed: "تاییدشده",
  completed: "تکمیل‌شده",
  cancelled: "لغوشده",
};

export const rangeEndOf = (start: Date, period: Period): Date => {
  switch (period) {
    case "day":
      return addDays(start, 1);
    case "week":
      return addDays(start, 7);
    case "month":
      return addMonths(start, 1);
    case "year":
      return addYears(start, 1);
    default:
      return addDays(start, 1);
  }
};
