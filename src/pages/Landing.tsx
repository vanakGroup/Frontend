import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Car,
  ChevronLeft,
  Sparkles,
  Phone,
  Mail,
  Building,
  Target,
  ArrowLeft,
  ShieldCheck,
  Search,
  CreditCard,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --------------------------------------------------------
// 1. Scroll Reveal Hook (همان انیمیشن صفحات قبل)
// --------------------------------------------------------
function useIntersectionState() {
  const [hasRevealed, setHasRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasRevealed(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return [ref, hasRevealed] as const;
}

function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, isVisible] = useIntersectionState();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-12 scale-[0.95] pointer-events-none"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// --------------------------------------------------------
// 2. Custom Minimalist SVGs (طراحی شده با پالت پروژه)
// --------------------------------------------------------
const MiladTowerSVG = () => (
  <svg
    viewBox="0 0 100 200"
    className="w-24 h-48 drop-shadow-xl transition-transform hover:scale-105 duration-500"
  >
    <defs>
      <linearGradient id="miladGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--primary)" />
        <stop offset="100%" stopColor="var(--secondary)" />
      </linearGradient>
    </defs>
    <polygon
      points="45,200 55,200 52,90 48,90"
      fill="url(#miladGrad)"
      opacity="0.8"
    />
    <polygon points="50,40 65,65 58,90 42,90 35,65" fill="url(#miladGrad)" />
    <rect x="49" y="5" width="2" height="35" fill="var(--primary)" />
    <circle
      cx="50"
      cy="5"
      r="2.5"
      fill="var(--secondary)"
      className="animate-pulse"
    />
  </svg>
);

const AzadiTowerSVG = () => (
  <svg
    viewBox="0 0 150 150"
    className="w-32 h-32 drop-shadow-xl transition-transform hover:scale-105 duration-500"
  >
    <defs>
      <linearGradient id="azadiGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="var(--primary)" />
        <stop offset="100%" stopColor="var(--secondary)" />
      </linearGradient>
    </defs>
    <path
      d="M20,140 L50,140 L65,70 Q75,50 85,70 L100,140 L130,140 L105,40 Q75,10 45,40 Z"
      fill="url(#azadiGrad)"
    />
    <path d="M50,140 Q75,90 100,140 Z" fill="var(--background)" />
    <rect x="65" y="30" width="20" height="10" fill="var(--primary)" />
  </svg>
);

const VanakBuildingSVG = () => (
  <svg
    viewBox="0 0 120 160"
    className="w-28 h-40 drop-shadow-xl transition-transform hover:scale-105 duration-500"
  >
    <defs>
      <linearGradient id="bldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--secondary)" opacity="0.9" />
        <stop offset="100%" stopColor="var(--primary)" />
      </linearGradient>
    </defs>
    <rect x="30" y="40" width="60" height="120" rx="4" fill="url(#bldGrad)" />
    <rect
      x="40"
      y="55"
      width="10"
      height="15"
      rx="2"
      fill="var(--background)"
      opacity="0.9"
    />
    <rect
      x="70"
      y="55"
      width="10"
      height="15"
      rx="2"
      fill="var(--background)"
      opacity="0.9"
    />
    <rect
      x="40"
      y="85"
      width="10"
      height="15"
      rx="2"
      fill="var(--background)"
      opacity="0.9"
    />
    <rect
      x="70"
      y="85"
      width="10"
      height="15"
      rx="2"
      fill="var(--background)"
      opacity="0.9"
    />
    <rect
      x="40"
      y="115"
      width="10"
      height="15"
      rx="2"
      fill="var(--background)"
      opacity="0.9"
    />
    <rect
      x="70"
      y="115"
      width="10"
      height="15"
      rx="2"
      fill="var(--background)"
      opacity="0.9"
    />
    <path d="M30,40 L60,10 L90,40 Z" fill="var(--primary)" opacity="0.8" />
    <text
      x="60"
      y="32"
      fontSize="12"
      fontWeight="bold"
      fill="white"
      textAnchor="middle"
    >
      Vanak
    </text>
  </svg>
);

// --------------------------------------------------------
// 3. Main Landing Component
// --------------------------------------------------------
export default function Landing() {
  return (
    <div
      dir="rtl"
      className="w-full text-foreground bg-background font-sans relative overflow-x-hidden"
    >
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent -z-20"></div>
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px] -z-20"></div>

      {/* --- HERO SECTION --- */}
      <section className="relative max-w-6xl mx-auto px-4 pt-20 pb-12 flex flex-col items-center text-center space-y-8">
        <ScrollReveal>
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm mb-4"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            سیستم هوشمند اشتراک‌گذاری پارکینگ
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            جای پارک شما، <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              در دستان ونک
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            از ترافیک کلافه‌کننده رها شوید! با پلتفرم ونک، پارکینگ‌های خالی سطح
            شهر را رزرو کنید یا پارکینگ خود را به درآمد تبدیل کنید.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/login">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg h-14 px-8 rounded-2xl shadow-xl shadow-primary/25 transition-all hover:-translate-y-1">
                ورود به اپلیکیشن
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/aboutus">
              <Button
                variant="outline"
                className="border-border/80 text-foreground text-lg h-14 px-8 rounded-2xl hover:bg-muted transition-all"
              >
                داستان ونک
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* --- THE WINDING ROAD JOURNEY --- */}
      {/* ایده جاده: استفاده از حاشیه‌های (Borders) منحنی برای ساخت یک جاده پیوسته.
        در حالت RTL، راست‌چین بودن روی Border ها اثر می‌گذارد.
      */}
      <section className="relative max-w-5xl mx-auto px-4 py-20 overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(21,145,220,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(21,145,220,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] -z-30"></div>

        {/* NODE 1: Vanak Square (Starts Top Right, curves to Left) */}
        <div className="relative border-t-[16px] border-l-[16px] border-b-[16px] border-primary/20 rounded-l-[100px] md:rounded-l-[250px] p-6 md:p-12 pb-24 md:pb-32 mt-10 mr-4 md:mr-12 flex justify-end items-start border-dashed">
          {/* Animated Car on Road */}
          <div className="absolute -top-[24px] right-[20%] text-primary animate-[bounce_3s_infinite]">
            <Car className="w-8 h-8 scale-x-[-1]" />
          </div>

          <ScrollReveal
            delay={100}
            className="w-full md:w-1/2 relative z-10 translate-y-12"
          >
            <Card className="bg-card/80 backdrop-blur-md border-primary/30 shadow-2xl p-6 rounded-3xl relative">
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg rotate-12">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3 mt-2">
                میدان ونک؛ نقطه آغاز
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed text-justify">
                همه چیز از شلوغی‌های پایان‌ناپذیر میدان ونک شروع شد. جایی که
                پیدا کردن یک جای پارک امن، شبیه به پیدا کردن سوزن در انبار کاه
                بود. ما این چالش را نقطه شروع پلتفرم قرار دادیم.
              </p>
            </Card>
          </ScrollReveal>
        </div>

        {/* NODE 2: Milad Tower (Connects from Left, curves down to Right) */}
        {/* Margin-top is negative to overlap borders and create a continuous line */}
        <div className="relative border-r-[16px] border-b-[16px] border-secondary/20 rounded-r-[100px] md:rounded-r-[250px] p-6 md:p-12 pb-24 md:pb-32 -mt-[16px] ml-4 md:ml-12 flex justify-start items-center border-solid">
          <ScrollReveal
            delay={200}
            className="w-full md:w-3/4 relative z-10 flex flex-col md:flex-row items-center gap-8 translate-y-8"
          >
            <div className="shrink-0">
              <MiladTowerSVG />
            </div>
            <Card className="bg-card/80 backdrop-blur-md border-secondary/30 shadow-2xl p-6 rounded-3xl flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                تهران و بحران ترافیک
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed text-justify mb-4">
                ترافیک پایتخت تنها هدررفت زمان نیست؛ دغدغه ذهنی و آلودگی هواست.
                ما تصمیم گرفتیم به جای ساخت پارکینگ‌های جدید، از ظرفیت عظیم
                پارکینگ‌های خالی و خاموش منازل و برج‌ها استفاده کنیم.
              </p>
              <div className="flex gap-2">
                <Badge className="bg-muted text-muted-foreground hover:bg-muted">
                  #کاهش_ترافیک
                </Badge>
                <Badge className="bg-muted text-muted-foreground hover:bg-muted">
                  #شهر_هوشمند
                </Badge>
              </div>
            </Card>
          </ScrollReveal>
        </div>

        {/* NODE 3: Vanak Services Building (Connects from Right, curves to Left) */}
        <div className="relative border-l-[16px] border-b-[16px] border-primary/20 rounded-l-[100px] md:rounded-l-[250px] p-6 md:p-12 pb-24 md:pb-32 -mt-[16px] mr-4 md:mr-12 flex justify-end items-center border-dashed">
          {/* Animated Pin */}
          <div className="absolute -bottom-[24px] left-[30%] text-secondary bg-background rounded-full p-1 border-4 border-secondary animate-pulse">
            <Target className="w-5 h-5" />
          </div>

          <ScrollReveal
            delay={300}
            className="w-full md:w-4/5 relative z-10 flex flex-col md:flex-row-reverse items-center gap-8 translate-y-12"
          >
            <div className="shrink-0 relative">
              <VanakBuildingSVG />
              <div className="absolute -right-4 top-10 bg-background shadow-lg rounded-full p-2 text-primary border border-primary/20 animate-bounce">
                <Car className="w-5 h-5" />
              </div>
            </div>
            <div className="flex-1 space-y-4 text-right">
              <h3 className="text-3xl font-extrabold text-foreground">
                خدمات پلتفرم ونک
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-4 border-border shadow-sm flex items-start gap-3">
                  <Search className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">جستجوی هوشمند</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      یافتن نزدیک‌ترین جای پارک روی نقشه
                    </p>
                  </div>
                </Card>
                <Card className="p-4 border-border shadow-sm flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">کسب درآمد پایدار</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      اجاره ساعتی پارکینگ خالی شما
                    </p>
                  </div>
                </Card>
                <Card className="p-4 border-border shadow-sm flex items-start gap-3 sm:col-span-2">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">
                      امنیت و احراز هویت دیجیتال
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      ورود و خروج ثبت‌شده با QR Code و تضمین حریم خصوصی
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* NODE 4: Azadi Tower (Connects from Left, Straightens out at bottom) */}
        <div className="relative border-r-[16px] border-primary/20 rounded-tr-[100px] md:rounded-tr-[250px] p-6 md:p-12 -mt-[16px] ml-4 md:ml-12 flex justify-start items-end min-h-[300px]">
          <ScrollReveal
            delay={400}
            className="w-full relative z-10 flex flex-col md:flex-row items-center gap-10 mt-12"
          >
            <div className="shrink-0 mt-8">
              <AzadiTowerSVG />
            </div>
            <div className="flex-1 space-y-6 text-center md:text-right">
              <h3 className="text-3xl font-extrabold text-foreground">
                گسترش به وسعت ایران
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed max-w-lg">
                چشم‌انداز ما محدود به محله ونک نیست. هدف تیم ما گسترش این سیستم
                یکپارچه در تمامی مناطق ۲۲ گانه تهران و در نهایت، هوشمندسازی
                سیستم پارکینگ در سراسر کلان‌شهرهای ایران است.
              </p>
              <Link to="/aboutus" className="inline-block">
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl px-6 h-12 shadow-lg">
                  با اهداف ما بیشتر آشنا شوید
                  <ChevronLeft className="mr-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
