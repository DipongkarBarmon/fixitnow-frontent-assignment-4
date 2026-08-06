"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  FolderPlus,
  ArrowLeft,
  Wrench,
  Zap,
  Sparkles,
  Shield,
  Droplet,
  Hammer,
  Paintbrush,
  Flame,
  Tv,
  CheckCircle2,
  Loader2,
  FolderTree,
  Eye,
  Info,
  ImageIcon,
  Link as LinkIcon,
  Check,
  X,
  Layers,
  Sparkle,
  TreePine,
  Laptop,
  CheckCheck,
  HelpCircle,
  Maximize2,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { QUERY_KEYS } from "@/constants";
import { categoryFormSchema, type CategoryFormInput } from "@/lib/validations";
import createCategoryAction from "../_actions/categoryAction";

// Visual Curated Category Image Presets for all service domains
const CURATED_IMAGE_PRESETS = [
  {
    id: "electrical",
    label: "Electrical",
    categoryName: "Electrical & Wiring Solutions",
    url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80",
    iconName: "Zap",
    accent: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: "plumbing",
    label: "Plumbing",
    categoryName: "Plumbing & Pipe Repair",
    url: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80",
    iconName: "Droplet",
    accent: "from-cyan-500/20 to-blue-500/20",
  },
  {
    id: "cleaning",
    label: "Cleaning",
    categoryName: "Home & Commercial Cleaning",
    url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80",
    iconName: "Sparkles",
    accent: "from-emerald-500/20 to-teal-500/20",
  },
  {
    id: "carpentry",
    label: "Carpentry",
    categoryName: "Carpentry & Woodwork",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
    iconName: "Hammer",
    accent: "from-yellow-600/20 to-amber-700/20",
  },
  {
    id: "painting",
    label: "Painting",
    categoryName: "Interior & Exterior Painting",
    url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&auto=format&fit=crop&q=80",
    iconName: "Paintbrush",
    accent: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "appliance",
    label: "HVAC & AC",
    categoryName: "AC & HVAC Appliance Repair",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    iconName: "Flame",
    accent: "from-red-500/20 to-orange-500/20",
  },
  {
    id: "electronics",
    label: "Electronics",
    categoryName: "Gadget & Computer IT Support",
    url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80",
    iconName: "Tv",
    accent: "from-indigo-500/20 to-violet-500/20",
  },
  {
    id: "security",
    label: "Security",
    categoryName: "Smart Lock & CCTV Security",
    url: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80",
    iconName: "Shield",
    accent: "from-slate-600/20 to-zinc-800/20",
  },
  {
    id: "roofing",
    label: "Roofing",
    categoryName: "Roofing & Ceiling Repair",
    url: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800&auto=format&fit=crop&q=80",
    iconName: "Layers",
    accent: "from-stone-600/20 to-amber-900/20",
  },
  {
    id: "gardening",
    label: "Gardening",
    categoryName: "Gardening & Lawn Maintenance",
    url: "https://images.unsplash.com/photo-1558904541-efa8c4a08931?w=800&auto=format&fit=crop&q=80",
    iconName: "TreePine",
    accent: "from-lime-600/20 to-green-800/20",
  },
  {
    id: "pestcontrol",
    label: "Pest Control",
    categoryName: "Pest Control & Extermination",
    url: "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=80",
    iconName: "Shield",
    accent: "from-teal-600/20 to-emerald-800/20",
  },
  {
    id: "masonry",
    label: "Masonry & Tile",
    categoryName: "Tile Flooring & Masonry",
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
    iconName: "Hammer",
    accent: "from-neutral-500/20 to-stone-700/20",
  },
  {
    id: "solar",
    label: "Solar Energy",
    categoryName: "Solar Panel & Renewable Energy",
    url: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80",
    iconName: "Zap",
    accent: "from-yellow-500/20 to-amber-600/20",
  },
  {
    id: "glass",
    label: "Glass & Window",
    categoryName: "Window Glazing & Glass Installation",
    url: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=800&auto=format&fit=crop&q=80",
    iconName: "Maximize2",
    accent: "from-sky-400/20 to-blue-600/20",
  },
  {
    id: "moving",
    label: "Moving & Packing",
    categoryName: "Relocation & Shifting Services",
    url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80",
    iconName: "FolderTree",
    accent: "from-orange-500/20 to-red-600/20",
  },
  {
    id: "auto",
    label: "Auto Mechanic",
    categoryName: "Vehicle Diagnostics & Repair",
    url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80",
    iconName: "Wrench",
    accent: "from-zinc-600/20 to-neutral-900/20",
  },
  {
    id: "locksmith",
    label: "Locksmith",
    categoryName: "Door Lock & Key Solutions",
    url: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80",
    iconName: "Shield",
    accent: "from-amber-600/20 to-yellow-800/20",
  },
  {
    id: "welding",
    label: "Welding & Metal",
    categoryName: "Metal Fabrication & Welding",
    url: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80",
    iconName: "Flame",
    accent: "from-red-600/20 to-orange-700/20",
  },
  {
    id: "pool",
    label: "Pool & Spa",
    categoryName: "Swimming Pool Cleaning & Care",
    url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&auto=format&fit=crop&q=80",
    iconName: "Droplet",
    accent: "from-cyan-400/20 to-teal-600/20",
  },
  {
    id: "interior",
    label: "Interior Design",
    categoryName: "Home Renovation & Interior Decor",
    url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80",
    iconName: "Sparkles",
    accent: "from-rose-500/20 to-pink-600/20",
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
  { label: "Garden", value: "TreePine", icon: TreePine },
  { label: "IT / Tech", value: "Laptop", icon: Laptop },
];

export function CreateCategoryForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [mediaMode, setMediaMode] = useState<"image" | "icon">("image");

  const form = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      icon: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80",
      description: "",
    },
  });

  const watchedValues = form.watch();
  const currentImageUrl = watchedValues.icon || watchedValues.image || "";
  const isImageValid = currentImageUrl.startsWith("http://") || currentImageUrl.startsWith("https://");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    form.setValue("name", val, { shouldValidate: true });
    // Auto-generate slug
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    form.setValue("slug", generatedSlug);
  };

  const handleSelectPreset = (preset: typeof CURATED_IMAGE_PRESETS[0]) => {
    setImageError(false);
    form.setValue("icon", preset.url, { shouldValidate: true });
    form.setValue("image", preset.url, { shouldValidate: true });
    if (!form.getValues("name")) {
      form.setValue("name", preset.categoryName, { shouldValidate: true });
    }
  };

  const onSubmit = async (values: CategoryFormInput) => {
    setIsSubmitting(true);
    try {
      // Pass the image URL or icon in the icon payload field
      const finalIconValue = values.icon || values.image || "";
      const res = await createCategoryAction({
        name: values.name,
        description: values.description,
        icon: finalIconValue,
      });

      if (!res.success) {
        toast.error(res.message || "Failed to create category");
        setIsSubmitting(false);
        return;
      }

      // Invalidate React Query categories cache
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });

      toast.success(res.message || `Category "${values.name}" created successfully!`);
      router.push("/admin-dashboard/categories");
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error(err?.message || "An unexpected error occurred while creating the category");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Back Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200/80 pb-5 dark:border-neutral-800">
        <div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2 gap-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            <Link href="/admin-dashboard/categories">
              <ArrowLeft className="size-4" />
              <span>Back to Categories</span>
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20">
              <FolderPlus className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
                Create Service Category
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Craft a category with high-res cover image, name, and clear service description.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button asChild variant="outline" className="border-neutral-200 dark:border-neutral-800">
            <Link href="/admin-dashboard/categories">Cancel</Link>
          </Button>
        </div>
      </div>

      {/* Grid Layout: Form on Left, Live Preview on Right */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Main Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-neutral-200/90 shadow-sm dark:border-neutral-800/90 bg-white dark:bg-neutral-900/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">
                    Category Details
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Fill out the fields to publish this category to the FixItNow marketplace.
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-[11px] font-medium bg-teal-50 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300 border-teal-200/50">
                  Required Fields *
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Category Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-xs text-neutral-900 dark:text-white flex items-center justify-between">
                          <span>Category Title *</span>
                          <span className="text-[11px] font-normal text-neutral-400">e.g. Electrical & Wiring</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Electrical & Wiring Solutions"
                            {...field}
                            onChange={handleNameChange}
                            className="h-10 text-sm focus-visible:ring-teal-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ========================================================================= */}
                  {/* IMAGE & VISUAL REPRESENTATION SECTION */}
                  {/* ========================================================================= */}
                  <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4 dark:border-neutral-800/80 dark:bg-neutral-900/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="size-4 text-teal-600 dark:text-teal-400" />
                        <span className="text-xs font-bold text-neutral-900 dark:text-white">
                          Cover Image & Icon Representation
                        </span>
                      </div>
                      
                      {/* Switch tabs: Visual Image vs Icon tag */}
                      <div className="flex rounded-lg bg-neutral-200/60 p-0.5 text-[11px] font-medium dark:bg-neutral-800">
                        <button
                          type="button"
                          onClick={() => setMediaMode("image")}
                          className={`rounded-md px-2.5 py-1 transition-all ${
                            mediaMode === "image"
                              ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-950 dark:text-white"
                              : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400"
                          }`}
                        >
                          Photo Banner
                        </button>
                        <button
                          type="button"
                          onClick={() => setMediaMode("icon")}
                          className={`rounded-md px-2.5 py-1 transition-all ${
                            mediaMode === "icon"
                              ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-950 dark:text-white"
                              : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400"
                          }`}
                        >
                          Lucide Icon
                        </button>
                      </div>
                    </div>

                    {mediaMode === "image" ? (
                      <div className="space-y-3.5">
                        {/* Image URL input with Live thumbnail & clear button */}
                        <FormField
                          control={form.control}
                          name="icon"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                Image URL Link
                              </FormLabel>
                              <div className="flex gap-2 items-center">
                                <div className="relative flex-1">
                                  <Input
                                    placeholder="https://images.unsplash.com/... (or paste image URL)"
                                    value={field.value ?? ""}
                                    onChange={(e) => {
                                      setImageError(false);
                                      field.onChange(e.target.value);
                                      form.setValue("image", e.target.value);
                                    }}
                                    className="pl-9 pr-8 text-xs font-mono h-9.5 bg-white dark:bg-neutral-950 focus-visible:ring-teal-500"
                                  />
                                  <LinkIcon className="absolute left-3 top-3 size-3.5 text-neutral-400" />
                                  {field.value ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        field.onChange("");
                                        form.setValue("image", "");
                                      }}
                                      className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                                    >
                                      <X className="size-4" />
                                    </button>
                                  ) : null}
                                </div>

                                {isImageValid && !imageError ? (
                                  <div className="relative size-9.5 shrink-0 overflow-hidden rounded-lg border border-teal-500/40 shadow-xs">
                                    <img
                                      src={currentImageUrl}
                                      alt="Thumbnail"
                                      className="h-full w-full object-cover"
                                      onError={() => setImageError(true)}
                                    />
                                    <div className="absolute inset-0 bg-teal-500/10" />
                                  </div>
                                ) : null}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Curated One-Click Visual Image Presets */}
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                              Instant Cover Presets:
                            </span>
                            <span>Click thumbnail to apply</span>
                          </div>

                          <div className="grid grid-cols-4 gap-2 sm:grid-cols-4 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                            {CURATED_IMAGE_PRESETS.map((preset) => {
                              const isSelected =
                                form.watch("icon") === preset.url ||
                                form.watch("image") === preset.url;
                              return (
                                <button
                                  key={preset.id}
                                  type="button"
                                  onClick={() => handleSelectPreset(preset)}
                                  className={`group relative overflow-hidden rounded-xl border text-left transition-all duration-200 ${
                                    isSelected
                                      ? "border-teal-500 ring-2 ring-teal-500/30 shadow-sm"
                                      : "border-neutral-200/80 bg-white hover:border-neutral-400 hover:shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
                                  }`}
                                >
                                  {/* Image Thumbnail */}
                                  <div className="relative h-14 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                    <img
                                      src={preset.url}
                                      alt={preset.label}
                                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    
                                    {isSelected && (
                                      <div className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-teal-500 text-white shadow-xs">
                                        <Check className="size-2.5 stroke-[3]" />
                                      </div>
                                    )}
                                    
                                    <div className="absolute bottom-1 left-1.5 right-1.5">
                                      <p className="truncate text-[10px] font-bold text-white drop-shadow-xs">
                                        {preset.label}
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Lucide Icon Presets */
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {ICON_PRESETS.map((preset) => {
                            const IconComponent = preset.icon;
                            const isSelected = form.watch("icon") === preset.value;
                            return (
                              <button
                                key={preset.value}
                                type="button"
                                onClick={() => {
                                  form.setValue("icon", preset.value, { shouldValidate: true });
                                  form.setValue("image", "");
                                }}
                                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-medium transition-all ${
                                  isSelected
                                    ? "border-teal-500 bg-teal-50 text-teal-700 shadow-xs dark:border-teal-500 dark:bg-teal-950/70 dark:text-teal-300 ring-2 ring-teal-500/20"
                                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                }`}
                              >
                                <IconComponent className="size-4 text-teal-600 dark:text-teal-400" />
                                <span className="text-[11px] truncate">{preset.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        <Input
                          placeholder="Or type custom icon tag (e.g. Shield, Tool, Bolt)"
                          value={form.watch("icon")?.startsWith("http") ? "" : form.watch("icon") ?? ""}
                          onChange={(e) => form.setValue("icon", e.target.value)}
                          className="text-xs h-9"
                        />
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="font-semibold text-xs text-neutral-900 dark:text-white">
                            Category Description *
                          </FormLabel>
                          <span className={`text-[11px] ${
                            (field.value?.length || 0) > 300
                              ? "text-red-500 font-semibold"
                              : "text-neutral-400"
                          }`}>
                            {field.value?.length || 0} / 300 characters
                          </span>
                        </div>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="Describe the services and repairs under this category. E.g., Professional residential and commercial electrical repair, wiring inspection, panel upgrades, and lighting installations..."
                            {...field}
                            className="text-xs leading-relaxed focus-visible:ring-teal-500"
                          />
                        </FormControl>
                        <FormDescription className="text-[11px]">
                          Minimum 10 characters. Explains what type of jobs belong to this category.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-5 border-t border-neutral-100 dark:border-neutral-800">
                    <Button asChild variant="outline" className="border-neutral-200 dark:border-neutral-800 text-xs">
                      <Link href="/admin-dashboard/categories">Cancel</Link>
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 font-semibold text-white hover:from-teal-700 hover:to-emerald-700 shadow-sm transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Publishing Category...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="size-4" />
                          <span>Publish Category</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Live Marketplace Preview (5 cols) */}
        <div className="space-y-6 lg:col-span-5 sticky top-6">
          {/* Live Preview Card */}
          <Card className="border-neutral-200/90 shadow-sm dark:border-neutral-800/90 overflow-hidden bg-white dark:bg-neutral-900/60 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                  <Eye className="size-4 text-teal-600 dark:text-teal-400" />
                  <CardTitle className="text-xs font-bold uppercase tracking-wider">
                    Live Public Preview
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] font-medium border-teal-500/30 text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/50">
                  Marketplace Card
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-md transition-all duration-300 hover:border-teal-500 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
                {/* Banner Photo */}
                <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900">
                  {isImageValid && !imageError ? (
                    <img
                      src={currentImageUrl}
                      alt={watchedValues.name || "Category"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-900/40 via-neutral-900 to-emerald-950/40">
                      <FolderTree className="size-12 text-teal-400/40 stroke-1" />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badges on Banner */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <Badge className="bg-white/90 text-neutral-900 backdrop-blur-md text-[10px] font-semibold hover:bg-white dark:bg-black/70 dark:text-white border-0 shadow-xs">
                      Active
                    </Badge>
                    <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-mono text-white/90 backdrop-blur-sm">
                      0 Services
                    </span>
                  </div>

                  {/* Floating Icon overlapping bottom */}
                  <div className="absolute -bottom-4 left-4 flex size-12 items-center justify-center rounded-xl bg-white p-1 text-teal-700 shadow-md ring-2 ring-white dark:bg-neutral-900 dark:text-teal-300 dark:ring-neutral-900">
                    <div className="flex size-full items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/80">
                      {watchedValues.icon && !watchedValues.icon.startsWith("http") ? (
                        <span className="font-bold text-xs">
                          {watchedValues.icon.slice(0, 3).toUpperCase()}
                        </span>
                      ) : (
                        <Sparkles className="size-5 text-teal-600 dark:text-teal-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="pt-6 p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {watchedValues.name || "Category Title"}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                      {watchedValues.description ||
                        "Comprehensive description of services, diagnostics, and repairs will appear here in the marketplace."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-between text-xs">
                    <span className="font-semibold text-teal-600 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                      Browse Technicians →
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      /{watchedValues.slug || "slug"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Help Card */}
          <Card className="border-neutral-200/80 bg-neutral-50/60 dark:border-neutral-800/80 dark:bg-neutral-900/40">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
                <Info className="size-4 text-teal-600 dark:text-teal-400" />
                <CardTitle className="text-xs font-bold">Image & Catalog Guidelines</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>• <strong>Recommended resolution:</strong> 800x600px (4:3) or 1200x800px landscape format.</p>
              <p>• <strong>Unsplash & CDN:</strong> Direct HTTPS image URLs load automatically with responsive scaling.</p>
              <p>• <strong>Presets:</strong> Clicking any preset above automatically fills a high-res cover image and suggested title.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Export alias in case user imports as createCategoryFrom
export const CreateCategoryFrom = CreateCategoryForm;
export default CreateCategoryForm;
