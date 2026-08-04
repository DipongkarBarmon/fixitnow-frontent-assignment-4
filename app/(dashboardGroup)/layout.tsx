"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Wrench,
  Menu,
  LogOut,
  LayoutDashboard,
  Calendar,
  CreditCard,
  Star,
  Bell,
  User as UserIcon,
  Settings,
  Clock,
  Users,
  FolderTree,
  FolderPlus,
  PlusCircle,
  TrendingUp,
  BarChart3,
  ChevronRight,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Globe,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/shared/navbar";
import { useAuth } from "@/providers/auth-provider";
import { getInitials, getAvatarUrl } from "@/utils/format";
import { CUSTOMER_SIDEBAR_ITEMS, TECHNICIAN_SIDEBAR_ITEMS, ADMIN_SIDEBAR_ITEMS } from "@/constants";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { User as UserType } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Calendar,
  CreditCard,
  Star,
  Bell,
  User: UserIcon,
  Settings,
  Wrench,
  Clock,
  Users,
  FolderTree,
  FolderPlus,
  PlusCircle,
  TrendingUp,
  BarChart3,
};

// ─────────────────────────────────────────────────────────────────────────────
// SidebarContent Component
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
  const role = user?.role || "CUSTOMER";

  return (
    <div className="flex h-full flex-col bg-white dark:bg-neutral-950">
      {/* Console Header / Role Title */}
      <div className="flex h-14 items-center justify-between border-b border-neutral-200 px-5 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          {role === "ADMIN" ? (
            <div className="flex size-7 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              <Shield className="size-4" />
            </div>
          ) : role === "TECHNICIAN" ? (
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <ShieldCheck className="size-4" />
            </div>
          ) : (
            <div className="flex size-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <UserIcon className="size-4" />
            </div>
          )}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              {role === "ADMIN" ? "Admin Console" : role === "TECHNICIAN" ? "Technician Portal" : "Customer Area"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <div className="px-3 pb-1 pt-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Management
          </p>
        </div>
        {sidebarItems.map((item) => {
          const Icon = iconMap[item.icon] ?? LayoutDashboard;
          const isActive = pathname === item.href;
          const isCreateAction = item.href.includes("/create");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-blue-600 text-white shadow-sm dark:bg-blue-600"
                  : isCreateAction
                    ? "text-teal-700 bg-teal-50/70 hover:bg-teal-100 dark:text-teal-300 dark:bg-teal-950/40 dark:hover:bg-teal-900/60"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "size-4 shrink-0 transition-transform group-hover:scale-105",
                    isActive
                      ? "text-white"
                      : isCreateAction
                        ? "text-teal-600 dark:text-teal-400"
                        : "text-neutral-500 dark:text-neutral-400"
                  )}
                />
                <span>{item.title}</span>
              </div>
              {isCreateAction && !isActive && (
                <span className="rounded bg-teal-200/70 px-1.5 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-800/60 dark:text-teal-200">
                  NEW
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Card & Logout in Sidebar Footer */}
      <div className="border-t border-neutral-200 p-3 dark:border-neutral-800">
        <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900">
          <Avatar className="size-8 border border-neutral-200 dark:border-neutral-700">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-xs font-bold">{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-neutral-900 dark:text-white">{name}</p>
            <p className="truncate text-[11px] text-neutral-500">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 w-full justify-start gap-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50"
          onClick={onLogout}
        >
          <LogOut className="size-3.5" /> Log Out
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DashboardLayout Component
// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  const name = user?.name ?? "User";
  const avatar = user?.avatar ?? getAvatarUrl(name);
  const currentRole = (user?.role || "CUSTOMER").toUpperCase();

  // Client-side authentication & role protection guard
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    const role = (user.role || "").toUpperCase();

    // Role route guards
    if (pathname.startsWith("/admin-dashboard") && role !== "ADMIN") {
      router.replace(role === "TECHNICIAN" ? "/technician-dashboard" : "/dashboard");
      return;
    }

    if (pathname.startsWith("/technician-dashboard") && role !== "TECHNICIAN" && role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }

    if (pathname === "/dashboard" && role === "ADMIN") {
      router.replace("/admin-dashboard");
      return;
    }

    if (pathname === "/dashboard" && role === "TECHNICIAN") {
      router.replace("/technician-dashboard");
      return;
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  // Determine sidebar items based on role
  const sidebarItems: ReadonlyArray<{ title: string; href: string; icon: string }> =
    currentRole === "TECHNICIAN"
      ? TECHNICIAN_SIDEBAR_ITEMS
      : currentRole === "ADMIN"
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

  // Helper to format breadcrumb items
  const pathSegments = pathname.split("/").filter(Boolean);
  const formatSegmentTitle = (segment: string) => {
    if (segment === "admin-dashboard") return "Admin";
    if (segment === "technician-dashboard") return "Technician";
    if (segment === "dashboard") return "Dashboard";
    return segment
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  // Loading state with smooth spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-900/30 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Loading workspace...</p>
        </div>
      </div>
    );
  }

  // Prevent flash while redirecting unauthenticated or unauthorized users
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-900/30 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (pathname.startsWith("/admin-dashboard") && currentRole !== "ADMIN") {
    return (
      <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-900/30 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  if (pathname.startsWith("/technician-dashboard") && currentRole !== "TECHNICIAN" && currentRole !== "ADMIN") {
    return (
      <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-900/30 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-900/30 flex flex-col">
      {/* 1. Global Fixed Main Navbar for ALL Dashboards */}
      <Navbar />

      {/* 2. Mobile Dashboard Sub-bar (below Navbar on small screens) */}
      <div className="flex h-12 items-center justify-between border-b border-neutral-200 bg-white/90 px-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90 lg:hidden">
        <div className="flex items-center gap-2">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="h-8 gap-1.5 px-2.5 text-xs font-semibold"
            >
              <SlidersHorizontal className="size-3.5" />
              <span>Menu</span>
            </Button>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Dashboard Navigation</SheetTitle>
              <SidebarContent {...sidebarProps} />
            </SheetContent>
          </Sheet>

          {/* Breadcrumbs for Mobile */}
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            {pathSegments.map((segment, idx) => {
              const isLast = idx === pathSegments.length - 1;
              const formatted = formatSegmentTitle(segment);
              return (
                <span key={segment} className="flex items-center gap-1">
                  {idx > 0 && <ChevronRight className="size-3 text-neutral-400" />}
                  <span className={cn(isLast ? "font-semibold text-neutral-900 dark:text-white" : "")}>
                    {formatted}
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Role Pill */}
        <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
          {currentRole}
        </span>
      </div>

      {/* 3. Dashboard Container with Sidebar and Content */}
      <div className="flex flex-1">
        {/* Desktop Sidebar (Fixed/Sticky below top navbar) */}
        <aside className="hidden w-64 shrink-0 border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 lg:block">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <SidebarContent {...sidebarProps} />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
