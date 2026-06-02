import { useSidebarStore } from "@/store/sidebarStore/sidebarStore";
import { SideBar } from "@/components/Custom/SideBar";
import { SideBarItem } from "@/components/Custom/SideBarItem";
import { LogOut, Settings } from "lucide-react";

interface Props {
  isDashboardPage: boolean;
  mainLinks: { label: string; to: string; icon: React.ReactNode }[];
  dashboardLinks: { label: string; to: string; icon: React.ReactNode }[];
}

export const MobileSideBar = ({
  isDashboardPage,
  mainLinks,
  dashboardLinks,
}: Props) => {
  const { collapseSidebar } = useSidebarStore();

  return (
    <div className="md:hidden">
      <SideBar>
        <div className="flex-1 space-y-1">
          {isDashboardPage ? (
            dashboardLinks.map((link, index) => (
              <SideBarItem
                key={index}
                to={link.to}
                icon={link.icon}
                label={link.label}
                onClick={collapseSidebar}
              />
            ))
          ) : (
            <>
              <span
                className="px-3 text-xs font-semibold text-muted-foreground block mb-2 text-right"
                dir="rtl"
              >
                منوی دسترسی
              </span>
              {mainLinks.map((link, index) => (
                <SideBarItem
                  key={index}
                  to={link.to}
                  icon={link.icon}
                  label={link.label}
                  onClick={collapseSidebar}
                />
              ))}
            </>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-border space-y-1">
          <span
            className="px-3 text-xs font-semibold text-muted-foreground block mb-2 text-right"
            dir="rtl"
          >
            حساب کاربری
          </span>
          <SideBarItem
            to="/settings"
            icon={<Settings size={20} />}
            label="تنظیمات"
            onClick={collapseSidebar}
          />
          <SideBarItem
            to="/login"
            icon={<LogOut size={20} className="text-red-500" />}
            label="خروج"
            onClick={collapseSidebar}
          />
        </div>
      </SideBar>
    </div>
  );
};
