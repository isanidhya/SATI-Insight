import { Dashboard } from "@/components/dashboard";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <Dashboard />
    </SidebarProvider>
  );
}
