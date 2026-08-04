"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FolderTree,
  FolderPlus,
  Plus,
  Edit2,
  Trash2,
  Eye,
  RotateCw,
  Copy,
  Check,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  Loader2,
  Info,
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
  useCategoryDetail,
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

// ─────────────────────────────────────────────────────────────────────────────
// Category Detail Modal (Fetches single category via router.get('/get-category/:categoryId'))
// ─────────────────────────────────────────────────────────────────────────────
function CategoryDetailDialog({
  categoryId,
  open,
  onOpenChange,
  onEdit,
}: {
  categoryId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (category: Category) => void;
}) {
  const [copied, setCopied] = useState(false);
  const { data: detailRes, isLoading, isError, refetch } = useCategoryDetail(categoryId ?? "");

  const category = detailRes?.data;

  const handleCopyId = () => {
    if (category?.id) {
      void navigator.clipboard.writeText(category.id);
      setCopied(true);
      toast.success("Category ID copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
              <FolderTree className="size-5" />
              <DialogTitle className="text-lg font-bold">Category Details</DialogTitle>
            </div>
            {category && (
              <Badge variant="outline" className="font-mono text-xs">
                {category.slug || "category"}
              </Badge>
            )}
          </div>
          <DialogDescription>
            Live category record fetched via backend endpoint <code className="font-mono text-[11px] text-teal-600 dark:text-teal-400">/get-category/:categoryId</code>
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2 className="size-8 animate-spin text-teal-600" />
            <p className="text-xs text-neutral-500">Loading category specifications...</p>
          </div>
        ) : isError || !category ? (
          <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 text-center dark:border-red-900/40 dark:bg-red-950/20">
            <p className="text-sm font-medium text-red-700 dark:text-red-300">
              Failed to load category details.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 gap-1.5"
              onClick={() => void refetch()}
            >
              <RotateCw className="size-3.5" /> Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {/* Main Header Preview */}
            <div className="flex items-start gap-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 font-bold text-base shadow-sm">
                {category.icon ? category.icon.slice(0, 2).toUpperCase() : <FolderTree className="size-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-neutral-900 dark:text-white text-base">
                  {category.name}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {category.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Specification Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-neutral-100 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950">
                <span className="text-neutral-400 text-[11px] block">Category ID</span>
                <div className="mt-1 flex items-center justify-between font-mono font-medium text-neutral-800 dark:text-neutral-200 truncate">
                  <span className="truncate">{category.id}</span>
                  <button
                    onClick={handleCopyId}
                    className="ml-1 p-1 hover:text-teal-600 transition-colors"
                    title="Copy ID"
                  >
                    {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-100 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950">
                <span className="text-neutral-400 text-[11px] block">Public URL Slug</span>
                <div className="mt-1 font-mono font-medium text-neutral-800 dark:text-neutral-200 truncate">
                  /{category.slug || category.name.toLowerCase().replace(/\s+/g, "-")}
                </div>
              </div>

              <div className="rounded-lg border border-neutral-100 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950">
                <span className="text-neutral-400 text-[11px] block">Services Listed</span>
                <div className="mt-1 flex items-center gap-1.5 font-semibold text-neutral-900 dark:text-white">
                  <Layers className="size-3.5 text-teal-600" />
                  <span>{category.serviceCount ?? 0} active services</span>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-100 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950">
                <span className="text-neutral-400 text-[11px] block">Created Date</span>
                <div className="mt-1 flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
                  <Calendar className="size-3.5 text-blue-500" />
                  <span>{formatDate(category.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Public Link Preview */}
            <div className="flex items-center justify-between rounded-lg border border-teal-100 bg-teal-50/50 px-3.5 py-2.5 dark:border-teal-900/30 dark:bg-teal-950/20">
              <span className="text-xs text-teal-800 dark:text-teal-300">
                View category on public marketplace
              </span>
              <Button asChild variant="ghost" size="sm" className="h-7 gap-1 text-xs text-teal-700 hover:text-teal-900 dark:text-teal-300">
                <Link href={`/services?category=${category.slug || category.id}`} target="_blank">
                  Explore <ExternalLink className="size-3" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {category && (
            <Button
              onClick={() => {
                onOpenChange(false);
                onEdit(category);
              }}
              className="gap-1.5 bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Edit2 className="size-3.5" /> Edit Category
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingCategoryId, setViewingCategoryId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Queries & Mutations
  const {
    data: categoriesRes,
    isLoading,
    isRefetching,
    refetch: refetchCategories,
  } = useCategories();

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
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
      const res = await createMutation.mutateAsync({
        name: values.name.trim(),
        description: values.description?.trim(),
        icon: values.icon?.trim(),
      });
      if (res?.success === false) {
        toast.error(res?.message || "Failed to create category");
        return;
      }
      toast.success("Category created successfully!");
      setIsCreateOpen(false);
      createForm.reset();
      void refetchCategories();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(error.response?.data?.message || error.message || "Failed to create category");
    }
  };

  const handleEditSubmit = async (values: CategoryFormValues) => {
    if (!editingCategory) return;
    try {
      const res = await updateMutation.mutateAsync({
        id: editingCategory.id,
        data: {
          name: values.name.trim(),
          description: values.description?.trim(),
          icon: values.icon?.trim(),
        },
      });
      if (res?.success === false) {
        toast.error(res?.message || "Failed to update category");
        return;
      }
      toast.success("Category updated successfully!");
      setEditingCategory(null);
      void refetchCategories();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(error.response?.data?.message || error.message || "Failed to update category");
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    try {
      const res = await deleteMutation.mutateAsync(deletingCategory.id);
      if (res?.success === false) {
        toast.error(res?.message || "Failed to delete category");
        return;
      }
      toast.success(`Category "${deletingCategory.name}" deleted successfully`);
      setDeletingCategory(null);
      void refetchCategories();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(error.response?.data?.message || error.message || "Failed to delete category");
    }
  };

  const filteredCategories = categories.filter((c) =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase()) ||
    c.slug?.toLowerCase().includes(search.toLowerCase())
  );

  const totalServices = categories.reduce((sum, cat) => sum + (cat.serviceCount || 0), 0);

  const columns: ColumnDef<Category>[] = [
    {
      key: "name",
      header: "Category Name",
      sortable: true,
      cell: (cat) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 font-bold text-xs shadow-sm">
            {cat.icon ? cat.icon.slice(0, 2).toUpperCase() : <FolderTree className="size-4" />}
          </div>
          <div>
            <button
              onClick={() => setViewingCategoryId(cat.id)}
              className="text-left font-semibold text-neutral-900 hover:text-teal-600 dark:text-white dark:hover:text-teal-400 text-sm transition-colors"
            >
              {cat.name}
            </button>
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
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          <Layers className="size-3.5 text-teal-600" />
          {cat.serviceCount ?? 0} services
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
            className="size-8 text-neutral-500 hover:text-teal-600 dark:hover:text-teal-400"
            title="View Details"
            onClick={() => setViewingCategoryId(cat.id)}
          >
            <Eye className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            title="Edit Category"
            onClick={() => handleOpenEdit(cat)}
          >
            <Edit2 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
            title="Delete Category"
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
            Create, categorize, and organize platform service categories via live endpoints.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="icon"
            onClick={() => void refetchCategories()}
            disabled={isLoading || isRefetching}
            className="border-neutral-200 dark:border-neutral-800"
            title="Refresh categories"
          >
            <RotateCw className={`size-4 ${isRefetching ? "animate-spin text-teal-600" : "text-neutral-600"}`} />
          </Button>
          <Button
            asChild
            variant="outline"
            className="gap-2 border-teal-200 text-teal-700 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-300 dark:hover:bg-teal-950/40"
          >
            <Link href="/admin-dashboard/categories/create">
              <FolderPlus className="size-4" /> Create Category Page
            </Link>
          </Button>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-sm"
          >
            <Plus className="size-4" /> Quick Add
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-neutral-200 shadow-sm dark:border-neutral-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total Categories</p>
              <h4 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                {isLoading ? "..." : categories.length}
              </h4>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
              <FolderTree className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-sm dark:border-neutral-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Cataloged Services</p>
              <h4 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                {isLoading ? "..." : totalServices}
              </h4>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              <Layers className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-sm dark:border-neutral-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Endpoint Status</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex size-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  /get-all-category (Active)
                </span>
              </div>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              <Sparkles className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredCategories}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search categories by name, slug, or description..."
        emptyMessage="No categories found"
        emptyDescription="Create your first category to start organizing platform services."
      />

      {/* View Category Detail Dialog (Fetches via /get-category/:categoryId) */}
      <CategoryDetailDialog
        categoryId={viewingCategoryId}
        open={!!viewingCategoryId}
        onOpenChange={(open) => !open && setViewingCategoryId(null)}
        onEdit={(cat) => handleOpenEdit(cat)}
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
