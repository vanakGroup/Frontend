import { Outlet, ScrollRestoration } from "react-router-dom";

export default function DashboardLayout() {
  const { isExpanded } = useSidebarStore();
  return (
    <div className="min-h-screen bg-muted">
      <ScrollRestoration />
      <div className="p-4 md:p-6" dir="rtl">
        <Outlet />
      </div>
    </div>
  );
}
