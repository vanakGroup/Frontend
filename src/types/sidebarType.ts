export interface SidebarState {
  isExpanded: boolean;
  isAdminMode: boolean;
  toggleSidebar: () => void;
  expandSidebar: () => void;
  collapseSidebar: () => void;
  toggleAdminMode: () => void;
}
