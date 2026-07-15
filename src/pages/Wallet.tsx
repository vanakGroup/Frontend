import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  History,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Import your services
import {
  getWalletBalanceService,
  getWalletTransactionsService,
  depositWalletService,
} from "@/services/walletServices";
import type { Transaction } from "@/services/walletServices";

export default function Wallet() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chargeAmount, setChargeAmount] = useState("");

  const [balance, setBalance] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDepositing, setIsDepositing] = useState<boolean>(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    setIsLoading(true);
    try {
      const [balanceResponse, transactionsResponse] = await Promise.all([
        getWalletBalanceService(),
        getWalletTransactionsService(),
      ]);

      if (balanceResponse.statusCode === 200 && balanceResponse.data) {
        setBalance(balanceResponse.data.balance);
        setIsActive(balanceResponse.data.is_active);
      } else if (balanceResponse.statusCode === 422) {
        setIsActive(false);
        setBalance(0);
      }

      setTransactions(transactionsResponse.data || []);
    } catch (error: any) {
      if (error?.statusCode === 422 || error?.response?.status === 422) {
        setIsActive(false);
        setBalance(0);
        setTransactions([]);
      } else {
        console.error("Error fetching wallet data:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    const amountNum = Number(chargeAmount);
    if (!amountNum || isNaN(amountNum)) return;

    setIsDepositing(true);
    try {
      const response = await depositWalletService({ amount: amountNum });

      if (response.statusCode === 200) {
        setChargeAmount("");
        setIsModalOpen(false);
        await fetchWalletData();
      }
    } catch (error) {
      console.error("Error depositing money:", error);
    } finally {
      setIsDepositing(false);
    }
  };

  const formatPersianDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);

    return new Intl.DateTimeFormat("fa-IR", {
      calendar: "persian", // Enforce Solar Hijri calendar
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-64px)] flex flex-col items-center justify-center text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p dir="rtl">در حال دریافت اطلاعات کیف پول...</p>
      </div>
    );
  }

  const isValidAmount = /^\d+$/.test(chargeAmount) && Number(chargeAmount) > 0;

  return (
    <div dir="rtl" className="w-full p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          کیف پول
        </h1>
        <p className="text-muted-foreground mt-1">
          مدیریت موجودی و مشاهده تاریخچه تراکنش‌ها.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Balance Card */}
        <Card className="flex flex-col bg-primary text-primary-foreground h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80 flex items-center gap-2">
              <WalletIcon className="h-4 w-4" />
              موجودی فعلی
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between pt-4">
            {/* Conditional Rendering based on is_active */}
            {isActive ? (
              <div>
                <div className="text-4xl font-bold tracking-tight">
                  {balance.toLocaleString("fa-IR")}{" "}
                  <span className="text-lg font-normal opacity-80">تومان</span>
                </div>
              </div>
            ) : (
              <div className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary-foreground/90 shrink-0 mt-0.5" />
                <p className="text-sm font-medium leading-relaxed text-primary-foreground/90">
                  برای مشاهده موجودی و استفاده از کیف پول، لطفاً ابتدا پروفایل
                  کاربری خود را تکمیل کنید.
                </p>
              </div>
            )}

            <div className="mt-8">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    className="w-full flex items-center gap-2"
                    disabled={!isActive} // Disable button if profile is incomplete
                  >
                    <Plus className="h-4 w-4" />
                    شارژ حساب
                  </Button>
                </DialogTrigger>

                <DialogContent dir="rtl" className="sm:max-w-md text-right">
                  <DialogHeader className="text-right sm:text-right">
                    <DialogTitle className="text-right sm:text-right">شارژ کیف پول</DialogTitle>
                    <DialogDescription className="mt-2 text-muted-foreground text-right sm:text-right">
                      مبلغ مورد نظر خود را برای انتقال به درگاه پرداخت وارد
                      کنید.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-col gap-4 py-4 text-right">
                    <div className="flex flex-col gap-2 text-right">
                      <Label htmlFor="amount" className="text-right">
                        مبلغ (تومان)
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        placeholder="مثال: ۵۰۰۰۰"
                        value={chargeAmount}
                        onChange={(e) => setChargeAmount(e.target.value)}
                        /* These utility classes completely strip out the browser counter arrows */
                        className="text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        dir="rtl"
                        disabled={isDepositing}
                      />
                    </div>
                  </div>

                  <DialogFooter className="justify-start sm:justify-start text-right">
                    <button
                      type="button"
                      onClick={handleDeposit}
                      /* Button stays disabled if there's a negative sign, decimals, characters, or 0 */
                      disabled={!isValidAmount || isDepositing}
                      className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 aria-expanded:bg-primary\
                      aria-expanded:text-primary-foreground h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 group/button \
                      inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium\
                      whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 \
                      focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50\
                      aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40\
                      [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    >
                      {isDepositing ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          در حال انتقال...
                        </>
                      ) : (
                        "انتقال به درگاه پرداخت"
                      )}
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History Card */}
        <Card className="lg:col-span-2 h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-muted-foreground" />
                تاریخچه تراکنش‌ها
              </CardTitle>
              <CardDescription>
                فهرست پرداخت‌ها و شارژهای حساب شما
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {transactions.length === 0 ? (
              <div className="flex justify-center items-center h-32 text-muted-foreground text-sm">
                تراکنشی برای نمایش وجود ندارد.
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    {/* Explicitly set text-center for centered alignment */}
                    <TableHead className="py-3 px-4 text-center">
                      شماره پیگیری
                    </TableHead>
                    <TableHead className="py-3 px-4 text-center">
                      نوع تراکنش
                    </TableHead>
                    <TableHead className="py-3 px-4 text-center">
                      تاریخ
                    </TableHead>
                    <TableHead className="py-3 px-4 text-center">
                      مبلغ (تومان)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((trx) => {
                    const isDeposit = trx.type.toLowerCase() === "deposit";
                    const isGateway = trx.reason?.toLowerCase() === "gateway";

                    // Determine the Persian label based on type and reason
                    let transactionLabel = "تراکنش نامشخص";
                    if (isDeposit) {
                      transactionLabel = isGateway
                        ? "شارژ حساب (درگاه)"
                        : "دریافت وجه";
                    } else {
                      // Assuming non-deposits are withdrawals
                      transactionLabel = "برداشت";
                    }

                    return (
                      <TableRow key={trx.id}>
                        <TableCell className="px-4 py-3 text-center font-medium text-foreground">
                          {trx.id}
                        </TableCell>

                        <TableCell className="px-4 py-3 text-center text-muted-foreground">
                          {transactionLabel}
                        </TableCell>

                        <TableCell className="px-4 py-3 text-center text-muted-foreground text-sm">
                          {formatPersianDate(trx.created_at)}
                        </TableCell>

                        <TableCell className="px-4 py-3 text-center">
                          <div
                            className={`flex items-center justify-center gap-1 font-bold ${
                              isDeposit
                                ? "text-green-600 dark:text-green-500" // Green for all incoming money
                                : "text-red-600 dark:text-red-500" // Red for outgoing money
                            }`}
                          >
                            {isDeposit ? (
                              <ArrowDownLeft className="h-4 w-4" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4" />
                            )}
                            {trx.amount.toLocaleString("fa-IR")}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
