"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Wrench,
  Plus,
  Edit2,
  Trash2,
  Clock,
  DollarSign,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Loader2,
  FolderTree,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  useServices,
  useCategories,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from "@/hooks";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Service } from "@/types";

const serviceSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  startingPrice: z.number().min(50, "Starting price must be at least 50 BDT"),
  duration: z.number().min(15, "Duration must be at least 15 minutes"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type ServiceFormValues = {
  name: string;
  categoryId: string;
  startingPrice: number;
  duration: number;
  description: string;
};

export default function AdminServicesPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  const { data: servicesRes, isLoading } = useServices({
    page,
    limit: 10,
    categoryId: categoryFilter === "ALL" ? undefined : categoryFilter,
    search: search || undefined,
  });
  const { data: categoriesRes } = useCategories();

  const createMutation = useCreateService();
  const updateMutation = useUpdateService(editingService?.id || "");
  const deleteMutation = useDeleteService();

  const services: Service[] = servicesRes?.data ?? [];
  const categories = categoriesRes?.data ?? [];
  const meta = servicesRes?.meta;

  const createForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      startingPrice: 500,
      duration: 60,
      description: "",
    },
  });

  const editForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      startingPrice: 500,
      duration: 60,
      description: "",
    },
  });

  const handleOpenEdit = (service: Service) => {
    setEditingService(service);
    editForm.reset({
      name: service.name,
      categoryId: service.categoryId,
      startingPrice: service.startingPrice,
      duration: service.duration || 60,
      description: service.description || "",
    });
  };

  const handleCreateSubmit = async (values: ServiceFormValues) => {
    try {
      await createMutation.mutateAsync({
        name: values.name,
        categoryId: values.categoryId,
        startingPrice: values.startingPrice,
        duration: values.duration,
        description: values.description,
      });
      toast.success("Service created successfully!");
      setIsCreateOpen(false);
      createForm.reset();
    } catch {
      toast.error("Failed to create service");
    }
  };

  const handleEditSubmit = async (values: ServiceFormValues) => {
    if (!editingService) return;
    try {
      await updateMutation.mutateAsync({
        name: values.name,
        categoryId: values.categoryId,
        startingPrice: values.startingPrice,
        duration: values.duration,
        description: values.description,
      });
      toast.success("Service updated successfully!");
      setEditingService(null);
    } catch {
      toast.error("Failed to update service");
    }
  };

  const handleDelete = async () => {
    if (!deletingService) return;
    try {
      await deleteMutation.mutateAsync(deletingService.id);
      toast.success(`Service "${deletingService.name}" deleted successfully`);
      setDeletingService(null);
    } catch {
      toast.error("Failed to delete service");
    }
  };

  const columns: ColumnDef<Service>[] = [
    {
      key: "name",
      header: "Service",
      sortable: true,
      cell: (service) => (
        <div>
          <p className="font-semibold text-neutral-900 dark:text-white text-sm">{service.name}</p>
          <p className="text-xs text-neutral-500 line-clamp-1">{service.description}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (service) => (
        <Badge variant="secondary" className="text-xs font-medium">
          {service.category?.name || "General"}
        </Badge>
      ),
    },
    {
      key: "startingPrice",
      header: "Price",
      sortable: true,
      cell: (service) => (
        <span className="font-bold text-neutral-900 dark:text-white text-sm">
          {formatCurrency(service.startingPrice)}
        </span>
      ),
    },
    {
      key: "duration",
      header: "Est. Duration",
      hideOnMobile: true,
      cell: (service) => (
        <span className="text-xs text-neutral-500">{service.duration || 60} mins</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (service) => (
        <Badge
          variant="outline"
          className={
            service.isActive !== false
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs"
              : "border-neutral-200 text-neutral-500 text-xs"
          }
        >
          {service.isActive !== false ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (service) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            onClick={() => handleOpenEdit(service)}
          >
            <Edit2 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
            onClick={() => setDeletingService(service)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            Services Catalog Management
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Create, update, and manage all services offered across the platform.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
        >
          <Plus className="size-4" /> Add New Service
        </Button>
      </div>

      {/* Category Filter */}
      <Card className="border-neutral-200 dark:border-neutral-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Filter by Category
            </span>
            <Select
              value={categoryFilter}
              onValueChange={(val) => {
                setCategoryFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[220px]">
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
        </CardContent>
      </Card>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={services}
        rowKey="id"
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search services..."
        emptyMessage="No services found"
        emptyDescription="Create a service or adjust your category filter."
        meta={meta}
        onPageChange={setPage}
      />

      {/* Create Service Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Platform Service</DialogTitle>
            <DialogDescription>
              Define name, category, baseline pricing, and description.
            </DialogDescription>
          </DialogHeader>

          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Full House Deep Sanitization" {...field} />
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
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
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
                  name="startingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting Price (৳)</FormLabel>
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
                      <FormLabel>Duration (mins)</FormLabel>
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

              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="Comprehensive description of the service..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" /> Creating...
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

      {/* Edit Service Dialog */}
      <Dialog open={!!editingService} onOpenChange={(open) => !open && setEditingService(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Modify service parameters for {editingService?.name}
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
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
                  name="startingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting Price (৳)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="50"
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
                      <FormLabel>Duration (mins)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="15"
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
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setEditingService(null)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" /> Saving...
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingService}
        onOpenChange={(open) => !open && setDeletingService(null)}
        title="Delete Service"
        description={`Are you sure you want to delete "${deletingService?.name}" from the platform catalog?`}
        confirmLabel="Delete Service"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
