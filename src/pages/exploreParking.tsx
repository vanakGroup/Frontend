import { useEffect, useState } from "react";
import { useParkingStore } from "@/store/parkingStore/parkingStore";
import { searchParkingService } from "@/services/searchService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const FALLBACK_IMAGE = "/noimage.jpeg";

// Mapped array to translate city names to backend IDs
const CITIES = [
  { id: 1, name: "تهران" },
  { id: 2, name: "اصفهان" },
  { id: 3, name: "شیراز" },
  { id: 4, name: "مشهد" },
  { id: 5, name: "تبریز" },
  { id: 6, name: "ارومیه" },
  { id: 7, name: "اردبیل" },
  { id: 8, name: "کرج" },
  { id: 9, name: "ایلام" },
  { id: 10, name: "بوشهر" },
  { id: 11, name: "شهرکرد" },
  { id: 12, name: "بیرجند" },
  { id: 13, name: "بجنورد" },
  { id: 14, name: "اهواز" },
  { id: 15, name: "زنجان" },
  { id: 16, name: "سمنان" },
  { id: 17, name: "زاهدان" },
  { id: 18, name: "قزوین" },
  { id: 19, name: "قم" },
  { id: 20, name: "سنندج" },
  { id: 21, name: "کرمان" },
  { id: 22, name: "کرمانشاه" },
  { id: 23, name: "یاسوج" },
  { id: 24, name: "گرگان" },
  { id: 25, name: "رشت" },
  { id: 26, name: "خرم‌آباد" },
  { id: 27, name: "ساری" },
  { id: 28, name: "اراک" },
  { id: 29, name: "بندرعباس" },
  { id: 30, name: "همدان" },
  { id: 31, name: "یزد" },
];

const PARKING_ATTRIBUTES: Record<number, string> = {
  1: "سقف دار",
  2: "سرپوشیده",
  3: "روباز",
  4: "چند طبقه",
  5: "دوربین مداربسته",
  6: "نگهبان",
  7: "حصار",
  8: "درب اتوماتیک",
  9: "نورپردازی مناسب",
  10: "کارواش",
  11: "تعمیر لاستیک",
  12: "شارژ خودرو برقی",
  13: "باتری زدن",
  14: "روغن موتور",
  15: "۲۴ ساعته",
  16: "پارکبان",
  17: "مناسب معلولین",
  18: "جایگاه موتورسیکلت",
  19: "مناسب ون",
  20: "رزرو آنلاین",
  21: "اجاره ماهانه",
  22: "اجاره ساعتی",
  23: "وی آی پی",
  24: "پارکینگ طولانی مدت",
};

export default function ParkingSearchPage() {
  const navigate = useNavigate();
  const {
    parkings,
    setParkings,
    searchQuery,
    setSearchQuery,
    maxPrice,
    setMaxPrice,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    setTotalPages,
    isLoading,
    setIsLoading,
    resetFilters,
    cityId,
    setCityId,
    date,
    setDate,
    startHour,
    setStartHour,
    endHour,
    setEndHour,
  } = useParkingStore();

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");
  const [sliderMax, setSliderMax] = useState(60);

  // New state for the City Selector
  const [citySearch, setCitySearch] = useState("");
  const [showCityList, setShowCityList] = useState(false);

  // Sync citySearch input with the cityId from the store (handles "clear all" resets)
  useEffect(() => {
    if (!cityId) {
      setCitySearch("");
    } else {
      const selectedCity = CITIES.find((c) => c.id === cityId);
      if (selectedCity) setCitySearch(selectedCity.name);
    }
  }, [cityId]);

  const filteredCities = CITIES.filter((c) => c.name.includes(citySearch));

  const handleCitySelect = (city: { id: number; name: string }) => {
    setCityId(city.id);
    setCitySearch(city.name);
    setShowCityList(false);
  };

  useEffect(() => {
    const fetchParkings = async () => {
      setIsLoading(true);
      try {
        // Convert the ISO string date into YYYY-MM-DD for the backend
        let apiDate = undefined;
        if (date) {
          const d = new Date(date);
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = d.getFullYear();
          apiDate = `${year}-${month}-${day}`;
        }

        const requestPayload = {
          page: currentPage,
          pageSize: itemsPerPage,
          address: searchQuery || undefined,
          maxPrice: maxPrice ? maxPrice * 1000 : undefined,
          cityId: cityId || undefined,
          date: apiDate, // Sends the formatted YYYY-MM-DD string
          startHour: startHour !== null ? startHour : undefined,
          endHour: endHour !== null ? endHour : undefined,
          sortBy: sortOrder !== "none" ? "price" : undefined,
          sortAsc:
            sortOrder === "asc"
              ? true
              : sortOrder === "desc"
                ? false
                : undefined,
        };

        const response = await searchParkingService(requestPayload);
        const resultPayload = response?.data;

        if (resultPayload && Array.isArray(resultPayload.data)) {
          const formattedParkings = resultPayload.data.map((parking: any) => ({
            ...parking,
            basePrice: parking.base_price,
            imageUrls: parking.image_urls,
            attributeIds: parking.attribute_ids || [],
          }));

          setParkings(formattedParkings);
          setTotalPages(resultPayload.pagination?.totalPages || 1);

          if (currentPage === 1 && formattedParkings.length > 0) {
            const maxBasePrice = Math.max(...formattedParkings.map((p: any) => p.basePrice || 0));
            const maxInThousands = Math.ceil(maxBasePrice / 1000);
            if (maxInThousands > 0) {
              if (maxPrice >= sliderMax || maxInThousands > sliderMax) {
                setSliderMax(maxInThousands);
                if (maxPrice > maxInThousands || maxPrice >= sliderMax) {
                  setMaxPrice(maxInThousands);
                }
              }
            }
          }
        } else {
          setParkings([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("❌ ERROR FETCHING:", error);
        setParkings([]);
        setTotalPages(1); // Added to ensure pagination resets on 409/EOF crashes
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchParkings();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    currentPage,
    searchQuery,
    maxPrice,
    itemsPerPage,
    cityId,
    date,
    startHour,
    endHour,
    sortOrder,
    setParkings,
    setTotalPages,
    setIsLoading,
  ]);

  const getPaginationRange = () => {
    const range: (number | string)[] = [];
    const delta = 1;

    range.push(1);

    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    if (start > 2) range.push("...");
    for (let i = start; i <= end; i++) range.push(i);
    if (end < totalPages - 1) range.push("...");
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  const paginationRange = getPaginationRange();

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  return (
    <div
      dir="rtl"
      className="bg-background w-full flex justify-center text-right font-sans text-foreground"
    >
      <div className="max-w-7xl w-full p-4 md:p-8 flex justify-center">
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 w-full justify-center">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 bg-card text-card-foreground p-6 rounded-xl border border-border h-fit lg:sticky lg:top-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-border pb-4 lg:border-none lg:pb-0 mb-6">
              <h2 className="text-lg font-bold">فیلترها</h2>
              <Button
                variant="link"
                onClick={() => {
                  resetFilters();
                  setSortOrder("none");
                }}
                className="text-xs font-semibold text-primary h-auto p-0"
              >
                پاک کردن همه
              </Button>
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                موقعیت مکانی
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
              {/* City Selection */}
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  شهر
                </label>
                <input
                  value={citySearch}
                  onChange={(e) => {
                    setCitySearch(e.target.value);
                    setShowCityList(true);
                    if (e.target.value === "") {
                      setCityId(null);
                    }
                  }}
                  onFocus={() => setShowCityList(true)}
                  onBlur={() => setTimeout(() => setShowCityList(false), 200)}
                  placeholder="جستجوی شهر..."
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-right"
                  dir="rtl"
                />
                {showCityList && filteredCities.length > 0 && (
                  <div className="absolute z-20 w-full bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1 top-full">
                    {filteredCities.map((city) => (
                      <button
                        key={city.id}
                        type="button"
                        onMouseDown={(e) => {
                          // Prevent input onBlur from firing before the click registers
                          e.preventDefault();
                          handleCitySelect(city);
                        }}
                        className="w-full text-right px-3 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Selection */}
              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    تاریخ رزرو
                  </label>
                  {/* Show "پاک کردن" only if a date is selected */}
                  {date && (
                    <button
                      type="button"
                      onClick={() => setDate(null)}
                      className="text-[11px] text-primary hover:underline font-semibold bg-transparent border-none p-0 cursor-pointer"
                    >
                      حذف تاریخ
                    </button>
                  )}
                </div>
                <DatePicker
                  containerClassName="w-full"
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  minDate={todayDate}
                  format="YYYY/MM/DD"
                  // 1. Read: Convert the stored ISO string back to a native Gregorian JS Date.
                  // react-multi-date-picker automatically converts JS Dates into Jalali in the calendar.
                  value={date ? new Date(date) : null}
                  // 2. Write: Convert the Jalali DateObject into a Gregorian ISO string using the same .toDate() method
                  onChange={(selectedDate: DateObject | null) => {
                    if (
                      selectedDate &&
                      typeof selectedDate.toDate === "function"
                    ) {
                      const nativeDate = selectedDate.toDate();
                      setDate(nativeDate.toISOString());
                    } else {
                      setDate(null);
                    }
                  }}
                  render={(value: string, openCalendar: () => void) => (
                    <button
                      type="button"
                      onClick={openCalendar}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground hover:border-ring transition-colors text-right"
                      dir="rtl"
                    >
                      {value || "انتخاب تاریخ"}
                    </button>
                  )}
                />
              </div>

              {/* Time Range Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                    ساعت ورود
                  </label>
                  <select
                    value={startHour !== null ? startHour : ""}
                    onChange={(e) =>
                      setStartHour(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-right"
                    dir="ltr"
                  >
                    <option value="">همه</option>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <option key={`start-${i}`} value={i}>
                        {i.toString().padStart(2, "0")}:00
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                    ساعت خروج
                  </label>
                  <select
                    value={endHour !== null ? endHour : ""}
                    onChange={(e) =>
                      setEndHour(e.target.value ? Number(e.target.value) : null)
                    }
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-right"
                    dir="ltr"
                  >
                    <option value="">همه</option>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <option key={`end-${i}`} value={i}>
                        {i.toString().padStart(2, "0")}:00
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sorting Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  مرتب‌سازی بر اساس قیمت
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as "asc" | "desc" | "none")
                  }
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-right"
                >
                  <option value="none">بدون مرتب‌سازی</option>
                  <option value="asc">ارزان‌ترین</option>
                  <option value="desc">گران‌ترین</option>
                </select>
              </div>

              {/* Price Slider */}
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
                  min="1"
                  max={sliderMax}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 flex flex-col justify-between min-h-[50vh]">
            {isLoading ? (
              <div className="flex items-center justify-center w-full h-64 bg-card rounded-xl border border-border">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-muted-foreground font-medium">
                    در حال جستجو...
                  </p>
                </div>
              </div>
            ) : parkings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-stretch">
                {parkings.map((parking) => (
                  <Card
                    key={parking.id}
                    className="flex flex-col justify-between shadow-sm hover:shadow-md transition-all border-border bg-card text-card-foreground overflow-hidden"
                  >
                    <div className="relative w-full h-48 bg-muted shrink-0">
                      <img
                        src={parking.imageUrls?.[0] || FALLBACK_IMAGE}
                        alt={parking.title}
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
                          {parking.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                        {parking.address?.exactAddress || "بدون آدرس"}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-5 space-y-3 text-sm text-muted-foreground flex-grow">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">وضعیت:</span>
                        <span className="font-semibold text-foreground">
                          {parking.status === "ACTIVE"
                            ? "فعال"
                            : parking.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="font-medium">روزهای کاری:</span>
                        <span className="font-semibold text-foreground text-right max-w-[70%] line-clamp-1">
                          همه روزه
                        </span>
                      </div>

                      {/* Attributes Section */}
                      {parking.attributeIds &&
                        parking.attributeIds.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border mt-3">
                            {parking.attributeIds
                              .slice(0, 4)
                              .map((id: number) => {
                                const name = PARKING_ATTRIBUTES[id];
                                if (!name) return null;
                                return (
                                  <span
                                    key={id}
                                    className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-[11px] font-semibold"
                                  >
                                    {name}
                                  </span>
                                );
                              })}
                            {parking.attributeIds.length > 4 && (
                              <span className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-[11px] font-semibold">
                                +{parking.attributeIds.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                    </CardContent>

                    <CardFooter className="border-t border-border pt-4 pb-4 flex justify-between items-center bg-muted/30 mt-auto">
                      <div>
                        <span className="text-xl font-extrabold text-foreground">
                          {parking.basePrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium mr-1">
                          تومان/ساعت
                        </span>
                      </div>
                      <Button
                        size="default"
                        className="font-bold shadow-sm"
                        onClick={() => navigate(`/parking/${parking.id}`)}
                      >
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

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10 bg-card p-2 border border-border rounded-xl shadow-sm w-fit mx-auto">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="h-7 px-2.5 border border-border"
                >
                  قبلی
                </Button>

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
                      // @ts-ignore Ignore non-standard size prop to match existing template if custom
                      size="icon-sm"
                      variant={currentPage === page ? "default" : "ghost"}
                      onClick={() => setCurrentPage(Number(page))}
                      className="w-7 h-7 text-sm font-bold"
                    >
                      {page}
                    </Button>
                  );
                })}

                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="h-7 px-2.5 border border-border "
                >
                  بعدی
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
