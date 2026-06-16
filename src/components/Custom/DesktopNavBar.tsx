import { useSidebarStore } from "@/store/sidebarStore/sidebarStore";
import useUserStore from "@/store/userStore/userStore";
import { Menu, User, LogIn } from "lucide-react"; // Import an icon for logo if needed
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface Props {
  showToggle: boolean;
  links: { label: string; to: string }[];
}

export const DesktopNavBar = ({ showToggle, links }: Props) => {
  const { toggleSidebar } = useSidebarStore();
  const { username, phone } = useUserStore();
  const Navigate = useNavigate();

  return (
    <header className="hidden md:flex fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-md z-[60] items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {phone ? (
          <div
            onClick={() => Navigate("/userprofile")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground shrink-0">
              <User size={16} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold leading-none truncate max-w-[120px]">
                {username || "کاربر"}
              </span>
              <span className="text-xs text-muted-foreground mt-1 font-medium">
                {phone}
              </span>
            </div>
          </div>
        ) : (
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium"
            onClick={() => {
              Navigate("/login");
            }}
          >
            <LogIn size={16} /> <span>ورود</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <nav
          className="flex items-center gap-4 border-l border-border pl-6 pr-2"
          dir="rtl"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium px-2 py-1 rounded-md transition-colors ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3" dir="rtl">
          {showToggle && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-muted-foreground hover:bg-accent transition-colors"
              aria-label="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>
          )}

          <button onClick={() => Navigate("/")}>
            <div className="flex items-center gap-3 cursor-pointer" dir="ltr">
              <div className="hidden lg:flex flex-col" dir="rtl">
                <span className="font-bold text-xl text-primary tracking-tight mb-1 leading-none">
                  ونک
                </span>
                <span className="text-[11px] text-muted-foreground font-medium leading-none">
                  سیستم پارکینگ هوشمند
                </span>
              </div>
              <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                <img
                  src="@/../jl.png"
                  alt="logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
