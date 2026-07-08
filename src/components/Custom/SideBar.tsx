import { useSidebarStore } from "@/store/sidebarStore/sidebarStore";
import { X, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import useUserStore from "@/store/userStore/userStore";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface SideBarProps {
  children: React.ReactNode;
}

export const SideBar = ({ children }: SideBarProps) => {
  const { isExpanded, collapseSidebar, isAdminMode, setAdminMode } =
    useSidebarStore();

  const role = useUserStore((state) => state.role);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isCurrentlyAdminRoute = location.pathname.startsWith("/admin");
    setAdminMode(isCurrentlyAdminRoute);
  }, [location.pathname, setAdminMode]);

  const handleToggleMode = () => {
    if (isAdminMode) {
      navigate("/dashboard");
    } else {
      navigate("/admin");
    }

    if (window.innerWidth < 768) {
      collapseSidebar();
    }
  };

  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden transition-opacity"
          onClick={collapseSidebar}
        />
      )}

      <aside
        className={`
          fixed top-0 right-0 h-screen z-[70] 
          bg-background border-l border-border shadow-xl
          transition-transform duration-300 ease-in-out
          flex flex-col overflow-y-auto
          w-full md:w-64 pt-0 md:pt-20 pb-4 
          ${isExpanded ? "translate-x-0" : "translate-x-full"}
        `}
        dir="rtl"
      >
        {/* Mobile Close Button Header */}
        <div className="flex items-center justify-end p-4 md:hidden">
          <button
            onClick={collapseSidebar}
            className="p-2 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Dynamic Links */}
        <div className="flex flex-col flex-1 px-3 md:mt-0">{children}</div>

        {/* Toggle Panel Button */}
        {role === "ADMIN" && (
          <div className="mt-auto px-3 pt-4 border-t border-border">
            <Button
              className="w-full flex items-center justify-start gap-3"
              onClick={handleToggleMode}
            >
              <ArrowRightLeft size={18} />
              <span>
                {isAdminMode ? "نمایش پنل کاربری" : "نمایش پنل مدیریت"}
              </span>
            </Button>
          </div>
        )}
      </aside>
    </>
  );
};
