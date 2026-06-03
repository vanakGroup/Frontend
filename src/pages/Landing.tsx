import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Compass,
  CreditCard,
  Target,
  Cpu,
  BellRing,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --------------------------------------------------------
// 1. Scroll Reveal Hook
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

// --------------------------------------------------------
// 2. Main Landing Component
// --------------------------------------------------------
export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const [carPos, setCarPos] = useState({
    x: 600,
    y: 80,
    angle: 90,
    opacity: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!pathRef.current || !containerRef.current) return;

      const path = pathRef.current;
      const pathLength = path.getTotalLength();

      const containerTop = containerRef.current.offsetTop;
      const containerHeight = containerRef.current.offsetHeight;

      const scrollProgress =
        (window.scrollY - containerTop + window.innerHeight * 0.3) /
        (containerHeight - window.innerHeight * 0.5);
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

      const point = path.getPointAtLength(clampedProgress * pathLength);
      const nextPointOffset = Math.min(
        pathLength,
        clampedProgress * pathLength + 6,
      );
      const nextPoint = path.getPointAtLength(nextPointOffset);
      const angle =
        Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) *
        (180 / Math.PI);

      setCarPos({
        x: point.x,
        y: point.y,
        angle: angle,
        opacity: clampedProgress > 0.005 && clampedProgress < 0.995 ? 1 : 0,
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
      dir="rtl"
      className="w-full text-foreground bg-background font-sans relative min-h-screen flex flex-col justify-between overflow-hidden rtl"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(21,145,220,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(21,145,220,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] -z-30"></div>

      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] -z-20"></div>
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[140px] -z-20"></div>

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
              <Button className="bg-primary hover:bg-primary/95 text-primary-foreground text-base font-bold h-14 px-8 rounded-2xl shadow-lg shadow-primary/25 transition-all hover:-translate-y-1 cursor-pointer">
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
      <section className="relative max-w-6xl mx-auto px-4 md:px-6 py-20 w-full z-10 min-h-[2200px] md:min-h-[2800px]">
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-full pointer-events-none z-0">
          <svg
            className="w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 1200 2800"
            fill="none"
          >
            <path
              d="M 600,80 C 1150,280 1150,600 600,650 C 50,700 50,1050 600,1100 C 1150,1150 1150,1500 600,1550 C 50,1600 50,1950 600,2000 C 1150,2050 1150,2400 600,2450"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="130"
              strokeLinecap="round"
              className="opacity-5 dark:opacity-10 blur-2xl"
            />
            <path
              d="M 600,80 C 1150,280 1150,600 600,650 C 50,700 50,1050 600,1100 C 1150,1150 1150,1500 600,1550 C 50,1600 50,1950 600,2000 C 1150,2050 1150,2400 600,2450"
              fill="none"
              className="stroke-card dark:stroke-slate-900/85"
              strokeWidth="110"
              strokeLinecap="round"
            />
            <path
              ref={pathRef}
              d="M 600,80 C 1150,280 1150,600 600,650 C 50,700 50,1050 600,1100 C 1150,1150 1150,1500 600,1550 C 50,1600 50,1950 600,2000 C 1150,2050 1150,2400 600,2450"
              fill="none"
              className="stroke-primary/30 dark:stroke-primary/60"
              strokeWidth="4"
              strokeDasharray="20 25"
              strokeLinecap="round"
            />

            {/* Parking Icons (Increased size for mobile visibility) */}
            <g transform="translate(1060, 280)">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="40"
                stroke="#94a3b8"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <rect
                x="-30"
                y="-60"
                width="60"
                height="60"
                rx="12"
                fill="var(--primary)"
                stroke="white"
                strokeWidth="4"
              />
              <text
                x="0"
                y="-16"
                fill="white"
                fontSize="40"
                fontWeight="900"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                P
              </text>
            </g>
            <g transform="translate(140, 700)">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="40"
                stroke="#94a3b8"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <rect
                x="-30"
                y="-60"
                width="60"
                height="60"
                rx="12"
                fill="var(--primary)"
                stroke="white"
                strokeWidth="4"
              />
              <text
                x="0"
                y="-16"
                fill="white"
                fontSize="40"
                fontWeight="900"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                P
              </text>
            </g>
            <g transform="translate(1060, 1100)">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="40"
                stroke="#94a3b8"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <rect
                x="-30"
                y="-60"
                width="60"
                height="60"
                rx="12"
                fill="var(--primary)"
                stroke="white"
                strokeWidth="4"
              />
              <text
                x="0"
                y="-16"
                fill="white"
                fontSize="40"
                fontWeight="900"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                P
              </text>
            </g>
            <g transform="translate(140, 1550)">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="40"
                stroke="#94a3b8"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <rect
                x="-30"
                y="-60"
                width="60"
                height="60"
                rx="12"
                fill="var(--primary)"
                stroke="white"
                strokeWidth="4"
              />
              <text
                x="0"
                y="-16"
                fill="white"
                fontSize="40"
                fontWeight="900"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                P
              </text>
            </g>
            <g transform="translate(1060, 2000)">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="40"
                stroke="#94a3b8"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <rect
                x="-30"
                y="-60"
                width="60"
                height="60"
                rx="12"
                fill="var(--primary)"
                stroke="white"
                strokeWidth="4"
              />
              <text
                x="0"
                y="-16"
                fill="white"
                fontSize="40"
                fontWeight="900"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                P
              </text>
            </g>

            <g
              transform={`translate(${carPos.x}, ${carPos.y}) rotate(${carPos.angle})`}
              style={{
                opacity: carPos.opacity,
                transition: "transform 0.08s ease-out, opacity 0.3s ease",
              }}
            >
              <circle
                r="35"
                fill="var(--primary)"
                opacity="0.15"
                className="animate-ping"
              />

              <g transform="translate(-25, -12)">
                <rect
                  x="4"
                  y="-3"
                  width="10"
                  height="4"
                  rx="1"
                  fill="#1e293b"
                />
                <rect
                  x="36"
                  y="-3"
                  width="10"
                  height="4"
                  rx="1"
                  fill="#1e293b"
                />
                <rect
                  x="4"
                  y="23"
                  width="10"
                  height="4"
                  rx="1"
                  fill="#1e293b"
                />
                <rect
                  x="36"
                  y="23"
                  width="10"
                  height="4"
                  rx="1"
                  fill="#1e293b"
                />

                <rect
                  x="0"
                  y="0"
                  width="50"
                  height="24"
                  rx="6"
                  fill="var(--primary)"
                  className="stroke-white/25"
                  strokeWidth="1.5"
                />

                <rect
                  x="14"
                  y="3"
                  width="22"
                  height="18"
                  rx="4"
                  fill="#0f172a"
                />

                <polygon points="46,4 49,5 49,8 46,7" fill="#fbbf24" />
                <polygon points="46,20 49,19 49,16 46,17" fill="#fbbf24" />

                <rect
                  x="-2"
                  y="2"
                  width="4"
                  height="20"
                  rx="1"
                  fill="var(--secondary)"
                />
              </g>
            </g>
          </svg>
        </div>

        {/* --- DYNAMIC INTERACTIVE CONTENT NODES --- */}
        <div className="relative w-full space-y-48 md:space-y-64 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-12 w-full items-center relative">
            <div className="md:col-start-1 md:col-span-5 relative z-10 px-2 md:px-0">
              <ScrollReveal>
                <Card
                  dir="rtl"
                  className="p-6 md:p-8 bg-card/85 backdrop-blur-md border border-border/80 rounded-3xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 space-y-4 text-right rtl"
                >
                  <div className="flex items-center gap-3 justify-start w-full">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                      <Compass className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-foreground text-right w-full">
                      مکان‌یابی هوشمند آنی
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed text-justify text-right w-full">
                    پلتفرم ونک با استفاده از الگوریتم‌های پیشرفته مسیریابی،
                    نزدیک‌ترین و ارزان‌ترین جای پارک خالی در محدوده مورد نظر شما
                    را ثانیه‌ای و دقیق روی نقشه نمایش می‌دهد.
                  </p>
                </Card>
              </ScrollReveal>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 w-full items-center relative">
            <div className="md:col-start-8 md:col-span-5 relative z-10 px-2 md:px-0">
              <ScrollReveal delay={100}>
                <Card
                  dir="rtl"
                  className="p-6 md:p-8 bg-card/85 backdrop-blur-md border border-border/80 rounded-3xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 space-y-4 text-right rtl"
                >
                  <div className="flex items-center gap-3 justify-start w-full">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                      <Target className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-foreground text-right w-full">
                      قفل هوشمند و کنترل دیجیتال
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed text-justify text-right w-full">
                    برقراری ارتباط مستقیم با قفل‌های سخت‌افزاری و مکانیزه نصب
                    شده در جایگاه‌ها. باز و بسته کردن موانع فیزیکی پارکینگ‌ها به
                    صورت خودکار تنها با فشردن دکمه داخل اپلیکیشن.
                  </p>
                </Card>
              </ScrollReveal>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 w-full items-center relative">
            <div className="md:col-start-1 md:col-span-5 relative z-10 px-2 md:px-0">
              <ScrollReveal delay={150}>
                <Card
                  dir="rtl"
                  className="p-6 md:p-8 bg-card/85 backdrop-blur-md border border-border/80 rounded-3xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 space-y-4 text-right rtl"
                >
                  <div className="flex items-center gap-3 justify-start w-full">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-foreground text-right w-full">
                      احراز هویت دومرحله‌ای ایمن
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed text-justify text-right w-full">
                    ثبت هویت راننده و مالک با امنیت سطح بالا. ورود و خروج
                    خودروها به وسیله صدور بارکد موقت و کدهای امنیتی ثبت‌شده برای
                    محافظت کامل از حریم خصوصی افراد در پارکینگ‌های شخصی.
                  </p>
                </Card>
              </ScrollReveal>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 w-full items-center relative">
            <div className="md:col-start-8 md:col-span-5 relative z-10 px-2 md:px-0">
              <ScrollReveal delay={200}>
                <Card
                  dir="rtl"
                  className="p-6 md:p-8 bg-card/85 backdrop-blur-md border border-border/80 rounded-3xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 space-y-4 text-right rtl"
                >
                  <div className="flex items-center gap-3 justify-start w-full">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-foreground text-right w-full">
                      کیف پول و تسویه حساب فوری
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed text-justify text-right w-full">
                    تسویه حساب کاملاً شفاف مالی و آنلاین با مالکان پارکینگ‌ها.
                    درآمد حاصل از به اشتراک‌گذاری در کمترین زمان به صورت مستقیم
                    به کیف پول الکترونیکی و شماره شبای مالکان منتقل خواهد شد.
                  </p>
                </Card>
              </ScrollReveal>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 w-full items-center relative">
            <div className="md:col-start-1 md:col-span-5 relative z-10 px-2 md:px-0">
              <ScrollReveal delay={250}>
                <Card
                  dir="rtl"
                  className="p-6 md:p-8 bg-card/85 backdrop-blur-md border border-border/80 rounded-3xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 space-y-4 text-right rtl"
                >
                  <div className="flex items-center gap-3 justify-start w-full">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                      <BellRing className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-foreground text-right w-full">
                      سیستم مانیتورینگ آنلاین
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed text-justify text-right w-full">
                    ارسال آنی پیامک، نوتیفیکیشن و تصویر ورود راننده به محض تایید
                    پارکینگ. مالکان در هر لحظه می‌توانند از طریق داشبورد
                    مدیریتی، جریان ترافیکی پارکینگ خود را مانیتور کنند.
                  </p>
                </Card>
              </ScrollReveal>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 w-full items-center relative">
            <div className="md:col-start-8 md:col-span-5 relative z-10 px-2 md:px-0">
              <ScrollReveal delay={300}>
                <Card
                  dir="rtl"
                  className="p-6 md:p-8 bg-card/85 backdrop-blur-md border border-border/80 rounded-3xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 space-y-4 text-right rtl"
                >
                  <div className="flex items-center gap-3 justify-start w-full">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-foreground text-right w-full">
                      سیستم کاملا هوشمند
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed text-justify text-right w-full">
                    مجهز به سیستم پیشرفته برای راحتی استفاده و کارایی بالا از
                    جمله کنترل های از راه دور و تشخیص پلاک
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
                  <Button className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-12 px-6 rounded-xl flex items-center gap-2 shadow-md cursor-pointer">
                    ثبت‌نام و ورود سریع
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/contactus">
                  <Button
                    variant="outline"
                    className="border-border hover:bg-muted text-foreground h-12 px-6 rounded-xl font-bold flex items-center gap-2 cursor-pointer"
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
