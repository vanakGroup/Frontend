import { Toaster } from "../../components/ui/sonner";
import { Outlet, useLocation, ScrollRestoration } from "react-router-dom";
import { DesktopNavBar } from "../../components/Custom/DesktopNavBar";
import { MobileNavBar } from "../../components/Custom/MobileNavBar";
import { DesktopSideBar } from "../../components/Custom/DesktopSideBar";
import { MobileSideBar } from "../../components/Custom/MobileSideBar";
import { useSidebarStore } from "../../store/sidebarStore/sidebarStore";
import { Home, Layers, Info, Phone, ShieldUser } from "lucide-react";
import Footer from "@/components/Custom/Footer";
import useUserStore from "@/store/userStore/userStore";

const PublicLayout = () => {
  const { isExpanded } = useSidebarStore();
  const location = useLocation();

  const routesWithoutNavbar = ["/login"];
  const shouldShowNavbar = !routesWithoutNavbar.includes(location.pathname);

  const dashboardRoutes = ["/blank", "/vehi", "/admin"];
  const isDashboardPage = dashboardRoutes.some((route) =>
    location.pathname.startsWith(route),
  );

  const role = useUserStore((state) => state.role);

  const mainNavLinks = [
    { label: "صفحه اصلی", to: "/", icon: <Home size={18} /> },
    { label: "درباره ما", to: "/aboutus", icon: <Info size={18} /> },
    { label: "تماس با ما", to: "/contactus", icon: <Phone size={18} /> },
  ];

  const dashboardLinks = [
    { label: "داشبورد", to: "/login", icon: <Home size={20} /> },
    { label: "blank", to: "/blank", icon: <Layers size={20} /> },
  ];

  if (role === "ADMIN") {
    dashboardLinks.unshift({
      label: "پنل مدیریت",
      to: "/admin",
      icon: <ShieldUser size={20} className="text-primary" />,
    });
  }

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
          <DesktopNavBar showToggle={isDashboardPage} links={mainNavLinks} />
          {isDashboardPage && <DesktopSideBar links={dashboardLinks} />}
        </>
      )}

      {shouldShowNavbar && (
        <>
          <MobileNavBar />
          <MobileSideBar
            isDashboardPage={isDashboardPage}
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
          ${shouldShowNavbar && isDashboardPage && isExpanded ? "md:pr-64 pr-0" : "pr-0"}
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
