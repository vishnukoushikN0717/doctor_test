"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  User,
  FileSpreadsheet,
  LogOut,
} from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { Button } from "@/components/ui/button";
import { logout } from "@/utils/internal/auth";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

// Logout handler
const handleLogout = () => {
  try {
    logout();
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// Define base sidebar items (excluding Account Manager)
const baseSidebarItems = [
  {
    title: "Dashboard",
    href: "/internal/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Market Analysis",
    href: "/market-analysis/landing-page",
    icon: FileSpreadsheet,
  },
  {
    title: "Patient Manager",
    href: "/internal/patient-manager",
    icon: Users,
  },
];

// Add Account Manager conditionally based on userRole
const getSidebarItems = (userRole: string | null) => {
  const items = [...baseSidebarItems];
  if (userRole === "Super Admin") {
    items.push({
      title: "Account Manager",
      href: "/internal/dashboard/account",
      icon: User,
    });
  }
  return items;
};

// Add userRole as a prop
export function SidebarNav({ userRole }: { userRole: string | null }) {
  const pathname = usePathname();
  const { isOpen } = useSidebar();

  const sidebarItems = getSidebarItems(userRole);

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed top-16 left-0 z-50 border-r h-[calc(100vh-4rem)] bg-background transition-all duration-300 flex flex-col",
          isOpen ? "w-52" : "w-16"
        )}
        style={{
          "--sidebar-width": isOpen ? "13rem" : "4rem",
        } as any}
      >
        {/* Main Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                      isActive ? "text-blue-500" : "text-foreground",
                      !isOpen && "justify-center px-2",
                      "group hover:text-blue-500"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 flex-shrink-0 transition-colors",
                        isActive ? "text-blue-500" : "text-foreground",
                        isOpen ? "group-hover:text-blue-500" : "hover:text-blue-500"
                      )}
                    />
                    {isOpen && <span className="truncate">{item.title}</span>}
                  </Link>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side="right">
                    {item.title}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Logout Button - Fixed at Bottom */}
        <div className="border-t p-4 mt-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full text-red-600 hover:text-red-700 hover:bg-red-50",
                  !isOpen && "px-2 justify-center"
                )}
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                {isOpen && <span className="ml-2">Logout</span>}
              </Button>
            </TooltipTrigger>
            {!isOpen && (
              <TooltipContent side="right">
                Logout
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}