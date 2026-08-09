"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [date, setDate] = useState("");
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

      // Create proper Date objects from the inputs
      // date is "YYYY-MM-DD", startTime is "HH:mm"
      const startTime = new Date(`${date}T${startTimeStr}:00`);
      const endTime = new Date(`${date}T${endTimeStr}:00`);

      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        toast.error("Invalid date or time format");
        return;
      }

      if (startTime >= endTime) {
        toast.error("Start time must be before end time");
        return;
      }

      const res = await createAvailabilityAction({
        date: new Date(date).toISOString(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      if (res.success) {
        toast.success("Availability slot created successfully");
        setDate("");
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="date" className="text-neutral-700 dark:text-neutral-300">
          Date
        </Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime" className="text-neutral-700 dark:text-neutral-300">
            Start Time
          </Label>
          <Select value={startTimeStr} onValueChange={setStartTimeStr} required>
            <SelectTrigger id="startTime" className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
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
            <SelectTrigger id="endTime" className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
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

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all font-medium py-2.5"
          disabled={isSubmitting || !date || !startTimeStr || !endTimeStr}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Add Availability Slot"
          )}
        </Button>
      </div>
    </form>
  );
}
