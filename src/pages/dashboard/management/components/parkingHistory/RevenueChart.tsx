import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatPrice, periodLabel } from "./utils";
import type { Bucket, Period } from "./types";

interface RevenueChartProps {
  data: Bucket[];
  period: Period;
}

const chartConfig: ChartConfig = {
  revenue: {
    label: "درآمد ثبت‌شده",
    color: "var(--chart-1)",
  },
  upcoming: {
    label: "درآمد آتی",
    color: "var(--chart-3)",
  },
};

export function RevenueChart({ data, period }: RevenueChartProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3 text-sm font-medium text-foreground">
        <TrendingUp size={16} className="text-primary" />
        نمودار درآمد بر اساس {periodLabel[period]}
      </div>
      {data.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          رزرو‌ای در این بازه وجود ندارد
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <AreaChart data={data} margin={{ left: 8, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillUpcoming" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-upcoming)"
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-upcoming)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={56}
              tickFormatter={(v: number) => `${(v / 1000).toLocaleString("fa-IR")}k`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <span className="font-mono font-medium">
                      {formatPrice(Number(value))} تومان
                    </span>
                  )}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              fill="url(#fillRevenue)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="upcoming"
              stroke="var(--color-upcoming)"
              fill="url(#fillUpcoming)"
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          </AreaChart>
        </ChartContainer>
      )}
    </div>
  );
}
