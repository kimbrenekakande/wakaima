import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar />
      <div className="h-svh overflow-hidden lg:p-2 w-full">
        <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-stretch justify-start bg-container h-full w-full bg-background">
          <DashboardHeader />
          <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
