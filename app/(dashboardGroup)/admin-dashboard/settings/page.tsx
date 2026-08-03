"use client";

import { useState } from "react";
import {
  Settings,
  Shield,
  Percent,
  Server,
  Mail,
  Phone,
  Building,
  Save,
  CreditCard,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSettingsPage() {
  const [commissionRate, setCommissionRate] = useState("10");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [supportEmail, setSupportEmail] = useState("support@fixitnow.com");
  const [supportPhone, setSupportPhone] = useState("+880 1700 000000");
  const [enableStripe, setEnableStripe] = useState(true);
  const [enableSSLCommerz, setEnableSSLCommerz] = useState(true);
  const [enableCOD, setEnableCOD] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Platform settings updated successfully!");
    }, 800);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
          Platform Settings
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Configure marketplace commission, payment gateways, and system maintenance.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Marketplace Commission & Economics */}
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Percent className="size-5" />
              <CardTitle className="text-lg font-bold text-neutral-900 dark:text-white">
                Commission & Economics
              </CardTitle>
            </div>
            <CardDescription>
              Set the platform fee deducted from technician job payouts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-xs space-y-2">
              <Label className="text-sm font-semibold">Standard Platform Fee (%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                />
                <span className="text-sm font-bold text-neutral-500">%</span>
              </div>
              <p className="text-xs text-neutral-400">
                Applied automatically to all completed customer service orders.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Gateways */}
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <CreditCard className="size-5" />
              <CardTitle className="text-lg font-bold text-neutral-900 dark:text-white">
                Payment Gateways
              </CardTitle>
            </div>
            <CardDescription>
              Enable or disable customer checkout payment processors.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Stripe Checkout (International Cards)
                </Label>
                <p className="text-xs text-neutral-500">Accept Visa, Mastercard, and American Express.</p>
              </div>
              <Switch checked={enableStripe} onCheckedChange={setEnableStripe} />
            </div>

            <div className="flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-neutral-900 dark:text-white">
                  SSLCommerz (Local MFS & Banks)
                </Label>
                <p className="text-xs text-neutral-500">Accept bKash, Nagad, Rocket, and Bangladeshi debit cards.</p>
              </div>
              <Switch checked={enableSSLCommerz} onCheckedChange={setEnableSSLCommerz} />
            </div>

            <div className="flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Cash On Delivery (COD)
                </Label>
                <p className="text-xs text-neutral-500">Allow customers to pay the technician in cash upon service completion.</p>
              </div>
              <Switch checked={enableCOD} onCheckedChange={setEnableCOD} />
            </div>
          </CardContent>
        </Card>

        {/* System Maintenance & Support */}
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <Server className="size-5" />
              <CardTitle className="text-lg font-bold text-neutral-900 dark:text-white">
                System & Support Configuration
              </CardTitle>
            </div>
            <CardDescription>
              Emergency maintenance mode and platform support contacts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900 dark:bg-amber-950/20">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="size-4" />
                  <Label className="text-sm font-semibold">Maintenance Mode</Label>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Temporarily disable new booking checkouts for all customers during database maintenance.
                </p>
              </div>
              <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Support Email</Label>
                <Input
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Support Phone</Label>
                <Input
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" /> Saving Changes...
              </>
            ) : (
              <>
                <Save className="size-4 mr-2" /> Save Platform Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
