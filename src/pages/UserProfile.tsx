import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Phone,
  CreditCard,
  ShieldCheck,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- Types ---
interface UserProfileData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  nationalId: string;
  accountNumber: string;
}

// --- Simulating API Methods ---
const mockApi = {
  getUserProfile: (): Promise<UserProfileData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          firstName: "",
          lastName: "",
          phoneNumber: "09123456789",
          nationalId: "",
          accountNumber: "",
        });
      }, 1000);
    });
  },

  updateUserProfile: (
    data: UserProfileData,
  ): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "اطلاعات پروفایل شما با موفقیت به‌روزرسانی شد.",
        });
      }, 1200);
    });
  },
};

// --- Helper to convert Persian/Arabic digits to English ---
function convertDigitsToEnglish(str: string): string {
  const persianDigits = [
    /۰/g,
    /۱/g,
    /۲/g,
    /۳/g,
    /۴/g,
    /۵/g,
    /۶/g,
    /۷/g,
    /۸/g,
    /۹/g,
  ];
  const arabicDigits = [
    /٠/g,
    /١/g,
    /٢/g,
    /٣/g,
    /٤/g,
    /٥/g,
    /٦/g,
    /٧/g,
    /٨/g,
    /٩/g,
  ];

  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result
      .replace(persianDigits[i], i.toString())
      .replace(arabicDigits[i], i.toString());
  }
  return result;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfileData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    nationalId: "",
    accountNumber: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- Load Profile Data ---
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const data = await mockApi.getUserProfile();
        setProfile(data);
      } catch (error) {
        setErrorMessage(
          "خطا در دریافت اطلاعات از سرور. لطفاً دوباره تلاش کنید.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // --- Input Change Handler ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Automatically convert digits for numeric fields
    const processedValue =
      name === "nationalId" || name === "accountNumber"
        ? convertDigitsToEnglish(value)
        : value;

    setProfile((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  // --- Submit & Validate Profile ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      setErrorMessage("لطفاً نام و نام خانوادگی خود را به طور کامل وارد کنید.");
      return;
    }

    const cleanNationalId = profile.nationalId.replace(/\s/g, "");
    if (
      cleanNationalId &&
      (cleanNationalId.length !== 10 || isNaN(Number(cleanNationalId)))
    ) {
      setErrorMessage("کد ملی وارد شده باید دقیقاً ۱۰ رقم و بدون حروف باشد.");
      return;
    }

    const cleanAccount = profile.accountNumber.replace(/\s/g, "");
    if (
      cleanAccount &&
      isNaN(Number(cleanAccount)) &&
      !cleanAccount.toUpperCase().startsWith("IR")
    ) {
      setErrorMessage("شماره حساب یا شبای وارد شده معتبر نیست.");
      return;
    }

    try {
      setIsSaving(true);

      const payload: UserProfileData = {
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        phoneNumber: profile.phoneNumber,
        nationalId: cleanNationalId,
        accountNumber: cleanAccount,
      };

      const response = await mockApi.updateUserProfile(payload);

      if (response.success) {
        setSuccessMessage(response.message);
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage("ارتباط با سرور برقرار نشد. لطفاً مجدداً تلاش کنید.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="w-full min-h-screen text-foreground bg-background font-sans relative py-12 px-4 md:px-8 rtl"
    >
      {/* Dynamic Background Glows */}
      <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div
        className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] -z-10 animate-pulse"
        style={{ animationDuration: "4s" }}
      ></div>

      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div className="space-y-2 text-right">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 justify-start">
              <span className="p-1.5 bg-gradient-to-tr from-primary to-secondary text-primary-foreground rounded-xl shadow-lg">
                <UserCheck className="w-6 h-6" />
              </span>
              تکمیل مشخصات حساب کاربری
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              جهت استفاده از خدمات هوشمند رزرو و مدیریت درآمد پارکینگ ونک،
              اطلاعات خود را کامل کنید.
            </p>
          </div>
          <Link to="/" className="shrink-0">
            {/* Redesigned blue back button with icon on the right side */}
            <Button className="bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 hover:border-transparent gap-2 text-xs h-10 px-5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
              <ArrowRight className="w-4 h-4" />
              <span>بازگشت به خانه</span>
            </Button>
          </Link>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <Card className="p-12 flex flex-col items-center justify-center space-y-4 border-primary/20 bg-card/40 backdrop-blur-md rounded-3xl shadow-xl shadow-primary/5 animate-pulse">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">
              در حال دریافت اطلاعات کاربری شما...
            </p>
          </Card>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Main Form Card with soft hover glow effect */}
            <Card className="p-6 md:p-8 bg-card/60 backdrop-blur-lg border border-border/80 hover:border-primary/30 rounded-[32px] space-y-8 shadow-2xl transition-all duration-500 hover:shadow-primary/5">
              {/* Error messages */}
              {errorMessage && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-start gap-3 text-destructive text-sm text-right animate-shake">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 animate-bounce" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {/* Success messages */}
              {successMessage && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-emerald-600 dark:text-emerald-400 text-sm text-right animate-fadeIn">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 animate-bounce" />
                  <span className="leading-relaxed">{successMessage}</span>
                </div>
              )}

              {/* Form inputs grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2 text-right group">
                  <label
                    htmlFor="firstName"
                    className="text-xs md:text-sm font-bold text-foreground/80 flex items-center gap-1.5 transition-colors group-focus-within:text-primary"
                  >
                    نام <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleInputChange}
                      placeholder="مثال: علی"
                      className="w-full pr-12 pl-4 py-3.5 bg-background/50 border border-border/80 focus:border-primary focus:bg-background rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-right shadow-sm focus:shadow-md"
                      required
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-2 text-right group">
                  <label
                    htmlFor="lastName"
                    className="text-xs md:text-sm font-bold text-foreground/80 flex items-center gap-1.5 transition-colors group-focus-within:text-primary"
                  >
                    نام خانوادگی <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleInputChange}
                      placeholder="مثال: رضایی"
                      className="w-full pr-12 pl-4 py-3.5 bg-background/50 border border-border/80 focus:border-primary focus:bg-background rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-right shadow-sm focus:shadow-md"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number (Read-only) */}
                <div className="space-y-2 text-right opacity-80">
                  <label
                    htmlFor="phoneNumber"
                    className="text-xs md:text-sm font-bold text-foreground/80 flex items-center gap-1.5"
                  >
                    شماره تلفن همراه{" "}
                    <span className="text-[10px] text-muted-foreground/80 bg-muted/60 px-2 py-0.5 rounded-md font-normal">
                      غیرقابل ویرایش
                    </span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={profile.phoneNumber}
                      disabled
                      className="w-full pr-12 pl-4 py-3.5 bg-muted/40 border border-border/40 rounded-2xl text-sm text-muted-foreground/80 font-mono ltr text-left cursor-not-allowed select-none"
                    />
                  </div>
                </div>

                {/* National ID */}
                <div className="space-y-2 text-right group">
                  <label
                    htmlFor="nationalId"
                    className="text-xs md:text-sm font-bold text-foreground/80 transition-colors group-focus-within:text-primary"
                  >
                    کد ملی{" "}
                    <span className="text-[10px] text-muted-foreground font-normal">
                      (جهت احراز هویت)
                    </span>
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
                    <input
                      type="text"
                      id="nationalId"
                      name="nationalId"
                      value={profile.nationalId}
                      onChange={handleInputChange}
                      placeholder="مثال: ۰۰۱۲۳۴۵۶۷۸"
                      maxLength={10}
                      className="w-full pr-12 pl-4 py-3.5 bg-background/50 border border-border/80 focus:border-primary focus:bg-background rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-right font-mono shadow-sm focus:shadow-md"
                    />
                  </div>
                </div>

                {/* Account/Sheba Number */}
                <div className="space-y-2 text-right sm:col-span-2 group">
                  <label
                    htmlFor="accountNumber"
                    className="text-xs md:text-sm font-bold text-foreground/80 transition-colors group-focus-within:text-primary"
                  >
                    شماره حساب یا شماره شبا (جهت تسویه مالکان){" "}
                    <span className="text-[10px] text-muted-foreground font-normal">
                      (اختیاری)
                    </span>
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
                    <input
                      type="text"
                      id="accountNumber"
                      name="accountNumber"
                      value={profile.accountNumber}
                      onChange={handleInputChange}
                      placeholder="مثال: شماره حساب یا شماره شبا با IR"
                      className="w-full pr-12 pl-4 py-3.5 bg-background/50 border border-border/80 focus:border-primary focus:bg-background rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-right font-mono shadow-sm focus:shadow-md"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Button */}
              <div className="pt-6 border-t border-border/60 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-primary-foreground font-bold h-12 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>در حال ذخیره‌سازی...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>ذخیره مشخصات</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </form>
        )}
      </div>
    </div>
  );
}
