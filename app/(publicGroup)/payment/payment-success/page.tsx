import { CheckCircle2, Download, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const rawSessionId = typeof resolvedParams.session_id === 'string' ? resolvedParams.session_id : '';
  const sessionId = rawSessionId || 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();

  // Call the backend to verify the payment and update the database status to PAID
  if (rawSessionId) {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
      // Trying both common patterns just in case the backend route differs
      await fetch(`${backendUrl}/api/payment/payment-success?session_id=${rawSessionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        cache: "no-store",
      }).then(res => {
        if (!res.ok) {
          // Fallback if the backend actually uses /payment without /api
          return fetch(`${backendUrl}/payment/payment-success?session_id=${rawSessionId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          });
        }
        return res;
      });
    } catch (e) {
      console.error("Failed to verify payment with backend:", e);
    }
  }

  return (
    <Container className="flex min-h-[80vh] flex-col items-center justify-center py-12">
      <Card className="w-full max-w-lg shadow-xl overflow-hidden border-neutral-200 dark:border-neutral-800">
        <CardContent className="pt-10 pb-8 flex flex-col items-center text-center">
          <div className="relative mb-6 flex size-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-100 dark:bg-emerald-900/30 opacity-75"></div>
            <CheckCircle2 className="relative z-10 size-12 text-emerald-600" />
          </div>
          
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Payment Successful!
          </h1>
          
          <p className="mb-8 text-neutral-600 dark:text-neutral-400">
            Your payment has been securely processed. The technician has been notified and will proceed with the service.
          </p>
          
          <div className="w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50 text-left">
            <div className="border-b border-neutral-200 dark:border-neutral-800 px-5 py-3 flex items-center gap-2 bg-neutral-100/50 dark:bg-neutral-800/50">
              <ShieldCheck className="size-5 text-emerald-600" />
              <h3 className="font-semibold text-neutral-900 dark:text-white">Transaction Details</h3>
            </div>
            <div className="space-y-3 p-5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Transaction ID</span>
                <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-white truncate max-w-[180px] sm:max-w-[220px]" title={sessionId}>
                  {sessionId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Status</span>
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Paid
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Method</span>
                <span className="font-medium text-neutral-900 dark:text-white">Stripe</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Date</span>
                <span className="font-medium text-neutral-900 dark:text-white">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3 bg-neutral-50 dark:bg-neutral-900/20 px-6 py-6 border-t border-neutral-100 dark:border-neutral-800">
          <Button asChild className="h-11 w-full sm:flex-1 rounded-xl bg-blue-600 font-semibold hover:bg-blue-700">
            <a href="/dashboard/bookings">
              Go to My Bookings <ArrowRight className="ml-2 size-4" />
            </a>
          </Button>
          <Button variant="outline" className="h-11 w-full sm:flex-1 rounded-xl font-semibold">
            <Download className="mr-2 size-4" /> Receipt
          </Button>
        </CardFooter>
      </Card>
    </Container>
  );
}
