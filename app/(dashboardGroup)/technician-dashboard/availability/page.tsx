"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  X,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Unlock,
  Loader2,
  Trash2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/auth-provider";
import {
  useAvailability,
  useSetAvailability,
  useRemoveAvailability,
  useMyTechnicianProfile,
} from "@/hooks";

const DAYS_OF_WEEK = [
  { dayIndex: 1, name: "Monday" },
  { dayIndex: 2, name: "Tuesday" },
  { dayIndex: 3, name: "Wednesday" },
  { dayIndex: 4, name: "Thursday" },
  { dayIndex: 5, name: "Friday" },
  { dayIndex: 6, name: "Saturday" },
  { dayIndex: 0, name: "Sunday" },
];

const DEFAULT_SCHEDULE = [
  {
    dayIndex: 1,
    day: "Monday",
    isBlocked: false,
    slots: [
      { id: "s1", startTime: "09:00 AM", endTime: "01:00 PM" },
      { id: "s2", startTime: "02:00 PM", endTime: "06:00 PM" },
    ],
  },
  {
    dayIndex: 2,
    day: "Tuesday",
    isBlocked: false,
    slots: [
      { id: "s3", startTime: "09:00 AM", endTime: "01:00 PM" },
      { id: "s4", startTime: "02:00 PM", endTime: "06:00 PM" },
    ],
  },
  {
    dayIndex: 3,
    day: "Wednesday",
    isBlocked: false,
    slots: [
      { id: "s5", startTime: "10:00 AM", endTime: "02:00 PM" },
      { id: "s6", startTime: "03:00 PM", endTime: "07:00 PM" },
    ],
  },
  {
    dayIndex: 4,
    day: "Thursday",
    isBlocked: false,
    slots: [
      { id: "s7", startTime: "09:00 AM", endTime: "01:00 PM" },
      { id: "s8", startTime: "02:00 PM", endTime: "06:00 PM" },
    ],
  },
  {
    dayIndex: 5,
    day: "Friday",
    isBlocked: false,
    slots: [{ id: "s9", startTime: "09:00 AM", endTime: "12:00 PM" }],
  },
  {
    dayIndex: 6,
    day: "Saturday",
    isBlocked: false,
    slots: [{ id: "s10", startTime: "10:00 AM", endTime: "04:00 PM" }],
  },
  {
    dayIndex: 0,
    day: "Sunday",
    isBlocked: true,
    slots: [],
  },
];

export default function AvailabilityPage() {
  const { user } = useAuth();
  const { data: profileRes } = useMyTechnicianProfile();
  const technicianId = profileRes?.data?.id || user?.id || "";

  const { data: availabilityRes } = useAvailability(technicianId);
  const setAvailabilityMutation = useSetAvailability();
  const removeSlotMutation = useRemoveAvailability();

  // Local state for weekly schedule
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);

  // Dialog state for adding a slot
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(1);
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("01:00 PM");

  const handleToggleBlockDay = (dayIndex: number) => {
    setSchedule((prev) =>
      prev.map((day) =>
        day.dayIndex === dayIndex ? { ...day, isBlocked: !day.isBlocked } : day
      )
    );
    const dayName = DAYS_OF_WEEK.find((d) => d.dayIndex === dayIndex)?.name;
    const isNowBlocked = !schedule.find((d) => d.dayIndex === dayIndex)?.isBlocked;
    toast.success(`${dayName} marked as ${isNowBlocked ? "Blocked / Unavailable" : "Available"}`);
  };

  const handleRemoveSlot = async (dayIndex: number, slotId: string) => {
    try {
      setSchedule((prev) =>
        prev.map((day) =>
          day.dayIndex === dayIndex
            ? { ...day, slots: day.slots.filter((s) => s.id !== slotId) }
            : day
        )
      );
      toast.success("Time slot removed");
    } catch {
      toast.error("Failed to remove slot");
    }
  };

  const handleAddSlot = async () => {
    if (!startTime || !endTime) {
      toast.error("Please provide both start and end time");
      return;
    }

    const newSlot = {
      id: `slot_${Date.now()}`,
      startTime,
      endTime,
    };

    setSchedule((prev) =>
      prev.map((day) =>
        day.dayIndex === selectedDayIndex
          ? { ...day, isBlocked: false, slots: [...day.slots, newSlot] }
          : day
      )
    );

    setIsAddSlotOpen(false);
    toast.success("Time slot added successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            Availability & Working Hours
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Set your weekly working hours, manage bookable time slots, and block off-days.
          </p>
        </div>
        <Button
          onClick={() => setIsAddSlotOpen(true)}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
        >
          <Plus className="size-4" /> Add Time Slot
        </Button>
      </div>

      {/* Quick Summary Banner */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Active Working Days</p>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">
                {schedule.filter((d) => !d.isBlocked && d.slots.length > 0).length} Days / Week
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
              <Clock className="size-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Total Bookable Slots</p>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">
                {schedule.reduce((sum, d) => sum + (d.isBlocked ? 0 : d.slots.length), 0)} Slots
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
              <Lock className="size-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Blocked / Off Days</p>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">
                {schedule.filter((d) => d.isBlocked).length} Days
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Schedule Days List */}
      <div className="space-y-4">
        {schedule.map((day) => (
          <Card
            key={day.dayIndex}
            className={`border-neutral-200 transition-colors dark:border-neutral-800 ${
              day.isBlocked
                ? "bg-neutral-50/70 dark:bg-neutral-900/40"
                : "bg-white dark:bg-neutral-900"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-neutral-900 dark:text-white">
                  {day.day}
                </span>
                {day.isBlocked ? (
                  <Badge variant="destructive" className="text-xs">
                    Blocked / Day Off
                  </Badge>
                ) : day.slots.length > 0 ? (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs"
                  >
                    {day.slots.length} Slots Available
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-neutral-400">
                    No Slots Set
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() => {
                    setSelectedDayIndex(day.dayIndex);
                    setIsAddSlotOpen(true);
                  }}
                >
                  <Plus className="size-3.5" /> Add Slot
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs gap-1 ${
                    day.isBlocked
                      ? "text-emerald-600 hover:text-emerald-700"
                      : "text-neutral-500 hover:text-red-600"
                  }`}
                  onClick={() => handleToggleBlockDay(day.dayIndex)}
                >
                  {day.isBlocked ? (
                    <>
                      <Unlock className="size-3.5" /> Unblock Day
                    </>
                  ) : (
                    <>
                      <Lock className="size-3.5" /> Block Day
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {day.isBlocked ? (
                <p className="text-xs text-neutral-400 italic">
                  Customers cannot book appointments on this day.
                </p>
              ) : day.slots.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {day.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-800 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    >
                      <Clock className="size-3 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        {slot.startTime} – {slot.endTime}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(day.dayIndex, slot.id)}
                        className="ml-1 rounded-full p-0.5 text-neutral-400 hover:bg-neutral-200 hover:text-red-600 dark:hover:bg-neutral-700"
                        title="Remove time slot"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>No time slots configured. You won&apos;t receive bookings for this day.</span>
                  <button
                    onClick={() => {
                      setSelectedDayIndex(day.dayIndex);
                      setIsAddSlotOpen(true);
                    }}
                    className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    Add a slot now
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Slot Dialog */}
      <Dialog open={isAddSlotOpen} onOpenChange={setIsAddSlotOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Working Time Slot</DialogTitle>
            <DialogDescription>
              Select a weekday and define your working window for customer bookings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Day of the Week</Label>
              <Select
                value={selectedDayIndex.toString()}
                onValueChange={(val) => setSelectedDayIndex(parseInt(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((d) => (
                    <SelectItem key={d.dayIndex} value={d.dayIndex.toString()}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Start" />
                  </SelectTrigger>
                  <SelectContent>
                    {["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>End Time</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="End" />
                  </SelectTrigger>
                  <SelectContent>
                    {["12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSlotOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddSlot}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Add Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
