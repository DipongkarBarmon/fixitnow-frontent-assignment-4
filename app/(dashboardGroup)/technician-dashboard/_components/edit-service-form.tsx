"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateServiceAction } from "../_actions/serviceAction";
import type { Category, Service } from "@/types";
import { QUERY_KEYS } from "@/constants";

const serviceSchema = z.object({
  title: z.string().min(2, "Service title must be at least 2 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  price: z.number().min(50, "Price must be at least 50 BDT"),
  duration: z.number().min(15, "Duration must be at least 15 minutes"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  certificates: z.string().optional(),
  experienceYears: z.number().min(0, "Experience years cannot be negative").optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface EditServiceFormProps {
  service: Service | null;
  onClose: () => void;
  categories: Category[];
}

export function EditServiceForm({ service, onClose, categories }: EditServiceFormProps) {
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

  const editForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      price: 500,
      duration: 60,
      description: "",
      certificates: "",
      experienceYears: 0,
    },
  });

  useEffect(() => {
    if (service) {
      editForm.reset({
        title: service.name || "",
        categoryId: service.categoryId || "",
        price: service.startingPrice || 500,
        duration: service.duration || 60,
        description: service.description || "",
        certificates: service.certificates?.join(", ") || "",
        experienceYears: service.experienceYears || 0,
      });
    }
  }, [service, editForm]);

  const handleEditSubmit = async (values: ServiceFormValues) => {
    if (!service) return;
    setIsPending(true);
    try {
      const result = await updateServiceAction(service.id, {
        title: values.title,
        categoryId: values.categoryId,
        price: values.price,
        duration: values.duration,
        description: values.description,
        certificates: values.certificates
          ? values.certificates.split(",").map((c) => c.trim()).filter(Boolean)
          : [],
        experienceYears: values.experienceYears || 0,
      });

      if (result.success) {
        toast.success("Service updated successfully!");
        onClose();
        // Invalidate services query so the page reflects the new data
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICES.ALL });
        void queryClient.invalidateQueries({ queryKey: ["getTechnicianServicesAction"] });
      } else {
        toast.error(result.message || "Failed to update service.");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={!!service} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogDescription>
            Update pricing or service details for {service?.name}.
          </DialogDescription>
        </DialogHeader>

        <Form {...editForm}>
          <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
            <FormField
              control={editForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Master Bathroom Pipe Repair" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editForm.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={editForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (৳)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="50"
                        placeholder="500"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Est. Duration (mins)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="15"
                        placeholder="60"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={editForm.control}
                name="certificates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificates (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ISO 9001, Plumber Cert" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="experienceYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        placeholder="2"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={editForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed breakdown of what is included in this service..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
