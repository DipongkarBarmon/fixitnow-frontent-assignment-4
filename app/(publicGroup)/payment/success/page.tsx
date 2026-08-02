import Link from "next/link";
import { CheckCircle2, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import Navbar from "@/components/shared/navbar";

export default function PaymentSuccessPage() {
  return (
    <>
      <Navbar />
      <Container className="flex min-h-[80vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex size-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <CheckCircle2 className="size-12 text-emerald-600" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-neutral-900 dark:text-white">Payment Successful!</h1>
        <p className="mb-8 max-w-md text-neutral-600 dark:text-neutral-400">
          Your payment has been processed successfully. The technician has been notified and will arrive at the scheduled time.
        </p>
        <div className="mb-4 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800 text-left w-full max-w-sm">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-neutral-500">Transaction ID</span><span className="font-medium">TXN-2026-001234</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Amount</span><span className="font-medium">৳1,500.00</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Method</span><span className="font-medium">Stripe</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Date</span><span className="font-medium">{new Date().toLocaleDateString()}</span></div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2"><Download className="size-4" />Download Receipt</Button>
          <Button asChild className="gap-2"><Link href="/dashboard">Dashboard <ArrowRight className="size-4" /></Link></Button>
        </div>
      </Container>
    </>
  );
}
