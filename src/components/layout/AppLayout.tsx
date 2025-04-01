
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";
import HeaderNav from "./HeaderNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFinance } from "@/context/FinanceContext";

const AppLayout = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { settings } = useFinance();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <div className={cn(
      "min-h-screen flex flex-col bg-finance-background",
      settings.darkMode ? "dark" : ""
    )}>
      <HeaderNav toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <aside className={cn(
          "fixed inset-y-0 z-50 flex w-72 flex-col border-r bg-white dark:bg-gray-800 dark:border-gray-700 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0", 
          isMobile ? sidebarOpen ? "translate-x-0" : "-translate-x-full" : ""
        )}>
          <div className="flex h-16 items-center justify-between px-4 py-4 lg:px-6">
            <span className="text-xl font-semibold dark:text-white">My DoughJo</span>
            {isMobile && <button onClick={toggleSidebar} className="lg:hidden p-2">
                <X size={24} className="dark:text-white" />
              </button>}
          </div>
          <SideNav closeSidebar={() => setSidebarOpen(false)} />
        </aside>
        {isMobile && sidebarOpen && <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}
        <main className={cn("flex-1 overflow-auto p-4 transition-all duration-300 ease-in-out dark:bg-gray-900 dark:text-gray-100", "lg:p-6")}>
          <div className="mx-auto max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
