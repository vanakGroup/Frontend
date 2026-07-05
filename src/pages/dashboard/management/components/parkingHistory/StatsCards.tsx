import { formatPrice } from "./utils";

interface StatsCardsProps {
  totalRevenue: number;
  totalUpcoming: number;
}

export function StatsCards({ totalRevenue, totalUpcoming }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs text-muted-foreground">درآمد ثبت‌شده</p>
        <p className="text-lg font-bold text-primary mt-1">
          {formatPrice(totalRevenue)} تومان
        </p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs text-muted-foreground">درآمد آتی</p>
        <p className="text-lg font-bold text-foreground mt-1">
          {formatPrice(totalUpcoming)} تومان
        </p>
      </div>
    </div>
  );
}
