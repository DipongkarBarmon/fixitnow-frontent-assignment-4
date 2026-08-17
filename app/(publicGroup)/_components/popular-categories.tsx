import Link from "next/link";
import {
  Wrench,
  Zap,
  Droplets,
  Paintbrush,
  Wind,
  Hammer,
  ShieldCheck,
  Truck,
  Grid,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { getAllCategoriesAction } from "@/app/(dashboardGroup)/admin-dashboard/_actions/categoryAction";
import type { LucideIcon } from "lucide-react";

interface CategoryIconMap {
  [key: string]: { icon: LucideIcon; color: string; bgColor: string };
}

const categoryStyleMap: CategoryIconMap = {
  plumbing: {
    icon: Droplets,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  electrical: {
    icon: Zap,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  painting: {
    icon: Paintbrush,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  hvac: {
    icon: Wind,
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
  },
  carpentry: {
    icon: Hammer,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
  cleaning: {
    icon: Wrench,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  security: {
    icon: ShieldCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  moving: {
    icon: Truck,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
  },
};

const defaultStyle = {
  icon: Grid,
  color: "text-gray-600 dark:text-gray-400",
  bgColor: "bg-gray-100 dark:bg-gray-900/30",
};

export async function PopularCategories() {
  const result = await getAllCategoriesAction();
  let categories: any[] = [];
  
  if (result.success && result.data) {
    categories = result.data;
    if (categories && !Array.isArray(categories) && Array.isArray((categories as any).data)) {
      categories = (categories as any).data;
    }
  }

  const displayCategories = (Array.isArray(categories) ? categories : []).slice(0, 8);

  return (
    <section className="py-20 bg-white dark:bg-neutral-950">
      <Container>
        <SectionHeading
          title="Popular Categories"
          subtitle="Browse our most popular service categories and find exactly what you need"
        />
        {displayCategories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {displayCategories.map((category) => {
              const slug = category.slug || category.name.toLowerCase().replace(/\\s+/g, "-");
              const styleKey = Object.keys(categoryStyleMap).find((k) => slug.includes(k)) || "default";
              const { icon: Icon, color, bgColor } = categoryStyleMap[styleKey] || defaultStyle;
              
              return (
                <Link
                  key={category.id}
                  href={`/services?category=${slug}`}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-neutral-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-800"
                >
                  <div
                    className={`flex size-14 items-center justify-center rounded-xl ${bgColor} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className={`size-7 ${color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-neutral-500 py-10">
            No categories available at the moment.
          </div>
        )}
      </Container>
    </section>
  );
}
