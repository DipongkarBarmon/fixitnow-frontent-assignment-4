"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useCreateCategory } from "@/hooks";

const categoryFormSchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(60, "Category name is too long"),
  slug: z.string().optional(),
  icon: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters").max(300, "Description is too long"),
});

type CategoryFormInput = z.infer<typeof categoryFormSchema>;

const ICON_PRESETS = [
  { label: "Wrench", value: "Wrench", icon: Wrench },
  { label: "Electrical", value: "Zap", icon: Zap },
  { label: "Plumbing", value: "Droplet", icon: Droplet },
  { label: "Cleaning", value: "Sparkles", icon: Sparkles },
  { label: "Carpentry", value: "Hammer", icon: Hammer },
  { label: "Painting", value: "Paintbrush", icon: Paintbrush },
  { label: "Appliance", value: "Flame", icon: Flame },
  { label: "Electronics", value: "Tv", icon: Tv },
  { label: "Security", value: "Shield", icon: Shield },
];

export default function CreateCategoryPage() {
  const router = useRouter();
  const createMutation = useCreateCategory();

  const form = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      icon: "Wrench",
      description: "",
    },
  });

  const watchedValues = form.watch();

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

  const onSubmit = async (values: CategoryFormInput) => {
    try {
      const res = await createMutation.mutateAsync({
        name: values.name.trim(),
        description: values.description.trim(),
        icon: values.icon?.trim() || "Wrench",
      });

      if (res?.success === false) {
        toast.error(res?.message || "Failed to create category");
        return;
      }

      toast.success(`Category "${values.name}" created successfully!`);
      router.push("/admin-dashboard/categories");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(error.response?.data?.message || error.message || "Failed to create category");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Back Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            Create Service Category
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Define a new category to group related services and help customers find technicians quickly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/admin-dashboard/categories">Cancel</Link>
          </Button>
        </div>
      </div>

      {/* Grid Layout: Form on Left, Live Preview & Tips on Right */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main Form (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="border-neutral-200 shadow-sm dark:border-neutral-800">
            <CardHeader>
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                <FolderPlus className="size-5" />
                <CardTitle className="text-lg font-bold text-neutral-900 dark:text-white">
                  Category Information
                </CardTitle>
              </div>
              <CardDescription>
                Fill out the required attributes for platform indexing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  {/* Category Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-neutral-900 dark:text-white">
                          Category Title *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Electrical & Wiring Solutions"
                            {...field}
                            onChange={handleNameChange}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Clear, descriptive name shown in the main marketplace navigation.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Slug */}
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-neutral-900 dark:text-white">
                          URL Slug
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-800 dark:bg-neutral-900">
                            <span className="text-xs font-mono text-neutral-400">/categories/</span>
                            <input
                              {...field}
                              className="w-full bg-transparent text-xs font-mono text-neutral-900 outline-none dark:text-white"
                              placeholder="electrical-and-wiring"
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
                          Auto-generated from title. You can customize the URL endpoint if needed.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Icon Selection */}
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-neutral-900 dark:text-white">
                          Icon / Preset Tag
                        </FormLabel>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {ICON_PRESETS.map((preset) => {
                            const IconComponent = preset.icon;
                            const isSelected = field.value === preset.value;
                            return (
                              <button
                                key={preset.value}
                                type="button"
                                onClick={() => form.setValue("icon", preset.value)}
                                className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border p-2.5 text-xs font-medium transition-all ${
                                  isSelected
                                    ? "border-teal-500 bg-teal-50 text-teal-700 shadow-sm dark:border-teal-500 dark:bg-teal-950/60 dark:text-teal-300"
                                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                }`}
                              >
                                <IconComponent className="size-4" />
                                <span>{preset.label}</span>
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-2">
                          <Input
                            placeholder="Or enter custom icon tag (e.g. Shield, Tool, Bolt)"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="text-xs"
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-neutral-900 dark:text-white">
                          Category Description *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="Comprehensive description of services, repairs, and installations covered under this category..."
                            {...field}
                          />
                        </FormControl>
                        <div className="flex justify-between text-[11px] text-neutral-400">
                          <span>Minimum 10 characters</span>
                          <span>{field.value?.length || 0}/300 characters</span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <Button asChild variant="outline">
                      <Link href="/admin-dashboard/categories">Cancel</Link>
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="gap-2 bg-teal-600 font-semibold text-white hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700"
                    >
                      {createMutation.isPending ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Creating Category...</span>
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

        {/* Live Marketplace Preview & Best Practices (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          {/* Live Preview Card */}
          <Card className="border-neutral-200 shadow-sm dark:border-neutral-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                  <Eye className="size-4 text-blue-600" />
                  <CardTitle className="text-sm font-bold">Live Public Preview</CardTitle>
                </div>
                <Badge variant="secondary" className="text-[10px] font-mono">
                  Marketplace Card
                </Badge>
              </div>
              <CardDescription className="text-xs">
                How this category appears on the public marketplace cards and category filters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:border-teal-500 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-teal-100 text-teal-700 shadow-sm dark:bg-teal-900/40 dark:text-teal-300">
                    {watchedValues.icon ? (
                      <span className="font-bold text-sm">
                        {watchedValues.icon.slice(0, 3).toUpperCase()}
                      </span>
                    ) : (
                      <FolderTree className="size-6" />
                    )}
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    0 services
                  </Badge>
                </div>

                <div className="mt-4 space-y-1.5">
                  <h4 className="font-bold text-neutral-900 dark:text-white text-base">
                    {watchedValues.name || "Category Title"}
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                    {watchedValues.description ||
                      "Category description will appear here. Provide detailed information to guide customers seeking home repairs."}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-neutral-400">
                    slug: /{watchedValues.slug || "slug"}
                  </span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400">
                    Explore Services →
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organizing Advice */}
          <Card className="border-neutral-200 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/30">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
                <Info className="size-4 text-blue-600" />
                <CardTitle className="text-sm font-bold">Category Guidelines</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex gap-2">
                <span className="font-bold text-blue-600">1.</span>
                <p>Keep category names concise and familiar (e.g. Electrical, Plumbing, HVAC).</p>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-blue-600">2.</span>
                <p>Once created, you can associate multiple individual services to this category.</p>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-blue-600">3.</span>
                <p>Categories can be edited or removed from the Category Management table anytime.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
