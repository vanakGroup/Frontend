import { Outlet, ScrollRestoration } from "react-router-dom";
import { DesktopNavBar } from "@/components/Custom/DesktopNavBar";
import { DesktopSideBar } from "@/components/Custom/DesktopSideBar";
import { MobileNavBar } from "@/components/Custom/MobileNavBar";
import { MobileSideBar } from "@/components/Custom/MobileSideBar";
import { LayoutDashboard, ParkingSquare, Settings, User } from "lucide-react";
import { Label } from "radix-ui";
import { useSidebarStore } from "@/store/sidebarStore/sidebarStore";

const dashboardLinks = [
  {
    label: "پارکینگ من",
    to: "/dashboard/my-parking",
    icon: <ParkingSquare size={20} />,
  },
  { label: "پروفایل", to: "/dashboard/profile", icon: <User size={20} /> },
  { label: "تنظیمات", to: "/dashboard/settings", icon: <Settings size={20} /> },
];

const navLinks = [
  { label: "صفحه اصلی", to: "/" },
  { label: "درباره ما", to: "/aboutus" },
  { label: "تماس با ما", to: "/contactus" },
];

export default function DashboardLayout() {
  const { isExpanded } = useSidebarStore();

  return (
    <div className="min-h-screen bg-muted">
      <ScrollRestoration />
      {/* Navbar */}
      <DesktopNavBar showToggle={true} links={navLinks} />

      {/* Sidebar */}
      <DesktopSideBar links={dashboardLinks} />
      <MobileSideBar
        isDashboardPage={true}
        mainLinks={[]}
        dashboardLinks={dashboardLinks}
      />

      {/* Mobile bottom navbar */}
      <MobileNavBar />

      {/* Main content */}
      <main 
        className={`${isExpanded ? "md:mr-64" : "md:mr-0"} pt-16 pb-24 md:pb-8 min-h-screen transition-all duration-300 ease-in-out`} 
        dir="rtl"
      >
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
