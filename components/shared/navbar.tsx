"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Wrench, Menu, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { UserMenu } from "./userMenu";
import { ThemeToggle } from "./themeToggle";
import { useAuth } from "@/providers/auth-provider";
import { PUBLIC_NAV_ITEMS } from "@/constants";

// Static notification count — will be replaced with real API data
const NOTIFICATION_COUNT = 3;

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();

  const isActive = (href: string) => pathname === href;

  // Determine dashboard link based on role
  const getDashboardLink = () => {
    if (!user) return "/dashboard";
    switch (user.role) {
      case "ADMIN":
        return "/admin-dashboard";
      case "TECHNICIAN":
        return "/technician-dashboard";
      default:
        return "/dashboard";
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-lg dark:border-neutral-800/80 dark:bg-neutral-950/80">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section - Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Wrench className="size-4" />
          </div>
          <span className="hidden text-xl font-bold text-neutral-900 dark:text-white sm:inline">
            FixItNow
          </span>
        </Link>

        {/* Center Navigation - Desktop Only */}
        <div className="hidden gap-1 md:flex">
          {PUBLIC_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              {item.title}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-4/5 -translate-x-1/2 rounded-full bg-blue-600 dark:bg-blue-400" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {isLoading ? (
            <div className="size-8 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
          ) : isAuthenticated ? (
            <>
              {/* Notification Bell — only shown when logged in */}
              <Link
                href="/dashboard/notifications"
                aria-label={`Notifications (${NOTIFICATION_COUNT} unread)`}
                className="relative flex size-9 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                id="notification-bell"
              >
                <Bell className="size-5" />
                {NOTIFICATION_COUNT > 0 && (
                  <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold leading-none text-white">
                    {NOTIFICATION_COUNT > 9 ? "9+" : NOTIFICATION_COUNT}
                  </span>
                )}
              </Link>
              <UserMenu user={user} dashboardLink={getDashboardLink()} />
            </>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="hidden sm:inline-flex"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="hidden sm:inline-flex">
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(true)}
              className="md:hidden text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>

            <SheetContent side="left" className="w-72">
              <SheetTitle className="mb-6 flex items-center gap-2 text-lg font-bold">
                <Wrench className="size-5 text-blue-600" />
                FixItNow
              </SheetTitle>

              {/* Navigation Links */}
              <div className="mb-6 flex flex-col gap-1">
                {PUBLIC_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>

              {/* Auth Section */}
              <div className="border-t border-neutral-200 pt-4 dark:border-neutral-800">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-1">
                    {/* Notification link in mobile menu */}
                    <Link
                      href="/dashboard/notifications"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                    >
                      <Bell className="size-4" />
                      Notifications
                      {NOTIFICATION_COUNT > 0 && (
                        <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                          {NOTIFICATION_COUNT > 9 ? "9+" : NOTIFICATION_COUNT}
                        </span>
                      )}
                    </Link>
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setIsOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setIsOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                    >
                      My Profile
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
