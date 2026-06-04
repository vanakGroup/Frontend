// components/ui/plate-input.tsx
"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PlateInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
}

export function PlateInput({ value, onChange, className, required }: PlateInputProps) {
  // تابع برای تبدیل فرمت کامل به بخش‌ها
  const parsePlate = (fullPlate: string) => {
    // حذف فاصله‌ها و کاراکترهای اضافی
    const clean = fullPlate.replace(/\s/g, '');
    
    // فرمت: دو رقم + حرف + سه رقم + دو رقم (آخر)
    // مثال: 12 ب 855 11
    const firstTwo = clean.slice(0, 2);
    const letter = clean.slice(2, 3);
    const lastThree = clean.slice(3, 6);
    const lastTwo = clean.slice(6, 8);
    
    return {
      firstTwo: /^\d+$/.test(firstTwo) ? firstTwo : '',
      letter: /^[ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]$/i.test(letter) ? letter : '',
      lastThree: /^\d+$/.test(lastThree) ? lastThree : '',
      lastTwo: /^\d+$/.test(lastTwo) ? lastTwo : '',
    };
  };

  const parts = parsePlate(value);

  const updateFullPlate = (newParts: {
    firstTwo?: string;
    letter?: string;
    lastThree?: string;
    lastTwo?: string;
  }) => {
    const updated = {
      firstTwo: newParts.firstTwo !== undefined ? newParts.firstTwo : parts.firstTwo,
      letter: newParts.letter !== undefined ? newParts.letter : parts.letter,
      lastThree: newParts.lastThree !== undefined ? newParts.lastThree : parts.lastThree,
      lastTwo: newParts.lastTwo !== undefined ? newParts.lastTwo : parts.lastTwo,
    };
    
    // ساخت فرمت کامل: "12 ب 855 11"
    let result = updated.firstTwo;
    if (updated.letter) result += ` ${updated.letter}`;
    if (updated.lastThree) result += ` ${updated.lastThree}`;
    if (updated.lastTwo) result += ` ${updated.lastTwo}`;
    
    onChange(result);
  };

  return (
    <div className={cn("flex gap-2 items-center justify-end", className)} dir="rtl">
      {/* باکس اول: دو رقم (سمت چپ‌ترین) */}
      <div className="relative">
        <Input
          type="text"
          maxLength={2}
          value={parts.firstTwo}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9]/g, '');
            updateFullPlate({ firstTwo: val });
          }}
          className="w-16 text-center border-gray-300 focus:border-[#1591dc] focus:ring-[#1591dc] bg-white text-gray-800"
          placeholder="۱۲"
          required={required}
        />
      </div>

      <span className="text-gray-500 text-lg font-bold">-</span>

      {/* باکس دوم: حرف الفبا */}
      <div className="relative">
        <Input
          type="text"
          maxLength={1}
          value={parts.letter}
          onChange={(e) => {
            const val = e.target.value;
            // فقط حروف فارسی مجاز
            const persianLetters = /[ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]/i;
            if (val === '' || persianLetters.test(val)) {
              updateFullPlate({ letter: val });
            }
          }}
          className="w-12 text-center border-gray-300 focus:border-[#1591dc] focus:ring-[#1591dc] bg-white text-gray-800"
          placeholder="ب"
          required={required}
        />
      </div>

      <span className="text-gray-500 text-lg font-bold">-</span>

      {/* باکس سوم: سه رقم */}
      <div className="relative">
        <Input
          type="text"
          maxLength={3}
          value={parts.lastThree}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9]/g, '');
            updateFullPlate({ lastThree: val });
          }}
          className="w-20 text-center border-gray-300 focus:border-[#1591dc] focus:ring-[#1591dc] bg-white text-gray-800"
          placeholder="۸۵۵"
          required={required}
        />
      </div>

      <span className="text-gray-500 text-lg font-bold">-</span>

      {/* باکس چهارم: دو رقم (سمت راست‌ترین - ایران) */}
      <div className="relative">
        <Input
          type="text"
          maxLength={2}
          value={parts.lastTwo}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9]/g, '');
            updateFullPlate({ lastTwo: val });
          }}
          className="w-16 text-center border-gray-300 focus:border-[#1591dc] focus:ring-[#1591dc] bg-white text-gray-800"
          placeholder="۱۱"
          required={required}
        />
      </div>
    </div>
  );
}