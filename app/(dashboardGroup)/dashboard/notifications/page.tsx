"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Notifications</h1>
      <EmptyState icon={Bell} title="No notifications" description="You're all caught up! Check back later for updates." />
    </div>
  );
}
