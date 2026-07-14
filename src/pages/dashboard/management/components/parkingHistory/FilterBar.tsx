import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import DateObject from "react-date-object";
import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { customLocale } from "./utils";
import type { ChartMode, Period } from "./types";

interface FilterBarProps {
  mode: ChartMode;
  from: DateObject | null;
  to: DateObject | null;
  period: Period;
  rangeStart: DateObject | null;
  rangePeriod: Period;
  onModeChange: (value: ChartMode) => void;
  onFromChange: (value: DateObject | null) => void;
  onToChange: (value: DateObject | null) => void;
  onPeriodChange: (value: Period) => void;
  onRangeStartChange: (value: DateObject | null) => void;
  onRangePeriodChange: (value: Period) => void;
}

const MODE_LABEL: Record<ChartMode, string> = {
  aggregate: "تجمیعی",
  range: "بازه‌ای روزانه",
};

export function FilterBar({
  mode,
  from,
  to,
  period,
  rangeStart,
  rangePeriod,
  onModeChange,
  onFromChange,
  onToChange,
  onPeriodChange,
  onRangeStartChange,
  onRangePeriodChange,
}: FilterBarProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Calendar size={16} className="text-primary" />
          فیلتر بازه و دوره
        </div>
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(["aggregate", "range"] as ChartMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onModeChange(m)}
              className={`px-3 py-1 text-xs transition-colors ${
                mode === m
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-accent"
              }`}
            >
              {MODE_LABEL[m]}
            </button>
          ))}
        </div>
      </div>

      {mode === "aggregate" ? (
        <div className="flex flex-col sm:flex-row gap-3" dir="rtl">
          <div className="flex-1 w-full">
            <label className="block text-xs text-muted-foreground mb-1.5">
              از تاریخ
            </label>
            <DatePicker
              className="w-full"
              calendar={persian}
              locale={customLocale}
              calendarPosition="bottom-right"
              value={from}
              onChange={(value) => onFromChange(value as DateObject | null)}
              render={(value: string, openCalendar: () => void) => (
                <button
                  type="button"
                  onClick={openCalendar}
                  className="w-full! min-w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground hover:border-primary transition-colors text-right"
                  dir="rtl"
                >
                  {value || "انتخاب تاریخ"}
                </button>
              )}
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs text-muted-foreground mb-1.5">
              تا تاریخ
            </label>
            <DatePicker
              className="w-full"
              calendar={persian}
              locale={customLocale}
              calendarPosition="bottom-right"
              value={to}
              onChange={(value) => onToChange(value as DateObject | null)}
              render={(value: string, openCalendar: () => void) => (
                <button
                  type="button"
                  onClick={openCalendar}
                  className="w-full! min-w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground hover:border-primary transition-colors text-right"
                  dir="rtl"
                >
                  {value || "انتخاب تاریخ"}
                </button>
              )}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-muted-foreground mb-1.5">
              دوره
            </label>
            <Select
              value={period}
              onValueChange={(v) => onPeriodChange(v as Period)}
            >
              <SelectTrigger className="w-full h-[38px] bg-white! hover:border-primary data-[state=open]:border-primary">
                <SelectValue placeholder="دوره" />
              </SelectTrigger>
              <SelectContent className="bg-white! p-1">
                <SelectItem value="day">روز</SelectItem>
                <SelectItem value="week">هفته</SelectItem>
                <SelectItem value="month">ماه</SelectItem>
                <SelectItem value="year">سال</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3" dir="rtl">
          <div className="flex-1 w-full">
            <label className="block text-xs text-muted-foreground mb-1.5">
              تاریخ شروع
            </label>
            <DatePicker
              className="w-full"
              calendar={persian}
              locale={customLocale}
              calendarPosition="bottom-right"
              value={rangeStart}
              onChange={(value) => onRangeStartChange(value as DateObject | null)}
              render={(value: string, openCalendar: () => void) => (
                <button
                  type="button"
                  onClick={openCalendar}
                  className="w-full! min-w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground hover:border-primary transition-colors text-right"
                  dir="rtl"
                >
                  {value || "انتخاب تاریخ"}
                </button>
              )}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-muted-foreground mb-1.5">
              طول بازه
            </label>
            <Select
              value={rangePeriod}
              onValueChange={(v) => onRangePeriodChange(v as Period)}
            >
              <SelectTrigger className="w-full h-[38px] bg-white! hover:border-primary data-[state=open]:border-primary">
                <SelectValue placeholder="طول بازه" />
              </SelectTrigger>
              <SelectContent className="bg-white! p-1">
                <SelectItem value="day">یک روز</SelectItem>
                <SelectItem value="week">یک هفته</SelectItem>
                <SelectItem value="month">یک ماه</SelectItem>
                <SelectItem value="year">یک سال</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
