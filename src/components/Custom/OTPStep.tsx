import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";
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
        });
        Navigate("/blank");
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
      toast.success("کد مجدداً ارسال شد", {
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
    <Card>
      <CardHeader>
        <Button size="icon" onClick={handleBack}>
          <ArrowRight className="h-5 w-5" />
        </Button>
        <CardTitle>تایید کد</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="otp" className="block mb-2">
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
                className="text-sm text-destructive mt-2"
                role="alert"
              >
                {formik.errors.otp}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full"
          >
            {formik.isSubmitting ? "در حال بررسی کد..." : "تایید"}
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
                className="hover:underline"
                onClick={handleResend}
              >
                برای ارسال مجدد کلیک کنید
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
