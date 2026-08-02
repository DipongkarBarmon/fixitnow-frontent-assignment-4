"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TechnicianServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">My Services</h1>
        <Button className="gap-2"><Plus className="size-4" />Add Service</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { name: "Plumbing Repair", price: 500, bookings: 45 },
          { name: "Pipe Replacement", price: 1500, bookings: 22 },
          { name: "Drain Cleaning", price: 300, bookings: 60 },
        ].map((s, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">{s.name}</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">৳{s.price}</p>
              <p className="text-sm text-neutral-500">{s.bookings} bookings</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
