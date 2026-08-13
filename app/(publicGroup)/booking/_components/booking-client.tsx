"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, CheckCircle2, ChevronRight, User, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useServiceDetail, useAvailability, useCreateBooking } from "@/hooks";
import { formatCurrency } from "@/utils/format";
import type { TimeSlot } from "@/types";

export default function BookingClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceId = searchParams.get("serviceId");

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [notes, setNotes] = useState("");

  const { data: serviceRes, isLoading: serviceLoading, error: serviceError } = useServiceDetail(serviceId ?? "");
  const service = serviceRes?.data ?? ((serviceRes as any)?.id ? serviceRes : null);

  const technicianId = service?.technicianId || (service as any)?.technician?.id;
  
  const { data: availRes, isLoading: availLoading } = useAvailability(technicianId ?? "");
  const availabilityData = availRes?.data ?? (Array.isArray(availRes) ? availRes : []);

  const createBookingMutation = useCreateBooking();

  // Redirect if no service ID
  useEffect(() => {
    if (!serviceId && typeof window !== "undefined") {
      toast.error("Please select a service first");
      router.push("/services");
    }
  }, [serviceId, router]);


  if (serviceLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
        <Loader2 className="mb-4 size-8 animate-spin" />
        <p>Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-neutral-600 dark:text-neutral-400">Service not found.</p>
        <div className="mt-4 text-left p-4 bg-red-50 text-red-600 rounded-md max-w-xl mx-auto overflow-auto text-xs">
          <strong>Debug Info:</strong>
          <pre>{JSON.stringify({ serviceId, serviceRes, serviceError }, null, 2)}</pre>
        </div>
        <Button className="mt-4" onClick={() => router.push("/services")}>Back to Services</Button>
      </div>
    );
  }

  // Find availability for the selected date
  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const dayAvailability = availabilityData.find((a) => {
    // some backends return ISO strings, some return YYYY-MM-DD
    const aDateStr = a.date.split("T")[0];
    return aDateStr === selectedDateStr;
  });
  
  // Dummy slots if backend availability is empty for demo purposes
  const timeSlots = dayAvailability?.timeSlots?.length 
    ? dayAvailability.timeSlots 
    : [
        { id: "1", startTime: "09:00", endTime: "10:00", isBooked: false },
        { id: "2", startTime: "11:00", endTime: "12:00", isBooked: true },
        { id: "3", startTime: "14:00", endTime: "15:00", isBooked: false },
        { id: "4", startTime: "16:00", endTime: "17:00", isBooked: false },
      ];

  const handleNextStep = () => {
    if (step === 2 && (!selectedDate || !selectedTimeSlot)) {
      toast.error("Please select a date and time");
      return;
    }
    setStep((s) => s + 1);
  };

  const handleConfirm = () => {
    if (!technicianId || !selectedDate || !selectedTimeSlot || !service) return;

    createBookingMutation.mutate({
      serviceId: service.id,
      technicianId: technicianId,
      availabilityId: dayAvailability?.id || selectedTimeSlot.id,
      price: service.startingPrice || (service as any).price || 0,
      
      // Fallbacks in case the backend also requires these fields
      bookingDate: new Date(selectedDate).toISOString(),
      timeSlotId: selectedTimeSlot.id,
      timeSlot: `${selectedTimeSlot.startTime} - ${selectedTimeSlot.endTime}`, 
      notes,
    } as any, {
      onSuccess: () => {
        toast.success("Booking confirmed successfully!");
        router.push("/dashboard/bookings");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to create booking. Please try again.");
      }
    });
  };

  return (
    <div>
      {/* Stepper */}
      <div className="mb-8 flex items-center justify-between">
        {[
          { num: 1, label: "Service" },
          { num: 2, label: "Schedule" },
          { num: 3, label: "Confirm" },
        ].map((s, i, arr) => (
          <div key={s.num} className="flex flex-1 items-center">
            <div className={`flex flex-col items-center ${s.num <= step ? "text-blue-600 dark:text-blue-500" : "text-neutral-400"}`}>
              <div className={`flex size-8 items-center justify-center rounded-full border-2 text-sm font-bold ${s.num <= step ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30" : "border-neutral-300"}`}>
                {s.num < step ? <CheckCircle2 className="size-5" /> : s.num}
              </div>
              <span className="mt-2 hidden text-xs font-medium sm:block">{s.label}</span>
            </div>
            {i < arr.length - 1 && (
              <div className={`mx-2 h-0.5 flex-1 ${s.num < step ? "bg-blue-600 dark:bg-blue-500" : "bg-neutral-200 dark:bg-neutral-800"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Service Confirmation */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Confirm Service Details</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <Clock className="size-8" />
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">{service.name || (service as any).title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{service.description || "No description provided for this service."}</p>
                  <div className="flex flex-wrap gap-4 text-sm font-medium text-neutral-900 dark:text-neutral-200">
                    <div className="flex items-center gap-1.5"><Clock className="size-4 text-neutral-500" /> ~{service.duration || 60} mins</div>
                    <div className="font-bold text-blue-600 dark:text-blue-400">Starting at {formatCurrency(service.startingPrice || (service as any).price || 0)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button onClick={handleNextStep}>Continue to Schedule <ChevronRight className="ml-2 size-4" /></Button>
          </div>
        </div>
      )}

      {/* Step 2: Choose Schedule */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Choose Date & Time</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-0 shadow-none bg-transparent">
              <CardContent className="p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                  className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950 mx-auto"
                />
              </CardContent>
            </Card>
            
            <div>
              <h3 className="mb-4 font-semibold text-neutral-900 dark:text-white">Available Time Slots</h3>
              {availLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="size-6 animate-spin text-neutral-400" /></div>
              ) : !selectedDate ? (
                <p className="text-sm text-neutral-500">Please select a date first.</p>
              ) : timeSlots.length === 0 ? (
                <p className="text-sm text-neutral-500">No time slots available for this date.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      disabled={slot.isBooked}
                      onClick={() => setSelectedTimeSlot(slot as TimeSlot)}
                      className={`flex items-center justify-center rounded-lg border py-3 text-sm font-medium transition-colors ${
                        slot.isBooked
                          ? "cursor-not-allowed border-neutral-100 bg-neutral-50 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-600"
                          : selectedTimeSlot?.id === slot.id
                          ? "border-blue-600 bg-blue-600 text-white shadow-md dark:bg-blue-500 dark:text-neutral-950"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-blue-300 hover:bg-blue-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      }`}
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={handleNextStep} disabled={!selectedDate || !selectedTimeSlot}>Review Booking <ChevronRight className="ml-2 size-4" /></Button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Review & Confirm</h2>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-neutral-500">Service</p>
                  <p className="font-semibold text-neutral-900 dark:text-white">{service.name || (service as any).title}</p>
                  <p className="text-sm text-neutral-600">{formatCurrency(service.startingPrice || (service as any).price || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Technician</p>
                  <p className="font-semibold text-neutral-900 dark:text-white">{service?.technician?.user?.name || "Technician"}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Date & Time</p>
                  <p className="font-semibold text-neutral-900 dark:text-white">{selectedDate ? format(selectedDate, "PPP") : ""}</p>
                  <p className="text-sm text-neutral-600">{selectedTimeSlot?.startTime}</p>
                </div>
              </div>
              
              <div className="border-t border-neutral-100 pt-6 dark:border-neutral-800">
                <p className="mb-2 text-sm font-medium text-neutral-900 dark:text-white">Add Notes for Technician (Optional)</p>
                <Textarea 
                  placeholder="E.g., Please ring the doorbell upon arrival..." 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white" 
              onClick={handleConfirm}
              disabled={createBookingMutation.isPending}
            >
              {createBookingMutation.isPending ? <><Loader2 className="mr-2 size-4 animate-spin" /> Confirming...</> : "Confirm Booking"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
