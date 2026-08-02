"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/format";

const payments = [
  { id: "1", service: "Plumbing Repair", amount: 1500, method: "Stripe", date: "Jul 28, 2026", status: "PAID", txn: "TXN-001234" },
  { id: "2", service: "Electrical Wiring", amount: 2200, method: "SSLCommerz", date: "Jul 25, 2026", status: "PAID", txn: "TXN-001235" },
  { id: "3", service: "House Cleaning", amount: 1200, method: "Stripe", date: "Jul 20, 2026", status: "REFUNDED", txn: "TXN-001236" },
];

const statusColors: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  PENDING: "bg-amber-100 text-amber-700",
  REFUNDED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  FAILED: "bg-red-100 text-red-700",
};

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Payment History</h1>
        <p className="text-neutral-500">View all your payment transactions</p>
      </div>
      <Card>
        <CardHeader><CardTitle>All Payments</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payments.map((p) => (
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-neutral-200 p-4 dark:border-neutral-800 gap-2">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">{p.service}</p>
                  <p className="text-sm text-neutral-500">{p.date} • {p.method} • {p.txn}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-neutral-900 dark:text-white">{formatCurrency(p.amount)}</span>
                  <Badge variant="secondary" className={statusColors[p.status]}>{p.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
