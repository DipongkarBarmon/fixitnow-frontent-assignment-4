"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Settings</h1>
      <Card>
        <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { id: "email-notif", label: "Email Notifications", desc: "Receive booking updates via email" },
            { id: "sms-notif", label: "SMS Notifications", desc: "Receive booking updates via SMS" },
            { id: "promo", label: "Promotional Emails", desc: "Receive offers and promotions" },
          ].map((s) => (
            <div key={s.id} className="flex items-center justify-between">
              <div><Label htmlFor={s.id} className="font-medium">{s.label}</Label><p className="text-sm text-neutral-500">{s.desc}</p></div>
              <Switch id={s.id} defaultChecked={s.id !== "promo"} />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Account</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="font-medium text-neutral-900 dark:text-white">Change Password</p><p className="text-sm text-neutral-500">Update your password</p></div>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Change</button>
          </div>
          <div className="flex items-center justify-between">
            <div><p className="font-medium text-red-600">Delete Account</p><p className="text-sm text-neutral-500">Permanently delete your account</p></div>
            <button className="text-sm font-medium text-red-600 hover:text-red-700">Delete</button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
