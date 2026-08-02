import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import Navbar from "@/components/shared/navbar";

export default function PaymentCancelPage() {
  return (
    <>
      <Navbar />
      <Container className="flex min-h-[80vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex size-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <XCircle className="size-12 text-red-600" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-neutral-900 dark:text-white">Payment Cancelled</h1>
        <p className="mb-8 max-w-md text-neutral-600 dark:text-neutral-400">
          Your payment was not completed. Your booking is still active — you can try again anytime.
        </p>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="gap-2"><Link href="/dashboard/bookings"><ArrowLeft className="size-4" />My Bookings</Link></Button>
          <Button className="gap-2"><RefreshCw className="size-4" />Try Again</Button>
        </div>
      </Container>
    </>
  );
}
