"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ServiceCard, ServiceCardSkeleton } from "@/components/cards/service-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { Service } from "@/types";

interface DashboardServicesClientProps {
  initialServices: Service[];
}

interface FilterPanelProps {
  category: string;
  categories: string[];
  onCategoryChange: (cat: string) => void;
}

function FilterPanel({ category, categories, onCategoryChange }: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={category === cat ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardServicesClient({ initialServices }: DashboardServicesClientProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");

  const categories = ["All", ...Array.from(new Set(initialServices.map((s) => s.category?.name).filter(Boolean)))];

  const filteredServices = initialServices.filter((s) => {
    const serviceName = (s as any).title || s.name || "";
    const matchesSearch = !search || serviceName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || s.category?.name === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Available Services</h1>
        <p className="text-neutral-500">Browse and book professional home services directly from your dashboard</p>
      </div>

      {/* Search & Filters Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="size-4 text-neutral-400" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile Filter */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <SlidersHorizontal className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle>Filters</SheetTitle>
              <div className="mt-6"><FilterPanel category={category} categories={categories as string[]} onCategoryChange={setCategory} /></div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex gap-6 lg:gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">Filters</h2>
            <FilterPanel category={category} categories={categories as string[]} onCategoryChange={setCategory} />
          </div>
        </aside>

        {/* Services Grid */}
        <div className="flex-1">
          <p className="mb-4 text-sm text-neutral-500">{filteredServices.length} services found</p>
          {filteredServices.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredServices.map((s) => <ServiceCard key={s.id} service={s} />)}
            </div>
          ) : (
            <EmptyState 
              title="No services found" 
              description="Try adjusting your filters or search query" 
              actionLabel="Clear Filters" 
              onAction={() => { setSearch(""); setCategory("All"); }} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
