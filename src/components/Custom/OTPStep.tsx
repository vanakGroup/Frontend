import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useFormik } from "formik";
import { otpValidationSchema } from "@/schemas/otpLoginSchema";
import { verifyOTPService } from "@/services/authService";
import { sendOTPService } from "@/services/authService";
import useUserStore from "@/store/userStore/userStore";
import { loginService } from "@/services/authService";
import CustomToast from "@/components/Custom/CustomToast";
import { useNavigate } from "react-router-dom";

const TIMER_START = 5;

export default function OTPStep({
  phoneNumber,
  handleBack,
}: {
  phoneNumber: string;
  handleBack: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(TIMER_START);
  const Navigate = useNavigate();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const setAuthData = useUserStore((state) => state.setAuthData);

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: otpValidationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      console.log(phoneNumber);
      console.log("OTP:", values.otp);

      try {
        await verifyOTPService({ phone: phoneNumber, otp: values.otp.trim() });
        const loginRes = await loginService({ phone: phoneNumber });
        setAuthData({
          phone: loginRes.data.phone,
          accessToken: loginRes.data.accessToken,
          refreshToken: loginRes.data.refreshToken,
          role: loginRes.data.role,
        });

        // Fetch user profile immediately to update username in navbar
        try {
          const { getData } = await import("@/services/services");
          const profileRes = await getData({ endPoint: "/v1/profile" });
          if (profileRes && profileRes.statusCode === 200) {
            const userData = profileRes.data;
            if (userData && (userData.first_name || userData.last_name)) {
              useUserStore
                .getState()
                .setUsername(
                  `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
                );
            }
          }
        } catch (e) {
          console.error("Failed to fetch profile during login", e);
        }

        Navigate("/dashboard/management");
        console.log("Login successful");
      } catch (error) {
        console.error("Login failed:", error);

        const axiosError = error as { response?: { status?: number } };
        const statusCode = axiosError.response?.status;

        let errorMessage = "خطای غیر منتظره ای رخ داد لطفا بعدا تلاش کنید";

        switch (statusCode) {
          case 401:
            errorMessage = "کد وارد شده اشتباه است";
            break;
          case 404:
            errorMessage = "صفحه مورد نظر موجود نمی‌باشد";
            break;
          case 500:
            errorMessage = "خطای سرور. لطفا دوباره تلاش کنید";
            break;
        }

        formik.setFieldError("otp", errorMessage);
      } finally {
        formik.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (timeLeft === 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleResend = async () => {
    try {
      await sendOTPService({ phone: phoneNumber });
      CustomToast.success("کد مجدداً ارسال شد", {
        description: `یک کد تایید جدید به شماره ${phoneNumber} پیامک شد.`,
      });

      setTimeLeft(TIMER_START);
      formik.resetForm();
      console.log("New OTP sent to:", phoneNumber);
    } catch (error) {
      console.error("Failed to resend OTP:", error);

      const axiosError = error as { response?: { status?: number } };
      const statusCode = axiosError.response?.status;

      let errorMessage = "خطای غیر منتظره ای رخ داد لطفا بعدا تلاش کنید";

      switch (statusCode) {
        case 401:
          errorMessage = "کد ورود ارسال شده است";
          break;
        case 404:
          errorMessage = "صفحه مورد نظر موجود نمی‌باشد";
          break;
        case 500:
          errorMessage = "خطای سرور. لطفا دوباره تلاش کنید";
          break;
      }

      formik.setFieldError("otp", errorMessage);
    }
  };

  const handleOTPChange = (value: string) => {
    formik.setFieldValue("otp", value);

    if (formik.errors.otp) {
      formik.setFieldError("otp", undefined);
    }

    if (value.length === 6) {
      formik.setFieldTouched("otp", true, false);
      // Using setTimeout ensures Formik updates the state before triggering the submit handler
      setTimeout(() => formik.handleSubmit(), 0);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/40 p-4">
      <Card>
        <CardHeader className="relative flex items-center justify-center min-h-[64px] pb-4">
          <CardAction className="absolute right-4 top-1/2 -translate-y-1/2">
            <Button size="icon" onClick={handleBack}>
              <ArrowRight className="h-5 w-5 text-white" />
            </Button>
          </CardAction>
          <CardTitle className="text-xl md:text-2xl font-bold text-center">
            تایید کد
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="otp" className="block mb-6">
                کد ارسال شده به شماره {phoneNumber} را وارد کنید
              </Label>

              <InputOTP
                id="otp"
                maxLength={6}
                value={formik.values.otp}
                onChange={handleOTPChange}
                disabled={formik.isSubmitting}
                autoFocus
              >
                <InputOTPGroup className="gap-2 justify-center w-full direction-ltr">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              {formik.errors.otp && (
                <p
                  id="otp-error"
                  className="text-sm font-medium text-destructive mt-4 mb-4"
                  role="alert"
                  dir="rtl"
                >
                  {formik.errors.otp}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full text-white h-10 mt-4"
              dir="rtl"
            >
              {formik.isSubmitting ? "در حال بررسی کد تایید ..." : "تایید"}
            </Button>

            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-sm text-muted-foreground">
                  برای ارسال مجدد {formatTime(timeLeft)} صبر کنید
                </p>
              ) : (
                <Button
                  type="button"
                  variant="link"
                  className="hover:underline "
                  onClick={handleResend}
                >
                  برای ارسال مجدد کلیک کنید
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
