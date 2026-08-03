"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/shared/container";
import {
  TechnicianCard,
  TechnicianCardSkeleton,
} from "@/components/cards/technician-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { TechnicianProfile } from "@/types";

// ─── Demo data ────────────────────────────────────────────────────────────────
const demoTechnicians: TechnicianProfile[] = [
  {
    id: "1", userId: "u1",
    user: { id: "u1", name: "Karim Ahmed", email: "", role: "TECHNICIAN", isVerified: true, isBanned: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim", createdAt: "", updatedAt: "" },
    bio: "10 years in plumbing and pipe systems.",
    skills: ["Plumbing", "Pipe Fitting", "Water Heater", "Drain Cleaning"],
    experience: 10, certifications: ["Certified Plumber – BTEB"],
    hourlyRate: 500, completedJobs: 450, averageRating: 4.9, totalReviews: 234, isVerified: true, location: "Dhaka, Gulshan", createdAt: "", updatedAt: "",
  },
  {
    id: "2", userId: "u2",
    user: { id: "u2", name: "Rafiq Islam", email: "", role: "TECHNICIAN", isVerified: true, isBanned: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafiq", createdAt: "", updatedAt: "" },
    bio: "Expert electrician with 8 years of residential experience.",
    skills: ["Electrical", "Wiring", "Solar Panel", "Generator"],
    experience: 8, certifications: ["BREB Licensed Electrician"],
    hourlyRate: 600, completedJobs: 380, averageRating: 4.8, totalReviews: 189, isVerified: true, location: "Dhaka, Banani", createdAt: "", updatedAt: "",
  },
  {
    id: "3", userId: "u3",
    user: { id: "u3", name: "Sumon Das", email: "", role: "TECHNICIAN", isVerified: true, isBanned: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sumon", createdAt: "", updatedAt: "" },
    bio: "AC and HVAC specialist with 6 years of field experience.",
    skills: ["AC Repair", "HVAC", "Refrigeration"],
    experience: 6, certifications: [],
    hourlyRate: 700, completedJobs: 220, averageRating: 4.7, totalReviews: 156, isVerified: true, location: "Dhaka, Dhanmondi", createdAt: "", updatedAt: "",
  },
  {
    id: "4", userId: "u4",
    user: { id: "u4", name: "Anwar Hossain", email: "", role: "TECHNICIAN", isVerified: false, isBanned: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anwar", createdAt: "", updatedAt: "" },
    bio: "12 years of painting experience — interior and exterior.",
    skills: ["Painting", "Interior Paint", "Exterior Paint", "Wall Design"],
    experience: 12, certifications: [],
    hourlyRate: 400, completedJobs: 560, averageRating: 4.6, totalReviews: 98, isVerified: false, location: "Dhaka, Mirpur", createdAt: "", updatedAt: "",
  },
  {
    id: "5", userId: "u5",
    user: { id: "u5", name: "Jamal Uddin", email: "", role: "TECHNICIAN", isVerified: true, isBanned: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamal", createdAt: "", updatedAt: "" },
    bio: "Master carpenter with 15 years of woodwork and furniture expertise.",
    skills: ["Carpentry", "Furniture Assembly", "Woodwork", "Flooring"],
    experience: 15, certifications: [],
    hourlyRate: 450, completedJobs: 620, averageRating: 4.9, totalReviews: 301, isVerified: true, location: "Dhaka, Uttara", createdAt: "", updatedAt: "",
  },
  {
    id: "6", userId: "u6",
    user: { id: "u6", name: "Nasir Khan", email: "", role: "TECHNICIAN", isVerified: true, isBanned: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nasir", createdAt: "", updatedAt: "" },
    bio: "Professional cleaner specializing in deep and move-in/out cleaning.",
    skills: ["Cleaning", "Deep Cleaning", "Office Cleaning"],
    experience: 5, certifications: [],
    hourlyRate: 350, completedJobs: 190, averageRating: 4.5, totalReviews: 87, isVerified: true, location: "Dhaka, Mohammadpur", createdAt: "", updatedAt: "",
  },
  {
    id: "7", userId: "u7",
    user: { id: "u7", name: "Rahim Mia", email: "", role: "TECHNICIAN", isVerified: true, isBanned: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahim", createdAt: "", updatedAt: "" },
    bio: "Security systems expert. CCTV, smart locks and access control.",
    skills: ["Security", "CCTV", "Smart Lock", "Alarm Systems"],
    experience: 7, certifications: ["Certified Security Technician"],
    hourlyRate: 800, completedJobs: 145, averageRating: 4.8, totalReviews: 62, isVerified: true, location: "Dhaka, Bashundhara", createdAt: "", updatedAt: "",
  },
  {
    id: "8", userId: "u8",
    user: { id: "u8", name: "Kabir Hasan", email: "", role: "TECHNICIAN", isVerified: false, isBanned: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir", createdAt: "", updatedAt: "" },
    bio: "Gardening and landscaping professional with 4 years experience.",
    skills: ["Gardening", "Lawn Mowing", "Tree Trimming", "Landscaping"],
    experience: 4, certifications: [],
    hourlyRate: 300, completedJobs: 95, averageRating: 4.4, totalReviews: 41, isVerified: false, location: "Dhaka, Tejgaon", createdAt: "", updatedAt: "",
  },
];

const ALL_SKILLS = [
  "Plumbing", "Electrical", "AC Repair", "Carpentry", "Cleaning",
  "Painting", "Security", "Gardening", "HVAC", "Solar Panel",
];

type SortOption = "rating" | "price_asc" | "price_desc" | "jobs" | "experience";

// ─── Filter Panel ─────────────────────────────────────────────────────────────
interface FilterPanelProps {
  selectedSkill: string;
  onSkillChange: (skill: string) => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
  onReset: () => void;
}

function FilterPanel({
  selectedSkill,
  onSkillChange,
  minRating,
  onMinRatingChange,
  onReset,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      {/* Skills */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
          Skill / Specialty
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedSkill === "" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onSkillChange("")}
          >
            All Skills
          </Badge>
          {ALL_SKILLS.map((skill) => (
            <Badge
              key={skill}
              variant={selectedSkill === skill ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onSkillChange(selectedSkill === skill ? "" : skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Min Rating */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
          Minimum Rating
        </h3>
        <div className="flex gap-2">
          {[0, 4, 4.5, 4.8].map((r) => (
            <button
              key={r}
              onClick={() => onMinRatingChange(r)}
              className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                minRating === r
                  ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
              }`}
            >
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {r === 0 ? "Any" : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="w-full"
      >
        Reset Filters
      </Button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function TechniciansPageClient() {
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [isLoading] = useState(false);

  const handleReset = () => {
    setSearch("");
    setSelectedSkill("");
    setMinRating(0);
    setSortBy("rating");
  };

  const filteredTechnicians = useMemo(() => {
    let list = demoTechnicians.filter((t) => {
      const name = t.user?.name?.toLowerCase() ?? "";
      const skillsText = t.skills.join(" ").toLowerCase();
      const location = (t.location ?? "").toLowerCase();
      const query = search.toLowerCase();

      const matchesSearch =
        !search ||
        name.includes(query) ||
        skillsText.includes(query) ||
        location.includes(query);

      const matchesSkill =
        !selectedSkill ||
        t.skills.some((s) =>
          s.toLowerCase().includes(selectedSkill.toLowerCase())
        );

      const matchesRating = t.averageRating >= minRating;

      return matchesSearch && matchesSkill && matchesRating;
    });

    // Sort
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.averageRating - a.averageRating;
        case "price_asc":
          return a.hourlyRate - b.hourlyRate;
        case "price_desc":
          return b.hourlyRate - a.hourlyRate;
        case "jobs":
          return b.completedJobs - a.completedJobs;
        case "experience":
          return b.experience - a.experience;
        default:
          return 0;
      }
    });

    return list;
  }, [search, selectedSkill, minRating, sortBy]);

  const activeFilterCount =
    (selectedSkill ? 1 : 0) + (minRating > 0 ? 1 : 0);

  return (
    <section className="py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Expert Technicians
          </h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Find and book verified professionals for any home service
          </p>
        </div>

        {/* Search & Sort Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <Input
              id="technician-search"
              placeholder="Search by name, skill, or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as SortOption)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="jobs">Most Jobs Done</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative sm:hidden"
                  id="mobile-filter-btn"
                >
                  <SlidersHorizontal className="size-4" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetTitle>Filter Technicians</SheetTitle>
                <div className="mt-6">
                  <FilterPanel
                    selectedSkill={selectedSkill}
                    onSkillChange={setSelectedSkill}
                    minRating={minRating}
                    onMinRatingChange={setMinRating}
                    onReset={handleReset}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden w-64 shrink-0 sm:block">
            <div className="sticky top-24 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Filters
                </h2>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary">{activeFilterCount} active</Badge>
                )}
              </div>
              <FilterPanel
                selectedSkill={selectedSkill}
                onSkillChange={setSelectedSkill}
                minRating={minRating}
                onMinRatingChange={setMinRating}
                onReset={handleReset}
              />
            </div>
          </aside>

          {/* Technician Grid */}
          <div className="flex-1">
            <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
              {isLoading
                ? "Loading technicians…"
                : `${filteredTechnicians.length} technician${filteredTechnicians.length !== 1 ? "s" : ""} found`}
            </p>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <TechnicianCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredTechnicians.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredTechnicians.map((tech) => (
                  <TechnicianCard key={tech.id} technician={tech} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No technicians found"
                description="Try adjusting your search or filters to find the right professional."
                actionLabel="Clear All Filters"
                onAction={handleReset}
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
