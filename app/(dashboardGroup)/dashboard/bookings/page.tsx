"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { Calendar } from "lucide-react";

const bookings = [
  { id: "1", service: "Plumbing Repair", technician: "Karim Ahmed", date: "Aug 02, 2026", time: "10:00 AM", status: "PENDING", payment: "PENDING" },
  { id: "2", service: "AC Maintenance", technician: "Sumon Das", date: "Jul 28, 2026", time: "2:00 PM", status: "COMPLETED", payment: "PAID" },
  { id: "3", service: "Electrical Wiring", technician: "Rafiq Islam", date: "Jul 25, 2026", time: "11:00 AM", status: "COMPLETED", payment: "PAID" },
  { id: "4", service: "House Cleaning", technician: "Nasir Khan", date: "Jul 20, 2026", time: "9:00 AM", status: "CANCELLED", payment: "REFUNDED" },
];

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ACCEPTED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  CANCELLED: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400",
  IN_PROGRESS: "bg-purple-100 text-purple-700",
};

const paymentColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  PAID: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  REFUNDED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export default function BookingsPage() {
  if (bookings.length === 0) {
    return <EmptyState icon={Calendar} title="No bookings yet" description="Book your first service to get started" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">My Bookings</h1>
        <p className="text-neutral-500">View and manage your service bookings</p>
      </div>

      <Card>
        <CardHeader><CardTitle>All Bookings</CardTitle></CardHeader>
        <CardContent>
          {/* Mobile Cards */}
          <div className="space-y-3 lg:hidden">
            {bookings.map((b) => (
              <div key={b.id} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800 space-y-2">
                <div className="flex justify-between items-start">
                  <div><p className="font-medium text-neutral-900 dark:text-white">{b.service}</p><p className="text-sm text-neutral-500">{b.technician}</p></div>
                  <Badge variant="secondary" className={statusColors[b.status]}>{b.status}</Badge>
                </div>
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>{b.date} at {b.time}</span>
                  <Badge variant="secondary" className={paymentColors[b.payment]}>{b.payment}</Badge>
                </div>
                {b.status === "PENDING" && <Button variant="destructive" size="sm" className="w-full">Cancel</Button>}
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-neutral-200 dark:border-neutral-800 text-left text-sm text-neutral-500">
                <th className="pb-3 font-medium">Service</th><th className="pb-3 font-medium">Technician</th><th className="pb-3 font-medium">Date</th><th className="pb-3 font-medium">Time</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Payment</th><th className="pb-3 font-medium">Action</th>
              </tr></thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-neutral-100 dark:border-neutral-800/50">
                    <td className="py-3 font-medium text-neutral-900 dark:text-white">{b.service}</td>
                    <td className="py-3 text-neutral-600 dark:text-neutral-400">{b.technician}</td>
                    <td className="py-3 text-neutral-600 dark:text-neutral-400">{b.date}</td>
                    <td className="py-3 text-neutral-600 dark:text-neutral-400">{b.time}</td>
                    <td className="py-3"><Badge variant="secondary" className={statusColors[b.status]}>{b.status}</Badge></td>
                    <td className="py-3"><Badge variant="secondary" className={paymentColors[b.payment]}>{b.payment}</Badge></td>
                    <td className="py-3">{b.status === "PENDING" ? <Button variant="destructive" size="sm">Cancel</Button> : b.status === "COMPLETED" ? <Button variant="outline" size="sm">Review</Button> : <span className="text-sm text-neutral-400">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
