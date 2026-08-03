"use client";

import { useState } from "react";
import {
  Bell,
  Lock,
  Smartphone,
  Save,
  CheckCircle2,
  CalendarCheck,
  Shield,
  Loader2,
  Mail,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/providers/auth-provider";

export default function TechnicianSettingsPage() {
  const { user } = useAuth();

  // Booking preferences
  const [autoAccept, setAutoAccept] = useState(false);
  const [maxJobsPerDay, setMaxJobsPerDay] = useState("5");
  const [instantBooking, setInstantBooking] = useState(true);

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [promoEmails, setPromoEmails] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Technician preferences updated successfully!");
    }, 800);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
          Technician Settings
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Manage your booking automation, notification channels, and account security.
        </p>
      </div>

      <form onSubmit={handleSavePreferences} className="space-y-6">
        {/* Booking Automation Settings */}
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Zap className="size-5" />
              <CardTitle className="text-lg font-bold text-neutral-900 dark:text-white">
                Booking & Job Automation
              </CardTitle>
            </div>
            <CardDescription>
              Configure how incoming service requests from customers are processed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Auto-Accept Booking Requests
                </Label>
                <p className="text-xs text-neutral-500">
                  Automatically accept bookings when they fit into your open availability schedule.
                </p>
              </div>
              <Switch checked={autoAccept} onCheckedChange={setAutoAccept} />
            </div>

            <div className="flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Instant Booking Badge
                </Label>
                <p className="text-xs text-neutral-500">
                  Highlight your profile as available for emergency & same-day repairs.
                </p>
              </div>
              <Switch checked={instantBooking} onCheckedChange={setInstantBooking} />
            </div>

            <div className="border-t border-neutral-100 pt-4 dark:border-neutral-800">
              <div className="max-w-xs space-y-2">
                <Label className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Maximum Daily Jobs Cap
                </Label>
                <Input
                  type="number"
                  min="1"
                  max="15"
                  value={maxJobsPerDay}
                  onChange={(e) => setMaxJobsPerDay(e.target.value)}
                />
                <p className="text-xs text-neutral-400">
                  Limits how many jobs can be scheduled in a single 24-hour period.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Bell className="size-5" />
              <CardTitle className="text-lg font-bold text-neutral-900 dark:text-white">
                Notification Channels
              </CardTitle>
            </div>
            <CardDescription>
              Select which notifications and alerts you receive.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Email Notifications
                </Label>
                <p className="text-xs text-neutral-500">
                  Receive instant emails for new booking requests and customer cancellations.
                </p>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>

            <div className="flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-neutral-900 dark:text-white">
                  SMS & Phone Alerts
                </Label>
                <p className="text-xs text-neutral-500">
                  Receive text messages when a booking is within 2 hours of starting.
                </p>
              </div>
              <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
            </div>

            <div className="flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Platform Marketing & Updates
                </Label>
                <p className="text-xs text-neutral-500">
                  Weekly tips for increasing your earnings and community announcements.
                </p>
              </div>
              <Switch checked={promoEmails} onCheckedChange={setPromoEmails} />
            </div>
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" /> Saving Preferences...
              </>
            ) : (
              <>
                <Save className="size-4 mr-2" /> Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
