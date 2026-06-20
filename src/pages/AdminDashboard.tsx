import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Car,
  CalendarCheck,
  Ticket,
  MapPin,
  Banknote,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div dir="rtl" className="w-full p-4 md:p-6 lg:p-8 pb-12 space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          داشبورد مدیریت
        </h1>
        <p className="text-muted-foreground mt-1">
          نمای کلی از وضعیت سیستم، کاربران و رزروهای ونک.
        </p>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ۱. کاربران (Users) */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              کاربران سیستم
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">۱,۲۴۵</div>
              <p className="text-xs text-muted-foreground mt-1">
                کل کاربران ثبت‌نام شده
              </p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-muted-foreground">فعال در این ماه</span>
                <span className="font-medium text-foreground">۸۵۰</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-muted-foreground">حساب‌های مسدود</span>
                <span className="font-medium text-foreground">۱۲</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              مشاهده
            </Button>
          </CardContent>
        </Card>

        {/* ۲. پارکینگ‌ها (Parkings) */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              پارکینگ‌ها
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">۳۴۲</div>
              <p className="text-xs text-muted-foreground mt-1">
                کل پارکینگ‌های ثبت‌شده
              </p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-muted-foreground">در انتظار تایید</span>
                <span className="font-medium text-foreground">۱۸</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-muted-foreground">فعال و در دسترس</span>
                <span className="font-medium text-foreground">۳۱۰</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              مشاهده
            </Button>
          </CardContent>
        </Card>

        {/* ۳. خودروها (Vehicles) */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              خودروهای ثبت‌شده
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">۸۵۰</div>
              <p className="text-xs text-muted-foreground mt-1">
                تعداد پلاک‌های ثبت‌شده
              </p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-muted-foreground">
                  تایید شده توسط سیستم
                </span>
                <span className="font-medium text-foreground">۸۰۰</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-muted-foreground">در انتظار بررسی</span>
                <span className="font-medium text-foreground">۵۰</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              مشاهده
            </Button>
          </CardContent>
        </Card>

        {/* ۴. رزروها (Reservations) */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              رزروها
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">۸۹</div>
              <p className="text-xs text-muted-foreground mt-1">
                کل رزروهای این ماه
              </p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-muted-foreground">در حال استفاده</span>
                <span className="font-medium text-foreground">۱۲</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-muted-foreground">تکمیل شده</span>
                <span className="font-medium text-foreground">۶۵</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              مشاهده
            </Button>
          </CardContent>
        </Card>

        {/* ۵. گزارش مالی (Financial Report) */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              گزارش مالی
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">
                ۲۴.۵M{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  تومان
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                حجم تراکنش‌های این ماه
              </p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-muted-foreground">کارمزد پلتفرم</span>
                <span className="font-medium text-foreground">۲.۴۵M تومان</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-muted-foreground">در انتظار تسویه</span>
                <span className="font-medium text-foreground">۸۵۰k تومان</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              مشاهده
            </Button>
          </CardContent>
        </Card>

        {/* ۶. تیکت‌ها و پشتیبانی (Tickets & Support) */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              تیکت‌ها و پشتیبانی
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">۱۵</div>
              <p className="text-xs text-muted-foreground mt-1">تیکت‌های باز</p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-muted-foreground">شکایات کاربران</span>
                <span className="font-medium text-foreground">۵</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-muted-foreground">پشتیبانی عمومی</span>
                <span className="font-medium text-foreground">۱۰</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              مشاهده
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
