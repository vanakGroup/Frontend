import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useSidebarStore } from "@/store/sidebarStore/sidebarStore";

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  to: string;
  onClick?: () => void;
  end?: boolean;
}

export const SideBarItem = ({ icon, label, to, onClick, end }: SidebarItemProps) => {
  const { isExpanded } = useSidebarStore();
  // If no explicit 'end' prop is passed, default to true for the root dashboard to prevent layout bugs
  const isEnd = end !== undefined ? end : to === "/dashboard" || to === "/";
  return (
    <NavLink
      to={to}
      end={isEnd}
      onClick={onClick}
      dir="rtl"
      className={({ isActive }) => `
        w-full flex items-center rounded-md text-lg font-medium
        transition-all duration-300 group
        ${isExpanded ? "justify-start gap-3 px-3 py-2.5" : "md:justify-center md:gap-0 md:px-0 md:py-2.5 justify-start gap-3 px-3 py-2.5"}
        ${
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        }
      `}
    >
      <div className="shrink-0">{icon}</div>

      <span className={`truncate text-right w-full font-sans transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "md:opacity-0 md:w-0 md:pointer-events-none md:overflow-hidden"}`}>
        {label}
      </span>
    </NavLink>
  );
};

