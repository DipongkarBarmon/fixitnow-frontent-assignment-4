"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Edit2,
  Trash2,
  Wrench,
  Clock,
  DollarSign,
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  FolderTree,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
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
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { CardSkeleton } from "@/components/shared/loading";
import { useCategories, useServices } from "@/hooks";
import { formatCurrency } from "@/utils/format";
import type { Service } from "@/types";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { CreateServiceForm } from "../_components/create-service-form";
import { EditServiceForm } from "../_components/edit-service-form";
import { deleteServiceAction, getTechnicianServicesAction } from "../_actions/serviceAction";
import { QUERY_KEYS } from "@/constants";

export default function TechnicianServicesPage() {
  const { data: servicesRes, isLoading: servicesLoading } = useQuery({
    queryKey: ["getTechnicianServicesAction"],
    queryFn: () => getTechnicianServicesAction(),
  });
  const { data: categoriesRes } = useCategories();
  const queryClient = useQueryClient();

  let services: Service[] = [];
  if (Array.isArray(servicesRes?.data)) {
    services = servicesRes.data;
  } else if (servicesRes?.data && Array.isArray((servicesRes.data as any).data)) {
    services = (servicesRes.data as any).data;
  } else if (Array.isArray(servicesRes)) {
    services = servicesRes as unknown as Service[];
  }

  const categories = categoriesRes?.data ?? [];

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deletingServiceId) return;
    setIsDeleting(true);
    try {
      const result = await deleteServiceAction(deletingServiceId);
      if (result.success) {
        toast.success("Service deleted successfully");
        setDeletingServiceId(null);
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICES.ALL });
        void queryClient.invalidateQueries({ queryKey: ["getTechnicianServicesAction"] });
      } else {
        toast.error(result.message || "Failed to delete service");
      }
    } catch {
      toast.error("Failed to delete service. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter services
  const filteredServices = services.filter((s) => {
    // Backend may return `title` and `price` instead of `name` and `startingPrice`
    const serviceName = (s as any).title || s.name || "";
    const matchesSearch =
      !search ||
      serviceName.toLowerCase().includes(search.toLowerCase()) ||
      (s.description || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "ALL" || s.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            My Services
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Create, edit, and organize the services and pricing you offer to customers.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
        >
          <Plus className="size-4" /> Add Service
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search your services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Services Grid */}
      {servicesLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredServices.length === 0 ? (
        <EmptyState
          title="No services found"
          description="Add your first service to start accepting customer orders."
          actionLabel="Add Service"
          onAction={() => setIsCreateOpen(true)}
          className="py-12"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="flex flex-col justify-between border-neutral-200 transition-all hover:shadow-md dark:border-neutral-800"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge variant="secondary" className="mb-2 flex w-fit items-center gap-1.5 text-xs font-medium">
                      {service.category?.icon && (
                        <div className="relative size-3.5 overflow-hidden rounded-[2px]">
                          <Image
                            src={service.category.icon}
                            alt={service.category?.name || "Icon"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span>{service.category?.name || "General Service"}</span>
                    </Badge>
                    <CardTitle className="text-lg font-bold text-neutral-900 dark:text-white">
                      {(service as any).title || service.name || "Unnamed Service"}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                      onClick={() => setEditingService(service)}
                    >
                      <Edit2 className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                      onClick={() => setDeletingServiceId(service.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="line-clamp-2 text-xs">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 pb-4">
                <div className="mt-2 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Clock className="size-3.5" />
                    <span>{service.duration || 60} mins</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-neutral-400">Starting at</span>
                    <p className="text-lg font-bold text-neutral-900 dark:text-white">
                      {formatCurrency((service as any).price || service.startingPrice || 0)}
                    </p>
                  </div>
                </div>

                {/* Booking Stats and Actions */}
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800" asChild>
                    <Link href="/technician-dashboard/availability">
                      <Calendar className="size-3.5" />
                      Availability
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800" asChild>
                    <Link href={`/technician-dashboard/bookings?serviceId=${service.id}`}>
                      <ShoppingBag className="size-3.5" />
                      Bookings
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Service Dialog */}
      <CreateServiceForm
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        categories={categories}
      />

      {/* Edit Service Dialog */}
      <EditServiceForm
        service={editingService}
        onClose={() => setEditingService(null)}
        categories={categories}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingServiceId}
        onOpenChange={(open) => !open && setDeletingServiceId(null)}
        title="Delete Service"
        description="Are you sure you want to remove this service? Existing completed bookings will not be affected."
        confirmLabel="Delete Service"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
