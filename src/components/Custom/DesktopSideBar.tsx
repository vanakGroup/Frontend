import { SideBar } from "@/components/Custom/SideBar";
import { SideBarItem } from "@/components/Custom/SideBarItem";

interface Props {
  links: { label: string; to: string; icon: React.ReactNode }[];
}

export const DesktopSideBar = ({ links }: Props) => {
  return (
    <div className="hidden md:block">
      <SideBar>
        <div className="flex-1 space-y-1">
          {links.map((link, index) => (
            <SideBarItem
              key={index}
              to={link.to}
              icon={link.icon}
              label={link.label}
            />
          ))}
        </div>
      </SideBar>
    </div>
  );
};
