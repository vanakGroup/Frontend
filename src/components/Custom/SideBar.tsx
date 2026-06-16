import { useSidebarStore } from "@/store/sidebarStore/sidebarStore";
import { X } from "lucide-react";

interface SideBarProps {
  children: React.ReactNode;
}

export const SideBar = ({ children }: SideBarProps) => {
  const { isExpanded, collapseSidebar } = useSidebarStore();

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
        <button
          onClick={collapseSidebar}
          className="md:hidden absolute top-6 left-6 p-2 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col flex-1 px-3 md:mt-0 mt-2">{children}</div>
      </aside>
    </>
  );
};
