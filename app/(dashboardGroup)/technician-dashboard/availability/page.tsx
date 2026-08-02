"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

const schedule = [
  { day: "Monday", slots: ["9:00 AM - 12:00 PM", "2:00 PM - 6:00 PM"] },
  { day: "Tuesday", slots: ["10:00 AM - 1:00 PM", "3:00 PM - 7:00 PM"] },
  { day: "Wednesday", slots: ["9:00 AM - 12:00 PM"] },
  { day: "Thursday", slots: ["10:00 AM - 2:00 PM", "4:00 PM - 8:00 PM"] },
  { day: "Friday", slots: ["9:00 AM - 1:00 PM"] },
  { day: "Saturday", slots: [] },
  { day: "Sunday", slots: [] },
];

export default function AvailabilityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Availability Schedule</h1>
        <Button className="gap-2"><Plus className="size-4" />Add Time Slot</Button>
      </div>
      <div className="grid gap-4">
        {schedule.map((day) => (
          <Card key={day.day}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{day.day}</CardTitle>
            </CardHeader>
            <CardContent>
              {day.slots.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {day.slots.map((slot, i) => (
                    <Badge key={i} variant="secondary" className="gap-1 pr-1 text-sm">
                      {slot}
                      <button className="ml-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 p-0.5">
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">No slots set — <button className="text-blue-600 hover:underline">Add one</button></p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
