"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, Menu, LogOut, LayoutDashboard, Calendar, CreditCard, Star, Bell, User, Settings, Clock, Users, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/themeToggle";
import { useAuth } from "@/providers/auth-provider";
import { getInitials, getAvatarUrl } from "@/utils/format";
import { CUSTOMER_SIDEBAR_ITEMS, TECHNICIAN_SIDEBAR_ITEMS, ADMIN_SIDEBAR_ITEMS } from "@/constants";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { User as UserType } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard, Calendar, CreditCard, Star, Bell, User, Settings, Wrench, Clock, Users, FolderTree,
};

// ─────────────────────────────────────────────────────────────────────────────
// SidebarContent — extracted outside layout to avoid "component in render" lint
// ─────────────────────────────────────────────────────────────────────────────

interface SidebarContentProps {
  sidebarItems: ReadonlyArray<{ title: string; href: string; icon: string }>;
  pathname: string;
  user: UserType | null;
  name: string;
  avatar: string;
  onNavClick: () => void;
  onLogout: () => void;
}

function SidebarContent({
  sidebarItems,
  pathname,
  user,
  name,
  avatar,
  onNavClick,
  onLogout,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-neutral-200 px-6 dark:border-neutral-800">
        <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Wrench className="size-4" />
        </div>
        <span className="text-lg font-bold text-neutral-900 dark:text-white">FixItNow</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => {
          const Icon = iconMap[item.icon] ?? LayoutDashboard;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                  : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              )}
            >
              <Icon className="size-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="size-9">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-xs">{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{name}</p>
            <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950"
          onClick={onLogout}
        >
          <LogOut className="size-4" />Logout
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DashboardLayout
// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const name = user?.name ?? "User";
  const avatar = user?.avatar ?? getAvatarUrl(name);

  // Determine sidebar items based on role
  const sidebarItems: ReadonlyArray<{ title: string; href: string; icon: string }> =
    user?.role === "TECHNICIAN"
      ? TECHNICIAN_SIDEBAR_ITEMS
      : user?.role === "ADMIN"
        ? ADMIN_SIDEBAR_ITEMS
        : CUSTOMER_SIDEBAR_ITEMS;

  const sidebarProps: SidebarContentProps = {
    sidebarItems,
    pathname,
    user,
    name,
    avatar,
    onNavClick: () => setSidebarOpen(false),
    onLogout: logout,
  };

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 lg:block">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <SidebarContent {...sidebarProps} />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/80 px-4 backdrop-blur-lg dark:border-neutral-800 dark:bg-neutral-950/80 sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="lg:hidden">
                <Menu className="size-5" />
              </Button>
              <SheetContent side="left" className="w-64 p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarContent {...sidebarProps} />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold text-neutral-900 dark:text-white capitalize">
              {pathname.split("/").pop()?.replace("-", " ") ?? "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-5 text-neutral-500" />
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">3</span>
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
