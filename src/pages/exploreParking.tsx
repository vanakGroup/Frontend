import { useEffect, useState } from "react";
import { useParkingStore } from "@/store/parkingStore/parkingStore";
import { MOCK_PARKINGS } from "@/assets/mockData";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FALLBACK_IMAGE = "/no_image.svg";

export default function ParkingSearchPage() {
  const {
    parkings,
    setParkings,
    searchQuery,
    setSearchQuery,
    maxPrice,
    setMaxPrice,
    minScore,
    setMinScore,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    resetFilters,
  } = useParkingStore();

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    setParkings(MOCK_PARKINGS);
    setTotalPages(100);
  }, [setParkings, setTotalPages]);

  const getPaginationRange = () => {
    const range: (number | string)[] = [];
    const delta = 1;

    range.push(1);

    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    if (start > 2) {
      range.push("...");
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (end < totalPages - 1) {
      range.push("...");
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const paginationRange = getPaginationRange();

  return (
    <div
      dir="rtl"
      className="bg-background w-full flex justify-center text-right font-sans text-foreground"
    >
      <div className="max-w-7xl w-full p-4 md:p-8 flex justify-center">
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 w-full justify-center">
          <div className="lg:col-span-1 bg-card text-card-foreground p-6 rounded-xl border border-border h-fit lg:sticky lg:top-6 shadow-sm">
            <div className="mb-4">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                موقعیت مکانی / نام پارکینگ
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="مثلاً میرداماد، ونک..."
                className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-right"
              />
            </div>

            <Button
              variant="outline"
              className="w-full lg:hidden flex justify-between items-center mb-2"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
              <span>فیلترهای بیشتر</span>
              <span className="text-xs">{isFiltersOpen ? "▲" : "▼"}</span>
            </Button>

            <div
              className={`space-y-6 transition-all duration-300 lg:block ${
                isFiltersOpen ? "block mt-6" : "hidden"
              }`}
            >
              <div className="flex justify-between items-center border-b border-border pb-4 lg:border-none lg:pb-0">
                <h2 className="text-lg font-bold">فیلترها</h2>
                <Button
                  variant="link"
                  onClick={resetFilters}
                  className="text-xs font-semibold text-primary h-auto p-0"
                >
                  پاک کردن همه
                </Button>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    حداکثر قیمت
                  </label>
                  <span className="text-sm font-bold text-primary">
                    {maxPrice} هزار تومان / ساعت
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    حداقل امتیاز
                  </label>
                  <span className="text-sm font-bold text-primary">
                    {minScore === 0 ? "همه" : `${minScore} ★`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col justify-between min-h-[50vh]">
            {parkings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-stretch">
                {parkings.map((parking) => (
                  <Card
                    key={parking.id}
                    className="flex flex-col justify-between shadow-sm hover:shadow-md transition-all border-border bg-card text-card-foreground overflow-hidden"
                  >
                    <div className="relative w-full h-48 bg-muted">
                      <img
                        src={parking.imageUrl || FALLBACK_IMAGE}
                        alt={parking.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                          e.currentTarget.onerror = null;
                        }}
                      />
                    </div>

                    <CardHeader className="pb-4 pt-5">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <CardTitle className="text-lg font-bold line-clamp-1">
                          {parking.name}
                        </CardTitle>
                        <div className="flex items-center gap-0.5 px-2 py-0.5 bg-accent text-accent-foreground rounded-md text-sm font-bold shrink-0 border border-border">
                          <span>★</span>
                          <span>{parking.score.toFixed(1)}</span>
                        </div>
                      </div>
                      <CardDescription className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                        {parking.location}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-5 space-y-3 text-sm text-muted-foreground">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">ساعت کاری:</span>
                        <span
                          className="font-semibold text-foreground"
                          dir="ltr"
                        >
                          {parking.workingHours.start} -{" "}
                          {parking.workingHours.end}
                        </span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="font-medium">روزهای کاری:</span>
                        <span className="font-semibold text-foreground text-right max-w-[70%] line-clamp-1">
                          {parking.workingDays.length === 7
                            ? "همه روزه"
                            : "روزهای عادی"}
                        </span>
                      </div>
                    </CardContent>

                    <CardFooter className="border-t border-border pt-4 pb-4 flex justify-between items-center bg-muted/30">
                      <div>
                        <span className="text-xl font-extrabold text-foreground">
                          {parking.pricePerHour}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium mr-1">
                          تومان/ساعت
                        </span>
                      </div>
                      <Button size="default" className="font-bold shadow-sm">
                        انتخاب پارکینگ
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-xl border border-border w-full">
                <p className="text-muted-foreground text-base">
                  هیچ پارکینگی با فیلترهای انتخابی شما پیدا نشد.
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10 bg-card p-2 border border-border rounded-xl shadow-sm w-fit mx-auto">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="h-7 px-2.5 border border-border bg-background text-foreground hover:bg-muted disabled:pointer-events-none disabled:opacity-50 text-sm font-semibold rounded-[min(var(--radius-md),12px)] transition-all select-none outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  قبلی
                </button>

                {paginationRange.map((page, index) => {
                  if (page === "...") {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="w-7 h-7 flex items-center justify-center text-sm font-medium text-muted-foreground select-none"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <Button
                      key={page}
                      size="icon-sm"
                      variant={currentPage === page ? "default" : "ghost"}
                      onClick={() => setCurrentPage(Number(page))}
                      className="w-7 h-7 text-sm font-bold"
                    >
                      {page}
                    </Button>
                  );
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="h-7 px-2.5 border border-border bg-background text-foreground hover:bg-muted disabled:pointer-events-none disabled:opacity-50 text-sm font-semibold rounded-[min(var(--radius-md),12px)] transition-all select-none outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  بعدی
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
