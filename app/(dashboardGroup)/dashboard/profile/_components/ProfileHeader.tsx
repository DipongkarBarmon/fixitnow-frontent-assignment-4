"use client";

import Image from "next/image";
import { Camera, CheckCircle2, ShieldCheck, CalendarDays, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/auth-provider";
import { getAvatarUrl, formatDate } from "@/utils/format";

function getRoleLabel(role?: string) {
  switch ((role || "CUSTOMER").toUpperCase()) {
    case "ADMIN":
      return "Admin";
    case "TECHNICIAN":
      return "Technician";
    default:
      return "Customer";
  }
}

export function ProfileHeader() {
  const { user } = useAuth();

  const name = user?.name ?? "User";
  const avatar = user?.avatar ?? getAvatarUrl(name);
  const role = getRoleLabel(user?.role);

  return (
    <Card className="overflow-hidden border-neutral-200 bg-gradient-to-br from-white via-white to-sky-50/60 shadow-sm dark:border-neutral-800 dark:from-neutral-950 dark:via-neutral-950 dark:to-sky-950/20">
      <CardContent className="flex flex-col gap-6 p-0">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">Profile overview</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Your account snapshot at a glance</p>
          </div>
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
            {role}
          </Badge>
        </div>

        <div className="flex flex-col items-center gap-4 px-6 pt-2 text-center">
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full bg-sky-200/50 blur-2xl dark:bg-sky-500/10" />
          <Image
            src={avatar}
            alt={name}
            width={112}
            height={112}
            className="size-28 rounded-full border-4 border-white object-cover shadow-[0_12px_30px_rgba(15,23,42,0.12)] dark:border-neutral-900"
          />
          <button
            className="absolute bottom-1 right-1 flex size-9 items-center justify-center rounded-full bg-sky-600 text-white shadow-md transition-colors hover:bg-sky-700"
            title="Change avatar (coming soon)"
          >
            <Camera className="size-4" />
          </button>
        </div>

          <div className="space-y-2">
            <p className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">{name}</p>
            <div className="flex items-center justify-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
              <Mail className="size-4" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Badge className="rounded-full bg-sky-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white hover:bg-sky-600">
                <ShieldCheck className="mr-1 size-3.5" />
                Verified profile
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
                <CheckCircle2 className="mr-1 size-3.5 text-emerald-600" />
                {user?.isVerified ? "Active" : "Pending"}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid gap-3 px-6 pb-6 text-sm sm:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/70">
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
              <CalendarDays className="size-4" />
              <span>Member since</span>
            </div>
            <p className="mt-2 text-base font-semibold text-neutral-950 dark:text-white">
              {user?.createdAt ? formatDate(user.createdAt, "MMM yyyy") : "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/70">
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
              <ShieldCheck className="size-4" />
              <span>Status</span>
            </div>
            <p className={`mt-2 text-base font-semibold ${user?.isVerified ? "text-emerald-600" : "text-amber-600"}`}>
              {user?.isVerified ? "Email verified" : "Email pending"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
