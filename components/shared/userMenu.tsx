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
  FolderTree,
  Users,
  Wrench,
  Shield,
  ShieldCheck,
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
  const role = user?.role || "CUSTOMER";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Avatar className="size-8 border border-neutral-200 dark:border-neutral-700">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold text-neutral-900 dark:text-white leading-none">
              {name}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {email}
            </p>
            <span className="mt-1 inline-flex w-fit rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              {role === "ADMIN" ? "Administrator" : role === "TECHNICIAN" ? "Technician" : "Customer"}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Primary Dashboard Link */}
        <DropdownMenuItem asChild>
          <Link href={dashboardLink} className="cursor-pointer font-medium">
            <LayoutDashboard className="mr-2 size-4 text-blue-600 dark:text-blue-400" />
            {role === "ADMIN" ? "Admin Console" : role === "TECHNICIAN" ? "Technician Portal" : "Customer Dashboard"}
          </Link>
        </DropdownMenuItem>

        {/* Role-Specific Quick Links */}
        {role === "ADMIN" && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin-dashboard/categories" className="cursor-pointer">
                <FolderTree className="mr-2 size-4" />
                Categories
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin-dashboard/users" className="cursor-pointer">
                <Users className="mr-2 size-4" />
                Users Moderation
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin-dashboard/settings" className="cursor-pointer">
                <Settings className="mr-2 size-4" />
                Platform Settings
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {role === "TECHNICIAN" && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/technician-dashboard/bookings" className="cursor-pointer">
                <Calendar className="mr-2 size-4" />
                My Job Requests
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/technician-dashboard/profile" className="cursor-pointer">
                <UserIcon className="mr-2 size-4" />
                Technician Profile
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {role === "CUSTOMER" && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/bookings" className="cursor-pointer">
                <Calendar className="mr-2 size-4" />
                My Bookings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="cursor-pointer">
                <UserIcon className="mr-2 size-4" />
                My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/payments" className="cursor-pointer">
                <CreditCard className="mr-2 size-4" />
                Payment History
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem asChild>
          <Link href="/contact" className="cursor-pointer">
            <HelpCircle className="mr-2 size-4" />
            Help & Support
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logout()}
          className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-950 dark:focus:text-red-400"
        >
          <LogOut className="mr-2 size-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

