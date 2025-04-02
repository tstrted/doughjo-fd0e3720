
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Wallet,
  BarChart3,
  ArrowRightLeft,
  PiggyBank,
  Settings,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SideNavProps {
  closeSidebar: () => void;
}

const SideNav = ({ closeSidebar }: SideNavProps) => {
  const navItems = [
    {
      name: "Budget",
      path: "/",
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      name: "Accounts",
      path: "/accounts",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: <ArrowRightLeft className="h-5 w-5" />,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Sub-Accounts",
      path: "/sub-accounts",
      icon: <PiggyBank className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="flex-1 overflow-auto py-4">
      <div className="mb-6 px-4">
        <div className="flex items-center justify-center mb-4">
          <img 
            src="/lovable-uploads/03194697-3c05-4437-ae1d-f031fbeb29eb.png" 
            alt="DoughJo Logo" 
            className="w-full max-w-[200px]" 
          />
        </div>
        <h2 className="text-xl font-bold text-center mb-6">My DoughJo</h2>
      </div>
      <div className="px-3 py-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                cn(
                  "nav-item",
                  isActive ? "active" : ""
                )
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default SideNav;
