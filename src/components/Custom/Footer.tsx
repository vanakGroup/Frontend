import React from "react";
import { Link } from "react-router-dom";
import { Car, MapPin, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Footer() {
  return (
    <footer
      className="w-full bg-card border-t border-border mt-12 relative overflow-hidden"
      dir="rtl"
    >
      {/* Subtle footer glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white text-primary-foreground p-2 rounded-lg shadow-md">
                <img src="/public/jl.png" className="h-6 w-6" />
              </div>
              <span className="text-xl font-black text-foreground tracking-tight">
                پلتفرم ونک
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed text-justify">
              ونک، راهکار نوین و دانشگاهی برای حل بحران ترافیک و جای پارک.
            </p>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className="text-[10px] text-muted-foreground border-border/80"
              >
                نسخه بتا ۱.۰
              </Badge>
            </div>
          </div>

          {/* Links Col */}
          <div className="space-y-4">
            <h4 className="font-bold text-foreground">دسترسی سریع</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  ورود به پنل کاربری
                </Link>
              </li>
              <li>
                <Link
                  to="/aboutus"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  داستان توسعه ونک
                </Link>
              </li>
              <li>
                <Link
                  to="/contactus"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  ارتباط با ما
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-4 lg:col-span-2">
            <h4 className="font-bold text-foreground">اطلاعات تماس</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-relaxed">
                  تهران، میدان رسالت، خیابان دانشگاه علم و صنعت، دانشکده مهندسی
                  کامپیوتر (PGR4+JWH)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span
                  className="text-muted-foreground ltr text-left block"
                  dir="ltr"
                >
                  <a
                    className="text-muted-foreground hover:text-primary transition-colors font-medium ltr text-left block"
                    href="tel:02177300000"
                  >
                    +98 21 7730000
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a
                  href="mailto:contact@vanak.com"
                  className="text-muted-foreground hover:text-primary transition-colors font-medium ltr text-left block"
                  dir="ltr"
                >
                  contact@vanak.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-right">
            تمامی حقوق برای پلتفرم به اشتراک‌گذاری پارکینگ{" "}
            <strong className="text-primary">ونک</strong> محفوظ است. (شروع
            توسعه: بهمن ۱۴۰۴)
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-muted-foreground/60">
              IUST Front-end & Back-end Team
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
