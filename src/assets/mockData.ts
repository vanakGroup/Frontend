import type { Parking } from "@/types/parkingsTypes";

export const MOCK_PARKINGS: Parking[] = [
  {
    id: "1",
    name: "پارکینگ طبقاتی طالقانی",
    location: "تهران، خیابان طالقانی، نرسیده به ولیعصر",
    pricePerHour: 20,
    workingDays: [
      "شنبه",
      "یکشنبه",
      "دوشنبه",
      "سه‌شنبه",
      "چهارشنبه",
      "پنج‌شنبه",
      "جمعه",
    ],
    workingHours: { start: "06:00", end: "24:00" },
    score: 4.2,
    imageUrl:
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=800&auto=format&fit=crop",
  },
  //"https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=800&auto=format&fit=crop"
  {
    id: "2",
    name: "پارکینگ مجتمع کوروش",
    location: "تهران، بزرگراه ستاری، مجتمع تجاری کوروش",
    pricePerHour: 35,
    workingDays: [
      "شنبه",
      "یکشنبه",
      "دوشنبه",
      "سه‌شنبه",
      "چهارشنبه",
      "پنج‌شنبه",
      "جمعه",
    ],
    workingHours: { start: "08:00", end: "23:30" },
    score: 4.8,
    imageUrl:
      "https://images.unsplash.com/photo-1604061986761-d9d0cc41b0d1?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "پارکینگ عمومی ونک",
    location: "تهران، میدان ونک، خیابان خدامی",
    pricePerHour: 25,
    workingDays: [
      "شنبه",
      "یکشنبه",
      "دوشنبه",
      "سه‌شنبه",
      "چهارشنبه",
      "پنج‌شنبه",
    ],
    workingHours: { start: "07:00", end: "22:00" },
    score: 3.5,
    imageUrl:
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "پارکینگ اختصاصی برج میلاد",
    location: "تهران، بزرگراه همت، برج میلاد",
    pricePerHour: 50,
    workingDays: [
      "شنبه",
      "یکشنبه",
      "دوشنبه",
      "سه‌شنبه",
      "چهارشنبه",
      "پنج‌شنبه",
      "جمعه",
    ],
    workingHours: { start: "00:00", end: "24:00" },
    score: 4.9,
    imageUrl:
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "پارکینگ شهرداری منطقه ۳",
    location: "تهران، خیابان شریعتی، بالاتر از میرداماد",
    pricePerHour: 15,
    workingDays: [
      "شنبه",
      "یکشنبه",
      "دوشنبه",
      "سه‌شنبه",
      "چهارشنبه",
      "پنج‌شنبه",
    ],
    workingHours: { start: "06:30", end: "21:00" },
    score: 3.8,
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "6",
    name: "پارکینگ رز میرداماد",
    location: "تهران، بلوار میرداماد، مجتمع رز",
    pricePerHour: 40,
    workingDays: [
      "شنبه",
      "یکشنبه",
      "دوشنبه",
      "سه‌شنبه",
      "چهارشنبه",
      "پنج‌شنبه",
      "جمعه",
    ],
    workingHours: { start: "08:00", end: "23:00" },
    score: 4.1,
    imageUrl:
      "https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=800&auto=format&fit=crop",
  },
];
