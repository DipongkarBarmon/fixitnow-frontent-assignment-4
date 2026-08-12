"use client";

import { useState } from "react";
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
import { createServiceAction } from "../_actions/serviceAction";
import type { Category } from "@/types";
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

interface CreateServiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
}

export function CreateServiceForm({ open, onOpenChange, categories }: CreateServiceFormProps) {
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

  const createForm = useForm<ServiceFormValues>({
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

  const handleCreateSubmit = async (values: ServiceFormValues) => {
    setIsPending(true);
    try {
      const result = await createServiceAction({
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
        toast.success("Service added successfully!");
        onOpenChange(false);
        createForm.reset();
        // Invalidate services query so the page reflects the new data
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICES.ALL });
        void queryClient.invalidateQueries({ queryKey: ["getTechnicianServicesAction"] });
      } else {
        toast.error(result.message || "Failed to create service.");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
          <DialogDescription>
            Provide details and pricing for the service you want to offer.
          </DialogDescription>
        </DialogHeader>

        <Form {...createForm}>
          <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
            <FormField
              control={createForm.control}
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
              control={createForm.control}
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
                control={createForm.control}
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
                control={createForm.control}
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
                control={createForm.control}
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
                control={createForm.control}
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
              control={createForm.control}
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
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
                    Creating...
                  </>
                ) : (
                  "Create Service"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
