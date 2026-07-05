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
import type { Period } from "./types";

interface FilterBarProps {
  from: DateObject | null;
  to: DateObject | null;
  period: Period;
  onFromChange: (value: DateObject | null) => void;
  onToChange: (value: DateObject | null) => void;
  onPeriodChange: (value: Period) => void;
}

export function FilterBar({
  from,
  to,
  period,
  onFromChange,
  onToChange,
  onPeriodChange,
}: FilterBarProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Calendar size={16} className="text-primary" />
        فیلتر بازه و دوره
      </div>
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
    </div>
  );
}
