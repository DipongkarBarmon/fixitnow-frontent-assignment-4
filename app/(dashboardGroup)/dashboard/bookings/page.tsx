"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Search, X, Eye, XCircle, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { PaymentStatusBadge } from "@/components/shared/payment-status-badge";
import { useBookings, useCancelBooking, useInitiatePayment } from "@/hooks";
import { formatDate, formatCurrency } from "@/utils/format";
import type { Booking, PaymentMethod, BookingStatus } from "@/types";

const PAGE_SIZE = 12;

const PAYMENT_METHODS: { method: PaymentMethod; label: string; logo: string; description: string }[] = [
  { method: "STRIPE", label: "Stripe", logo: "💳", description: "Pay securely with card via Stripe" },
  { method: "SSLCOMMERZ", label: "SSLCommerz", logo: "🏦", description: "Bangladesh's trusted payment gateway" },
];

export default function BookingsPage() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [paymentBookingId, setPaymentBookingId] = useState<string | null>(null);

  const cancelMutation = useCancelBooking(cancelId ?? "");
  const paymentMutation = useInitiatePayment();

  const { data, isLoading, isError } = useBookings({
    page,
    limit: PAGE_SIZE,
  });

  const bookings = (data?.data ?? []).filter((b) => {
    const q = search.toLowerCase();
    const matchSearch = !search || b.service?.name?.toLowerCase().includes(q) || b.technician?.user?.name?.toLowerCase().includes(q);
    if (!matchSearch) return false;
    
    const currentPaymentStatus = b.paymentStatus || "PENDING";

    if (activeTab === "pending") return b.status === "PENDING" || b.status === "REQUESTED";
    if (activeTab === "payment-now") return b.status === "ACCEPTED" && currentPaymentStatus === "PENDING";
    if (activeTab === "active") return (b.status === "ACCEPTED" && currentPaymentStatus === "PAID") || b.status === "IN_PROGRESS";
    if (activeTab === "history") return ["COMPLETED", "CANCELLED", "DECLINED"].includes(b.status);
    
    return true; // all
  });
  
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1);
  };

  const handleConfirmCancel = () => {
    if (!cancelId) return;
    cancelMutation.mutate(undefined, {
      onSuccess: () => { toast.success("Booking cancelled."); setCancelId(null); },
      onError: () => { toast.error("Failed to cancel. Please try again."); setCancelId(null); },
    });
  };

  const handlePay = (method: PaymentMethod) => {
    if (!paymentBookingId) return;
    paymentMutation.mutate(
      { bookingId: paymentBookingId, method },
      {
        onSuccess: (res) => {
          if (res.data?.redirectUrl) {
            window.location.href = res.data.redirectUrl;
          } else {
            toast.success("Payment initiated!");
            setPaymentBookingId(null);
          }
        },
        onError: () => toast.error("Payment initiation failed. Please try again."),
      }
    );
  };

  const renderCard = (b: Booking) => {
    // "REQUESTED" maps to pending visually in terms of actions
    const currentPaymentStatus = b.paymentStatus || "PENDING";
    const canCancel = b.status === "REQUESTED" || b.status === "PENDING" || b.status === "ACCEPTED";
    const canPay = currentPaymentStatus === "PENDING" && b.status === "ACCEPTED";
    
    // Graceful fallback for missing fields in DB
    const displayDate = b.availability?.date || b.bookingDate || b.createdAt;
    const displayTime = b.availability?.startTime || "TBD";
    const amount = Number(b.price) || 0;

    return (
      <div key={b.id} className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-white/40 bg-white/60 p-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 dark:border-white/10 dark:bg-neutral-900/50">
        {/* Subtle gradient glow behind the content */}
        <div className="absolute -left-10 -top-10 -z-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition-opacity group-hover:bg-blue-500/20 dark:bg-blue-500/5" />
        
        <div className="flex-1 rounded-2xl bg-white/40 p-5 dark:bg-neutral-950/40">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white line-clamp-1">{b.service?.name ?? "Custom Service"}</h3>
              <p className="text-sm font-medium text-neutral-500 line-clamp-1">by {b.technician?.user?.name ?? "Technician"}</p>
            </div>
            <BookingStatusBadge status={b.status} />
          </div>
          
          <div className="mb-4 flex items-center justify-between rounded-xl bg-neutral-50/50 px-4 py-3 dark:bg-neutral-900/50">
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              <Calendar className="size-4 text-blue-500" />
              <span className="font-medium">{formatDate(displayDate)}</span>
            </div>
            <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {displayTime}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Amount</span>
              <p className="text-xl font-black text-neutral-900 dark:text-white">{formatCurrency(amount)}</p>
            </div>
            <PaymentStatusBadge status={currentPaymentStatus} />
          </div>
        </div>

        <div className="mt-1 flex gap-1 p-1">
          <Button variant="secondary" asChild className="h-12 flex-1 rounded-xl bg-neutral-100 font-semibold text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700">
            <Link href={`/dashboard/bookings/${b.id}`}>
              <Eye className="mr-2 size-4" /> Details
            </Link>
          </Button>
          {canPay ? (
            <Button variant="default" onClick={() => setPaymentBookingId(b.id)} className="h-12 flex-1 rounded-xl bg-blue-600 font-semibold text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              <CreditCard className="mr-2 size-4" /> Pay Now
            </Button>
          ) : canCancel ? (
            <Button variant="outline" onClick={() => setCancelId(b.id)} className="h-12 flex-1 rounded-xl border-red-200 font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/30">
              <XCircle className="mr-2 size-4" /> Cancel
            </Button>
          ) : null}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isError) {
      return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">Failed to load bookings.</div>;
    }

    if (isLoading) {
      return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-4 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-between items-end pt-4 border-t border-neutral-100 dark:border-neutral-800/60">
                <div className="space-y-1"><Skeleton className="h-3 w-12" /><Skeleton className="h-5 w-16" /></div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-10 w-full rounded-lg mt-2" />
            </div>
          ))}
        </div>
      );
    }

    if (bookings.length === 0) {
      return <EmptyState icon={Calendar} title="No bookings found" description="Try adjusting your tabs or search query." />;
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {bookings.map(renderCard)}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">My Bookings</h1>
        <p className="mt-2 text-neutral-500 text-lg">View and manage your service bookings</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full sm:w-auto overflow-x-auto">
          <TabsList className="bg-neutral-100/80 p-1 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl inline-flex w-max">
            <TabsTrigger value="all" className="rounded-lg px-4">All</TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg px-4">Pending</TabsTrigger>
            <TabsTrigger value="payment-now" className="rounded-lg px-4">Payment Now</TabsTrigger>
            <TabsTrigger value="active" className="rounded-lg px-4">Active</TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg px-4">History</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:max-w-xs shrink-0">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <Input 
            placeholder="Search service or tech…" 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
            className="pl-9 rounded-xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus-visible:ring-blue-500" 
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"><X className="size-4" /></button>}
        </div>
      </div>

      <div className="min-h-[400px]">
        {renderContent()}
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-6">
          <p className="text-sm font-medium text-neutral-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</Button>
          </div>
        </div>
      )}

      {/* Cancel Dialog */}
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

      {/* Payment Method Dialog */}
      <Dialog open={!!paymentBookingId} onOpenChange={(open) => { if (!open) setPaymentBookingId(null); }}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Choose Payment Method</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {PAYMENT_METHODS.map(({ method, label, logo, description }) => (
              <button key={method} onClick={() => handlePay(method)} disabled={paymentMutation.isPending}
                className="flex w-full items-center gap-4 rounded-xl border border-neutral-200 p-4 text-left transition-all hover:border-blue-500 hover:bg-blue-50 hover:shadow-md disabled:opacity-50 dark:border-neutral-700 dark:hover:border-blue-500 dark:hover:bg-blue-950/20 group">
                <span className="flex size-12 items-center justify-center rounded-full bg-neutral-100 text-2xl group-hover:bg-white dark:bg-neutral-800 dark:group-hover:bg-neutral-900 shadow-sm">{logo}</span>
                <div className="flex-1">
                  <p className="font-bold text-neutral-900 dark:text-white">{label}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
                </div>
                {paymentMutation.isPending && paymentMutation.variables?.method === method ? (
                  <Loader2 className="size-5 animate-spin text-blue-600" />
                ) : (
                  <div className="size-5 rounded-full border-2 border-neutral-300 group-hover:border-blue-600 dark:border-neutral-600 dark:group-hover:border-blue-500" />
                )}
              </button>
            ))}
          </div>
          <p className="text-center text-xs font-medium text-neutral-400">Secured by 256-bit SSL encryption</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
