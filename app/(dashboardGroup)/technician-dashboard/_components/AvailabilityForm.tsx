"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Clock } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAvailabilityAction } from "../_actions/availabilityAction";

const TIME_OPTIONS = Array.from({ length: 27 }).map((_, i) => {
  // start from 7:00 to 20:00
  const hour = Math.floor(i / 2) + 7;
  const minute = i % 2 === 0 ? "00" : "30";
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const padHour = displayHour.toString().padStart(2, "0");
  const valueHour = hour.toString().padStart(2, "0");
  return {
    label: `${padHour}:${minute} ${ampm}`,
    value: `${valueHour}:${minute}`,
  };
});

interface AvailabilityFormProps {
  onSuccess?: () => void;
}

export function AvailabilityForm({ onSuccess }: AvailabilityFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTimeStr, setStartTimeStr] = useState("");
  const [endTimeStr, setEndTimeStr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !startTimeStr || !endTimeStr) {
      toast.error("Please fill in all fields (date, start time, end time)");
      return;
    }

    try {
      setIsSubmitting(true);

      const dateString = format(date, "yyyy-MM-dd");
      const startTime = new Date(`${dateString}T${startTimeStr}:00`);
      const endTime = new Date(`${dateString}T${endTimeStr}:00`);

      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        toast.error("Invalid date or time format");
        return;
      }

      if (startTime >= endTime) {
        toast.error("Start time must be before end time");
        return;
      }

      const res = await createAvailabilityAction({
        date: new Date(dateString).toISOString(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      if (res.success) {
        toast.success("Availability slot created successfully");
        setStartTimeStr("");
        setEndTimeStr("");
        onSuccess?.();
      } else {
        toast.error(res.message || "Failed to create availability");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm w-full">
      <CardHeader>
        <CardTitle>Add Working Time Slot</CardTitle>
        <CardDescription>
          Select a date from the calendar and define your working window.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
          {/* Calendar Section */}
          <div className="flex-shrink-0 space-y-3">
            <Label className="text-neutral-700 dark:text-neutral-300">Select Date</Label>
            <div className="rounded-md border border-neutral-200 bg-white p-2 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 inline-block">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="pointer-events-auto"
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </div>
          </div>
          
          {/* Time Options Section */}
          <div className="flex-1 space-y-6 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-neutral-700 dark:text-neutral-300">
                  Start Time
                </Label>
                <Select value={startTimeStr} onValueChange={setStartTimeStr} required>
                  <SelectTrigger id="startTime" className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 h-11">
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <Clock className="h-4 w-4" />
                      <SelectValue placeholder="Select start" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map((time) => (
                      <SelectItem key={`start-${time.value}`} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-neutral-700 dark:text-neutral-300">
                  End Time
                </Label>
                <Select value={endTimeStr} onValueChange={setEndTimeStr} required>
                  <SelectTrigger id="endTime" className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 h-11">
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <Clock className="h-4 w-4" />
                      <SelectValue placeholder="Select end" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map((time) => (
                      <SelectItem key={`end-${time.value}`} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all font-medium py-6 text-base rounded-xl mt-4"
              disabled={isSubmitting || !date || !startTimeStr || !endTimeStr}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving Slot...
                </>
              ) : (
                "Save Availability Slot"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
