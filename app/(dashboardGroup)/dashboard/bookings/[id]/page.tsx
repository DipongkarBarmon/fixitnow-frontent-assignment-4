"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, Star, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { PaymentStatusBadge } from "@/components/shared/payment-status-badge";
import { useBookingDetail, useCancelBooking, useInitiatePayment, useCreateReview } from "@/hooks";
import { formatDate, formatCurrency, formatRelativeTime, getAvatarUrl } from "@/utils/format";
import type { PaymentMethod } from "@/types";

const PAYMENT_METHODS: { method: PaymentMethod; label: string; logo: string; description: string }[] = [
  { method: "STRIPE", label: "Stripe", logo: "💳", description: "Pay securely with card via Stripe" },
  { method: "SSLCOMMERZ", label: "SSLCommerz", logo: "🏦", description: "Bangladesh's trusted payment gateway" },
];

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [showCancel, setShowCancel] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const { data, isLoading, isError } = useBookingDetail(id);
  const cancelMutation = useCancelBooking(id);
  const paymentMutation = useInitiatePayment();
  const reviewMutation = useCreateReview();

  const booking = data?.data;

  const handleCancel = () => {
    cancelMutation.mutate(undefined, {
      onSuccess: () => { toast.success("Booking cancelled."); setShowCancel(false); router.push("/dashboard/bookings"); },
      onError: () => { toast.error("Failed to cancel. Please try again."); setShowCancel(false); },
    });
  };

  const handlePay = (method: PaymentMethod) => {
    if (!booking) return;
    paymentMutation.mutate(
      { bookingId: booking.id, method },
      {
        onSuccess: (res) => {
          if (res.data?.redirectUrl) {
            window.location.href = res.data.redirectUrl;
          } else {
            toast.success("Payment initiated!"); setShowPayment(false);
          }
        },
        onError: () => toast.error("Payment initiation failed. Please try again."),
      }
    );
  };

  const handleReview = () => {
    if (!booking || !reviewComment.trim()) return;
    reviewMutation.mutate(
      { bookingId: booking.id, rating: reviewRating, comment: reviewComment },
      {
        onSuccess: () => { toast.success("Review submitted!"); setShowReview(false); setReviewComment(""); },
        onError: () => toast.error("Failed to submit review."),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="mb-4 size-12 text-red-500" />
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Booking not found</h2>
        <p className="mt-1 text-neutral-500">This booking may have been removed or doesn&apos;t exist.</p>
        <Button asChild className="mt-4" variant="outline"><Link href="/dashboard/bookings"><ArrowLeft className="mr-2 size-4" />Back to Bookings</Link></Button>
      </div>
    );
  }

  const techName = booking.technician?.user?.name ?? "Technician";
  const techAvatar = booking.technician?.user?.avatar ?? getAvatarUrl(techName);
  const canCancel = booking.status === "PENDING" || booking.status === "ACCEPTED";
  const canPay = booking.paymentStatus === "PENDING" && booking.status !== "CANCELLED";
  const canReview = booking.status === "COMPLETED" && !booking.review;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Button asChild variant="ghost" className="gap-2 pl-0 text-neutral-600">
        <Link href="/dashboard/bookings"><ArrowLeft className="size-4" />My Bookings</Link>
      </Button>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Booking Details</h1>
          <p className="text-sm text-neutral-500">ID: #{booking.id.slice(-8).toUpperCase()}</p>
        </div>
        <div className="flex items-center gap-3">
          <BookingStatusBadge status={booking.status} />
          <PaymentStatusBadge status={booking.paymentStatus} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Service + Technician */}
        <div className="space-y-6 lg:col-span-2">
          {/* Service */}
          <Card>
            <CardHeader><CardTitle className="text-base">Service Details</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">{booking.service?.name ?? "Service"}</p>
                <p className="text-sm text-neutral-500">{booking.service?.category?.name}</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                <span className="flex items-center gap-1.5"><Calendar className="size-4" />{formatDate(booking.bookingDate)}</span>
                <span className="flex items-center gap-1.5"><Clock className="size-4" />{booking.startTime} – {booking.endTime}</span>
              </div>
              {booking.notes && (
                <div className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800">
                  <p className="text-xs font-medium text-neutral-500 mb-1">Customer Notes</p>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">{booking.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Technician */}
          <Card>
            <CardHeader><CardTitle className="text-base">Technician</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Image src={techAvatar} alt={techName} width={56} height={56} className="size-14 rounded-full border-2 border-neutral-200 object-cover dark:border-neutral-700" />
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">{techName}</p>
                  {booking.technician?.location && (
                    <p className="flex items-center gap-1 text-sm text-neutral-500"><MapPin className="size-3.5" />{booking.technician.location}</p>
                  )}
                  <div className="mt-1 flex items-center gap-1 text-sm text-amber-600">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    {booking.technician?.averageRating.toFixed(1)} ({booking.technician?.totalReviews} reviews)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review (if submitted) */}
          {booking.review && (
            <Card>
              <CardHeader><CardTitle className="text-base">Your Review</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`size-4 ${i < booking.review!.rating ? "fill-amber-400 text-amber-400" : "text-neutral-300"}`} />
                  ))}
                </div>
                <p className="text-neutral-600 dark:text-neutral-400">{booking.review.comment}</p>
                <p className="mt-1 text-xs text-neutral-400">{formatRelativeTime(booking.review.createdAt)}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Payment + Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Payment Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Service cost</span>
                <span className="font-medium">{formatCurrency(booking.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Payment method</span>
                <span className="font-medium">{booking.payment?.method ?? "Not yet"}</span>
              </div>
              {booking.payment?.transactionId && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Transaction ID</span>
                  <span className="font-mono text-xs">{booking.payment.transactionId}</span>
                </div>
              )}
              <div className="border-t border-neutral-100 pt-3 dark:border-neutral-800">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-lg">{formatCurrency(booking.totalPrice)}</span>
                </div>
              </div>
              {canPay && (
                <Button className="w-full gap-2" onClick={() => setShowPayment(true)}>
                  <CreditCard className="size-4" />Pay Now
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            {canReview && (
              <Button variant="outline" className="w-full gap-2" onClick={() => setShowReview(true)}>
                <Star className="size-4" />Leave a Review
              </Button>
            )}
            {canCancel && (
              <Button variant="destructive" className="w-full" onClick={() => setShowCancel(true)}>
                Cancel Booking
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      <ConfirmDialog open={showCancel} onOpenChange={setShowCancel}
        title="Cancel Booking" description="Are you sure you want to cancel? This cannot be undone."
        confirmLabel={cancelMutation.isPending ? "Cancelling…" : "Yes, Cancel"}
        variant="destructive" onConfirm={handleCancel} isLoading={cancelMutation.isPending} />

      {/* Payment Method Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogHeader><DialogTitle>Choose Payment Method</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            {PAYMENT_METHODS.map(({ method, label, logo, description }) => (
              <button key={method} onClick={() => handlePay(method)} disabled={paymentMutation.isPending}
                className="flex w-full items-center gap-4 rounded-xl border border-neutral-200 p-4 text-left transition-colors hover:border-blue-500 hover:bg-blue-50/50 disabled:opacity-50 dark:border-neutral-700 dark:hover:border-blue-500 dark:hover:bg-blue-950/20">
                <span className="text-3xl">{logo}</span>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">{label}</p>
                  <p className="text-sm text-neutral-500">{description}</p>
                </div>
                {paymentMutation.isPending && <Loader2 className="ml-auto size-4 animate-spin text-blue-600" />}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-neutral-400">Secured by 256-bit SSL encryption</p>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={showReview} onOpenChange={setShowReview}>
        <DialogContent>
          <DialogHeader><DialogTitle>Leave a Review</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">Your Rating</p>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} onClick={() => setReviewRating(i + 1)}>
                    <Star className={`size-7 transition-colors ${i < reviewRating ? "fill-amber-400 text-amber-400" : "text-neutral-300 hover:text-amber-300"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">Your Comments</p>
              <Textarea placeholder="Describe your experience with the service and technician…" value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)} rows={4} />
            </div>
            <Button className="w-full" onClick={handleReview} disabled={!reviewComment.trim() || reviewMutation.isPending}>
              {reviewMutation.isPending ? <><Loader2 className="mr-2 size-4 animate-spin" />Submitting…</> : "Submit Review"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
