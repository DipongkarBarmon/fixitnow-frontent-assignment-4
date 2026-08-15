"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PaymentStatusBadge } from "@/components/shared/payment-status-badge";
import { usePayments, useInitiatePayment } from "@/hooks";
import { formatDate, formatCurrency } from "@/utils/format";
import type { PaymentStatus, PaymentMethod } from "@/types";

const PAGE_SIZE = 10;

const METHOD_ICONS: Record<PaymentMethod, string> = { STRIPE: "💳", SSLCOMMERZ: "🏦" };

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">("ALL");
  const [payBookingId, setPayBookingId] = useState<string | null>(null);
  const paymentMutation = useInitiatePayment();

  const { data, isLoading, isError } = usePayments({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    page, limit: PAGE_SIZE,
  });

  const payments = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const totalPaid = payments.filter((p) => p.status === "PAID" || p.status === "SUCCESS").reduce((s, p) => s + p.amount, 0);

  const handlePay = (method: PaymentMethod) => {
    if (!payBookingId) return;
    paymentMutation.mutate(
      { bookingId: payBookingId, method },
      {
        onSuccess: (res: any) => {
          const redirectUrl = res.data?.url || res.data?.redirectUrl || (typeof res.data === "string" ? res.data : null);
          if (redirectUrl) { window.location.href = redirectUrl; }
          else { toast.success("Payment initiated!"); setPayBookingId(null); }
        },
        onError: () => toast.error("Payment initiation failed."),
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Payment History</h1>
        <p className="text-neutral-500">View all your payment transactions</p>
      </div>

      {/* Summary */}
      {!isLoading && !isError && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total Paid", value: formatCurrency(totalPaid), color: "text-emerald-600" },
            { label: "Total Payments", value: String(data?.meta?.total || payments.length || 0), color: "text-blue-600" },
            { label: "Pending Payments", value: String(payments.filter((p) => p.status === "PENDING").length), color: "text-amber-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <p className="text-sm text-neutral-500">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as PaymentStatus | "ALL"); setPage(1); }}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
          <SelectContent>
            {["ALL", "PAID", "SUCCESS", "PENDING", "FAILED", "REFUNDED"].map((s) => (
              <SelectItem key={s} value={s}>{s === "ALL" ? "All Statuses" : s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            All Payments
            {data?.meta && <span className="text-sm font-normal text-neutral-500">{data.meta.total} total</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">Failed to load payments.</div>
          ) : isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                  <div className="space-y-1.5"><Skeleton className="h-4 w-36" /><Skeleton className="h-3 w-48" /></div>
                  <div className="flex items-center gap-3"><Skeleton className="h-6 w-24" /><Skeleton className="h-5 w-16 rounded-full" /></div>
                </div>
              ))}
            </div>
          ) : payments.length === 0 ? (
            <EmptyState icon={CreditCard} title="No payments found" description="Your payment history will appear here." />
          ) : (
            <div className="space-y-3">
              {payments.map((p) => (
                <div key={p.id} className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xl dark:bg-neutral-800">
                      {p.method ? METHOD_ICONS[p.method] : "💰"}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">{p.booking?.service?.name ?? "Service Payment"}</p>
                      <p className="text-sm text-neutral-500">
                        {p.method ?? "—"} • {formatDate(p.createdAt)}
                        {p.transactionId && ` • ${p.transactionId}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:shrink-0">
                    <span className="text-lg font-bold text-neutral-900 dark:text-white">{formatCurrency(p.amount)}</span>
                    <PaymentStatusBadge status={p.status} />
                    {p.status === "PENDING" && p.bookingId && (
                      <Button size="sm" onClick={() => setPayBookingId(p.bookingId)}>Pay Now</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-neutral-500">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method Dialog */}
      <Dialog open={!!payBookingId} onOpenChange={(open) => { if (!open) setPayBookingId(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Choose Payment Method</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            {(["STRIPE", "SSLCOMMERZ"] as PaymentMethod[]).map((method) => (
              <button key={method} onClick={() => handlePay(method)} disabled={paymentMutation.isPending}
                className="flex w-full items-center gap-4 rounded-xl border border-neutral-200 p-4 text-left transition-colors hover:border-blue-500 hover:bg-blue-50/50 disabled:opacity-50 dark:border-neutral-700 dark:hover:border-blue-500">
                <span className="text-3xl">{METHOD_ICONS[method]}</span>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">{method === "STRIPE" ? "Stripe" : "SSLCommerz"}</p>
                  <p className="text-sm text-neutral-500">{method === "STRIPE" ? "Credit/debit card via Stripe" : "Bangladesh's trusted payment gateway"}</p>
                </div>
                {paymentMutation.isPending && <Loader2 className="ml-auto size-4 animate-spin text-blue-600" />}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-neutral-400">Secured by 256-bit SSL encryption</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
