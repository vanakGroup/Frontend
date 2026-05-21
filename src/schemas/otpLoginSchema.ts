import * as Yup from "yup";

export const otpValidationSchema = Yup.object({
  otp: Yup.string()
    .trim()
    .required("کد تایید الزامی است")
    .matches(/^\d{6}$/, "کد تایید باید ۶ رقم باشد"),
});
