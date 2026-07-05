import {
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

import type { Period, Reservation, TimeFrame } from "./types";

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

export const mockParkingNames: Record<number, string> = {
  1: "پارکینگ اول",
  2: "پارکینگ دوم",
  3: "پارکینگ سوم",
};

const reserverNames = [
  "رضا محمدی",
  "مریم احمدی",
  "عی رضایی",
  "زهرا کریمی",
  "حسین موسوی",
  "فاطمه نوری",
  "محمد حسینی",
  "سارا اکبری",
  "امیر رستمی",
  "نگار صادقی",
];

const carNames = [
  "پژو ۲۰۶",
  "پراید",
  "سمند",
  "دنا",
  "هایما",
  "کوییک",
  "تیبا",
  "رانا",
];

export const periodLabel: Record<Period, string> = {
  day: "روز",
  week: "هفته",
  month: "ماه",
  year: "سال",
};

export const buildMockReservations = (parkingId: number): Reservation[] => {
  const offsets = [
    -176, -168, -161, -150, -142, -135, -129, -121, -114, -108,
    -99, -90, -82, -77, -71, -64, -55, -48, -40, -33,
    -27, -21, -14, -9, -4, -1,
    2, 5, 9, 14, 18, 23, 29, 36, 41,
  ];
  const timeFrameOptions: TimeFrame[][] = [
    [{ start: 8, end: 12 }],
    [{ start: 9, end: 13 }],
    [{ start: 10, end: 14 }],
    [{ start: 8, end: 12 }, { start: 15, end: 18 }],
    [{ start: 14, end: 18 }],
    [{ start: 7, end: 11 }],
  ];
  const pricePerHour = 20000 + parkingId * 5000;
  const now = new Date();
  return offsets.map((dayOffset, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);
    date.setHours(10, 0, 0, 0);
    const frames = timeFrameOptions[index % timeFrameOptions.length];
    const hoursCount = frames.reduce((sum, f) => sum + (f.end - f.start), 0);
    return {
      id: index + 1,
      parkingId,
      reserverName: reserverNames[index % reserverNames.length],
      carName: carNames[index % carNames.length],
      date,
      timeFrames: frames,
      pricePerHour,
      totalPrice: hoursCount * pricePerHour,
    };
  });
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

export const formatTimeFrame = (frame: TimeFrame) =>
  `${String(frame.start).padStart(2, "0")}:00 – ${String(frame.end).padStart(2, "0")}:00`;

export const formatPrice = (value: number) => value.toLocaleString("fa-IR");
