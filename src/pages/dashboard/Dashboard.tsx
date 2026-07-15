import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ParkingSquare,
  Car,
  Wallet as WalletIcon,
  User,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import useUserStore from "@/store/userStore/userStore";
import { getWalletBalanceService } from "@/services/walletServices";

export default function Dashboard() {
  const navigate = useNavigate();
  const username = useUserStore((state) => state.username);
  const phone = useUserStore((state) => state.phone);
  
  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const response = await getWalletBalanceService();
        if (response.statusCode === 200 && response.data) {
          setBalance(response.data.balance);
        }
      } catch (error) {
        console.error("Error fetching balance for dashboard:", error);
      } finally {
        setLoadingBalance(false);
      }
    }
    fetchBalance();
  }, []);

  const items = [
    {
      title: "پارکینگ‌های من",
      description: "مدیریت، ویرایش و ثبت فضاهای پارکینگ تحت مالکیت شما.",
      icon: <ParkingSquare className="h-8 w-8 text-primary" />,
      to: "/dashboard/management",
      color: "bg-white border-border",
    },
    {
      title: "ماشین‌های من",
      description: "ثبت پلاک و مدیریت اطلاعات خودروهای شما جهت رزرو سریع‌تر.",
      icon: <Car className="h-8 w-8 text-primary" />,
      to: "/vehicles",
      color: "bg-white border-border",
    },
    {
      title: "کیف پول",
      description: "شارژ حساب، مشاهده موجودی و تاریخچه تراکنش‌های اخیر.",
      icon: <WalletIcon className="h-8 w-8 text-primary" />,
      to: "/wallet",
      color: "bg-white border-border",
      extra: loadingBalance ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : balance !== null ? (
        <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-border text-foreground rounded-full">
          {balance.toLocaleString("fa-IR")} تومان
        </span>
      ) : null,
    },
    {
      title: "ویرایش حساب کاربری",
      description: "تکمیل مشخصات فردی، کدملی، شماره شبا و اطلاعات کاربری.",
      icon: <User className="h-8 w-8 text-primary" />,
      to: "/dashboard/profile",
      color: "bg-white border-border",
    },
  ];

  return (
    <div dir="rtl" className="w-full space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-l from-primary/90 to-primary text-primary-foreground rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">
            خوش آمدید، {username || phone || "کاربر گرامی"}!
          </h1>
          <p className="text-primary-foreground/80 text-sm md:text-base max-w-xl">
            به پنل کاربری خود خوش آمدید. از این بخش می‌توانید به سرعت تمام بخش‌های سامانه را مدیریت کنید.
          </p>
        </div>
        <div className="absolute left-0 bottom-0 opacity-10 transform -translate-x-10 translate-y-10 pointer-events-none">
          <ParkingSquare className="w-64 h-64" />
        </div>
      </div>

      {/* Grid of items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, idx) => (
          <Card
            key={idx}
            className="flex flex-col justify-between hover:shadow-lg transition-all duration-300 border hover:-translate-y-1 cursor-pointer group"
            onClick={() => navigate(item.to)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-3 rounded-xl border ${item.color}`}>
                  {item.icon}
                </div>
                {item.extra}
              </div>
              <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between pt-0">
              <CardDescription className="text-sm text-muted-foreground mb-4 min-h-[40px]">
                {item.description}
              </CardDescription>
              <Button
                variant="ghost"
                className="w-full justify-between hover:bg-primary/5 hover:text-primary group-hover:text-primary p-0 h-9 font-medium"
              >
                <span>ورود به بخش</span>
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
