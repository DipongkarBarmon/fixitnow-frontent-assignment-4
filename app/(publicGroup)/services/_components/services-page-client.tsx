"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/shared/container";
import { ServiceCard, ServiceCardSkeleton } from "@/components/cards/service-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { Service } from "@/types";

// Demo data - will be replaced with API calls
const allServices: Service[] = [
  { id: "1", name: "Complete Plumbing Repair", slug: "plumbing", description: "Expert plumbing repair for pipes, faucets, and drains.", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600", categoryId: "1", category: { id: "1", name: "Plumbing", slug: "plumbing", createdAt: "", updatedAt: "" }, startingPrice: 500, averageRating: 4.8, totalReviews: 234, technicianCount: 45, isActive: true, createdAt: "", updatedAt: "" },
  { id: "2", name: "Electrical Installation", slug: "electrical", description: "Professional electrical wiring and fixture installation.", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600", categoryId: "2", category: { id: "2", name: "Electrical", slug: "electrical", createdAt: "", updatedAt: "" }, startingPrice: 800, averageRating: 4.9, totalReviews: 189, technicianCount: 38, isActive: true, createdAt: "", updatedAt: "" },
  { id: "3", name: "Deep House Cleaning", slug: "cleaning", description: "Thorough home cleaning service.", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600", categoryId: "3", category: { id: "3", name: "Cleaning", slug: "cleaning", createdAt: "", updatedAt: "" }, startingPrice: 1200, averageRating: 4.7, totalReviews: 312, technicianCount: 62, isActive: true, createdAt: "", updatedAt: "" },
  { id: "4", name: "AC Maintenance", slug: "ac", description: "Complete AC service and maintenance.", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600", categoryId: "4", category: { id: "4", name: "AC & HVAC", slug: "hvac", createdAt: "", updatedAt: "" }, startingPrice: 1500, averageRating: 4.6, totalReviews: 156, technicianCount: 28, isActive: true, createdAt: "", updatedAt: "" },
  { id: "5", name: "Interior Painting", slug: "painting", description: "Professional painting for walls and ceilings.", image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600", categoryId: "5", category: { id: "5", name: "Painting", slug: "painting", createdAt: "", updatedAt: "" }, startingPrice: 2000, averageRating: 4.5, totalReviews: 98, technicianCount: 22, isActive: true, createdAt: "", updatedAt: "" },
  { id: "6", name: "Furniture Assembly", slug: "furniture", description: "Expert furniture assembly and repair.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600", categoryId: "6", category: { id: "6", name: "Carpentry", slug: "carpentry", createdAt: "", updatedAt: "" }, startingPrice: 700, averageRating: 4.8, totalReviews: 143, technicianCount: 19, isActive: true, createdAt: "", updatedAt: "" },
];

const categories = ["All", "Plumbing", "Electrical", "Cleaning", "AC & HVAC", "Painting", "Carpentry"];

interface FilterPanelProps {
  category: string;
  onCategoryChange: (cat: string) => void;
}

function FilterPanel({ category, onCategoryChange }: FilterPanelProps) {
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

export function ServicesPageClient() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [isLoading] = useState(false);

  const filteredServices = allServices.filter((s) => {
    const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || s.category?.name === category;
    return matchesSearch && matchesCategory;
  });


  return (
    <section className="py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">All Services</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Browse and book professional home services</p>
        </div>

        {/* Search & Filters Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                <Button variant="outline" size="icon" className="sm:hidden">
                  <SlidersHorizontal className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetTitle>Filters</SheetTitle>
                <div className="mt-6"><FilterPanel category={category} onCategoryChange={setCategory} /></div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden w-64 shrink-0 sm:block">
            <div className="sticky top-24 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">Filters</h2>
              <FilterPanel category={category} onCategoryChange={setCategory} />
            </div>
          </aside>

          {/* Services Grid */}
          <div className="flex-1">
            <p className="mb-4 text-sm text-neutral-500">{filteredServices.length} services found</p>
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredServices.map((s) => <ServiceCard key={s.id} service={s} />)}
              </div>
            ) : (
              <EmptyState title="No services found" description="Try adjusting your filters or search query" actionLabel="Clear Filters" onAction={() => { setSearch(""); setCategory("All"); }} />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
