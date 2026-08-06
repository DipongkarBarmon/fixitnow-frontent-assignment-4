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
  RotateCw,
  Copy,
  Check,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  Loader2,
  Info,
  Wrench,
  Zap,
  Droplet,
  Hammer,
  Paintbrush,
  Flame,
  Tv,
  Shield,
  LayoutGrid,
  List,
  ArrowUpDown,
  Search,
  SlidersHorizontal,
  ImageIcon,
  Link as LinkIcon,
  X,
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
  FormDescription,
} from "@/components/ui/form";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useCategories } from "@/hooks";
import createCategoryAction, {
  updateCategoryAction,
  deleteCategoryAction,
} from "@/app/(dashboardGroup)/admin-dashboard/_actions/categoryAction";
import { formatDate } from "@/utils/format";
import { categorySchema, type CategoryFormValues } from "@/lib/validations";
import type { Category } from "@/types";

// Curated Category Image Presets
const CURATED_IMAGE_PRESETS = [
  {
    id: "electrical",
    label: "Electrical",
    url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "plumbing",
    label: "Plumbing",
    url: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "cleaning",
    label: "Cleaning",
    url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "carpentry",
    label: "Carpentry",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "painting",
    label: "Painting",
    url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "appliance",
    label: "HVAC & AC",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "electronics",
    label: "Electronics",
    url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "security",
    label: "Security",
    url: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "roofing",
    label: "Roofing",
    url: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "gardening",
    label: "Gardening",
    url: "https://images.unsplash.com/photo-1558904541-efa8c4a08931?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "masonry",
    label: "Masonry",
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "solar",
    label: "Solar Energy",
    url: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80",
  },
];

const ICON_PRESETS = [
  { label: "Repair", value: "Wrench", icon: Wrench },
  { label: "Electrical", value: "Zap", icon: Zap },
  { label: "Plumbing", value: "Droplet", icon: Droplet },
  { label: "Cleaning", value: "Sparkles", icon: Sparkles },
  { label: "Carpentry", value: "Hammer", icon: Hammer },
  { label: "Painting", value: "Paintbrush", icon: Paintbrush },
  { label: "HVAC", value: "Flame", icon: Flame },
  { label: "Electronics", value: "Tv", icon: Tv },
  { label: "Security", value: "Shield", icon: Shield },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name" | "services">("newest");

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Queries
  const {
    data: categoriesRes,
    isLoading,
    isRefetching,
    refetch: refetchCategories,
  } = useCategories();

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
    const currentImg = category.image || (category.icon && category.icon.startsWith("http") ? category.icon : category.icon || "");
    editForm.reset({
      name: category.name,
      description: category.description || "",
      icon: currentImg,
    });
  };

  const handleCreateSubmit = async (values: CategoryFormValues) => {
    setIsCreating(true);
    try {
      const res = await createCategoryAction({
        name: values.name.trim(),
        description: values.description?.trim(),
        icon: values.icon?.trim(),
      });
      if (!res.success) {
        toast.error(res.message || "Failed to create category");
        return;
      }
      toast.success(res.message || "Category created successfully!");
      setIsCreateOpen(false);
      createForm.reset();
      void refetchCategories();
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to create category");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditSubmit = async (values: CategoryFormValues) => {
    if (!editingCategory) return;
    setIsUpdating(true);
    try {
      const res = await updateCategoryAction(editingCategory.id, {
        name: values.name.trim(),
        description: values.description?.trim(),
        icon: values.icon?.trim(),
      });
      if (!res.success) {
        toast.error(res.message || "Failed to update category");
        return;
      }
      toast.success(res.message || "Category updated successfully!");
      setEditingCategory(null);
      void refetchCategories();
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to update category");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      const res = await deleteCategoryAction(deletingCategory.id);
      if (!res.success) {
        toast.error(res.message || "Failed to delete category");
        return;
      }
      toast.success(res.message || `Category "${deletingCategory.name}" deleted successfully`);
      setDeletingCategory(null);
      void refetchCategories();
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter & Sort
  const filteredAndSortedCategories = categories
    .filter((c) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.slug?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "oldest") {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeA - timeB;
      }
      if (sortBy === "services") {
        return (b.serviceCount || 0) - (a.serviceCount || 0);
      }
      // default: newest
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

  const totalServices = categories.reduce((sum, cat) => sum + (cat.serviceCount || 0), 0);

  const columns: ColumnDef<Category>[] = [
    {
      key: "name",
      header: "Category Name",
      sortable: true,
      cell: (cat) => {
        const imageUrl = cat.image || (cat.icon && cat.icon.startsWith("http") ? cat.icon : null);
        return (
          <div className="flex items-center gap-3">
            {imageUrl ? (
              <div className="relative size-9.5 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 shadow-xs dark:border-neutral-800 dark:bg-neutral-800">
                <img
                  src={imageUrl}
                  alt={cat.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex size-9.5 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 font-bold text-xs shadow-xs">
                {cat.icon ? cat.icon.slice(0, 2).toUpperCase() : <FolderTree className="size-4" />}
              </div>
            )}
            <div className="min-w-0">
              <button
                onClick={() => handleOpenEdit(cat)}
                className="text-left font-semibold text-neutral-900 hover:text-teal-600 dark:text-white dark:hover:text-teal-400 text-sm transition-colors truncate block"
              >
                {cat.name}
              </button>
              <p className="text-xs text-neutral-500 line-clamp-1">{cat.description || "No description"}</p>
            </div>
          </div>
        );
      },
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
            className="size-8 rounded-lg text-neutral-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:text-teal-400 dark:hover:bg-teal-950/50"
            title="Edit Category"
            onClick={() => handleOpenEdit(cat)}
          >
            <Edit2 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/50"
            title="Delete Category"
            onClick={() => setDeletingCategory(cat)}
          >
            <Trash2 className="size-4" />
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg text-teal-600 hover:text-teal-800 hover:bg-teal-50 dark:hover:bg-teal-950/50"
            title="Open in Marketplace"
          >
            <Link href={`/services?category=${cat.slug || cat.id}`} target="_blank">
              <ExternalLink className="size-4" />
            </Link>
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

      {/* Controls Bar: Search, Sort, View Toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-neutral-200 bg-white p-3 shadow-xs dark:border-neutral-800 dark:bg-neutral-950">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search categories by name, slug, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm h-9 border-neutral-200 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Sorting */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="size-3.5 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Alphabetical (A-Z)</option>
              <option value="services">Most Services</option>
            </select>
          </div>

          {/* View Switcher (Grid vs Table) */}
          <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 dark:border-neutral-800 dark:bg-neutral-900">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-white text-teal-700 shadow-xs dark:bg-neutral-800 dark:text-teal-300"
                  : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="size-3.5" />
              <span className="hidden md:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                viewMode === "table"
                  ? "bg-white text-teal-700 shadow-xs dark:bg-neutral-800 dark:text-teal-300"
                  : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400"
              }`}
              title="Table View"
            >
              <List className="size-3.5" />
              <span className="hidden md:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Card Grid View OR Table View */}
      {viewMode === "grid" ? (
        <div>
          {isLoading ? (
            /* Skeleton Loading Grid */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="h-44 w-full bg-neutral-200 dark:bg-neutral-800" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-3/4 rounded-md bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-3.5 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-3.5 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="h-3.5 w-20 rounded bg-neutral-200 dark:bg-neutral-800" />
                      <div className="flex gap-1.5">
                        <div className="size-7 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                        <div className="size-7 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAndSortedCategories.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/50 py-16 px-4 text-center dark:border-neutral-800 dark:bg-neutral-900/30">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400 shadow-sm">
                <FolderTree className="size-7" />
              </div>
              <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-white">
                {search ? "No matching categories" : "No categories found"}
              </h3>
              <p className="mt-1 max-w-sm text-xs text-neutral-500 dark:text-neutral-400">
                {search
                  ? `No category matches "${search}". Try another keyword or clear search.`
                  : "Create your first category to start organizing platform services."}
              </p>
              <div className="mt-5 flex gap-2">
                {search && (
                  <Button variant="outline" size="sm" onClick={() => setSearch("")}>
                    Clear Search
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => setIsCreateOpen(true)}
                  className="gap-1.5 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  <Plus className="size-3.5" /> Quick Add Category
                </Button>
              </div>
            </div>
          ) : (
            /* Aesthetic Category Card Grid */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAndSortedCategories.map((category) => {
                const imageUrl =
                  category.image ||
                  (category.icon && category.icon.startsWith("http") ? category.icon : null);

                return (
                  <Card
                    key={category.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-500/40 hover:shadow-xl hover:shadow-teal-500/10 dark:border-neutral-800/80 dark:bg-neutral-900"
                  >
                    <div>
                      {/* Media Header with Smooth Zoom & Dark Glass Badges */}
                      <div className="relative h-44 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={category.name}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-500/10 via-teal-600/20 to-teal-800/30">
                            <FolderTree className="size-12 text-teal-600/40" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                          <Badge className="bg-black/60 backdrop-blur-md text-white border-white/15 text-[10px] font-semibold px-2.5 py-0.5 shadow-sm">
                            <Layers className="size-3 mr-1 text-teal-400 inline" />
                            {category.serviceCount ?? 0} Services
                          </Badge>
                          <Badge variant="outline" className="bg-white/90 backdrop-blur-md text-neutral-800 border-0 text-[10px] font-mono px-2 py-0.5 dark:bg-neutral-950/80 dark:text-neutral-200 shadow-sm">
                            /{category.slug || "category"}
                          </Badge>
                        </div>

                        {/* Overlapping Bottom Floating Icon Badge */}
                        <div className="absolute -bottom-4 left-4 flex size-11 items-center justify-center rounded-2xl bg-white dark:bg-neutral-900 p-1 shadow-lg ring-4 ring-white dark:ring-neutral-900 transition-transform duration-300 group-hover:scale-110">
                          <div className="flex size-full items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/15 to-teal-700/25 text-teal-700 dark:text-teal-300 font-bold text-xs shadow-xs">
                            {category.icon && !category.icon.startsWith("http") ? (
                              category.icon.slice(0, 2).toUpperCase()
                            ) : (
                              <FolderTree className="size-4" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="pt-6 p-4 space-y-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(category)}
                          className="w-full text-left font-bold text-neutral-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 text-base transition-colors line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400"
                          title={`Edit ${category.name}`}
                        >
                          {category.name}
                        </button>

                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed min-h-[32px]">
                          {category.description || "No description provided for this category."}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer Actions & Date */}
                    <div className="p-4 pt-0">
                      <div className="flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800/80">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400">
                          <Calendar className="size-3 text-neutral-400" />
                          <span>{formatDate(category.createdAt)}</span>
                        </div>

                        {/* Action Buttons (Edit, Delete, Marketplace Link - No Eye Button) */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7.5 rounded-lg text-neutral-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:text-teal-400 dark:hover:bg-teal-950/50 transition-colors"
                            title="Edit Category"
                            onClick={() => handleOpenEdit(category)}
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/50 transition-colors"
                            title="Delete Category"
                            onClick={() => setDeletingCategory(category)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="size-7.5 rounded-lg text-teal-600 hover:text-teal-800 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/50 transition-colors"
                            title="View in Marketplace"
                          >
                            <Link href={`/services?category=${category.slug || category.id}`} target="_blank">
                              <ExternalLink className="size-3.5" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Data Table View */
        <DataTable
          columns={columns}
          data={filteredAndSortedCategories}
          isLoading={isLoading}
          searchable={false}
          emptyMessage="No categories found"
          emptyDescription="Create your first category to start organizing platform services."
        />
      )}

      {/* Create Category Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
              <FolderPlus className="size-5" />
              <DialogTitle>Add New Category</DialogTitle>
            </div>
            <DialogDescription>
              Create a new category for services on the FixItNow platform (calls <code className="font-mono text-[11px] text-teal-600 dark:text-teal-400">POST /api/category/create-category</code>).
            </DialogDescription>
          </DialogHeader>

          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Electrical & Wiring" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image URL & Preset Selection */}
              <FormField
                control={createForm.control}
                name="icon"
                render={({ field }) => {
                  const isImgValid = field.value?.startsWith("http://") || field.value?.startsWith("https://");
                  return (
                    <FormItem className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center gap-1.5">
                          <ImageIcon className="size-3.5 text-teal-600 dark:text-teal-400" />
                          <span>Image URL</span>
                        </FormLabel>
                        <span className="text-[11px] text-neutral-400">Web image link or preset</span>
                      </div>

                      {/* Image Input with Thumbnail Preview */}
                      <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                          <Input
                            placeholder="https://images.unsplash.com/... (paste image link)"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="pl-8 pr-8 text-xs font-mono"
                          />
                          <LinkIcon className="absolute left-2.5 top-3 size-3.5 text-neutral-400" />
                          {field.value && (
                            <button
                              type="button"
                              onClick={() => field.onChange("")}
                              className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                            >
                              <X className="size-4" />
                            </button>
                          )}
                        </div>

                        {isImgValid && (
                          <div className="relative size-9 shrink-0 overflow-hidden rounded-lg border border-teal-500/40 shadow-xs bg-neutral-100 dark:bg-neutral-800">
                            <img
                              src={field.value}
                              alt="Preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {/* Curated Presets Grid */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] text-neutral-500">
                          <span className="font-medium text-neutral-700 dark:text-neutral-300">
                            Or choose from presets:
                          </span>
                          <span>Click to apply</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
                          {CURATED_IMAGE_PRESETS.map((preset) => {
                            const isSelected = field.value === preset.url;
                            return (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => field.onChange(preset.url)}
                                className={`group relative overflow-hidden rounded-lg border text-left transition-all ${
                                  isSelected
                                    ? "border-teal-500 ring-2 ring-teal-500/30"
                                    : "border-neutral-200 bg-white hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900"
                                }`}
                              >
                                <div className="relative h-10 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                  <img
                                    src={preset.url}
                                    alt={preset.label}
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                  <span className="absolute bottom-0.5 left-1 right-1 truncate text-[9px] font-bold text-white">
                                    {preset.label}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief summary of services included in this category..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between text-[11px] text-neutral-400">
                      <span>Minimum 5 characters</span>
                      <span>{field.value?.length || 0}/500</span>
                    </div>
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
                  disabled={isCreating}
                >
                  {isCreating ? (
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
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
              <Edit2 className="size-5" />
              <DialogTitle>Edit Category</DialogTitle>
            </div>
            <DialogDescription>
              Update details for &quot;{editingCategory?.name}&quot; (calls <code className="font-mono text-[11px] text-teal-600 dark:text-teal-400">PUT /api/category/update-category/:categoryId</code>).
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
              {/* Field 1: Category Name */}
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Electrical & Wiring" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Field 2: Image URL with Live Thumbnail Preview & One-Click Presets */}
              <FormField
                control={editForm.control}
                name="icon"
                render={({ field }) => {
                  const isImgValid = field.value?.startsWith("http://") || field.value?.startsWith("https://");
                  return (
                    <FormItem className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center gap-1.5">
                          <ImageIcon className="size-3.5 text-teal-600 dark:text-teal-400" />
                          <span>Image URL</span>
                        </FormLabel>
                        <span className="text-[11px] text-neutral-400">Web image link or preset</span>
                      </div>

                      {/* URL input + live preview */}
                      <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                          <Input
                            placeholder="https://images.unsplash.com/... (paste image link)"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="pl-8 pr-8 text-xs font-mono"
                          />
                          <LinkIcon className="absolute left-2.5 top-3 size-3.5 text-neutral-400" />
                          {field.value && (
                            <button
                              type="button"
                              onClick={() => field.onChange("")}
                              className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                            >
                              <X className="size-4" />
                            </button>
                          )}
                        </div>

                        {isImgValid && (
                          <div className="relative size-9 shrink-0 overflow-hidden rounded-lg border border-teal-500/40 shadow-xs bg-neutral-100 dark:bg-neutral-800">
                            <img
                              src={field.value}
                              alt="Preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {/* One-Click Presets Selection */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] text-neutral-500">
                          <span className="font-medium text-neutral-700 dark:text-neutral-300">
                            Or choose from presets:
                          </span>
                          <span>Click to apply</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
                          {CURATED_IMAGE_PRESETS.map((preset) => {
                            const isSelected = field.value === preset.url;
                            return (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => field.onChange(preset.url)}
                                className={`group relative overflow-hidden rounded-lg border text-left transition-all ${
                                  isSelected
                                    ? "border-teal-500 ring-2 ring-teal-500/30"
                                    : "border-neutral-200 bg-white hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900"
                                }`}
                              >
                                <div className="relative h-10 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                  <img
                                    src={preset.url}
                                    alt={preset.label}
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                  <span className="absolute bottom-0.5 left-1 right-1 truncate text-[9px] font-bold text-white">
                                    {preset.label}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Field 3: Category Description */}
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of this category..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between text-[11px] text-neutral-400">
                      <span>Minimum 5 characters</span>
                      <span>{field.value?.length || 0}/500</span>
                    </div>
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
                  disabled={isUpdating}
                >
                  {isUpdating ? (
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
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
