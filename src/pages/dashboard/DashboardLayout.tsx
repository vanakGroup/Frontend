import { Outlet } from "react-router-dom";
import { DesktopNavBar } from "@/components/Custom/DesktopNavBar";
import { DesktopSideBar } from "@/components/Custom/DesktopSideBar";
import { MobileNavBar } from "@/components/Custom/MobileNavBar";
import { MobileSideBar } from "@/components/Custom/MobileSideBar";
import { LayoutDashboard, ParkingSquare, Settings } from "lucide-react";
import { Label } from "radix-ui";

const dashboardLinks = [
  {
    label: "پارکینگ من",
    to: "/dashboard/my-parking",
    icon: <ParkingSquare size={20} />,
  },
  { label: "تنظیمات", to: "/dashboard/settings", icon: <Settings size={20} /> },
];

const navLinks = [
  { label: "خانه", to: "/" },
  { label: "داشبورد", to: "/dashboard" },
  { label: "درباره ما", to: "/blank" },
];

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-muted">
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
      <main className="md:mr-64 pt-16 pb-24 md:pb-8 min-h-screen" dir="rtl">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
