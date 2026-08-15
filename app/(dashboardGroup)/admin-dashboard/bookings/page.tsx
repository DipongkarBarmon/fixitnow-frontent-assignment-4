"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { PaymentStatusBadge } from "@/components/shared/payment-status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useBookings, useUpdateBookingStatus } from "@/hooks";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Booking, BookingStatus } from "@/types";

export default function AdminBookingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);

  const { data: bookingsRes, isLoading } = useBookings({
    page,
    limit: 10,
    status: statusFilter === "ALL" ? undefined : (statusFilter as BookingStatus),
  });

  const updateStatusMutation = useUpdateBookingStatus();

  const rawData = bookingsRes?.data;
  const bookings: Booking[] = Array.isArray(rawData) ? rawData : (Array.isArray((rawData as any)?.data) ? (rawData as any).data : []);
  const meta = bookingsRes?.meta ?? (rawData as any)?.meta ?? {};

  const handleAdminCancel = async () => {
    if (!cancellingBooking) return;
    try {
      await updateStatusMutation.mutateAsync({
        id: cancellingBooking.id,
        status: "CANCELLED",
      });
      toast.success(`Booking #${cancellingBooking.id.slice(-6)} cancelled by administrator`);
      setCancellingBooking(null);
      if (selectedBooking && selectedBooking.id === cancellingBooking.id) {
        setSelectedBooking((prev) => (prev ? { ...prev, status: "CANCELLED" } : null));
      }
    } catch {
      toast.error("Failed to cancel booking");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      b.id?.toLowerCase().includes(s) ||
      b.service?.name?.toLowerCase().includes(s) ||
      b.service?.title?.toLowerCase().includes(s) ||
      b.customer?.name?.toLowerCase().includes(s) ||
      b.customer?.email?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            Bookings Oversight
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Monitor and manage all service orders across the FixItNow platform.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
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
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="DECLINED">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grid List */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-4 dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                  </div>
                  <div className="h-6 w-20 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
                </div>
                <div className="h-4 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="flex justify-between items-end pt-4 border-t border-neutral-100 dark:border-neutral-800/60">
                  <div className="space-y-1">
                    <div className="h-3 w-12 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-5 w-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                  </div>
                  <div className="h-6 w-20 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
                </div>
                <div className="h-10 w-full animate-pulse rounded-lg mt-2 bg-neutral-200 dark:bg-neutral-800" />
              </div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar className="mb-4 size-12 text-neutral-300 dark:text-neutral-700" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">No bookings found</h3>
            <p className="mt-2 text-sm text-neutral-500">Try clearing your search or status filter.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredBookings.map((b) => {
              const currentPaymentStatus = b.paymentStatus || "PENDING";
              const isPaid = currentPaymentStatus === "PAID" || currentPaymentStatus === "SUCCESS" || (b.status as string) === "PAID";
              const borderClass = isPaid ? "border-emerald-400 dark:border-emerald-600/50 shadow-emerald-500/10 dark:shadow-emerald-900/20" : "border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]";

              return (
                <div key={b.id} className={`group relative flex flex-col overflow-hidden rounded-[1.5rem] border bg-white/60 p-1 backdrop-blur-xl transition-all hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 dark:bg-neutral-900/50 ${borderClass}`}>
                  <div className="absolute -left-10 -top-10 -z-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition-opacity group-hover:bg-blue-500/20 dark:bg-blue-500/5" />
                  
                  <div className="flex-1 rounded-2xl bg-white/40 p-5 dark:bg-neutral-950/40">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white line-clamp-1">{b.service?.title || b.service?.name || "Service"}</h3>
                        <p className="text-sm font-medium text-neutral-500 line-clamp-1">Customer: {b.customer?.name || "—"}</p>
                      </div>
                      <BookingStatusBadge status={b.status} />
                    </div>
                    
                    <div className="mb-4 flex items-center justify-between rounded-xl bg-neutral-50/50 px-4 py-3 dark:bg-neutral-900/50">
                      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                        <Calendar className="size-4 text-blue-500" />
                        <span className="font-medium">{formatDate(b.bookingDate || b.createdAt)}</span>
                      </div>
                      <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                        {b.timeSlot || "Standard slot"}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Amount</span>
                        <p className="text-xl font-black text-neutral-900 dark:text-white">{formatCurrency(Number(b.totalPrice || b.price || 0))}</p>
                      </div>
                      <PaymentStatusBadge status={currentPaymentStatus} />
                    </div>
                  </div>

                  <div className="mt-1 flex gap-1 p-1">
                    <Button variant="secondary" onClick={() => setSelectedBooking(b)} className="h-12 flex-1 rounded-xl bg-neutral-100 font-semibold text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700">
                      <Eye className="mr-2 size-4" /> Details
                    </Button>
                    
                    {b.status !== "CANCELLED" && b.status !== "COMPLETED" && (
                      <Button variant="outline" onClick={() => setCancellingBooking(b)} className="h-12 flex-1 rounded-xl border-red-200 font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/30">
                        <XCircle className="mr-2 size-4" /> Cancel
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!isLoading && (meta?.totalPages || 1) > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-6">
          <p className="text-sm font-medium text-neutral-500">Page {page} of {meta?.totalPages || 1}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setPage((p) => Math.min(meta?.totalPages || 1, p + 1))} disabled={page >= (meta?.totalPages || 1)}>Next</Button>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Booking Details #{selectedBooking?.id.slice(-6)}</DialogTitle>
            <DialogDescription>
              Platform order inspection and customer service info
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 py-2 text-sm">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white">
                    {selectedBooking.service?.title || selectedBooking.service?.name}
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Category: {selectedBooking.service?.category?.name || "General"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <BookingStatusBadge status={selectedBooking.status} />
                  <PaymentStatusBadge status={selectedBooking.paymentStatus} />
                </div>
              </div>

              {/* Customer Contact */}
              <div className="space-y-2 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-900">
                <h5 className="text-xs font-semibold uppercase text-neutral-500">Customer</h5>
                <div className="space-y-1 text-xs">
                  <p className="font-medium text-neutral-900 dark:text-white">
                    {selectedBooking.customer?.name || "Customer"}
                  </p>
                  <p className="text-neutral-500">{selectedBooking.customer?.email}</p>
                  <p className="text-neutral-500">{selectedBooking.customer?.phone || "No phone provided"}</p>
                </div>
              </div>

              {/* Schedule & Financials */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                  <p className="text-neutral-500">Scheduled Date</p>
                  <p className="mt-1 font-semibold text-neutral-900 dark:text-white">
                    {formatDate(selectedBooking.bookingDate || selectedBooking.createdAt)}
                  </p>
                  <p className="text-neutral-500">{selectedBooking.timeSlot || "Standard slot"}</p>
                </div>
                <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                  <p className="text-neutral-500">Order Amount</p>
                  <p className="mt-1 font-bold text-neutral-900 dark:text-white text-base">
                    {formatCurrency(Number(selectedBooking.totalPrice || selectedBooking.price || 0))}
                  </p>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="space-y-1">
                  <h5 className="text-xs font-semibold uppercase text-neutral-500">Customer Note</h5>
                  <p className="rounded-lg border border-neutral-200 p-3 text-xs text-neutral-700 dark:border-neutral-800 dark:text-neutral-300">
                    {selectedBooking.notes}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <Button variant="outline" size="sm" onClick={() => setSelectedBooking(null)}>
                  Close
                </Button>
                {selectedBooking.status !== "CANCELLED" && selectedBooking.status !== "COMPLETED" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setCancellingBooking(selectedBooking);
                    }}
                  >
                    Admin Cancel
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Admin Cancel Confirmation */}
      <ConfirmDialog
        open={!!cancellingBooking}
        onOpenChange={(open) => !open && setCancellingBooking(null)}
        title="Admin Override: Cancel Booking"
        description={`Are you sure you want to forcibly cancel booking #${cancellingBooking?.id.slice(-6)}? This will notify both customer and technician.`}
        confirmLabel="Cancel Booking"
        variant="destructive"
        isLoading={updateStatusMutation.isPending}
        onConfirm={handleAdminCancel}
      />
    </div>
  );
}
