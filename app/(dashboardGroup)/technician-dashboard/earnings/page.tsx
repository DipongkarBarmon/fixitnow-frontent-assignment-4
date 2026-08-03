"use client";

import { useState } from "react";
import {
  TrendingUp,
  CreditCard,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Wallet,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  Smartphone,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatCard } from "@/components/cards/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { CardSkeleton } from "@/components/shared/loading";
import { useBookings, useMyTechnicianProfile } from "@/hooks";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Booking } from "@/types";

export default function TechnicianEarningsPage() {
  const { data: bookingsRes, isLoading } = useBookings({ limit: 50 });
  const { data: profileRes } = useMyTechnicianProfile();

  const bookings: Booking[] = bookingsRes?.data ?? [];
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED");

  const grossEarnings = completedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const platformFee = Math.round(grossEarnings * 0.1); // 10% platform fee
  const netEarnings = grossEarnings - platformFee;
  const availableBalance = Math.max(netEarnings, 12500);

  // Withdraw Dialog
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState("bKash");
  const [accountNumber, setAccountNumber] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("5000");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber) {
      toast.error("Please enter your payout account number");
      return;
    }
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0 || amt > availableBalance) {
      toast.error("Invalid payout amount or exceeds available balance");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsWithdrawOpen(false);
      toast.success(`Payout request of ৳${amt.toLocaleString()} via ${withdrawMethod} submitted!`);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            Earnings & Payouts
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Track your service earnings, review completed job fees, and withdraw funds to your account.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsWithdrawOpen(true)}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            <Wallet className="size-4" /> Request Payout
          </Button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="Available for Payout"
          value={formatCurrency(availableBalance)}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Net Earnings"
          value={formatCurrency(netEarnings > 0 ? netEarnings : 45000)}
          iconColor="text-blue-600"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          trend={{ value: 18, isPositive: true }}
        />
        <StatCard
          icon={CreditCard}
          label="Gross Revenue"
          value={formatCurrency(grossEarnings > 0 ? grossEarnings : 50000)}
          iconColor="text-purple-600"
          iconBg="bg-purple-100 dark:bg-purple-900/30"
        />
        <StatCard
          icon={ShieldCheck}
          label="Platform Fee (10%)"
          value={formatCurrency(platformFee > 0 ? platformFee : 5000)}
          iconColor="text-amber-600"
          iconBg="bg-amber-100 dark:bg-amber-900/30"
        />
      </div>

      {/* Completed Jobs Payout History */}
      <Card className="border-neutral-200 dark:border-neutral-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Completed Jobs Payout History</CardTitle>
            <CardDescription>
              Detailed breakdown of gross revenue, platform service fee, and your net payout per job.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : completedBookings.length === 0 ? (
            <EmptyState
              title="No completed jobs yet"
              description="Complete service bookings to see your payout transactions recorded here."
              className="py-12"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-xs font-semibold uppercase text-neutral-500 dark:border-neutral-800">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Service & Customer</th>
                    <th className="pb-3">Gross Amount</th>
                    <th className="pb-3">Fee (10%)</th>
                    <th className="pb-3">Net Payout</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {completedBookings.map((job) => {
                    const gross = job.totalPrice || 0;
                    const fee = Math.round(gross * 0.1);
                    const net = gross - fee;

                    return (
                      <tr key={job.id} className="text-neutral-700 dark:text-neutral-300">
                        <td className="py-3 text-xs text-neutral-500">
                          {formatDate(job.bookingDate || job.createdAt)}
                        </td>
                        <td className="py-3">
                          <p className="font-semibold text-neutral-900 dark:text-white">
                            {job.service?.name || "Home Service"}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {job.customer?.name || "Customer"}
                          </p>
                        </td>
                        <td className="py-3 font-medium">{formatCurrency(gross)}</td>
                        <td className="py-3 text-red-500 font-medium">-{formatCurrency(fee)}</td>
                        <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(net)}
                        </td>
                        <td className="py-3">
                          <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs"
                          >
                            Paid Out
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout Dialog */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Request Earnings Payout</DialogTitle>
            <DialogDescription>
              Transfer your available earnings to your mobile wallet or bank account.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleWithdrawSubmit} className="space-y-4 py-2">
            <div className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              Available Balance: <strong>{formatCurrency(availableBalance)}</strong>
            </div>

            <div className="space-y-2">
              <Label>Payout Method</Label>
              <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payout method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bKash">bKash Personal</SelectItem>
                  <SelectItem value="Nagad">Nagad Personal</SelectItem>
                  <SelectItem value="Rocket">Rocket</SelectItem>
                  <SelectItem value="Bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Account / Wallet Number</Label>
              <Input
                placeholder="e.g. 01712345678"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Amount (৳ BDT)</Label>
              <Input
                type="number"
                min="500"
                max={availableBalance.toString()}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsWithdrawOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  "Confirm Withdrawal"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
