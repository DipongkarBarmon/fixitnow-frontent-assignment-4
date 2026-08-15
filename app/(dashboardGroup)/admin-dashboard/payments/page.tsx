"use client";

import { useState } from "react";
import {
  CreditCard,
  Search,
  Filter,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Wallet,
  Building,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentStatusBadge } from "@/components/shared/payment-status-badge";
import { StatCard } from "@/components/cards/stat-card";
import { usePayments } from "@/hooks";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Payment, PaymentStatus } from "@/types";

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);

  const { data: paymentsRes, isLoading } = usePayments({
    page,
    limit: 10,
    status: statusFilter === "ALL" ? undefined : (statusFilter as PaymentStatus),
  });

  const payments: Payment[] = paymentsRes?.data ?? [];
  const meta = paymentsRes?.meta;

  const settledPayments = payments.filter((p) => p.status === "PAID" || p.status === "SUCCESS");
  const totalVolume = settledPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const paidCount = settledPayments.length;

  const filteredPayments = payments.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      p.transactionId?.toLowerCase().includes(s) ||
      p.id.toLowerCase().includes(s) ||
      p.method?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
          Payments & Transactions
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Audit customer payments, SSLCommerz / Stripe transactions, and payout settlements.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={TrendingUp}
          label="Total Settled Volume"
          value={formatCurrency(totalVolume)}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
        />
        <StatCard
          icon={CheckCircle2}
          label="Successful Payments"
          value={paidCount.toString()}
          iconColor="text-blue-600"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatCard
          icon={Wallet}
          label="Platform Revenue (10%)"
          value={formatCurrency(Math.round(totalVolume * 0.1))}
          iconColor="text-purple-600"
          iconBg="bg-purple-100 dark:bg-purple-900/30"
        />
      </div>

      {/* Filter */}
      <Card className="border-neutral-200 dark:border-neutral-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Filter by Status
            </span>
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Payments</SelectItem>
                <SelectItem value="PAID">Paid / Completed</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payment List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Transaction Logs
            {meta && <span className="text-sm font-normal text-neutral-500">{meta.total} total</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by transaction ID or method..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-800 dark:bg-neutral-900"
            />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                  <div className="space-y-1.5">
                    <div className="h-4 w-36 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-3 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-5 w-16 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CreditCard className="mb-4 size-12 text-neutral-300 dark:text-neutral-700" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">No payment records found</h3>
              <p className="mt-2 text-sm text-neutral-500">All completed checkout transactions will be logged here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPayments.map((p) => {
                const icon = p.method === "STRIPE" ? "💳" : p.method === "SSLCOMMERZ" ? "🏦" : "💰";
                return (
                  <div key={p.id} className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xl dark:bg-neutral-800">
                        {icon}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {p.transactionId || `TXN_${p.id.slice(-8)}`}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {p.method ?? "—"} • {formatDate(p.createdAt)}
                          {p.bookingId && ` • Order #${p.bookingId.slice(-6)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:shrink-0">
                      <span className="text-lg font-bold text-neutral-900 dark:text-white">
                        {formatCurrency(p.amount || 0)}
                      </span>
                      <PaymentStatusBadge status={p.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!isLoading && (meta?.totalPages || 1) > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-neutral-500">Page {page} of {meta?.totalPages || 1}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(meta?.totalPages || 1, p + 1))} disabled={page >= (meta?.totalPages || 1)}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
