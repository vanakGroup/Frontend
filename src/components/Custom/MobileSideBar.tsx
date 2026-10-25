import { useSidebarStore } from "@/store/sidebarStore/sidebarStore";
import { SideBar } from "@/components/Custom/SideBar";
import { SideBarItem } from "@/components/Custom/SideBarItem";
import { LogOut, User } from "lucide-react";
import useUserStore from "@/store/userStore/userStore";

interface Props {
  isDashboardPage: boolean;
  mainLinks: { label: string; to: string; icon?: React.ReactNode }[];
  dashboardLinks: { label: string; to: string; icon?: React.ReactNode }[];
}

export const MobileSideBar = ({
  isDashboardPage,
  mainLinks,
  dashboardLinks,
}: Props) => {
  const { collapseSidebar } = useSidebarStore();
  const { username, phone, clearAuth } = useUserStore();

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

        <div className="mt-auto pt-4 border-t border-border space-y-3">
          <span
            className="px-3 text-xs font-semibold text-muted-foreground block text-right"
            dir="rtl"
          >
            حساب کاربری
          </span>

          {/* User Info Display */}
          {phone && (
            <div className="px-3 flex items-center gap-3 text-right" dir="rtl">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground shrink-0">
                <User size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground truncate max-w-[150px]">
                  {username || "کاربر"}
                </span>
                <span className="text-xs text-muted-foreground font-medium mt-0.5" dir="ltr">
                  {phone}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {!isDashboardPage && (
              <SideBarItem
                to="/dashboard/profile"
                icon={<User size={20} />}
                label="ویرایش حساب کاربری"
                onClick={collapseSidebar}
              />
            )}
            <SideBarItem
              to="/login"
              icon={<LogOut size={20} className="text-destructive" />}
              label="خروج"
              onClick={() => {
                clearAuth();
                collapseSidebar();
              }}
            />
          </div>
        </div>
      </SideBar>
    </div>
  );
};
