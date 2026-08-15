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
  ListTodo,
  Archive,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useBookings,
  useAcceptBooking,
  useDeclineBooking,
  useStartWorkingBooking,
  useCompleteBooking,
  useMyTechnicianProfile,
} from "@/hooks";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Booking } from "@/types";

export default function TechnicianBookingsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { data: bookingsRes, isLoading } = useBookings({
    page,
    limit: 10,
  });

  const acceptMutation = useAcceptBooking();
  const declineMutation = useDeclineBooking();
  const startMutation = useStartWorkingBooking();
  const completeMutation = useCompleteBooking();

  const isPending =
    acceptMutation.isPending ||
    declineMutation.isPending ||
    startMutation.isPending ||
    completeMutation.isPending;

  const rawData = bookingsRes?.data;
  const bookings: Booking[] = Array.isArray(rawData) ? rawData : (Array.isArray((rawData as any)?.data) ? (rawData as any).data : []);
  const meta = bookingsRes?.meta ?? (rawData as any)?.meta ?? {};

  const handleAction = async (bookingId: string, actionType: "accept" | "decline" | "start" | "complete") => {
    try {
      if (actionType === "accept") await acceptMutation.mutateAsync(bookingId);
      if (actionType === "decline") await declineMutation.mutateAsync(bookingId);
      if (actionType === "start") await startMutation.mutateAsync(bookingId);
      if (actionType === "complete") await completeMutation.mutateAsync(bookingId);

      toast.success(`Booking successfully updated`);
      
      // Update local state if modal is open
      if (selectedBooking && selectedBooking.id === bookingId) {
        let newStatus = selectedBooking.status;
        if (actionType === "accept") newStatus = "ACCEPTED";
        if (actionType === "decline") newStatus = "DECLINED";
        if (actionType === "start") newStatus = "IN_PROGRESS";
        if (actionType === "complete") newStatus = "COMPLETED";
        
        setSelectedBooking({ ...selectedBooking, status: newStatus as any });
      }
    } catch {
      toast.error("Failed to update booking status");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    // Search filter
    if (search) {
      const s = search.toLowerCase();
      const matchesSearch =
        b.service?.name?.toLowerCase().includes(s) ||
        b.customer?.name?.toLowerCase().includes(s) ||
        b.customer?.email?.toLowerCase().includes(s) ||
        b.id.toLowerCase().includes(s);
      if (!matchesSearch) return false;
    }

    // Tab filter
    if (activeTab === "pending") return b.status === "PENDING" || b.status === "REQUESTED";
    if (activeTab === "accepted") return b.status === "ACCEPTED" || b.status === "PAID" || b.status === "IN_PROGRESS";
    if (activeTab === "history") return ["COMPLETED", "DECLINED", "CANCELLED"].includes(b.status);
    
    return true; // all
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

        <div className="w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full min-w-[320px]">
            <TabsList className="w-full h-12 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50 p-1 rounded-xl shadow-sm">
              <TabsTrigger 
                value="all" 
                className="rounded-lg gap-2 data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-500/20 dark:data-[state=active]:text-violet-300 transition-all duration-300"
              >
                <ListTodo className="size-4" /> All
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className="rounded-lg gap-2 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 dark:data-[state=active]:bg-amber-500/20 dark:data-[state=active]:text-amber-300 transition-all duration-300"
              >
                <Clock className="size-4" /> Pending
              </TabsTrigger>
              <TabsTrigger 
                value="accepted" 
                className="rounded-lg gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-500/20 dark:data-[state=active]:text-blue-300 transition-all duration-300"
              >
                <CheckCircle2 className="size-4" /> Accepted
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="rounded-lg gap-2 data-[state=active]:bg-neutral-200 data-[state=active]:text-neutral-800 dark:data-[state=active]:bg-neutral-800 dark:data-[state=active]:text-neutral-200 transition-all duration-300"
              >
                <Archive className="size-4" /> History
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
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
              className="group relative overflow-hidden border border-neutral-200/60 bg-white/60 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 dark:border-neutral-800/60 dark:bg-neutral-900/60"
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-violet-500 to-fuchsia-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardContent className="p-5">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                  {/* Left Column: Service & Customer Info */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                        {b.service?.name || "Home Service"}
                      </h3>
                      <BookingStatusBadge status={b.status} />
                      {b.status !== "PAID" && b.status !== "COMPLETED" && b.status !== "IN_PROGRESS" && (
                        <PaymentStatusBadge status={b.paymentStatus || "PENDING"} />
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <User className="size-3.5" />
                        Customer: <strong className="text-neutral-800 dark:text-neutral-200">{b.customer?.name || "Customer"}</strong>
                      </span>
                      {(() => {
                        const matchedAvailability = b.technician?.availabilities?.find((a: any) => a.id === b.availabilityId);
                        const displayDate = matchedAvailability?.date || b.availability?.date || b.bookingDate || b.createdAt;
                        const displayTime = b.timeSlot || matchedAvailability?.startTime || matchedAvailability?.timeSlots?.[0]?.startTime || b.availability?.startTime;
                        return (
                          <>
                            <span className="flex items-center gap-1">
                              <Calendar className="size-3.5" />
                              {formatDate(displayDate)}
                            </span>
                            {displayTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="size-3.5" />
                                {displayTime !== "TBD" ? formatDate(displayTime, "h:mm a") : displayTime}
                              </span>
                            )}
                          </>
                        );
                      })()}
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
                        {formatCurrency(b.price || b.totalPrice || 0)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs rounded-full border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        onClick={() => setSelectedBooking(b)}
                      >
                        <Eye className="size-3.5" /> Details
                      </Button>

                      {/* 4 Dedicated Actions */}
                      {(b.status === "PENDING" || b.status === "REQUESTED") && (
                        <>
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 rounded-full shadow-sm shadow-emerald-500/20 transition-all hover:shadow-emerald-500/40"
                            disabled={isPending}
                            onClick={() => handleAction(b.id, "accept")}
                          >
                            <CheckCircle2 className="size-3.5" /> Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="text-xs gap-1.5 rounded-full shadow-sm shadow-red-500/20 transition-all hover:shadow-red-500/40"
                            disabled={isPending}
                            onClick={() => handleAction(b.id, "decline")}
                          >
                            <XCircle className="size-3.5" /> Decline
                          </Button>
                        </>
                      )}

                      {(b.status === "ACCEPTED" || b.status === "PAID") && (
                        <div className="flex flex-col items-center gap-1">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white text-xs gap-1.5 rounded-full shadow-md shadow-violet-500/20 transition-all hover:shadow-violet-500/40"
                            disabled={isPending || (b.status !== "PAID" && !["PAID", "SUCCESS"].includes(b.paymentStatus || "PENDING"))}
                            onClick={() => handleAction(b.id, "start")}
                          >
                            <PlayCircle className="size-3.5" /> Start Service
                          </Button>
                          {b.status !== "PAID" && !["PAID", "SUCCESS"].includes(b.paymentStatus || "PENDING") && (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Waiting for Payment</span>
                          )}
                        </div>
                      )}

                      {b.status === "IN_PROGRESS" && (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 rounded-full shadow-sm shadow-emerald-500/20 transition-all hover:shadow-emerald-500/40"
                          disabled={isPending}
                          onClick={() => handleAction(b.id, "complete")}
                        >
                          <CheckCircle2 className="size-3.5" /> Complete Job
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
                  {(() => {
                    const matchedAvailability = selectedBooking.technician?.availabilities?.find((a: any) => a.id === selectedBooking.availabilityId);
                    const displayDate = matchedAvailability?.date || selectedBooking.availability?.date || selectedBooking.bookingDate || selectedBooking.createdAt;
                    const displayTime = selectedBooking.timeSlot || matchedAvailability?.startTime || matchedAvailability?.timeSlots?.[0]?.startTime || selectedBooking.availability?.startTime;
                    return (
                      <>
                        <p className="text-neutral-500">Scheduled Date & Time</p>
                        <p className="mt-1 font-semibold text-neutral-900 dark:text-white">
                          {formatDate(displayDate)}
                        </p>
                        <p className="text-neutral-500">{displayTime ? (displayTime !== "TBD" ? formatDate(displayTime, "h:mm a") : displayTime) : "Not specified"}</p>
                      </>
                    );
                  })()}
                </div>
                <div className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                  <p className="text-neutral-500">Payment Status & Amount</p>
                  <p className="mt-1 font-semibold text-neutral-900 dark:text-white">
                    {formatCurrency(selectedBooking.price || selectedBooking.totalPrice || 0)}
                  </p>
                  <div className="mt-1">
                    {selectedBooking.status !== "PAID" && selectedBooking.status !== "COMPLETED" && selectedBooking.status !== "IN_PROGRESS" && (
                      <PaymentStatusBadge status={selectedBooking.paymentStatus || "PENDING"} />
                    )}
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
                {(selectedBooking.status === "PENDING" || selectedBooking.status === "REQUESTED") && (
                  <>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      disabled={isPending}
                      onClick={() => handleAction(selectedBooking.id, "accept")}
                    >
                      Accept Booking
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={isPending}
                      onClick={() => handleAction(selectedBooking.id, "decline")}
                    >
                      Decline
                    </Button>
                  </>
                )}
                {(selectedBooking.status === "ACCEPTED" || selectedBooking.status === "PAID") && (
                  <div className="flex items-center gap-2">
                    {selectedBooking.status !== "PAID" && !["PAID", "SUCCESS"].includes(selectedBooking.paymentStatus || "PENDING") && (
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Payment Required</span>
                    )}
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={isPending || (selectedBooking.status !== "PAID" && !["PAID", "SUCCESS"].includes(selectedBooking.paymentStatus || "PENDING"))}
                      onClick={() => handleAction(selectedBooking.id, "start")}
                    >
                      Start Service
                    </Button>
                  </div>
                )}
                {selectedBooking.status === "IN_PROGRESS" && (
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={isPending}
                    onClick={() => handleAction(selectedBooking.id, "complete")}
                  >
                    Completed
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
