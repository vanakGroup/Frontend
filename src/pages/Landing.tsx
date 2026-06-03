import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Car,
  ChevronLeft,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Search,
  CreditCard,
  Target,
  Compass,
  Zap,
  Lock,
  Cpu,
  RefreshCw,
  BellRing,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      { threshold: 0.1 },
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
          : "opacity-0 translate-y-12 scale-[0.98] pointer-events-none"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [carStyle, setCarStyle] = useState<React.CSSProperties>({
    transform: "translate(500px, 50px) rotate(90deg)",
    opacity: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!pathRef.current || !containerRef.current) return;

      const path = pathRef.current;
      const pathLength = path.getTotalLength();

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerTop = containerRef.current.offsetTop;
      const containerHeight = containerRef.current.offsetHeight;

      const scrollProgress =
        (window.scrollY - containerTop) /
        (containerHeight - window.innerHeight);
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

      const point = path.getPointAtLength(clampedProgress * pathLength);

      const nextPointOffset = Math.min(
        pathLength,
        clampedProgress * pathLength + 2,
      );
      const nextPoint = path.getPointAtLength(nextPointOffset);
      const angle =
        Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) *
        (180 / Math.PI);

      setCarStyle({
        transform: `translate(${point.x}px, ${point.y}px) rotate(${angle}deg)`,
        opacity: clampedProgress > 0.01 && clampedProgress < 0.99 ? 1 : 0,
        transition: "transform 0.1s ease-out, opacity 0.3s ease",
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full text-foreground bg-background font-sans relative min-h-screen flex flex-col justify-between"
    >
      {/* Dynamic Background Network Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(21,145,220,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(21,145,220,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] -z-30"></div>

      {/* Decorative Blur Ambient Lights */}
      <div className="absolute top-1/4 left-1/10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] -z-20"></div>
      <div className="absolute bottom-1/4 right-1/10 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[140px] -z-20"></div>

      {/* --- HERO SECTION --- */}
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center space-y-8 z-10">
        <ScrollReveal>
          <Badge
            variant="outline"
            className="gap-2 py-2 px-5 bg-primary/5 text-primary border-primary/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide animate-pulse"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            سامانه نوآورانه و هوشمند مدیریت پارک شهری
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.15] mt-4">
            تکنولوژی نوین اشتراک‌گذاری <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-[0_2px_10px_rgba(21,145,220,0.2)]">
              پارکینگ در دستان ونک
            </span>
          </h1>

          <p className="mt-8 text-base md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-justify md:text-center">
            از پرسه زدن‌های کلافه‌کننده در خیابان‌ها رها شوید! با پلتفرم هوشمند
            ونک، فضاهای پارک بلااستفاده شهر را رزرو کنید یا پارکینگ اختصاصی خود
            را در ساعات خالی روز به منبع درآمدی پایدار تبدیل کنید.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">
            <Link to="/login">
              <Button className="bg-primary hover:bg-primary/95 text-primary-foreground text-base font-bold h-14 px-8 rounded-2xl shadow-lg shadow-primary/25 transition-all hover:-translate-y-1">
                ورود به اپلیکیشن
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/aboutus">
              <Button
                variant="outline"
                className="border-border/80 text-foreground text-base font-bold h-14 px-8 rounded-2xl hover:bg-muted/40 backdrop-blur-sm transition-all"
              >
                داستان تیم ما
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* --- THE INTERACTIVE DEEP WINDING ROAD SECTION --- */}
      <section className="relative max-w-6xl mx-auto px-6 py-20 w-full z-10 min-h-[2400px]">
        {/* SVG Deep Road Track Container */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-full pointer-events-none z-0">
          <svg
            className="w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 1000 2400"
            fill="none"
          >
            {/* Base Glowing Shadow of the Road */}
            <path
              d="M 500,50 C 900,200 900,450 500,500 C 100,550 100,800 500,850 C 900,900 900,1150 500,1200 C 100,1250 100,1500 500,1550 C 900,1600 900,1850 500,1900 C 100,1950 100,2200 500,2250"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="110"
              strokeLinecap="round"
              className="opacity-5 dark:opacity-10 blur-xl"
            />

            {/* Asphalt Main Path */}
            <path
              d="M 500,50 C 900,200 900,450 500,500 C 100,550 100,800 500,850 C 900,900 900,1150 500,1200 C 100,1250 100,1500 500,1550 C 900,1600 900,1850 500,1900 C 100,1950 100,2200 500,2250"
              fill="none"
              className="stroke-card border-border"
              strokeWidth="90"
              strokeLinecap="round"
            />

            {/* Middle Dashed Interactive Divider Line */}
            <path
              ref={pathRef}
              d="M 500,50 C 900,200 900,450 500,500 C 100,550 100,800 500,850 C 900,900 900,1150 500,1200 C 100,1250 100,1500 500,1550 C 900,1600 900,1850 500,1900 C 100,1950 100,2200 500,2250"
              fill="none"
              className="stroke-primary/30 dark:stroke-primary/50"
              strokeWidth="3"
              strokeDasharray="16 20"
              strokeLinecap="round"
            />
          </svg>

          {/* Scroll-Animate Interactive Car */}
          <div
            style={carStyle}
            className="absolute top-0 left-0 w-16 h-16 -ml-8 -mt-8 flex items-center justify-center z-20 pointer-events-none"
          >
            <div className="bg-primary text-primary-foreground p-3 rounded-2xl shadow-xl shadow-primary/50 border-2 border-background flex items-center justify-center relative">
              <Car className="w-6 h-6 animate-pulse" />
              {/* Radar pulse effect */}
              <span className="absolute inset-0 rounded-2xl border border-primary animate-ping opacity-60"></span>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC INTERACTIVE CONTENT NODES (Alternating Left/Right layout) --- */}
        <div className="relative w-full space-y-36 pt-16">
          {/* Node 1: Right Side */}
          <div className="grid grid-cols-1 md:grid-cols-12 w-full items-center relative">
            <div className="md:col-start-8 md:col-span-5 relative z-10">
              <ScrollReveal>
                <Card className="p-8 bg-card/75 backdrop-blur-md border border-border/80 rounded-3xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      پارکینگ‌های اختصاصی
                    </Badge>
                    <span className="text-5xl font-black opacity-10">۰۱</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                      <Compass className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      مکان‌یابی هوشمند آنی
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                    پلتفرم ونک با استفاده از الگوریتم‌های پیشرفته مسیریابی،
                    نزدیک‌ترین و ارزان‌ترین جای پارک خالی در محدوده مورد نظر شما
                    را ثانیه‌ای و دقیق روی نقشه نمایش می‌دهد.
                  </p>
                </Card>
              </ScrollReveal>
            </div>
          </div>

          {/* Node 2: Left Side */}
          <div className="grid grid-cols-1 md:grid-cols-12 w-full items-center relative">
            <div className="md:col-start-1 md:col-span-5 relative z-10">
              <ScrollReveal delay={100}>
                <Card className="p-8 bg-card/75 backdrop-blur-md border border-border/80 rounded-3xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      تکنولوژی قفل
                    </Badge>
                    <span className="text-5xl font-black opacity-10">۰۲</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      قفل هوشمند و کنترل دیجیتال
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                    برقراری ارتباط مستقیم با قفل‌های سخت‌افزاری و مکانیزه نصب
                    شده در جایگاه‌ها. باز و بسته کردن موانع فیزیکی پارکینگ‌ها به
                    صورت خودکار تنها با فشردن دکمه داخل اپلیکیشن.
                  </p>
                </Card>
              </ScrollReveal>
            </div>
          </div>

          {/* Node 3: Right Side */}
          <div className="grid grid-cols-1 md:grid-cols-12 w-full items-center relative">
            <div className="md:col-start-8 md:col-span-5 relative z-10">
              <ScrollReveal delay={200}>
                <Card className="p-8 bg-card/75 backdrop-blur-md border border-border/80 rounded-3xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      امنیت حریم خصوصی
                    </Badge>
                    <span className="text-5xl font-black opacity-10">۰۳</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      احراز هویت دومرحله‌ای ایمن
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                    ثبت هویت راننده و مالک با امنیت سطح بالا. ورود و خروج
                    خودروها به وسیله صدور بارکد موقت و کدهای امنیتی ثبت‌شده برای
                    محافظت کامل از حریم خصوصی افراد در پارکینگ‌های شخصی.
                  </p>
                </Card>
              </ScrollReveal>
            </div>
          </div>

          {/* Node 4: Left Side */}
          <div className="grid grid-cols-1 md:grid-cols-12 w-full items-center relative">
            <div className="md:col-start-1 md:col-span-5 relative z-10">
              <ScrollReveal delay={300}>
                <Card className="p-8 bg-card/75 backdrop-blur-md border border-border/80 rounded-3xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      تراکنش‌های شفاف
                    </Badge>
                    <span className="text-5xl font-black opacity-10">۰۴</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      کیف پول و تسویه حساب فوری
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                    تسویه حساب کاملاً شفاف مالی و آنلاین با مالکان پارکینگ‌ها.
                    درآمد حاصل از به اشتراک‌گذاری در کمترین زمان به صورت مستقیم
                    به کیف پول الکترونیکی و شماره شبای مالکان منتقل خواهد شد.
                  </p>
                </Card>
              </ScrollReveal>
            </div>
          </div>

          {/* Node 5: Right Side */}
          <div className="grid grid-cols-1 md:grid-cols-12 w-full items-center relative">
            <div className="md:col-start-8 md:col-span-5 relative z-10">
              <ScrollReveal delay={400}>
                <Card className="p-8 bg-card/75 backdrop-blur-md border border-border/80 rounded-3xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      نوتیفیکیشن لحظه‌ای
                    </Badge>
                    <span className="text-5xl font-black opacity-10">۰۵</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                      <BellRing className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      سیستم مانیتورینگ آنلاین
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                    ارسال آنی پیامک، نوتیفیکیشن و تصویر ورود راننده به محض تایید
                    پارکینگ. مالکان در هر لحظه می‌توانند از طریق داشبورد
                    مدیریتی، جریان ترافیکی پارکینگ خود را مانیتور کنند.
                  </p>
                </Card>
              </ScrollReveal>
            </div>
          </div>

          {/* Node 6: Left Side */}
          <div className="grid grid-cols-1 md:grid-cols-12 w-full items-center relative">
            <div className="md:col-start-1 md:col-span-5 relative z-10">
              <ScrollReveal delay={500}>
                <Card className="p-8 bg-card/75 backdrop-blur-md border border-border/80 rounded-3xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      توسعه بومی
                    </Badge>
                    <span className="text-5xl font-black opacity-10">۰۶</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      معماری ابری دانشگاهی
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                    طراحی‌شده و توسعه‌یافته با استانداردهای دانشگاه علم و صنعت
                    ایران. زیرساخت ابری ونک برای پردازش همزمان هزاران درخواست
                    بدون تاخیر (Latency) بهینه‌سازی شده است.
                  </p>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION BLOCK --- */}
      <section className="relative max-w-5xl mx-auto px-6 py-12 z-10 w-full mb-16">
        <ScrollReveal>
          <div className="bg-gradient-to-r from-primary to-secondary p-[1px] rounded-[32px] overflow-hidden shadow-2xl">
            <div className="bg-card/90 backdrop-blur-lg p-8 md:p-12 rounded-[31px] flex flex-col md:flex-row items-center justify-between gap-8 text-right relative">
              <div className="space-y-3 flex-1">
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  به شبکه بزرگ پارکینگ ونک بپیوندید
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  توسعه یافته با استانداردهای دانشگاه علم و صنعت؛ ما آمده‌ایم تا
                  کیفیت زندگی ترافیکی در کلان‌شهرها را افزایش دهیم. همین حالا
                  شروع کنید!
                </p>
              </div>

              <div className="flex flex-wrap gap-4 shrink-0">
                <Link to="/login">
                  <Button className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-12 px-6 rounded-xl flex items-center gap-2 shadow-md">
                    ثبت‌نام و ورود سریع
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/contactus">
                  <Button
                    variant="outline"
                    className="border-border hover:bg-muted text-foreground h-12 px-6 rounded-xl font-bold flex items-center gap-2"
                  >
                    ارتباط با پشتیبانی
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
