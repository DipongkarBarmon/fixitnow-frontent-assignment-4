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
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
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
      b.service?.name?.toLowerCase().includes(s) ||
      b.customer?.name?.toLowerCase().includes(s) ||
      b.id.toLowerCase().includes(s)
    );
  });

  const columns: ColumnDef<Booking>[] = [
    {
      key: "id",
      header: "Booking ID",
      cell: (b) => (
        <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-white">
          #{b.id.slice(-6)}
        </span>
      ),
    },
    {
      key: "service",
      header: "Service",
      cell: (b) => (
        <div>
          <p className="font-semibold text-neutral-900 dark:text-white text-sm">
            {b.service?.name || "Home Service"}
          </p>
          <p className="text-xs text-neutral-500">
            {b.service?.category?.name || "General"}
          </p>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      cell: (b) => (
        <div>
          <p className="font-medium text-neutral-900 dark:text-white text-xs">
            {b.customer?.name || "Customer"}
          </p>
          <p className="text-xs text-neutral-500">{b.customer?.email || "—"}</p>
        </div>
      ),
    },
    {
      key: "schedule",
      header: "Scheduled For",
      hideOnMobile: true,
      cell: (b) => (
        <div className="text-xs">
          <p className="text-neutral-900 dark:text-white font-medium">
            {formatDate(b.bookingDate || b.createdAt)}
          </p>
          <p className="text-neutral-500">{b.timeSlot || "Standard slot"}</p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Total",
      cell: (b) => (
        <span className="font-bold text-neutral-900 dark:text-white text-sm">
          {formatCurrency(b.totalPrice || 0)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (b) => <BookingStatusBadge status={b.status} />,
    },
    {
      key: "paymentStatus",
      header: "Payment",
      hideOnMobile: true,
      cell: (b) => <PaymentStatusBadge status={b.paymentStatus} />,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (b) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            onClick={() => setSelectedBooking(b)}
            title="View Details"
          >
            <Eye className="size-4" />
          </Button>

          {b.status !== "CANCELLED" && b.status !== "COMPLETED" && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
              onClick={() => setCancellingBooking(b)}
              title="Admin Cancel"
            >
              <XCircle className="size-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

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

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredBookings}
        rowKey="id"
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search by service or customer..."
        emptyMessage="No bookings found"
        emptyDescription="Try clearing your search or status filter."
        meta={meta}
        onPageChange={setPage}
      />

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
                    {selectedBooking.service?.name}
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
                    {formatCurrency(selectedBooking.totalPrice || 0)}
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
