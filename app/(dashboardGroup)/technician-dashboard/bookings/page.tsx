"use client";

import { useState } from "react";
import {
  Search,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  PlayCircle,
  DollarSign,
  FileText,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { EmptyState } from "@/components/shared/empty-state";
import { CardSkeleton } from "@/components/shared/loading";
import { useBookings, useUpdateBookingStatus } from "@/hooks";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Booking, BookingStatus } from "@/types";

export default function TechnicianBookingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { data: bookingsRes, isLoading } = useBookings({
    page,
    limit: 10,
    status: statusFilter === "ALL" ? undefined : (statusFilter as BookingStatus),
  });

  const updateStatusMutation = useUpdateBookingStatus();

  const bookings: Booking[] = bookingsRes?.data ?? [];
  const meta = bookingsRes?.meta;

  const handleStatusChange = async (
    bookingId: string,
    status: "ACCEPTED" | "DECLINED" | "IN_PROGRESS" | "COMPLETED"
  ) => {
    try {
      await updateStatusMutation.mutateAsync({ id: bookingId, status });
      toast.success(`Booking marked as ${status.replace("_", " ")}`);
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking((prev) => (prev ? { ...prev, status } : null));
      }
    } catch {
      toast.error("Failed to update booking status");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      b.service?.name?.toLowerCase().includes(s) ||
      b.customer?.name?.toLowerCase().includes(s) ||
      b.customer?.email?.toLowerCase().includes(s) ||
      b.id.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
          Booking Management
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Review customer service requests, manage appointment progress, and update job statuses.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search by customer, service, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending Requests</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="DECLINED">Declined</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          title="No bookings found"
          description="Try adjusting your status filter or search query."
          className="py-12"
        />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <Card
              key={b.id}
              className="border-neutral-200 transition-all hover:border-neutral-300 dark:border-neutral-800"
            >
              <CardContent className="p-5">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                  {/* Left Column: Service & Customer Info */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                        {b.service?.name || "Home Service"}
                      </h3>
                      <BookingStatusBadge status={b.status} />
                      <PaymentStatusBadge status={b.paymentStatus} />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <User className="size-3.5" />
                        Customer: <strong className="text-neutral-800 dark:text-neutral-200">{b.customer?.name || "Customer"}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {formatDate(b.bookingDate || b.createdAt)}
                      </span>
                      {b.timeSlot && (
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" />
                          {b.timeSlot}
                        </span>
                      )}
                    </div>

                    {b.notes && (
                      <p className="text-xs italic text-neutral-500 bg-neutral-50 dark:bg-neutral-900/50 p-2 rounded border border-neutral-100 dark:border-neutral-800 inline-block">
                        &quot;{b.notes}&quot;
                      </p>
                    )}
                  </div>

                  {/* Right Column: Price & Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-3 lg:border-t-0 lg:pt-0">
                    <div className="text-left lg:text-right">
                      <span className="text-xs text-neutral-400">Total Price</span>
                      <p className="text-lg font-bold text-neutral-900 dark:text-white">
                        {formatCurrency(b.totalPrice || 0)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => setSelectedBooking(b)}
                      >
                        <Eye className="size-3.5" /> Details
                      </Button>

                      {/* 4 Dedicated Actions */}
                      {b.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1"
                            disabled={updateStatusMutation.isPending}
                            onClick={() => handleStatusChange(b.id, "ACCEPTED")}
                          >
                            <CheckCircle2 className="size-3.5" /> Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="text-xs gap-1"
                            disabled={updateStatusMutation.isPending}
                            onClick={() => handleStatusChange(b.id, "DECLINED")}
                          >
                            <XCircle className="size-3.5" /> Decline
                          </Button>
                        </>
                      )}

                      {b.status === "ACCEPTED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-950 text-xs gap-1"
                          disabled={updateStatusMutation.isPending}
                          onClick={() => handleStatusChange(b.id, "IN_PROGRESS")}
                        >
                          <PlayCircle className="size-3.5" /> Mark In Progress
                        </Button>
                      )}

                      {b.status === "IN_PROGRESS" && (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1"
                          disabled={updateStatusMutation.isPending}
                          onClick={() => handleStatusChange(b.id, "COMPLETED")}
                        >
                          <CheckCircle2 className="size-3.5" /> Mark Completed
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-neutral-500">
                Page {meta.page} of {meta.totalPages} ({meta.total} bookings)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="size-4 mr-1" /> Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next <ChevronRight className="size-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Booking Details Modal */}
      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Booking Details #{selectedBooking?.id.slice(-6)}</DialogTitle>
            <DialogDescription>
              Complete information about this customer appointment
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
                <BookingStatusBadge status={selectedBooking.status} />
              </div>

              {/* Customer Contact */}
              <div className="space-y-2 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-900">
                <h5 className="text-xs font-semibold uppercase text-neutral-500">Customer Details</h5>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <User className="size-3.5 text-neutral-400" />
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {selectedBooking.customer?.name || "Customer"}
                    </span>
                  </div>
                  {selectedBooking.customer?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="size-3.5 text-neutral-400" />
                      <span>{selectedBooking.customer.email}</span>
                    </div>
                  )}
                  {selectedBooking.customer?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="size-3.5 text-neutral-400" />
                      <span>{selectedBooking.customer.phone}</span>
                    </div>
                  )}
                  {selectedBooking.customer?.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3.5 text-neutral-400" />
                      <span>{selectedBooking.customer.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Schedule & Pricing */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                  <p className="text-neutral-500">Scheduled Date & Time</p>
                  <p className="mt-1 font-semibold text-neutral-900 dark:text-white">
                    {formatDate(selectedBooking.bookingDate || selectedBooking.createdAt)}
                  </p>
                  <p className="text-neutral-500">{selectedBooking.timeSlot || "Not specified"}</p>
                </div>
                <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                  <p className="text-neutral-500">Payment Status & Amount</p>
                  <p className="mt-1 font-semibold text-neutral-900 dark:text-white">
                    {formatCurrency(selectedBooking.totalPrice || 0)}
                  </p>
                  <div className="mt-1">
                    <PaymentStatusBadge status={selectedBooking.paymentStatus} />
                  </div>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="space-y-1">
                  <h5 className="text-xs font-semibold uppercase text-neutral-500">Customer Notes</h5>
                  <p className="rounded-lg border border-neutral-200 p-3 text-xs text-neutral-700 dark:border-neutral-800 dark:text-neutral-300">
                    {selectedBooking.notes}
                  </p>
                </div>
              )}

              {/* Status Action Buttons in Modal */}
              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                {selectedBooking.status === "PENDING" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      disabled={updateStatusMutation.isPending}
                      onClick={() => handleStatusChange(selectedBooking.id, "ACCEPTED")}
                    >
                      Accept Booking
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={updateStatusMutation.isPending}
                      onClick={() => handleStatusChange(selectedBooking.id, "DECLINED")}
                    >
                      Decline
                    </Button>
                  </>
                )}
                {selectedBooking.status === "ACCEPTED" && (
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={updateStatusMutation.isPending}
                    onClick={() => handleStatusChange(selectedBooking.id, "IN_PROGRESS")}
                  >
                    Start Service (In Progress)
                  </Button>
                )}
                {selectedBooking.status === "IN_PROGRESS" && (
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={updateStatusMutation.isPending}
                    onClick={() => handleStatusChange(selectedBooking.id, "COMPLETED")}
                  >
                    Complete Job
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
