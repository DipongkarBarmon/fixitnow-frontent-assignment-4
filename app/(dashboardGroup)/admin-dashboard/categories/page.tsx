"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Search,
  Wrench,
  Loader2,
  Sparkles,
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
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks";
import { formatDate } from "@/utils/format";
import type { Category } from "@/types";

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters").optional().or(z.literal("")),
  icon: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const { data: categoriesRes, isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory(editingCategory?.id || "");
  const deleteMutation = useDeleteCategory();

  const categories: Category[] = categoriesRes?.data ?? [];

  const createForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "", icon: "" },
  });

  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "", icon: "" },
  });

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    editForm.reset({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "",
    });
  };

  const handleCreateSubmit = async (values: CategoryFormValues) => {
    try {
      await createMutation.mutateAsync({
        name: values.name,
        description: values.description,
        icon: values.icon,
      });
      toast.success("Category created successfully!");
      setIsCreateOpen(false);
      createForm.reset();
    } catch {
      toast.error("Failed to create category");
    }
  };

  const handleEditSubmit = async (values: CategoryFormValues) => {
    if (!editingCategory) return;
    try {
      await updateMutation.mutateAsync({
        name: values.name,
        description: values.description,
        icon: values.icon,
      });
      toast.success("Category updated successfully!");
      setEditingCategory(null);
    } catch {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    try {
      await deleteMutation.mutateAsync(deletingCategory.id);
      toast.success(`Category "${deletingCategory.name}" deleted`);
      setDeletingCategory(null);
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const filteredCategories = categories.filter((c) =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  const columns: ColumnDef<Category>[] = [
    {
      key: "name",
      header: "Category Name",
      sortable: true,
      cell: (cat) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 font-bold text-sm">
            {cat.icon ? cat.icon.slice(0, 2).toUpperCase() : <FolderTree className="size-4" />}
          </div>
          <div>
            <p className="font-semibold text-neutral-900 dark:text-white text-sm">{cat.name}</p>
            <p className="text-xs text-neutral-500 line-clamp-1">{cat.description || "No description"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      hideOnMobile: true,
      cell: (cat) => (
        <Badge variant="outline" className="font-mono text-xs">
          {cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}
        </Badge>
      ),
    },
    {
      key: "servicesCount",
      header: "Services Listed",
      cell: (cat) => (
        <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          {cat.serviceCount ?? "—"} services
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      hideOnMobile: true,
      cell: (cat) => (
        <span className="text-xs text-neutral-500">{formatDate(cat.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (cat) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            onClick={() => handleOpenEdit(cat)}
          >
            <Edit2 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
            onClick={() => setDeletingCategory(cat)}
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
            Category Management
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Create, categorize, and organize platform service categories.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold"
        >
          <Plus className="size-4" /> Add Category
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredCategories}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search categories..."
        emptyMessage="No categories found"
        emptyDescription="Create your first category to start organizing services."
      />

      {/* Create Category Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category for services on the FixItNow platform.
            </DialogDescription>
          </DialogHeader>

          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Electrical & Wiring" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon / Tag (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Zap, Wrench, Shield" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief summary of services included in this category..."
                        rows={3}
                        {...field}
                      />
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
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" /> Creating...
                    </>
                  ) : (
                    "Create Category"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category details for {editingCategory?.name}
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon / Tag</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white"
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
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        title="Delete Category"
        description={`Are you sure you want to delete the "${deletingCategory?.name}" category? Services under this category may need reassigning.`}
        confirmLabel="Delete Category"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
