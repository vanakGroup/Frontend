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
  // Bring in setAdminMode instead of toggleAdminMode
  const { isExpanded, collapseSidebar, isAdminMode, setAdminMode } =
    useSidebarStore();

  const role = useUserStore((state) => state.role);
  const navigate = useNavigate();
  const location = useLocation();

  // The URL drives the state. Whenever the URL changes, we force the state to match.
  useEffect(() => {
    const isCurrentlyAdminRoute = location.pathname.startsWith("/admin");
    setAdminMode(isCurrentlyAdminRoute);
  }, [location.pathname, setAdminMode]);

  const handleToggleMode = () => {
    // Just navigate! The useEffect above will catch the URL change and update the state automatically.
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
          w-full md:w-64 pt-20 pb-4 
          ${isExpanded ? "translate-x-0" : "translate-x-full"}
        `}
        dir="rtl"
      >

        <div className="flex flex-col flex-1 px-3 md:mt-0 mt-2">{children}</div>

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
