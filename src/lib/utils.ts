import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidPhoneNumber(phoneNumber: string): boolean {
  const regex = /^09\d{9}$/;
  return regex.test(phoneNumber);
}
