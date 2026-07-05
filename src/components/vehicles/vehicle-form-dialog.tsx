"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { CustomDialog } from "@/components/Custom/CustomDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CustomLabel } from "@/components/Custom/CustomLabel";
import CustomInput from "@/components/Custom/CustomInput";
import { Upload, Car } from "lucide-react";
import { createVehicle } from "./vehicle-service";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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

function toPersianDigits(input: string): string {
  return input
    .split("")
    .map((c) => ENGLISH_TO_PERSIAN[c] ?? c)
    .join("");
}

function keepDigits(input: string): string {
  return toPersianDigits(input).replace(/[^\u06F0-\u06F9]/g, "");
}

function keepLetters(input: string): string {
  return input.replace(
    /[^\u0627\u0628\u067E\u062A\u062B\u062C\u0686\u062D\u062E\u062F\u0630\u0631\u0632\u0698\u0633\u0634\u0635\u0636\u0637\u0638\u0639\u063A\u0641\u0642\u06A9\u06AF\u0644\u0645\u0646\u0648\u0647\u06CC]/g,
    "",
  );
}


const vehicleSchema = yup.object({
  license_plate: yup
    .string()
    .required("پلاک الزامی است")
    .test(
      "plate-format",
      "فرمت پلاک نامعتبر است (۲ رقم + ۱ حرف + ۳ رقم + ۲ رقم)",
      (value) => {
        if (!value) return false;
        return /^[۰-۹]{2}[ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی][۰-۹]{5}$/.test(
          value,
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
  const plateRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);
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
        const plateForBackend = values.license_plate;
        await createVehicle({
          license_plate: plateForBackend,
          car_model: values.car_model,
          registration_card: values.registration_card!,
        });
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

  const setPlatePart = useCallback(
    (part: number, value: string) => {
      const current = formik.values.license_plate;
      const segments = [
        current.slice(0, 2),
        current.slice(2, 3),
        current.slice(3, 6),
        current.slice(6, 8),
      ];
      segments[part] = value;
      const next = segments.join("");
      formik.setFieldValue("license_plate", next);
      formik.setFieldTouched("license_plate", true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formik.values.license_plate],
  );

  const handlePlatePartChange = useCallback(
    (part: number, maxLen: number, type: "digit" | "letter") =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = toPersianDigits(e.target.value);
        const filtered =
          type === "digit"
            ? keepDigits(raw)
            : keepLetters(raw).slice(-1);
        const value = filtered.slice(0, maxLen);
        setPlatePart(part, value);
        if (value.length === maxLen) {
          plateRefs.current[Math.min(part + 1, 3)]?.focus();
        }
      },
    [setPlatePart],
  );

  const handlePlatePartKeyDown = useCallback(
    (part: number) =>
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
          e.key === "Backspace" &&
          !e.currentTarget.value &&
          part > 0
        ) {
          e.preventDefault();
          plateRefs.current[part - 1]?.focus();
        }
      },
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

  const isMobile = useIsMobile();

  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      title="افزودن وسیله نقلیه"
      description="برای احراز هویت، اطلاعات ماشین و عکس کارت را وارد کنید"
      showCloseButton
    >
      <form onSubmit={formik.handleSubmit} className={cn("space-y-5")} dir="rtl">
        <Card className="border border-border/80 border-primary bg-card/60 backdrop-blur-sm p-4 sm:p-6 shadow-lg space-y-5 rounded-2xl">
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
            <div className="flex flex-col w-full space-y-1.5" dir="rtl">
              <CustomLabel
                htmlFor="plate-part-0"
                required
                className="block text-right"
              >
                شماره پلاک
              </CustomLabel>
              <div className="flex items-center justify-center gap-2" dir="ltr">
                <Input
                  ref={(el) => { plateRefs.current[0] = el; }}
                  id="plate-part-0"
                  inputMode="numeric"
                  placeholder="۱۲"
                  value={formik.values.license_plate.slice(0, 2)}
                  onChange={handlePlatePartChange(0, 2, "digit")}
                  onKeyDown={handlePlatePartKeyDown(0)}
                  onBlur={formik.handleBlur}
                  maxLength={2}
                  dir="rtl"
                  className={cn(
                    "w-14 h-12 text-center text-lg font-semibold rounded-xl border bg-background outline-none transition-all",
                    formik.touched.license_plate && formik.errors.license_plate
                      ? "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/30"
                      : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
                  )}
                />
                <Input
                  ref={(el) => { plateRefs.current[1] = el; }}
                  id="plate-part-1"
                  placeholder="ب"
                  value={formik.values.license_plate.slice(2, 3)}
                  onChange={handlePlatePartChange(1, 1, "letter")}
                  onKeyDown={handlePlatePartKeyDown(1)}
                  onBlur={formik.handleBlur}
                  maxLength={1}
                  dir="rtl"
                  className={cn(
                    "w-12 h-12 text-center text-lg font-semibold rounded-xl border bg-background outline-none transition-all",
                    formik.touched.license_plate && formik.errors.license_plate
                      ? "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/30"
                      : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
                  )}
                />
                <Input
                  ref={(el) => { plateRefs.current[2] = el; }}
                  id="plate-part-2"
                  inputMode="numeric"
                  placeholder="۳۴۵"
                  value={formik.values.license_plate.slice(3, 6)}
                  onChange={handlePlatePartChange(2, 3, "digit")}
                  onKeyDown={handlePlatePartKeyDown(2)}
                  onBlur={formik.handleBlur}
                  maxLength={3}
                  dir="rtl"
                  className={cn(
                    "w-16 h-12 text-center text-lg font-semibold rounded-xl border bg-background outline-none transition-all",
                    formik.touched.license_plate && formik.errors.license_plate
                      ? "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/30"
                      : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
                  )}
                />
                <Input
                  ref={(el) => { plateRefs.current[3] = el; }}
                  id="plate-part-3"
                  inputMode="numeric"
                  placeholder="۶۷"
                  value={formik.values.license_plate.slice(6, 8)}
                  onChange={handlePlatePartChange(3, 2, "digit")}
                  onKeyDown={handlePlatePartKeyDown(3)}
                  onBlur={formik.handleBlur}
                  maxLength={2}
                  dir="rtl"
                  className={cn(
                    "w-14 h-12 text-center text-lg font-semibold rounded-xl border bg-background outline-none transition-all",
                    formik.touched.license_plate && formik.errors.license_plate
                      ? "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/30"
                      : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
                  )}
                />
              </div>
              {formik.touched.license_plate && formik.errors.license_plate && (
                <p className="text-sm text-destructive text-right">
                  {formik.errors.license_plate}
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-right">
              فرمت: ۲ رقم فارسی + ۱ حرف + ۳ رقم + ۲ رقم
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

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border text-muted-foreground hover:bg-accent hover:text-foreground w-full sm:w-auto"
          >
            انصراف
          </Button>
          <Button
            type="submit"
            disabled={formik.isSubmitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors w-full sm:w-auto"
          >
            {formik.isSubmitting ? "در حال ثبت..." : "ثبت و احراز"}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
}
