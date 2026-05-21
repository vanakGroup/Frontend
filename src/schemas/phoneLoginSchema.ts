import * as yup from "yup";

export const phoneValidationSchema = yup.object().shape({
  phone: yup
    .string()
    .required("شماره موبایل را وارد کنید")
    .trim()
    .matches(/^09\d{9}$/, "شماره موبایل معتبر نمی باشد"),
  rememberMe: yup.boolean(),
});
