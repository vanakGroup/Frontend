import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomInput from "@/components/Custom/CustomInput";
import { CustomCheckBox } from "@/components/Custom/CustomCheckBox";
import { CustomLabel } from "@/components/Custom/CustomLabel";
import { useFormik } from "formik";
import { phoneValidationSchema } from "@/schemas/phoneLoginSchema";
import { sendOTPService } from "@/services/authService";
import CustomToast from "@/components/Custom/CustomToast";
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
        CustomToast.success("کد با موفقیت ارسال شد", {
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
            CustomToast.success("کد تایید قبلی منقضی نشده است", {
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
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/40 p-4 text-foreground"
      dir="rtl"
    >
      <Card className="w-full max-w-[400px] shadow-lg min-h-[500px] flex flex-col justify-between">
        <CardHeader>
          <CardContent>
            <Link to="/" className="block cursor-pointer">
              <img
                src="/logotype.png"
                alt="Logo"
                className="mx-auto w-32 md:w-full md:max-w-[200px] h-auto transition-transform duration-200 hover:scale-[1.03]"
              />
            </Link>
          </CardContent>
          <CardTitle className="text-2xl font-bold text-center tracking-tight text-card-foreground">
            {"ورود یا ثبت نام"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={formik.handleSubmit}
            className="flex-1 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-3">
              <CustomLabel htmlFor="phone" className="text-sm font-medium ">
                شماره موبایل خود را وارد کنید
              </CustomLabel>
              <CustomInput
                id="phone"
                name="phone"
                type="tel"
                dir="ltr"
                placeholder="09xxxxxxxxx"
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
                <p className="text-sm text-destructive font-medium">
                  {formik.errors.phone}
                </p>
              )}
            </div>

            <CustomCheckBox.Root
              id="rememberMe"
              checked={formik.values.rememberMe}
              onCheckedChange={(checked) =>
                formik.setFieldValue("rememberMe", checked)
              }
              disabled={formik.isSubmitting}
              className="gap-3 py-2"
            >
              <CustomCheckBox.Checkbox className="w-4 h-4" />
              <CustomCheckBox.Label>به خاطر بسپار</CustomCheckBox.Label>
            </CustomCheckBox.Root>

            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full h-12 text-white"
            >
              {formik.isSubmitting ? "در حال ورود ..." : "ورود"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
