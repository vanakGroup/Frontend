import { useState } from "react";
import { Plus, Pencil, Trash2, Clock, ArrowRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const mockParkings = [
  { id: 1, name: "پارکینگ اول", address: "تهران / میدان ونک" },
  { id: 2, name: "پارکینگ دوم", address: "تهران / پارک وی" },
  { id: 3, name: "پارکینگ سوم", address: "تهران / میدان رسالت" },
];

export default function Management() {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setTimeout(() => {
      alert(`پارکینگ حذف شد`);
      setDeletingId(null);
    }, 800);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/dashboard/my-parking")}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <ArrowRight size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            مدیریت پارکینگ‌ها
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            افزودن، ویرایش و حذف پارکینگ‌های شما
          </p>
        </div>
        <Button
          onClick={() => navigate("/dashboard/management/add")}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          افزودن پارکینگ
        </Button>
      </div>

      {/* Parking list */}
      <div className="space-y-3">
        {mockParkings.map((parking) => (
          <div
            key={parking.id}
            className="bg-card border border-border rounded-2xl p-4"
          >
            {/* Desktop layout */}
            <div
              className="hidden sm:flex items-center justify-between gap-4"
              dir="ltr"
            >
              {/* Buttons  */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deletingId === parking.id}
                  onClick={() => handleDelete(parking.id)}
                  className="flex items-center gap-1.5"
                >
                  <Trash2 size={14} /> حذف
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(`/dashboard/management/edit/${parking.id}`)
                  }
                  className="flex items-center gap-1.5"
                >
                  <Pencil size={14} /> ویرایش
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(`/dashboard/management/slots/${parking.id}`)
                  }
                  className="flex items-center gap-1.5"
                >
                  <Clock size={14} /> زمان‌بندی
                </Button>
              </div>

              {/* Info  */}
              <div className="text-right min-w-0">
                <h3 className="font-semibold text-foreground text-base">
                  {parking.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 justify-end">
                  <p className="text-sm text-muted-foreground truncate">
                    {parking.address}
                  </p>
                  <MapPin size={13} className="text-primary shrink-0" />
                </div>
              </div>
            </div>

            {/* Mobile layout */}
            <div className="flex flex-col gap-3 sm:hidden">
              {/* Info on top */}
              <div className="text-right">
                <h3 className="font-semibold text-foreground text-base">
                  {parking.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 justify-end">
                  <p className="text-sm text-muted-foreground">
                    {parking.address}
                  </p>
                  <MapPin size={13} className="text-primary shrink-0" />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Buttons on bottom — equal width */}
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deletingId === parking.id}
                  onClick={() => handleDelete(parking.id)}
                  className="flex-1 flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={14} /> حذف
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(`/dashboard/management/edit/${parking.id}`)
                  }
                  className="flex-1 flex items-center justify-center gap-1.5"
                >
                  <Pencil size={14} /> ویرایش
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(`/dashboard/management/slots/${parking.id}`)
                  }
                  className="flex-1 flex items-center justify-center gap-1.5"
                >
                  <Clock size={14} /> زمان‌بندی
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {mockParkings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Plus size={50} className="text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            هنوز پارکینگی ثبت نشده
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            اولین پارکینگ خود را اضافه کنید
          </p>
          <Button onClick={() => navigate("/dashboard/management/add")}>
            <Plus size={16} className="ml-2" />
            افزودن پارکینگ
          </Button>
        </div>
      )}
    </div>
  );
}
