import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { getData, putData } from "@/services/services";
import useUserStore from "@/store/userStore/userStore";

// --- Swagger Align Interfaces ---
interface SwaggerUserData {
  first_name: string;
  last_name: string;
  national_code: string;
  phone: string; // Read-only
  shaba_number: string;
}

interface SwaggerGetReponse {
  data: SwaggerUserData;
  message: string;
  statusCode: number;
}

interface SwaggerPutPayload {
  firstname: string;
  lastname: string;
  national_code: string;
  shaba_number: string;
}

interface SwaggerPutResponse {
  data: unknown;
  message: string | Record<string, string>;
  statusCode: number;
}

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

function translateErrorMessage(msg: string): string {
  const lowerMsg = msg.toLowerCase().trim();
  if (
    lowerMsg.includes("national id already exists") ||
    lowerMsg.includes("national_code already exists") ||
    lowerMsg.includes("national code already exists")
  ) {
    return "این کد ملی قبلاً ثبت شده است.";
  }
  if (
    lowerMsg.includes("iban already exists") ||
    lowerMsg.includes("shaba_number already exists") ||
    lowerMsg.includes("shaba already exists")
  ) {
    return "این شماره شبا قبلاً ثبت شده است.";
  }
  return msg;
}

export default function UserProfile() {
  const navigate = useNavigate();
  const {
    phone: storePhone,
    accessToken,
    clearAuth,
    setUsername,
  } = useUserStore();

  const [profile, setProfile] = useState<SwaggerUserData>({
    first_name: "",
    last_name: "",
    phone: "",
    national_code: "",
    shaba_number: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- Fetch Profile on Mount ---
  useEffect(() => {
    // Redirect to login if token is missing
    if (!accessToken) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const result: SwaggerGetReponse = await getData({
          endPoint: "/v1/profile",
        });

        if (result.statusCode === 200) {
          // If profile returned phone is empty, fallback to token-level phone
          const userData = { ...result.data };
          if (!userData.phone) {
            userData.phone = storePhone || "";
          }
          if (
            userData.shaba_number &&
            userData.shaba_number.toUpperCase().startsWith("IR")
          ) {
            userData.shaba_number = userData.shaba_number.substring(2);
          }
          setProfile(userData);
          if (userData.first_name || userData.last_name) {
            setUsername(
              `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
            );
          }
        } else if (result.statusCode === 401) {
          clearAuth();
          navigate("/login");
        } else {
          setErrorMessage(result.message || "خطا در بارگذاری مشخصات از سرور.");
        }
      } catch (error: unknown) {
        const err = error as { response?: { status?: number } };
        if (err.response?.status === 401) {
          clearAuth();
          navigate("/login");
        } else {
          setErrorMessage("ارتباط با سرور برقرار نشد. لطفاً مجدداً تلاش کنید.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, accessToken, storePhone, clearAuth, setUsername]);

  // --- Change Handler ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Apply English digits conversion for code and shaba fields
    const processedValue =
      name === "national_code" || name === "shaba_number"
        ? convertDigitsToEnglish(value)
        : value;

    setProfile((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  // --- Submit Update Profile ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!accessToken) {
      navigate("/login");
      return;
    }

    if (!profile.first_name.trim() || !profile.last_name.trim()) {
      setErrorMessage("وارد کردن نام و نام خانوادگی الزامی است.");
      return;
    }

    const cleanNationalCode = (profile.national_code || "").replace(/\s/g, "");
    if (
      !cleanNationalCode ||
      cleanNationalCode.length !== 10 ||
      isNaN(Number(cleanNationalCode))
    ) {
      setErrorMessage(
        "کد ملی الزامی است و باید دقیقاً ۱۰ رقم عددی باشد.",
      );
      return;
    }

    let cleanShaba = (profile.shaba_number || "").replace(/\s/g, "").toUpperCase();
    if (cleanShaba.startsWith("IR")) {
      cleanShaba = cleanShaba.substring(2);
    }
    const digitsRegex = /^\d{24}$/;
    if (!digitsRegex.test(cleanShaba)) {
      setErrorMessage(
        "شماره شبا الزامی است و باید دقیقاً ۲۴ رقم باشد.",
      );
      return;
    }

    try {
      setIsSaving(true);

      const payload: SwaggerPutPayload = {
        firstname: profile.first_name.trim(),
        lastname: profile.last_name.trim(),
        national_code: cleanNationalCode,
        shaba_number: cleanShaba,
      };

      const result: SwaggerPutResponse = await putData({
        endPoint: "/v1/profile",
        data: payload,
      });

      if (result.statusCode === 200) {
        setSuccessMessage("اطلاعات پروفایل شما با موفقیت به‌روزرسانی شد.");
        setProfile((prev) => ({
          ...prev,
          first_name: payload.firstname,
          last_name: payload.lastname,
          national_code: payload.national_code,
          shaba_number: cleanShaba,
        }));
        setUsername(`${payload.firstname} ${payload.lastname}`.trim());
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        const errorData = result;
        if (errorData?.message && typeof errorData.message === "object") {
          const extractErrors = (obj: Record<string, unknown>): string[] => {
            let messages: string[] = [];
            for (const key in obj) {
              if (typeof obj[key] === "object" && obj[key] !== null) {
                messages = messages.concat(extractErrors(obj[key] as Record<string, unknown>));
              } else {
                messages.push(String(obj[key]));
              }
            }
            return messages;
          };
          const errList = extractErrors(errorData.message as Record<string, unknown>).map(translateErrorMessage);
          setErrorMessage(errList.join(" | "));
        } else if (errorData?.message) {
          setErrorMessage(translateErrorMessage(String(errorData.message)));
        } else {
          setErrorMessage("خطا در به‌روزرسانی اطلاعات حساب کاربری.");
        }
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: unknown } } };
      if (err.response?.status === 401) {
        clearAuth();
        navigate("/login");
      } else {
        const errorData = err.response?.data;
        if (errorData?.message && typeof errorData.message === "object") {
          const extractErrors = (obj: Record<string, unknown>): string[] => {
            let messages: string[] = [];
            for (const key in obj) {
              const val = obj[key];
              if (typeof val === "object" && val !== null) {
                messages = messages.concat(extractErrors(val as Record<string, unknown>));
              } else {
                messages.push(String(val));
              }
            }
            return messages;
          };
          const errList = extractErrors(errorData.message as Record<string, unknown>).map(translateErrorMessage);
          setErrorMessage(errList.join(" | "));
        } else if (errorData?.message) {
          setErrorMessage(translateErrorMessage(String(errorData.message)));
        } else {
          setErrorMessage("خطا در برقراری ارتباط با وب‌سرویس.");
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="w-full min-h-screen text-foreground bg-background font-sans relative py-12 px-4 md:px-8 rtl"
    >
      {/* Background Ambience */}
      <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div
        className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] -z-10 animate-pulse"
        style={{ animationDuration: "4s" }}
      ></div>

      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
        {/* Profile Header */}
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
            <Button className="bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 hover:border-transparent gap-2 text-xs h-10 px-5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
              <span>بازگشت به خانه</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Loading / Content wrapper */}
        {isLoading ? (
          <Card className="p-12 flex flex-col items-center justify-center space-y-4 border-primary/20 bg-card/40 backdrop-blur-md rounded-3xl shadow-xl shadow-primary/5 animate-pulse">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">
              در حال دریافت اطلاعات کاربری شما...
            </p>
          </Card>
        ) : (
          <form onSubmit={handleSubmit}>
            <Card className="p-6 md:p-8 bg-card/60 backdrop-blur-lg border border-border/80 hover:border-primary/30 rounded-[32px] space-y-8 shadow-2xl transition-all duration-500 hover:shadow-primary/5">
              {/* Errors container */}
              {errorMessage && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-start gap-3 text-destructive text-sm text-right animate-shake animate-in fade-in duration-300">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 animate-bounce" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {/* Success container */}
              {successMessage && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-emerald-600 dark:text-emerald-400 text-sm text-right animate-in fade-in duration-300">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 animate-bounce" />
                  <span className="leading-relaxed">{successMessage}</span>
                </div>
              )}

              {/* Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2 text-right group">
                  <label
                    htmlFor="first_name"
                    className="text-xs md:text-sm font-bold text-foreground/80 flex items-center gap-1.5 transition-colors group-focus-within:text-primary"
                  >
                    نام <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={profile.first_name || ""}
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
                    htmlFor="last_name"
                    className="text-xs md:text-sm font-bold text-foreground/80 flex items-center gap-1.5 transition-colors group-focus-within:text-primary"
                  >
                    نام خانوادگی <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={profile.last_name || ""}
                      onChange={handleInputChange}
                      placeholder="مثال: رضایی"
                      className="w-full pr-12 pl-4 py-3.5 bg-background/50 border border-border/80 focus:border-primary focus:bg-background rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-right shadow-sm focus:shadow-md"
                      required
                    />
                  </div>
                </div>

                {/* Read-Only Phone Number */}
                <div className="space-y-2 text-right opacity-80">
                  <label
                    htmlFor="phone"
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
                      id="phone"
                      name="phone"
                      value={profile.phone || ""}
                      disabled
                      className="w-full pr-12 pl-4 py-3.5 bg-muted/40 border border-border/40 rounded-2xl text-sm text-muted-foreground/80 font-mono ltr text-left cursor-not-allowed select-none"
                    />
                  </div>
                </div>

                {/* National Code */}
                <div className="space-y-2 text-right group">
                  <label
                    htmlFor="national_code"
                    className="text-xs md:text-sm font-bold text-foreground/80 transition-colors group-focus-within:text-primary"
                  >
                    کد ملی <span className="text-destructive">*</span>{" "}
                    <span className="text-[10px] text-muted-foreground font-normal">
                      (جهت احراز هویت)
                    </span>
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
                    <input
                      type="text"
                      id="national_code"
                      name="national_code"
                      value={profile.national_code || ""}
                      onChange={handleInputChange}
                      placeholder="مثال: ۰۰۱۲۳۴۵۶۷۸"
                      maxLength={10}
                      className="w-full pr-12 pl-4 py-3.5 bg-background/50 border border-border/80 focus:border-primary focus:bg-background rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-right font-mono shadow-sm focus:shadow-md"
                      required
                    />
                  </div>
                </div>

                {/* Shaba Number */}
                <div className="space-y-2 text-right sm:col-span-2 group">
                  <label
                    htmlFor="shaba_number"
                    className="text-xs md:text-sm font-bold text-foreground/80 transition-colors group-focus-within:text-primary"
                  >
                    شماره شبا بدون IR (جهت تسویه مالکان) <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
                    <input
                      type="text"
                      id="shaba_number"
                      name="shaba_number"
                      value={profile.shaba_number || ""}
                      onChange={handleInputChange}
                      placeholder="مثال: ۱۲۳۴۵۶۷۸۹۰۱۲۳۴۵۶۷۸۹۰۱۲۳۴"
                      maxLength={24}
                      className="w-full pr-12 pl-4 py-3.5 bg-background/50 border border-border/80 focus:border-primary focus:bg-background rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-right font-mono shadow-sm focus:shadow-md"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
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
