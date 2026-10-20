import {
  Car,
  MapPin,
  Phone,
  DollarSign,
  ChevronLeft,
  Settings2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import parkingImg from "@/assets/react.svg";

// Temporary fake data — later replace with API call
const mockParkings = [
  {
    id: 1,
    name: "پارکینگ اول",
    address: "تهران / میدان ونک",
    phone: "021-88001234",
    capacity: 50,
    pricePerHour: 15000,
    image: "/jl.png",
  },
  {
    id: 2,
    name: "پارکینگ دوم",
    address: "تهران / پارک وی",
    phone: "021-88005678",
    capacity: 30,
    pricePerHour: 12000,
    image: parkingImg,
  },
  {
    id: 3,
    name: "پارکینگ سوم",
    address: "تهران / میدان رسالت",
    phone: "021-88009012",
    capacity: 80,
    pricePerHour: 10000,
    image: null,
  },
  {
    id: 3,
    name: "پارکینگ سوم",
    address: "تهران / میدان رسالت",
    phone: "021-88009012",
    capacity: 80,
    pricePerHour: 10000,
    image: null,
  },
  {
    id: 3,
    name: "پارکینگ سوم",
    address: "تهران / میدان رسالت",
    phone: "021-88009012",
    capacity: 80,
    pricePerHour: 10000,
    image: null,
  },
];

export default function MyParking() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">پارکینگ‌های من</h1>
          <p className="text-muted-foreground text-sm mt-1">
            لیست تمام پارکینگ‌های شما
          </p>
        </div>
        <Button
          onClick={() => navigate("/dashboard/management")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium"
        >
          <Settings2 size={16} />
          مدیریت پارکینگ‌ها
        </Button>
      </div>
      {/* Parking cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockParkings.map((parking) => (
          <div
            key={parking.id}
            onClick={() => navigate(`/dashboard/my-parking/${parking.id}`)}
            className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-200 group"
          >
            {/* Image area */}
            <div className="h-44 bg-accent/40 flex items-center justify-center">
              {parking.image ? (
                <img
                  src={parking.image}
                  alt={parking.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Car size={40} className="text-primary/40" />
                  <span className="text-xs">بدون تصویر</span>
                </div>
              )}
            </div>

            {/* Card content */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-foreground text-lg">
                  {parking.name}
                </h2>
                <ChevronLeft
                  size={18}
                  className="text-muted-foreground group-hover:text-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={14} className="text-primary shrink-0" />
                  <span className="truncate">{parking.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone size={14} className="text-primary shrink-0" />
                  <span dir="ltr">{parking.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-1 text-sm">
                  <Car size={14} className="text-primary" />
                  <span className="text-foreground font-medium">
                    {parking.capacity}
                  </span>
                  <span className="text-muted-foreground">جای خالی</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <DollarSign size={14} className="text-primary" />
                  <span className="text-foreground font-medium">
                    {parking.pricePerHour.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">تومان/ساعت</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {mockParkings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Car size={60} className="text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            هنوز پارکینگی ثبت نکرده‌اید
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            از بخش مدیریت پارکینگ اضافه کنید
          </p>
        </div>
      )}
    </div>
  );
}
