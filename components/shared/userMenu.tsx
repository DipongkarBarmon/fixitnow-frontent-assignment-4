"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  User as UserIcon,
  Calendar,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown_menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/providers/auth-provider";
import { getInitials, getAvatarUrl } from "@/utils/format";
import type { User } from "@/types";

interface UserMenuProps {
  user: User | null;
  dashboardLink: string;
}

export function UserMenu({ user, dashboardLink }: UserMenuProps) {
  const { logout } = useAuth();

  const name = user?.name || "User";
  const email = user?.email || "";
  const avatar = user?.avatar || getAvatarUrl(name);
  const initials = getInitials(name);

  return (
    <>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        className="relative text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
      >
        <Bell className="size-5" />
        <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
          3
        </span>
        <span className="sr-only">Notifications</span>
      </Button>

      {/* User Avatar Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <Avatar className="size-8">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={dashboardLink} className="cursor-pointer">
              <LayoutDashboard className="mr-2 size-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile" className="cursor-pointer">
              <UserIcon className="mr-2 size-4" />
              My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/bookings" className="cursor-pointer">
              <Calendar className="mr-2 size-4" />
              My Bookings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/payments" className="cursor-pointer">
              <CreditCard className="mr-2 size-4" />
              Payments
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="cursor-pointer">
              <Settings className="mr-2 size-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/help" className="cursor-pointer">
              <HelpCircle className="mr-2 size-4" />
              Help Center
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => logout()}
            className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-950 dark:focus:text-red-400"
          >
            <LogOut className="mr-2 size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
