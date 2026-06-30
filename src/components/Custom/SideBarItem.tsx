import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  to: string;
  onClick?: () => void;
  end?: boolean;
}

export const SideBarItem = ({ icon, label, to, onClick, end }: SidebarItemProps) => {
  // If no explicit 'end' prop is passed, default to true for the root dashboard to prevent layout bugs
  const isEnd = end !== undefined ? end : to === "/dashboard" || to === "/";
  return (
    <NavLink
      to={to}
      end={isEnd}
      onClick={onClick}
      dir="rtl"
      className={({ isActive }) => `
        w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-lg font-medium
        transition-colors group
        ${
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        }
      `}
    >
      <div className="shrink-0">{icon}</div>

      <span className="truncate text-right w-full font-sans">{label}</span>
    </NavLink>
  );
};
