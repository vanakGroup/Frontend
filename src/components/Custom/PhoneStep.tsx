import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { phoneValidationSchema } from "@/schemas/phoneLoginSchema";
import { sendOTPService } from "@/services/authService";
import { toast } from "sonner";
import useUserStore from "@/store/userStore/userStore";

export default function PhoneStep({
  phoneNumber,
  setPhoneNumber,
  handleSuccess,
}: {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  handleSuccess: () => void;
}) {
  const formik = useFormik({
    initialValues: {
      phone: phoneNumber || "",
      rememberMe: false,
    },
    validationSchema: phoneValidationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        await sendOTPService({ phone: values.phone.trim() });
        toast.success("کد با موفقیت ارسال شد", {
          description: `کد تایید به شماره ${values.phone.trim()} پیامک شد.`,
        });

        useUserStore.getState().setRememberMe(values.rememberMe);

        setPhoneNumber(values.phone.trim());
        handleSuccess();
      } catch (error) {
        console.error("Login failed:", error);

        const axiosError = error as { response?: { status?: number } };
        const statusCode = axiosError.response?.status;

        let errorMessage = "خطای غیر منتظره ای رخ داد لطفا بعدا تلاش کنید";

        switch (statusCode) {
          case 401:
            errorMessage = "";
            setPhoneNumber(values.phone.trim());
            toast.success("کد تایید قبلی منقضی نشده است", {
              description: "از کد تایید قبلی استفاده نمایید.",
            });
            handleSuccess();
            break;
          case 404:
            errorMessage = "صفحه مورد نظر موجود نمی‌باشد";
            break;
          case 422:
            errorMessage = "شماره موبایل وارد شده معتبر نیست";
            break;
        }
        setFieldError("phone", errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("phone", e.target.value);

    if (formik.errors.phone) {
      formik.setFieldError("phone", undefined);
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-muted/40 p-4"
      dir="rtl"
    >
      <Card className="w-full max-w-[400px] shadow-lg min-h-[500px] flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center tracking-tight text-foreground">
            {"ورود با شماره موبایل"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={formik.handleSubmit}
            className="flex-1 flex flex-col gap-6"
          >
            <div className="space-y-4">
              <Label htmlFor="phone" className="text-sm font-medium ">
                شماره موبایل خود را وارد کنید:
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="09374521254"
                disabled={formik.isSubmitting}
                autoFocus
                inputMode="numeric"
                value={formik.values.phone}
                onChange={handlePhoneChange}
                onBlur={formik.handleBlur}
                className={
                  (formik.touched.phone && formik.errors.phone
                    ? "border-destructive focus-visible:ring-destructive"
                    : "") + " h-12"
                }
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-sm text-destructive">
                  {formik.errors.phone}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 py-2">
              <Input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="w-4 h-4 "
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
                disabled={formik.isSubmitting}
              />
              <Label htmlFor="rememberMe">من را به خاطر بسپار</Label>
            </div>

            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full h-12"
            >
              {formik.isSubmitting ? "در حال ورود ..." : "ورود"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
