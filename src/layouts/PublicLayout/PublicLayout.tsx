import { Toaster } from "../../components/ui/sonner";
import { Outlet, useLocation, ScrollRestoration } from "react-router-dom";
import { DesktopNavBar } from "../../components/Custom/DesktopNavBar";
import { MobileNavBar } from "../../components/Custom/MobileNavBar";
import { DesktopSideBar } from "../../components/Custom/DesktopSideBar";
import { MobileSideBar } from "../../components/Custom/MobileSideBar";
import { useSidebarStore } from "../../store/sidebarStore/sidebarStore";
import {
  Home,
  Layers,
  Info,
  Phone,
  ShieldUser,
  SquareParking,
  Users,
  ParkingSquare,
  User,
  Car,
  Wallet,
} from "lucide-react";
import Footer from "@/components/Custom/Footer";
import useUserStore from "@/store/userStore/userStore";

const PublicLayout = () => {
  const { isExpanded, isAdminMode } = useSidebarStore();
  const location = useLocation();

  const routesWithoutNavbar = ["/login"];
  const shouldShowNavbar = !routesWithoutNavbar.includes(location.pathname);

  const dashboardRoutes = [
    "/blank",
    "/vehi",
    "/admin",
    "/dashboard",
    "/wallet",
    "/vehicles",
  ];
  const isDashboardPage = dashboardRoutes.some((route) =>
    location.pathname.startsWith(route),
  );

  const accessToken = useUserStore((state) => state.accessToken);
  const isLoggedIn = !!accessToken;
  const shouldShowSidebar = isLoggedIn;

  const mainNavLinks = [
    { label: "صفحه اصلی", to: "/", icon: <Home size={18} /> },
    { label: "درباره ما", to: "/aboutus", icon: <Info size={18} /> },
    { label: "تماس با ما", to: "/contactus", icon: <Phone size={18} /> },
    { label: "پارکینگ ها", to: "/parking", icon: <SquareParking size={18} /> },
  ];

  const userDashboardLinks = [
    { label: "داشبورد", to: "/dashboard", icon: <Layers size={20} /> },
    {
      label: "پارکینگ های من",
      to: "/dashboard/management",
      icon: <ParkingSquare size={20} />,
    },
    { label: "ماشین های من", to: "/vehicles", icon: <Car size={20} /> },
    { label: "کیف پول", to: "/wallet", icon: <Wallet size={20} /> },
    {
      label: "ویرایش حساب کاربری",
      to: "/dashboard/profile",
      icon: <User size={20} />,
    },
  ];

  const adminDashboardLinks = [
    { label: "داشبورد مدیریت", to: "/admin", icon: <ShieldUser size={20} /> },
    {
      label: "مدیریت پارکینگ ونک",
      to: "/admin/parking",
      icon: <SquareParking size={20} />,
    },
    { label: "مدیریت کاربران", to: "/admin/users", icon: <Users size={20} /> },
  ];

  const dashboardLinks = isAdminMode
    ? [...adminDashboardLinks]
    : [...userDashboardLinks];

  const shouldShowFooter = shouldShowNavbar && !isDashboardPage;

  return (
    <>
      <ScrollRestoration />
      <Toaster
        position="bottom-right"
        richColors={true}
        duration={5000}
        dir="rtl"
      />

      {shouldShowNavbar && (
        <>
          <DesktopNavBar showToggle={shouldShowSidebar} links={mainNavLinks} />
          {shouldShowSidebar && <DesktopSideBar links={dashboardLinks} />}
        </>
      )}

      {shouldShowNavbar && (
        <>
          <MobileNavBar />
          <MobileSideBar
            isDashboardPage={shouldShowSidebar}
            mainLinks={mainNavLinks}
            dashboardLinks={dashboardLinks}
          />
        </>
      )}

      <main
        className={`
          min-h-screen overflow-x-hidden transition-all duration-300 ease-in-out
          flex flex-col
          pt-0 pb-28 ${shouldShowNavbar ? "md:pt-16 md:pb-0" : "md:pt-0 md:pb-0"}
          ${shouldShowNavbar && shouldShowSidebar ? (isExpanded ? "md:pr-64 pr-0" : "md:pr-16 pr-0") : "pr-0"}
        `}
      >
        <div className="flex-grow ">
          <Outlet />
        </div>

        {shouldShowFooter && <Footer />}
      </main>
    </>
  );
};

export default PublicLayout;
