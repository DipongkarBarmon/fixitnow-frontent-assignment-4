"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  X,
  CheckCircle2,
  Lock,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AvailabilityForm } from "../_components/AvailabilityForm";
import {
  getAllAvailabilityAction,
  deleteAvailabilityByIdAction,
  type Availability,
} from "../_actions/availabilityAction";

export default function AvailabilityPage() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const loadAvailabilities = async () => {
    setIsLoading(true);
    try {
      const res = await getAllAvailabilityAction();
      if (res.success && res.data) {
        setAvailabilities(res.data);
      } else {
        toast.error(res.message || "Failed to load availability slots");
      }
    } catch (error) {
      toast.error("Error loading availability slots");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAvailabilities();
  }, []);

  const handleDeleteSlot = async (id: string) => {
    if (!confirm("Are you sure you want to remove this availability slot?")) return;
    
    try {
      setIsDeletingId(id);
      const res = await deleteAvailabilityByIdAction(id);
      if (res.success) {
        toast.success("Availability slot removed");
        setAvailabilities((prev) => prev.filter((a) => a.id !== id));
      } else {
        toast.error(res.message || "Failed to remove slot");
      }
    } catch {
      toast.error("Error deleting slot");
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleFormSuccess = () => {
    setIsAddSlotOpen(false);
    loadAvailabilities();
  };

  // Group by date string "YYYY-MM-DD"
  const groupedAvailabilities = availabilities.reduce((acc, curr) => {
    // extract date part safely
    const dateStr = curr.date.split("T")[0];
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(curr);
    return acc;
  }, {} as Record<string, Availability[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedAvailabilities).sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            Availability & Working Hours
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Set your working hours, manage bookable time slots, and block off-days.
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
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
              <CalendarIcon className="size-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Days with Availability</p>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">
                {sortedDates.length} Days
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
                {availabilities.length} Slots
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="size-8 animate-spin text-emerald-600" />
          </div>
        ) : sortedDates.length === 0 ? (
          <Card className="border-neutral-200 border-dashed dark:border-neutral-800">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 rounded-full bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <CalendarIcon className="size-8" />
              </div>
              <h3 className="mb-1 text-lg font-medium text-neutral-900 dark:text-white">
                No availability set
              </h3>
              <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
                You haven't defined any working hours yet. Add time slots so customers can book your services.
              </p>
              <Button onClick={() => setIsAddSlotOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Add Your First Slot
              </Button>
            </CardContent>
          </Card>
        ) : (
          sortedDates.map((dateStr) => (
            <Card
              key={dateStr}
              className="border-neutral-200 bg-white transition-colors dark:border-neutral-800 dark:bg-neutral-900"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-neutral-900 dark:text-white capitalize">
                    {format(parseISO(dateStr), "EEEE, MMMM do, yyyy")}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs"
                  >
                    {groupedAvailabilities[dateStr].length} Slots Available
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-4">
                {(() => {
                  const daySlots = groupedAvailabilities[dateStr].sort(
                    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
                  );
                  const availableSlots = daySlots.filter((s) => !s.isBooked);
                  const bookedSlots = daySlots.filter((s) => s.isBooked);

                  return (
                    <>
                      {availableSlots.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                            Available Openings
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {availableSlots.map((slot) => {
                              const start = format(parseISO(slot.startTime), "hh:mm a");
                              const end = format(parseISO(slot.endTime), "hh:mm a");
                              return (
                                <div
                                  key={slot.id}
                                  className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/50 px-3 py-1.5 text-xs font-medium text-emerald-900 shadow-sm transition-colors hover:bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-100 dark:hover:bg-emerald-950/40"
                                >
                                  <Clock className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                  <span>
                                    {start} – {end}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSlot(slot.id)}
                                    disabled={isDeletingId === slot.id}
                                    className="ml-1 rounded-full p-0.5 text-neutral-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 disabled:opacity-50"
                                    title="Remove time slot"
                                  >
                                    {isDeletingId === slot.id ? (
                                      <Loader2 className="size-3 animate-spin" />
                                    ) : (
                                      <X className="size-3" />
                                    )}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {bookedSlots.length > 0 && (
                        <div>
                          <h4 className="mb-2 mt-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                            Booked Appointments
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {bookedSlots.map((slot) => {
                              const start = format(parseISO(slot.startTime), "hh:mm a");
                              const end = format(parseISO(slot.endTime), "hh:mm a");
                              return (
                                <div
                                  key={slot.id}
                                  className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600 opacity-80 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
                                >
                                  <Lock className="size-3.5 text-neutral-500" />
                                  <span className="line-through decoration-neutral-400/50">
                                    {start} – {end}
                                  </span>
                                  <Badge variant="outline" className="ml-2 h-5 border-neutral-300 text-[10px] font-semibold text-neutral-500 dark:border-neutral-700">
                                    Booked
                                  </Badge>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Slot Dialog */}
      <Dialog open={isAddSlotOpen} onOpenChange={setIsAddSlotOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Working Time Slot</DialogTitle>
            <DialogDescription>
              Select a date and define your working window for customer bookings.
            </DialogDescription>
          </DialogHeader>

          <AvailabilityForm onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
