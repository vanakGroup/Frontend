import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Send,
  Sparkles,
  Building,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold: 0.1 },
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

function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: ScrollRevealProps) {
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

export default function ContactUs() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div
      dir="rtl"
      className="w-full text-foreground bg-background py-12 px-4 md:px-8 lg:px-12 max-w-6xl mx-auto space-y-20 font-sans relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(21,145,220,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(21,145,220,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] -z-30"></div>

      <div className="absolute top-1/4 left-1/10 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px] -z-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/10 w-[550px] h-[550px] bg-secondary/10 rounded-full blur-[150px] -z-20"></div>

      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge
            variant="default"
            className="gap-1.5 py-1.5 px-4 bg-primary/15 text-primary hover:bg-primary/25 border border-primary/30 transition-all font-semibold"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            پاسخگوی شما هستیم
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-foreground tracking-tight">
            ارتباط با تیم توسعه{" "}
            <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              «ونک»
            </span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            نظرات، پیشنهادها و سوالات خود را از طریق راه‌های ارتباطی زیر یا فرم
            پیام مستقیم با ما در میان بگذارید.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-5 flex flex-col gap-5 justify-between">
          <ScrollReveal delay={50} className="h-full">
            <Card className="border border-border/80 bg-card/60 backdrop-blur-sm p-6 shadow-lg hover:shadow-primary/10 hover:border-primary/50 transition-all duration-300 flex items-start gap-4 h-full group">
              <div className="p-3.5 bg-primary/15 text-primary rounded-2xl shrink-0 mt-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-md">
                <Building className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 text-right">
                <h4 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                  محل استقرار تیم
                </h4>
                <p className="text-sm text-foreground/90 font-medium leading-relaxed">
                  تهران، میدان رسالت، خیابان دانشگاه علم و صنعت
                </p>
                <p className="text-xs text-muted-foreground">
                  دانشکده مهندسی کامپیوتر، طبقه همکف - هسته پژوهشی پلتفرم ونک
                </p>
              </div>
            </Card>
          </ScrollReveal>

          <ScrollReveal delay={100} className="h-full">
            <Card className="border border-border/80 bg-card/60 backdrop-blur-sm p-6 shadow-lg hover:shadow-primary/10 hover:border-primary/50 transition-all duration-300 flex items-start gap-4 h-full group">
              <div className="p-3.5 bg-primary/15 text-primary rounded-2xl shrink-0 mt-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-md">
                <Mail className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 text-right w-full">
                <h4 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                  پشتیبانی و مکاتبات دیجیتال
                </h4>
                <a
                  href="mailto:vanak@comp.iust.ac.ir"
                  className="text-sm text-primary font-bold block tracking-wide hover:underline text-left ltr"
                >
                  contact@vanak.com
                </a>
                <p className="text-xs text-muted-foreground">
                  پاسخگویی رسمی و دریافت مستندات همکاری فنی
                </p>
              </div>
            </Card>
          </ScrollReveal>

          <ScrollReveal delay={150} className="h-full">
            <Card className="border border-border/80 bg-card/60 backdrop-blur-sm p-6 shadow-lg hover:shadow-primary/10 hover:border-primary/50 transition-all duration-300 flex items-start gap-4 h-full group">
              <div className="p-3.5 bg-primary/15 text-primary rounded-2xl shrink-0 mt-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-md">
                <Phone className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 text-right w-full">
                <h4 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                  تماس تلفنی (ساعات اداری)
                </h4>
                <span className="text-sm text-foreground/90 font-bold block tracking-wider text-left ltr">
                  +98 21 77300000
                </span>
                <p className="text-xs text-muted-foreground">
                  شنبه تا چهارشنبه از ساعت ۸:۰۰ الی ۱۵:۳۰
                </p>
              </div>
            </Card>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-7">
          <ScrollReveal delay={200} className="h-full">
            <Card className="border border-border/80 bg-card/60 backdrop-blur-sm overflow-hidden shadow-2xl rounded-3xl h-full min-h-[360px] relative group hover:border-primary/50 transition-all duration-300">
              <iframe
                title="IUST Computer Engineering Map"
                src="https://maps.google.com/maps?q=PGR4%2BJWH%2C%20Tehran&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full min-h-[340px] border-none grayscale-[20%] contrast-[110%] opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                allowFullScreen
                loading="lazy"
              ></iframe>
              <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-md border border-border px-3.5 py-2 rounded-2xl pointer-events-none shadow-lg flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary animate-bounce" />
                <span className="text-xs font-bold text-foreground tracking-tight">
                  کد پلاس: PGR4+JWH تهران
                </span>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </div>

      <ScrollReveal>
        <section className="max-w-3xl mx-auto bg-card/75 backdrop-blur-md border border-border/80 rounded-[32px] p-6 md:p-10 shadow-2xl relative overflow-hidden hover:border-primary/40 transition-colors duration-300">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-2xl"></div>

          <div className="flex items-center gap-3.5 mb-8 border-b border-border/60 pb-5 justify-start">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl shadow-sm">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="text-right">
              <h3 className="text-lg md:text-xl font-bold text-foreground">
                ارسال پیام مستقیم
              </h3>
              <p className="text-xs text-muted-foreground">
                پیغام شما مستقیماً به دست اعضای اسکرام پلتفرم خواهد رسید.
              </p>
            </div>
          </div>

          {isSubmitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-500">
              <div className="p-4 bg-primary/15 text-primary rounded-full animate-bounce shadow-md">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h4 className="text-lg font-bold text-foreground">
                پیام شما با موفقیت ثبت شد!
              </h4>
              <p className="text-sm text-muted-foreground max-w-sm">
                از زمان گذاشتن شما سپاسگزاریم. پس از بررسی در اولین جلسه تیمی،
                پاسخ از طریق ایمیل برای شما ارسال خواهد شد.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-right">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/85 mr-1">
                    نام و نام خانوادگی
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: علی علوی"
                    className="w-full bg-background/50 border border-border/80 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 transition-all hover:border-border/100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/85 mr-1">
                    نشانی ایمیل
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="example@domain.com"
                    className="w-full bg-background/50 border border-border/80 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 transition-all text-left ltr hover:border-border/100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/85 mr-1">
                  موضوع پیام
                </label>
                <input
                  type="text"
                  required
                  placeholder="همکاری فنی، گزارش باگ، پیشنهاد ایده و..."
                  className="w-full bg-background/50 border border-border/80 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 transition-all hover:border-border/100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/85 mr-1">
                  متن پیام شما
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="جزئیات پیام خود را در اینجا بنویسید..."
                  className="w-full bg-background/50 border border-border/80 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 transition-all resize-none leading-relaxed hover:border-border/100"
                ></textarea>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/95 font-bold px-7 h-12 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Send className="h-4 w-4 shrink-0 transform rotate-180" />
                  <span>ارسال پیغام نهایی</span>
                </Button>
              </div>
            </form>
          )}
        </section>
      </ScrollReveal>
    </div>
  );
}
