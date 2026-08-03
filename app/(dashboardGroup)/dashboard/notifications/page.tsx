"use client";

import { useState } from "react";
import { Bell, CheckCheck, Calendar, CreditCard, Star, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/utils/format";
import { cn } from "@/lib/utils";

// ─── Demo notification data (replace with real API when available) ──────────
type NotifType = "booking" | "payment" | "review" | "promo" | "system";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

const DEMO_NOTIFICATIONS: Notification[] = [
  { id: "1", type: "booking", title: "Booking Confirmed", message: "Your plumbing repair booking with Karim Ahmed on Aug 5 at 10:00 AM has been accepted.", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), isRead: false },
  { id: "2", type: "payment", title: "Payment Successful", message: "Payment of ৳1,500 for AC Maintenance (TXN-001234) was processed successfully.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), isRead: false },
  { id: "3", type: "booking", title: "Technician On The Way", message: "Sumon Das is on his way to your location. Expected arrival in 20 minutes.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), isRead: false },
  { id: "4", type: "review", title: "Leave a Review", message: "How was your electrical wiring service with Rafiq Islam? Share your experience.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), isRead: true },
  { id: "5", type: "payment", title: "Refund Processed", message: "Your refund of ৳1,200 for House Cleaning has been initiated and will arrive in 3–5 business days.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), isRead: true },
  { id: "6", type: "system", title: "Profile Verification", message: "Your account email has been verified. You now have access to all FixItNow features.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), isRead: true },
  { id: "7", type: "promo", title: "20% Off This Weekend", message: "Get 20% off all cleaning services this weekend. Use code CLEAN20 at checkout.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), isRead: true },
];

const TYPE_CONFIG: Record<NotifType, { icon: React.ElementType; color: string; bg: string }> = {
  booking: { icon: Calendar, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
  payment: { icon: CreditCard, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  review: { icon: Star, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
  promo: { icon: Info, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30" },
  system: { icon: AlertTriangle, color: "text-neutral-600 dark:text-neutral-400", bg: "bg-neutral-100 dark:bg-neutral-800" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Notifications</h1>
          {unreadCount > 0 && (
            <Badge className="bg-blue-600 text-white">{unreadCount} unread</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-2">
            <CheckCheck className="size-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
            <Bell className="size-8 text-neutral-400" />
          </div>
          <h3 className="mb-1 text-lg font-semibold text-neutral-900 dark:text-white">All caught up!</h3>
          <p className="text-sm text-neutral-500">No notifications to show right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const { icon: Icon, color, bg } = TYPE_CONFIG[notif.type];
            return (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={cn(
                  "group flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all",
                  notif.isRead
                    ? "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                    : "border-blue-200 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-950/20"
                )}
              >
                {/* Icon */}
                <div className={cn("mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full", bg)}>
                  <Icon className={cn("size-5", color)} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm font-semibold", notif.isRead ? "text-neutral-700 dark:text-neutral-300" : "text-neutral-900 dark:text-white")}>
                      {notif.title}
                    </p>
                    <span className="shrink-0 text-xs text-neutral-400">
                      {formatRelativeTime(notif.timestamp)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{notif.message}</p>
                </div>

                {/* Unread dot */}
                {!notif.isRead && (
                  <div className="mt-2 size-2 shrink-0 rounded-full bg-blue-600" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
