"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Search, X, Eye, XCircle, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { PaymentStatusBadge } from "@/components/shared/payment-status-badge";
import { useBookings, useCancelBooking } from "@/hooks";
import { formatDate, formatCurrency } from "@/utils/format";
import type { BookingStatus } from "@/types";

const PAGE_SIZE = 8;

export default function BookingsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const cancelMutation = useCancelBooking(cancelId ?? "");

  const { data, isLoading, isError } = useBookings({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    page,
    limit: PAGE_SIZE,
  });

  const bookings = (data?.data ?? []).filter((b) => {
    const q = search.toLowerCase();
    return !search || b.service?.name?.toLowerCase().includes(q) || b.technician?.user?.name?.toLowerCase().includes(q);
  });
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleConfirmCancel = () => {
    if (!cancelId) return;
    cancelMutation.mutate(undefined, {
      onSuccess: () => { toast.success("Booking cancelled."); setCancelId(null); },
      onError: () => { toast.error("Failed to cancel. Please try again."); setCancelId(null); },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">My Bookings</h1>
        <p className="text-neutral-500">View and manage your service bookings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <Input placeholder="Search service or technician…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" id="booking-search" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"><X className="size-4" /></button>}
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as BookingStatus | "ALL"); setPage(1); }}>
          <SelectTrigger className="w-[180px]" id="booking-status-filter">
            <SlidersHorizontal className="mr-2 size-4 text-neutral-400" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            {["ALL", "PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "DECLINED"].map((s) => (
              <SelectItem key={s} value={s}>{s === "ALL" ? "All Statuses" : s.replace("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            All Bookings
            {data?.meta && <span className="text-sm font-normal text-neutral-500">{data.meta.total} total</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">Failed to load bookings.</div>
          ) : (
            <>
              {/* Mobile */}
              <div className="space-y-3 lg:hidden">
                {isLoading ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800 space-y-2">
                    <Skeleton className="h-4 w-36" /><Skeleton className="h-3 w-48" /><Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                )) : bookings.length === 0 ? <EmptyState icon={Calendar} title="No bookings found" description="Try adjusting your filters." />
                  : bookings.map((b) => (
                    <div key={b.id} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white">{b.service?.name ?? "Service"}</p>
                          <p className="text-sm text-neutral-500">{b.technician?.user?.name ?? "—"}</p>
                        </div>
                        <BookingStatusBadge status={b.status} />
                      </div>
                      <div className="flex justify-between text-sm text-neutral-500">
                        <span>{formatDate(b.bookingDate)} • {b.startTime}</span>
                        <PaymentStatusBadge status={b.paymentStatus} />
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-sm font-semibold">{formatCurrency(b.totalPrice)}</span>
                        <div className="flex gap-2">
                          <Button asChild variant="outline" size="sm"><Link href={`/dashboard/bookings/${b.id}`}><Eye className="size-3.5 mr-1" />View</Link></Button>
                          {(b.status === "PENDING" || b.status === "ACCEPTED") && (
                            <Button variant="destructive" size="sm" onClick={() => setCancelId(b.id)}>Cancel</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-left text-sm text-neutral-500">
                      {["Service", "Technician", "Date", "Time", "Amount", "Status", "Payment", "Actions"].map((h) => (
                        <th key={h} className="pb-3 pr-4 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                      <tr key={i} className="border-b border-neutral-100 dark:border-neutral-800/50">
                        {Array.from({ length: 8 }).map((__, j) => (
                          <td key={j} className="py-3 pr-4"><Skeleton className="h-4 w-20" /></td>
                        ))}
                      </tr>
                    )) : bookings.length === 0 ? (
                      <tr><td colSpan={8} className="py-12"><EmptyState icon={Calendar} title="No bookings found" description="Try adjusting your search or filters." /></td></tr>
                    ) : bookings.map((b) => (
                      <tr key={b.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800/50 dark:hover:bg-neutral-900">
                        <td className="py-3 pr-4 font-medium text-neutral-900 dark:text-white">{b.service?.name ?? "—"}</td>
                        <td className="py-3 pr-4 text-neutral-600 dark:text-neutral-400">{b.technician?.user?.name ?? "—"}</td>
                        <td className="py-3 pr-4 text-neutral-600 dark:text-neutral-400">{formatDate(b.bookingDate)}</td>
                        <td className="py-3 pr-4 text-neutral-600 dark:text-neutral-400">{b.startTime}</td>
                        <td className="py-3 pr-4 font-medium text-neutral-900 dark:text-white">{formatCurrency(b.totalPrice)}</td>
                        <td className="py-3 pr-4"><BookingStatusBadge status={b.status} /></td>
                        <td className="py-3 pr-4"><PaymentStatusBadge status={b.paymentStatus} /></td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <Button asChild variant="ghost" size="icon" title="View details">
                              <Link href={`/dashboard/bookings/${b.id}`}><Eye className="size-4" /></Link>
                            </Button>
                            {(b.status === "PENDING" || b.status === "ACCEPTED") && (
                              <Button variant="ghost" size="icon" onClick={() => setCancelId(b.id)}
                                className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950">
                                <XCircle className="size-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!isLoading && totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-neutral-500">Page {page} of {totalPages}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!cancelId}
        onOpenChange={(open) => { if (!open) setCancelId(null); }}
        title="Cancel Booking"
        description="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmLabel={cancelMutation.isPending ? "Cancelling…" : "Yes, Cancel"}
        variant="destructive"
        onConfirm={handleConfirmCancel}
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
}
