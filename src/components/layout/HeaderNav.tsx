
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";

interface HeaderNavProps {
  toggleSidebar: () => void;
}

const HeaderNav = ({ toggleSidebar }: HeaderNavProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Get current page title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Budget";
    if (path === "/accounts") return "Accounts";
    if (path === "/transactions") return "Transactions";
    if (path === "/reports") return "Reports";
    if (path === "/sub-accounts") return "Sub-Accounts";
    if (path === "/settings") return "Settings";
    return "Pocket Savings";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700 px-4 sm:px-6">
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5 dark:text-gray-200" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      )}
      <div className="flex-1">
        <h1 className="text-lg font-semibold dark:text-white">{getPageTitle()}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/settings">
            <Settings className="h-5 w-5 dark:text-gray-200" />
            <span className="sr-only">Settings</span>
          </Link>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-5 w-5 dark:text-gray-200" />
          <span className="sr-only">User</span>
        </Button>
      </div>
    </header>
  );
};

export default HeaderNav;
