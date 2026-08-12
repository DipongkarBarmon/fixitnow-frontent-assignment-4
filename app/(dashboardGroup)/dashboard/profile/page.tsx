"use client";

import { useAuth } from "@/providers/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/utils/format";
import { Bell, BadgeCheck, CalendarCheck2, ShieldCheck, Wrench } from "lucide-react";
 
import { ProfileHeader } from "./_components/ProfileHeader";
import { ProfileDelete } from "./_components/ProfileDelete";

const quickActions = [
  { label: "Bookings", value: "Review upcoming visits", icon: CalendarCheck2 },
  { label: "Support", value: "Alerts and assistance", icon: Bell },
  { label: "Services", value: "Manage service history", icon: Wrench },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const name = user?.name ?? "User";
  const roleLabel = (user?.role || "CUSTOMER").toString().toUpperCase();

  return (
    <div className="space-y-6 pb-8">
      <section className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white px-6 py-7 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_30%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="rounded-full bg-sky-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-sky-600">
                <BadgeCheck className="mr-1 size-3.5" />
                Dashboard Profile
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                <ShieldCheck className="mr-1 size-3.5 text-emerald-600" />
                {roleLabel}
              </Badge>
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">My Profile</h1>
              <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400 sm:text-base">
                Manage your personal information, track your account status, and keep your dashboard details up to date.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-md">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.label} className="border-neutral-200/80 bg-white/90 shadow-none backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80">
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-950 dark:text-white">{item.label}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.35fr]">
        <ProfileHeader />
         
      </div>

      <ProfileDelete />
 
    </div>
  );
}
