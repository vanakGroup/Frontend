import React from "react";
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

const faqs = [
  {
    question: "پلتفرم ونک دقیقاً چطور کار می‌کند؟",
    answer:
      "ونک یک پلتفرم به اشتراک‌گذاری پارکینگ است. افرادی که در طول روز از پارکینگ اختصاصی خود استفاده نمی‌کنند، می‌توانند آن را در پلتفرم ونک ثبت کرده تا رانندگانی که به دنبال جای پارک در مناطق شلوغ هستند، آن را برای چند ساعت اجاره کنند.",
  },
  {
    question: "چرا تمرکز اولیه پروژه روی محله ونک تهران است؟",
    answer:
      "ونک یکی از پرترافیک‌ترین و پرتقاضاترین محله‌های تهران برای جای پارک است. ایده اولیه ما دقیقاً از حل بحران پارک در کوچه پس کوچه‌ها و خیابان‌های شلوغ ونک شکل گرفت و به همین دلیل نام پروژه را «ونک» گذاشتیم.",
  },
  {
    question: "چگونه می‌توانیم پارکینگ خود را در این سیستم ثبت کنیم؟",
    answer:
      "شما می‌توانید پس از ثبت‌نام اولیه، موقعیت جغرافیایی، تصاویر پارکینگ و بازه زمانی خالی بودن آن را مشخص کنید. سیستم پس از بررسی و تایید اولیه، آن را در لیست پارکینگ‌های در دسترس کاربران قرار می‌دهد.",
  },
  {
    question: "امنیت پارکینگ‌های ثبت شده چطور تامین می‌شود؟",
    answer:
      "پلتفرم ونک مجهز به سیستم احراز هویت دقیق کاربران راننده، بیمه حوادث محدود و ثبت زمان دقیق ورود و خروج خودروها به صورت دیجیتال است تا مالکان پارکینگ با خیالی آسوده اقدام به اشتراک‌گذاری کنند.",
  },
];

export default function AboutUs() {
  return (
    <div
      dir="rtl"
      className="w-full text-foreground bg-background py-8 px-4 md:px-8 lg:px-12 max-w-6xl mx-auto"
    >
      <section className="mb-16 relative rounded-3xl overflow-hidden bg-card border border-border p-6 md:p-10 lg:p-12">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex-1 space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="default"
                className="gap-1.5 py-1 px-3 bg-primary text-primary-foreground"
              >
                <Sparkles className="h-3.5 w-3.5" />
                ایده نوآورانه دانشجویی
              </Badge>
              <Badge
                variant="secondary"
                className="gap-1.5 py-1 px-3 bg-secondary text-secondary-foreground"
              >
                دانشگاه علم و صنعت ایران
              </Badge>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
              داستان پروژه <span className="text-primary">«ونک»</span>
            </h2>

            <p className="text-lg text-foreground/90 leading-relaxed text-justify">
              پروژه ما یک تیم ۶ نفره متشکل از بچه‌های با انگیزه گروه‌های
              فرانت‌اند و بک‌اند است. ما از بهمن سال ۱۴۰۴ آستین‌ها را بالا زدیم
              و شروع به توسعه این ایده کردیم. همگی هم‌دانشگاهی و دانشجوی دانشگاه
              علم و صنعت ایران هستیم.
            </p>

            <p className="text-base text-muted-foreground leading-relaxed text-justify">
              این ایده زمانی به ذهن ما رسید که دیدیم خیلی از مردم در طول روز از
              پارکینگ‌های خانگی یا تجاری اختصاصی خود استفاده نمی‌کنند؛ در حالی
              که پیدا کردن جای پارک، دغدغه و بحران روزانه همه شهروندان در
              کلان‌شهری مثل تهران است. به خصوص در محله شلوغ و تجاری ونک که نقطه
              آغاز الهام‌بخش ما بود؛ موضوعی که نام پلتفرم‌مان را نیز از آن وام
              گرفته‌ایم!
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-foreground bg-muted px-3 py-2 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <span>
                  آغاز فعالیت: <strong>بهمن ۱۴۰۴</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center">
            <div className="relative w-full max-w-xs md:max-w-sm aspect-square bg-muted rounded-3xl p-5 border border-border shadow-xl overflow-hidden group">
              <div className="w-full h-full border border-dashed border-border rounded-2xl relative flex flex-col justify-between p-4">
                <div className="absolute top-1/2 left-0 w-full h-8 bg-border/20 -translate-y-1/2 transform rotate-12"></div>
                <div className="absolute left-1/2 top-0 h-full w-8 bg-border/20 -translate-x-1/2 transform -rotate-12"></div>

                <div className="absolute top-1/3 right-1/4 animate-bounce bg-primary text-primary-foreground p-2.5 rounded-full shadow-lg z-10">
                  <MapPin className="h-5 w-5" />
                </div>

                <div className="absolute bottom-1/4 left-1/3 bg-secondary text-secondary-foreground text-xs px-3 py-1.5 rounded-lg shadow border border-primary/20 z-10 flex items-center gap-1.5">
                  <Car className="h-3.5 w-3.5" />
                  پارکینگ خالی!
                </div>

                <span className="text-xs text-muted-foreground self-start">
                  تهران، میدان ونک
                </span>
                <span className="text-xs text-muted-foreground self-end">
                  دانشگاه علم و صنعت
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-6 border-border">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary mb-1">۶ نفر</div>
            <div className="text-xs text-muted-foreground">دانشجوی پرانرژی</div>
          </CardContent>
        </Card>
        <Card className="text-center p-6 border-border">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary mb-1">۱۴۰۴</div>
            <div className="text-xs text-muted-foreground">
              شروع طوفانی از بهمن
            </div>
          </CardContent>
        </Card>
        <Card className="text-center p-6 border-border">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary mb-1">۱۰۰٪</div>
            <div className="text-xs text-muted-foreground">بومی و دانشگاهی</div>
          </CardContent>
        </Card>
        <Card className="text-center p-6 border-border">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary mb-1">۱ هدف</div>
            <div className="text-xs text-muted-foreground">
              حل مشکل پارک تهران
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h3 className="text-2xl font-bold text-foreground">
            اهداف و آرمان‌های ما
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            ما به فراتر از یک اپلیکیشن پارک ساده فکر می‌کنیم.
          </p>
        </div>

        <Tabs defaultValue="mission" className="w-full" dir="rtl">
          <div className="flex justify-center mb-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md border border-border bg-muted">
              <TabsTrigger
                value="mission"
                className="flex items-center justify-center gap-2"
                dir="rtl"
              >
                <Target className="h-4 w-4" />
                <span>ماموریت ما</span>
              </TabsTrigger>
              <TabsTrigger
                value="vision"
                className="flex items-center justify-center gap-2"
                dir="rtl"
              >
                <Eye className="h-4 w-4" />
                <span>چشم‌انداز</span>
              </TabsTrigger>
              <TabsTrigger
                value="values"
                className="flex items-center justify-center gap-2"
                dir="rtl"
              >
                <Compass className="h-4 w-4" />
                <span>ارزش‌ها</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div
            className="bg-card border border-border rounded-xl p-6 md:p-8 text-right"
            dir="rtl"
          >
            <TabsContent value="mission" className="space-y-4 outline-none">
              <h4 className="text-xl font-bold text-foreground flex items-center justify-start gap-2">
                <Target className="text-primary h-5 w-5" />
                <span>روان‌سازی ترافیک و بهینه‌سازی فضاهای خاموش شهری</span>
              </h4>
              <p className="text-muted-foreground leading-relaxed text-right text-justify">
                ماموریت ما در پلتفرم ونک این است که با بهره‌گیری از تکنولوژی‌های
                روز فرانت‌اند و بک‌اند، بستر ارتباطی امن و ساده‌ای را میان
                دارندگان فضاهای پارکینگ خالی و رانندگان جویای پارک برقرار کنیم.
                ما می‌خواهیم با کاهش زمان جستجوی جای پارک، مصرف سوخت و آلودگی
                هوا در تهران (شروع از محله ونک) را به شکل چشمگیری کاهش دهیم.
              </p>
            </TabsContent>

            <TabsContent value="vision" className="space-y-4 outline-none">
              <h4 className="text-xl font-bold text-foreground flex items-center justify-start gap-2">
                <Eye className="text-primary h-5 w-5" />
                <span>بزرگ‌ترین شبکه اشتراک‌گذاری پارکینگ در ایران</span>
              </h4>
              <p className="text-muted-foreground leading-relaxed text-right text-justify">
                ما چشم‌انداز روشنی داریم؛ پلتفرم ونک پس از اجرای پایلوت
                موفقیت‌آمیز در منطقه ونک، به تمامی مناطق ۲۲ گانه تهران و سپس
                کلان‌شهرهای دیگر ایران گسترش خواهد یافت. رویای ما شهری هوشمند
                است که در آن هیچ ظرفیت پارکینگی بی‌استفاده نمی‌ماند و رانندگان
                پیش از شروع سفر، از محل پارک خود اطمینان کامل دارند.
              </p>
            </TabsContent>

            <TabsContent value="values" className="space-y-4 outline-none">
              <h4 className="text-xl font-bold text-foreground flex items-center justify-start gap-2">
                <Compass className="text-primary h-5 w-5" />
                <span>باورها و ارزش‌های تیم جوان دانشگاه علم و صنعت</span>
              </h4>
              <p className="text-muted-foreground leading-relaxed text-right text-justify">
                ما در تیم توسعه پلتفرم ونک، به ارزش‌هایی چون شفافیت کامل مالی،
                امنیت حریم خصوصی کاربران، نوآوری مستمر فنی و مسئولیت اجتماعی
                زیست‌محیطی متعهد هستیم. به عنوان دانشجویان دانشگاه علم و صنعت،
                تلاش داریم پلی میان دانش فنی آکادمیک و حل مستقیم چالش‌های جامعه
                شهری خود بسازیم.
              </p>
            </TabsContent>
          </div>
        </Tabs>
      </section>

      <section className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <HelpCircle className="h-8 w-8 text-primary mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-foreground">
            سوالات متداول درباره ونک
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            شاید پاسخ سوال خود را همینجا پیدا کنید.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-card border border-border rounded-xl p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                value={`item-${index}`}
                key={index}
                className="border-border"
              >
                <AccordionTrigger className="text-right font-bold text-foreground hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-right text-justify">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="mb-8">
        <Card className="bg-primary text-primary-foreground p-6 md:p-8 border-none overflow-hidden relative">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 text-right">
              <h3 className="text-xl md:text-2xl font-bold">
                آیا ایده یا پیشنهادی برای توسعه پلتفرم دارید؟
              </h3>
              <p className="text-sm opacity-90 max-w-xl text-right">
                ما مشتاقانه منتظر شنیدن نظرات اساتید، دانشجویان و رانندگانی
                هستیم که روزانه با بحران جای پارک مواجهند. به ما پیام بدهید!
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                className="bg-secondary text-secondary-foreground hover:opacity-90 border-none"
              >
                <MessageSquare className="h-4.5 w-4.5" />
                فرم ارتباط با تیم
              </Button>
              <Button
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-white/10"
              >
                <Mail className="h-4.5 w-4.5" />
                ارسال ایمیل مستقیم
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
