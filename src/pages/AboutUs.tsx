import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  MapPin,
  Car,
  Compass,
  Eye,
  Target,
  Mail,
  Sparkles,
  MessageSquare,
  HelpCircle,
  Users,
  Clock,
  ShieldCheck,
  TrendingUp,
  Award,
  ChevronLeft,
  Laptop,
  Database,
  Settings2,
  Smartphone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Custom Intersection Observer Hook for Scroll Reveal
function useIntersectionState() {
  const [hasRevealed, setHasRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasRevealed(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, hasRevealed] as const;
}

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const [ref, isVisible] = useIntersectionState();

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-10 scale-[0.98] pointer-events-none"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const faqs = [
  {
    question: "پلتفرم ونک دقیقاً چطور کار می‌کند؟",
    answer:
      "ونک یک سیستم هوشمند به اشتراک‌گذاری پارکینگ خصوصی است. مالکانی که در بازه‌های زمانی خاصی از پارکینگ شخصی خود استفاده نمی‌کنند، آن را در سیستم ثبت می‌نمایند. رانندگان نیازمند جای پارک نیز می‌توانند از طریق اپلیکیشن، نزدیک‌ترین فضا را بیابند و به صورت ساعتی، روزانه یا ماهانه رزرو کنند.",
  },
  {
    question: "چرا تمرکز اولیه پروژه روی محله ونک تهران است؟",
    answer:
      "منطقه ونک به عنوان یکی از قطب‌های اداری، تجاری و پرتردد تهران، روزانه با چالش فوق‌العاده جدی پارک و ترافیک دست‌وپنجه نرم می‌کند. ایده اولیه ما حل علمی این گره ترافیکی در محله ونک بود که در فازهای بعدی به تمام نقاط کلان‌شهر تهران و سراسر کشور تعمیم داده خواهد شد.",
  },
  {
    question: "چگونه امنیت پارکینگ برای مالکان تضمین می‌شود؟",
    answer:
      "امنیت دغدغه اصلی ماست. ونک مجهز به سیستم احراز هویت هوشمند دو مرحله‌ای برای رانندگان، ثبت ورود و خروج دیجیتال با کدهای امنیتی و QR Code اختصاصی، و همچنین تدارک بیمه حمایتی حوادث محدود است تا مالکان با آسودگی خاطر کامل فضای خود را به اشتراک بگذارند.",
  },
  {
    question: "فرآیند تسویه حساب و درآمد مالکان چگونه است؟",
    answer:
      "تمام پرداخت‌ها در پلتفرم ونک به صورت آنلاین و از طریق درگاه‌های بانکی امن انجام می‌شود. درآمد حاصل از اجاره پارکینگ پس از کسر کارمزد بسیار اندک پلتفرم، به صورت کاملاً شفاف و دوره‌ای به کیف پول و حساب شبای مالک واریز می‌گردد.",
  },
];

const timelineSteps = [
  {
    step: "۰۱",
    title: "مکان‌یابی و ثبت اولیه",
    desc: "مالکان پارکینگ لوکیشن فضا را مشخص کرده و رانندگان نزدیک‌ترین پارکینگ‌های در دسترس را روی نقشه تعاملی ونک مشاهده می‌کنند.",
    icon: MapPin,
  },
  {
    step: "۰۲",
    title: "تعیین زمان و قیمت‌گذاری",
    desc: "مالک زمان‌های خالی بودن پارکینگ و نرخ اجاره (ساعتی، روزانه یا ماهانه) را تعریف می‌کند. راننده با توجه به نیاز خود رزرو می‌کند.",
    icon: Calendar,
  },
  {
    step: "۰۳",
    title: "کد عبور امنیتی دیجیتال",
    desc: "پس از تایید رزرو، یک QR Code یا کد ورود امنیتی موقت برای راننده صادر می‌شود تا ورود و خروج او کاملاً دیجیتال و ثبت‌شده باشد.",
    icon: ShieldCheck,
  },
  {
    step: "۰۴",
    title: "پرداخت و تسویه آسان",
    desc: "پرداخت راننده به صورت کاملاً آنلاین انجام شده و درآمد مالک پس از کسر کارمزد منصفانه اپلیکیشن، به حساب وی منتقل می‌گردد.",
    icon: TrendingUp,
  },
];

const teamMembers = [
  {
    name: "حسین راثی پور",
    role: "توسعه‌دهنده فرانت‌اند",
    stack: "Front-end Developer",
    icon: Laptop,
  },
  {
    name: "سروش قائمی",
    role: "توسعه‌دهنده فرانت‌اند",
    stack: "Front-end Developer",
    icon: Sparkles,
  },
  {
    name: "مبینا برقمدی",
    role: "توسعه‌دهنده فرانت‌اند",
    stack: "Front-end Developer",
    icon: Settings2,
  },
  {
    name: "مهدی وطن زاده",
    role: "توسعه‌دهنده فرانت‌اند",
    stack: "Front-end Developer",
    icon: Smartphone,
  },
  {
    name: "مانی زمانی",
    role: "توسعه‌دهنده بک‌اند",
    stack: "Back-end Developer",
    icon: Database,
  },
  {
    name: "امیرمحمد ایرانمنش",
    role: "توسعه‌دهنده بک‌اند",
    stack: "Back-end Developer",
    icon: ShieldCheck,
  },
  {
    name: "امین فیروزی",
    role: "مدیر محصول",
    stack: "Product Owner",
    icon: Compass,
  },
  {
    name: "علی مزدیان فرد",
    role: "اسکرام مستر",
    stack: "Scrum Master",
    icon: Target,
  },
];

export default function AboutUs() {
  return (
    <div
      dir="rtl"
      className="w-full text-foreground bg-background py-12 px-4 md:px-8 lg:px-12 max-w-6xl mx-auto space-y-28 font-sans relative overflow-hidden"
    >
      {/* Accordion Animation CSS Injection */}
      <style>{`
        @keyframes accordion-down {
          from { height: 0; opacity: 0; }
          to { height: var(--radix-accordion-content-height); opacity: 1; }
        }
        @keyframes accordion-up {
          from { height: var(--radix-accordion-content-height); opacity: 1; }
          to { height: 0; opacity: 0; }
        }
        .data-\\[state\\=open\\]\\:animate-accordion-down[data-state=open] {
          animation: accordion-down 0.28s cubic-bezier(0.87, 0, 0.13, 1) forwards;
        }
        .data-\\[state\\=closed\\]\\:animate-accordion-up[data-state=closed] {
          animation: accordion-up 0.28s cubic-bezier(0.87, 0, 0.13, 1) forwards;
        }
      `}</style>

      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] -z-20"></div>
      <div className="absolute bottom-1/3 right-0 w-[450px] h-[450px] bg-secondary/5 rounded-full blur-[130px] -z-20"></div>

      {/* 1. Hero Section */}
      <ScrollReveal>
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-card to-background border border-border/80 p-6 md:p-10 lg:p-14 shadow-2xl">
          {/* Decorative Glowing Elements */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-secondary/15 rounded-full blur-[80px] -z-10"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap gap-2.5">
                <Badge
                  variant="default"
                  className="gap-1.5 py-1.5 px-4 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all font-medium"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  ایده نوآورانه دانشجویی
                </Badge>
                <Badge
                  variant="secondary"
                  className="gap-1.5 py-1.5 px-4 bg-secondary/10 text-secondary hover:bg-secondary/20 border border-secondary/20 transition-all font-medium"
                >
                  <Award className="h-4 w-4 text-secondary" />
                  دانشگاه علم و صنعت ایران
                </Badge>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground tracking-tight">
                داستان توسعه پلتفرم{" "}
                <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  «ونک»
                </span>
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed text-justify">
                پروژه ونک حاصل تلاش یک تیم هم‌دانشگاهی ۸ نفره از دانشجویان
                پرانگیزه دانشگاه علم و صنعت ایران است. ما از بهمن‌ماه سال ۱۴۰۴
                با هدف طراحی یک سیستم نرم‌افزاری مدرن و هوشمند گردهم آمدیم و با
                توسعه همزمان فرانت‌اند و بک‌اند، گامی استوار جهت حل یکی از
                بزرگ‌ترین چالش‌های روزمره کلان‌شهرها برداشتیم.
              </p>

              <p className="text-base text-muted-foreground/80 leading-relaxed text-justify">
                ایده ونک از یک واقعیت ساده الهام گرفته شد: وجود هزاران فضای پارک
                اختصاصی بلااستفاده در ساعات مختلف شبانه‌روز در حالی که رانندگان
                زیادی در ترافیک‌های طاقت‌فرسا به دنبال جای پارک هستند. محله تجاری
                و اداری شلوغ ونک، نقطه آغاز این ایده و نام پلتفرم هوشمند ماست.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2.5 text-sm text-foreground bg-muted/80 backdrop-blur border border-border/60 px-4 py-2.5 rounded-xl shadow-sm transition-all hover:bg-muted">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>
                    آغاز توسعه محصول: <strong>بهمن ۱۴۰۴</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Live Parking Map Preview */}
            <div className="flex-1 flex justify-center items-center">
              <div className="relative w-full max-w-xs md:max-w-sm aspect-square bg-muted/50 rounded-3xl p-6 border border-border shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <div className="w-full h-full border border-dashed border-border/80 rounded-2xl relative flex flex-col justify-between p-4 bg-background/40 backdrop-blur-sm">
                  {/* Grid Lines simulating roads */}
                  <div className="absolute top-1/2 left-0 w-full h-10 bg-muted/40 -translate-y-1/2 transform rotate-12 border-y border-dashed border-border/40"></div>
                  <div className="absolute left-1/2 top-0 h-full w-10 bg-muted/40 -translate-x-1/2 transform -rotate-12 border-x border-dashed border-border/40"></div>

                  <div className="absolute top-1/3 right-1/4 animate-bounce bg-primary text-primary-foreground p-3 rounded-full shadow-lg z-10 border-2 border-background">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div className="absolute bottom-1/4 left-1/3 bg-secondary text-secondary-foreground text-xs px-3 py-2 rounded-lg shadow-lg border border-primary/20 z-10 flex items-center gap-2 animate-pulse">
                    <Car className="h-4 w-4" />
                    پارکینگ خالی!
                  </div>

                  <span className="text-[11px] font-semibold text-muted-foreground self-start bg-background/80 px-2.5 py-1 rounded-full border border-border/60">
                    میدان ونک، تهران
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground self-end bg-background/80 px-2.5 py-1 rounded-full border border-border/60">
                    دانشگاه علم و صنعت
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 2. Premium Stat Cards Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ScrollReveal delay={0} className="h-full">
          <Card className="h-full text-center p-6 border-border/80 bg-card hover:bg-gradient-to-b hover:from-card hover:to-primary/5 transition-all duration-300 hover:-translate-y-1 shadow-lg group">
            <CardContent className="pt-6 flex flex-col items-center gap-3 h-full justify-start">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-3xl font-extrabold text-primary group-hover:scale-105 transition-transform duration-300">
                ۸ متخصص
              </div>
              <div className="text-sm font-semibold text-foreground/90">
                هم‌بنیان‌گذاران و اعضای توسعه
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                دانشجویان مهندسی فرانت‌اند و بک‌اند با انگیزه بالا
              </p>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={100} className="h-full">
          <Card className="h-full text-center p-6 border-border/80 bg-card hover:bg-gradient-to-b hover:from-card hover:to-primary/5 transition-all duration-300 hover:-translate-y-1 shadow-lg group">
            <CardContent className="pt-6 flex flex-col items-center gap-3 h-full justify-start">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Clock className="h-6 w-6" />
              </div>
              <div className="text-3xl font-extrabold text-primary group-hover:scale-105 transition-transform duration-300">
                بهمن ۱۴۰۴
              </div>
              <div className="text-sm font-semibold text-foreground/90">
                آغاز فاز تحقیق و توسعه
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                طراحی معماری سیستم و پیاده‌سازی گام‌به‌گام سرویس
              </p>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={200} className="h-full">
          <Card className="h-full text-center p-6 border-border/80 bg-card hover:bg-gradient-to-b hover:from-card hover:to-primary/5 transition-all duration-300 hover:-translate-y-1 shadow-lg group">
            <CardContent className="pt-6 flex flex-col items-center gap-3 h-full justify-start">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="text-3xl font-extrabold text-primary group-hover:scale-105 transition-transform duration-300">
                امنیت هوشمند
              </div>
              <div className="text-sm font-semibold text-foreground/90">
                احراز هویت و کدهای امنیتی
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                تضمین حداکثر حریم خصوصی و امنیت برای مالکان و رانندگان
              </p>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={300} className="h-full">
          <Card className="h-full text-center p-6 border-border/80 bg-card hover:bg-gradient-to-b hover:from-card hover:to-primary/5 transition-all duration-300 hover:-translate-y-1 shadow-lg group">
            <CardContent className="pt-6 flex flex-col items-center gap-3 h-full justify-start">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="text-3xl font-extrabold text-primary group-hover:scale-105 transition-transform duration-300">
                ۱ هدف والا
              </div>
              <div className="text-sm font-semibold text-foreground/90">
                بهبود کلان‌شهرها و کاهش ترافیک
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                بهینه‌سازی فضاهای خاموش شهری و کاهش تولید کربن
              </p>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* 3. How Vanak Works (Interactive Step-by-Step) */}
      <ScrollReveal>
        <section className="space-y-12 relative">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 px-3 py-1 text-xs">
              پلتفرم هوشمند ما چطور عمل می‌کند؟
            </Badge>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              چرخه هوشمند به اشتراک‌گذاری پارکینگ
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              با ۴ گام ساده، فضای پارک خالی محله شما تبدیل به یک راهکار ترافیکی و درآمدزا خواهد شد.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {timelineSteps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-card/50 backdrop-blur-sm border border-border/80 hover:border-primary/40 rounded-2xl p-6 shadow-md transition-all duration-300 hover:shadow-xl relative group flex flex-col justify-between min-h-[220px]"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-4xl font-black text-primary/10 group-hover:text-primary/20 transition-colors">
                        {step.step}
                      </span>
                      <div className="p-2.5 bg-primary/5 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <StepIcon className="h-5 w-5" />
                      </div>
                    </div>
                    <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </ScrollReveal>

      {/* 4. Goals and Core Values Section (FIXED TABS ALIGNMENT & SPACING) */}
      <ScrollReveal>
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              اهداف و چشم‌اندازهای ما
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ما به فراتر از یک اپلیکیشن پارک ساده فکر می‌کنیم و در پی هوشمندسازی کامل خدمات شهری هستیم.
            </p>
          </div>

          <Tabs defaultValue="mission" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-3 w-full max-w-lg h-auto min-h-[48px] border border-border bg-muted p-1 rounded-2xl">
                <TabsTrigger
                  value="mission"
                  className="flex items-center justify-center gap-2 py-2 rounded-xl transition-all font-semibold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm text-sm"
                >
                  <Target className="h-4 w-4" />
                  <span>ماموریت ما</span>
                </TabsTrigger>
                <TabsTrigger
                  value="vision"
                  className="flex items-center justify-center gap-2 py-2 rounded-xl transition-all font-semibold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm text-sm"
                >
                  <Eye className="h-4 w-4" />
                  <span>چشم‌انداز</span>
                </TabsTrigger>
                <TabsTrigger
                  value="values"
                  className="flex items-center justify-center gap-2 py-2 rounded-xl transition-all font-semibold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm text-sm"
                >
                  <Compass className="h-4 w-4" />
                  <span>ارزش‌ها</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xl transition-all duration-300 relative overflow-hidden text-right" dir="rtl">
              <TabsContent
                value="mission"
                className="space-y-4 outline-none animate-in fade-in-50 duration-500 mt-0 text-right w-full"
                dir="rtl"
              >
                <h4 className="text-xl font-bold text-foreground flex items-center justify-start gap-2.5 text-right w-full" dir="rtl">
                  <Target className="text-primary h-5 w-5 shrink-0" />
                  <span>روان‌سازی ترافیک و بهینه‌سازی فضاهای خاموش شهری</span>
                </h4>
                <p className="text-muted-foreground leading-relaxed text-right text-justify w-full" dir="rtl">
                  ماموریت ما در پلتفرم ونک، برقراری ارتباط هوشمند و بی‌واسطه میان دارندگان فضاهای پارک بدون استفاده و رانندگان جویای پارک است. ما متعهد به طراحی بستری کاملاً پایدار، با کاربری ساده و ایمن هستیم تا با کاهش زمان جستجوی جای پارک، گامی عملی در راستای تقلیل مصرف سوخت و آلودگی هوای کلان‌شهر تهران برداریم.
                </p>
              </TabsContent>

              <TabsContent
                value="vision"
                className="space-y-4 outline-none animate-in fade-in-50 duration-500 mt-0 text-right w-full"
                dir="rtl"
              >
                <h4 className="text-xl font-bold text-foreground flex items-center justify-start gap-2.5 text-right w-full" dir="rtl">
                  <Eye className="text-primary h-5 w-5 shrink-0" />
                  <span>هوشمندترین شبکه یکپارچه اشتراک‌گذاری پارک در ایران</span>
                </h4>
                <p className="text-muted-foreground leading-relaxed text-right text-justify w-full" dir="rtl">
                  ما به سوی فردایی پیش می‌رویم که در آن هیچ بن‌بست ترافیکی به وجود نیاید و هیچ راننده‌ای دغدغه فکری جای پارک پیش از حرکت را نداشته باشد. رویای ما یک شهر هوشمند واقعی است؛ جایی که از تک‌تک ظرفیت‌های شهری حداکثر بهره‌وری حاصل شده و سیستم‌های نوین نقشه و پرداخت هوشمند با زندگی شهروندان عجین شده باشند.
                </p>
              </TabsContent>

              <TabsContent
                value="values"
                className="space-y-4 outline-none animate-in fade-in-50 duration-500 mt-0 text-right w-full"
                dir="rtl"
              >
                <h4 className="text-xl font-bold text-foreground flex items-center justify-start gap-2.5 text-right w-full" dir="rtl">
                  <Compass className="text-primary h-5 w-5 shrink-0" />
                  <span>شفافیت مالی، امنیت کامل و مسئولیت اجتماعی پایدار</span>
                </h4>
                <p className="text-muted-foreground leading-relaxed text-right text-justify w-full" dir="rtl">
                  به عنوان تیمی از متخصصان دانشگاه علم و صنعت، ارزش‌های بنیادین خود را بر پایه شفافیت کامل در تراکنش‌های مالی، حفظ تمام‌عیار حریم خصوصی کاربران، تعهد به حفظ محیط زیست شهری و پشتیبانی پاسخگو بنا نهاده‌ایم. ما باور داریم پیوند دانش دانشگاهی با نیازهای واقعی جامعه، زیباترین دستاورد علمی ما خواهد بود.
                </p>
              </TabsContent>
            </div>
          </Tabs>
        </section>
      </ScrollReveal>

      {/* 5. Our Technical Team Grid (UPDATED EXACT MEMBERS, ROLES, MINIMALIST & NO DETAIL PARAGRAPHS) */}
      <section className="space-y-12">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 px-3 py-1 text-xs">
              هم‌دانشگاهی‌های خلاق و مهندسان جوان
            </Badge>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              هسته تخصصی تیم توسعه ونک
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ترکیبی هماهنگ از مهندسان فرانت‌اند، بک‌اند، اسکرام مستر و مدیر محصول دانشگاه علم و صنعت ایران.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => {
            const MemberIcon = member.icon;
            return (
              <ScrollReveal key={index} delay={index * 60}>
                <Card className="border border-border/80 bg-card hover:bg-gradient-to-br hover:from-card hover:to-primary/5 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl group flex flex-col justify-between h-full p-6 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-3.5 bg-primary/10 text-primary rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shrink-0">
                      <MemberIcon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {member.name}
                      </h4>
                      <span className="text-xs text-primary font-semibold block">
                        {member.role}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] py-0.5 px-2 bg-muted/60 text-muted-foreground font-semibold border-border/60"
                    >
                      {member.stack}
                    </Badge>
                  </div>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 6. Frequently Asked Questions */}
      <ScrollReveal>
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex p-3 bg-primary/10 text-primary rounded-2xl mb-1">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              سوالات متداول کاربران
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              اگر سوالی در ذهن خود دارید، احتمالاً پاسخ آن را در زیر بیابید.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  value={`item-${index}`}
                  key={index}
                  className="border-border py-1"
                >
                  <AccordionTrigger className="text-right font-bold text-foreground hover:text-primary transition-all duration-300 py-4 hover:no-underline text-base md:text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed text-right text-justify pb-4 pt-1 px-1">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </ScrollReveal>

      {/* 7. CTA Contact Section */}
      <ScrollReveal>
        <section className="mb-4">
          <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-6 md:p-10 lg:p-12 border-none overflow-hidden relative shadow-2xl rounded-3xl group">
            {/* Glowing Accent Orbs */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>

            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-3 text-right">
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  آیا ایده یا پیشنهادی برای همکاری با ونک دارید؟
                </h3>
                <p className="text-sm opacity-90 max-w-xl text-right leading-relaxed font-medium">
                  ما با آغوشی باز مشتاق دریافت نظرات سازنده رانندگان، مالکان پارکینگ، اساتید محترم و صاحب‌نظران حوزه فناوری‌های شهری هوشمند هستیم. با ما در تماس باشید!
                </p>
              </div>

              <div className="flex flex-wrap gap-4 shrink-0">
                <Button
                  variant="secondary"
                  className="bg-background text-primary hover:bg-background/95 border-none shadow-md h-12 px-6 rounded-xl font-bold flex items-center gap-2 group-hover:translate-x-[-4px] transition-all"
                >
                  <MessageSquare className="h-5 w-5" />
                  فرم ارتباط با تیم
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 text-primary-foreground hover:bg-white/10 h-12 px-6 rounded-xl font-bold flex items-center gap-2 transition-all"
                >
                  <Mail className="h-5 w-5" />
                  ارسال ایمیل مستقیم
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </ScrollReveal>
    </div>
  );
}
