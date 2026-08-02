"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";

const bookings = [
  { id: "1", service: "Plumbing Repair", customer: "Mohammad Ali", date: "Aug 03, 2026", time: "10:00 AM", status: "PENDING", amount: 1500 },
  { id: "2", service: "Pipe Replacement", customer: "Sarah Khan", date: "Aug 05, 2026", time: "2:00 PM", status: "ACCEPTED", amount: 2500 },
  { id: "3", service: "Drain Cleaning", customer: "Rahim Uddin", date: "Jul 30, 2026", time: "11:00 AM", status: "IN_PROGRESS", amount: 800 },
  { id: "4", service: "Faucet Repair", customer: "Fatima Akter", date: "Jul 28, 2026", time: "3:00 PM", status: "COMPLETED", amount: 600 },
];

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ACCEPTED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  IN_PROGRESS: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  DECLINED: "bg-red-100 text-red-700",
};

export default function TechnicianBookingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Booking Management</h1>
      <Card>
        <CardHeader><CardTitle>All Bookings</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">{b.service}</p>
                    <p className="text-sm text-neutral-500">Customer: {b.customer} • {b.date} at {b.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{formatCurrency(b.amount)}</span>
                    <Badge variant="secondary" className={statusColors[b.status]}>{b.status.replace("_", " ")}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {b.status === "PENDING" && (
                    <><Button size="sm">Accept</Button><Button size="sm" variant="destructive">Decline</Button></>
                  )}
                  {b.status === "ACCEPTED" && <Button size="sm" variant="outline">Mark In Progress</Button>}
                  {b.status === "IN_PROGRESS" && <Button size="sm">Mark Completed</Button>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
