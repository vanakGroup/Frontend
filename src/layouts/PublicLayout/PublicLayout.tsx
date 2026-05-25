import { Toaster } from "@/components/ui/sonner";
import { Outlet, useLocation } from "react-router-dom";
import { DesktopNavBar } from "@/components/Custom/DesktopNavBar";
import { MobileNavBar } from "@/components/Custom/MobileNavBar";
import { DesktopSideBar } from "@/components/Custom/DesktopSideBar";
import { MobileSideBar } from "@/components/Custom/MobileSideBar";
import { useSidebarStore } from "@/store/sidebarStore/sidebarStore";
import { Home, Layers, Info } from "lucide-react"; // ◄ Icons moved here!

const PublicLayout = () => {
  const { isExpanded } = useSidebarStore();
  const location = useLocation();

  const routesWithoutNavbar = ["/login"];
  const shouldShowNavbar = !routesWithoutNavbar.includes(location.pathname);

  const dashboardRoutes = ["/blank"];
  const isDashboardPage = dashboardRoutes.some((route) =>
    location.pathname.startsWith(route),
  );

  const mainNavLinks = [
    { label: "صفحه اصلی", to: "/", icon: <Info size={18} /> },
    { label: "درباره ما", to: "/about", icon: <Info size={18} /> },
  ];

  const dashboardLinks = [
    { label: "داشبورد", to: "/login", icon: <Home size={20} /> },
    { label: "blank", to: "/blank", icon: <Layers size={20} /> },
  ];

  return (
    <>
      <Toaster
        position="bottom-right"
        richColors={true}
        duration={5000}
        dir="rtl"
      />

      {shouldShowNavbar && (
        <>
          <DesktopNavBar showToggle={isDashboardPage} links={mainNavLinks} />
          {/* We only render DesktopSideBar if we are on a dashboard page */}
          {isDashboardPage && <DesktopSideBar links={dashboardLinks} />}
        </>
      )}

      <MobileNavBar />
      <MobileSideBar
        isDashboardPage={isDashboardPage}
        mainLinks={mainNavLinks}
        dashboardLinks={dashboardLinks}
      />

      <main
        className={`
          min-h-screen overflow-x-hidden transition-all duration-300 ease-in-out
          pt-0 pb-28 ${shouldShowNavbar ? "md:pt-16 md:pb-0" : "md:pt-0 md:pb-0"}
          ${shouldShowNavbar && isDashboardPage && isExpanded ? "md:pr-64 pr-0" : "pr-0"}
        `}
      >
        <Outlet />
      </main>
    </>
  );
};

export default PublicLayout;
