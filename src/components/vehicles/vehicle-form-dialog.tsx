"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { CustomDialog } from "@/components/Custom/CustomDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CustomInput from "@/components/Custom/CustomInput";
import { Upload, Car, FileText } from "lucide-react";

const ENGLISH_TO_PERSIAN: Record<string, string> = {
  "0": "۰",
  "1": "۱",
  "2": "۲",
  "3": "۳",
  "4": "۴",
  "5": "۵",
  "6": "۶",
  "7": "۷",
  "8": "۸",
  "9": "۹",
};

const PERSIAN_DIGIT_RE = /[۰-۹]/;
const PERSIAN_LETTER_RE = /[ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]/;

function toPersianDigits(input: string): string {
  return input
    .split("")
    .map((c) => ENGLISH_TO_PERSIAN[c] ?? c)
    .join("");
}

function formatPlateInput(input: string): string {
  const converted = toPersianDigits(input);
  const stripped = converted.replace(
    /[^\u06F0-\u06F9ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]/g,
    "",
  );

  let result = "";
  let si = 0;

  while (result.length < 3 && si < stripped.length) {
    if (PERSIAN_DIGIT_RE.test(stripped[si])) result += stripped[si];
    si++;
  }
  if (result.length < 3) return result;

  while (si < stripped.length) {
    if (PERSIAN_LETTER_RE.test(stripped[si])) {
      result += stripped[si];
      si++;
      break;
    }
    si++;
  }
  if (result.length < 4) return result;

  while (result.length < 6 && si < stripped.length) {
    if (PERSIAN_DIGIT_RE.test(stripped[si])) result += stripped[si];
    si++;
  }
  if (result.length < 6) return result;

  if (si < stripped.length) {
    result += "|";
  }

  let lastD = 0;
  while (lastD < 2 && si < stripped.length) {
    if (PERSIAN_DIGIT_RE.test(stripped[si])) {
      result += stripped[si];
      lastD++;
    }
    si++;
  }

  return result;
}

const vehicleSchema = yup.object({
  license_plate: yup
    .string()
    .required("پلاک الزامی است")
    .test(
      "plate-format",
      "فرمت پلاک نامعتبر است (۳ رقم + ۱ حرف + ۲ رقم | ۲ رقم)",
      (value) => {
        if (!value) return false;
        const stripped = value.replace("|", "");
        return /^[۰-۹]{3}[ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی][۰-۹]{4}$/.test(
          stripped,
        );
      },
    ),
  car_model: yup.string().required("مدل ماشین الزامی است"),
  registration_card: yup
    .mixed<File>()
    .required("عکس کارت ماشین الزامی است")
    .test(
      "file-required",
      "لطفاً عکس کارت ماشین را آپلود کنید",
      (value) => value instanceof File,
    ),
});

interface FormValues {
  license_plate: string;
  car_model: string;
  registration_card: File | null;
}

interface VehicleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (
    data: {
      license_plate: string;
      car_model: string;
    },
    file: File,
  ) => Promise<void>;
}

export function VehicleFormDialog({
  open,
  onOpenChange,
  onSave,
}: VehicleFormDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      license_plate: "",
      car_model: "",
      registration_card: null,
    },
    validationSchema: vehicleSchema,
    onSubmit: async (values) => {
      try {
        const plateForBackend = values.license_plate.replace("|", "");
        await onSave(
          {
            license_plate: plateForBackend,
            car_model: values.car_model,
          },
          values.registration_card!,
        );
        onOpenChange(false);
        setBackendError(null);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        setBackendError(message);
      }
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
      setPreviewUrl(null);
      setBackendError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handlePlateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPlateInput(e.target.value);
      formik.setFieldValue("license_plate", formatted);
      formik.setFieldTouched("license_plate", true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        formik.setFieldValue("registration_card", file);
        formik.setFieldTouched("registration_card", true);
        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      title="افزودن وسیله نقلیه"
      description="برای احراز هویت، اطلاعات ماشین و عکس کارت را وارد کنید"
      showCloseButton
    >
      <form onSubmit={formik.handleSubmit} className="space-y-5" dir="rtl">
        <Card className="border border-border/80 border-primary bg-card/60 backdrop-blur-sm p-6 shadow-lg space-y-5 rounded-2xl">
          <div className="space-y-2">
            <CustomInput
              id="registration_card"
              label="عکس کارت ماشین"
              error={
                formik.touched.registration_card
                  ? formik.errors.registration_card
                  : undefined
              }
              dir="rtl"
              icon={<Upload className="h-4 w-4" />}
              iconPosition="left"
            >
              <CustomInput.Label required>عکس کارت ماشین</CustomInput.Label>
              <CustomInput.Error />
            </CustomInput>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed border-2 border-border hover:border-primary hover:bg-primary/5 transition-all rounded-xl h-20 flex items-center justify-center gap-2 text-muted-foreground hover:text-primary"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-5 w-5" />
              <span>
                {formik.values.registration_card
                  ? formik.values.registration_card.name
                  : "انتخاب عکس کارت ماشین"}
              </span>
            </Button>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="کارت ماشین"
                className="mt-2 w-32 h-20 object-cover rounded-lg border border-border"
              />
            )}
          </div>
          <div>
            <CustomInput
              id="license_plate"
              label="شماره پلاک"
              error={
                formik.touched.license_plate
                  ? formik.errors.license_plate
                  : undefined
              }
              inputSize="lg"
              placeholder="۱۲۳ب۴۵|۶۷"
              value={formik.values.license_plate}
              onChange={handlePlateChange}
              onBlur={formik.handleBlur}
              dir="rtl"
              icon={<FileText className="h-4 w-4" />}
              iconPosition="left"
            >
              <CustomInput.Label required>شماره پلاک</CustomInput.Label>
              <CustomInput.Input />
              <CustomInput.Error />
            </CustomInput>
            <p className="text-xs text-muted-foreground mt-1 text-right">
              فرمت: ۳ رقم فارسی + ۱ حرف + ۲ رقم | ۲ رقم
            </p>
          </div>

          <CustomInput
            id="car_model"
            label="مدل ماشین"
            error={
              formik.touched.car_model ? formik.errors.car_model : undefined
            }
            inputSize="lg"
            placeholder="مثال: پراید، ۲۰۶، پژو ۴۰۵..."
            value={formik.values.car_model}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            dir="rtl"
            icon={<Car className="h-4 w-4" />}
            iconPosition="left"
          >
            <CustomInput.Label required>مدل ماشین</CustomInput.Label>
            <CustomInput.Input />
            <CustomInput.Error />
          </CustomInput>
        </Card>

        {backendError && (
          <p className="text-sm text-destructive text-center">{backendError}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            انصراف
          </Button>
          <Button
            type="submit"
            disabled={formik.isSubmitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
          >
            {formik.isSubmitting ? "در حال ثبت..." : "ثبت و احراز"}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
}
