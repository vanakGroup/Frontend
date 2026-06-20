import { useSidebarStore } from "@/store/sidebarStore/sidebarStore";
import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Home, Car } from "lucide-react";

export const MobileNavBar = () => {
  const { toggleSidebar } = useSidebarStore();

  return (
    <div
      className="md:hidden fixed bottom-6 left-4 right-4 h-16 px-6 bg-background/85 backdrop-blur-lg border border-border shadow-2xl rounded-2xl z-50 flex items-center justify-between"
      dir="rtl"
    >
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-xl text-muted-foreground hover:bg-accent"
      >
        <Menu size={22} />
      </button>

      <div className="flex items-center gap-2">
        <NavLink
          to="/parkings"
          className={({ isActive }) =>
            `text-sm font-semibold px-3 py-2 rounded-lg ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground"}`
          }
        >
          <Car />
        </NavLink>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-sm font-semibold px-3 py-2 rounded-lg ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground"}`
          }
        >
          <Home />
        </NavLink>
      </div>
    </div>
  );
};
