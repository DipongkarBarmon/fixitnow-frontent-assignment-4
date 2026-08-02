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
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import type { LucideIcon } from "lucide-react";

interface CategoryItem {
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  href: string;
  count: string;
}

const categories: CategoryItem[] = [
  {
    name: "Plumbing",
    icon: Droplets,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    href: "/services?category=plumbing",
    count: "120+ Services",
  },
  {
    name: "Electrical",
    icon: Zap,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    href: "/services?category=electrical",
    count: "95+ Services",
  },
  {
    name: "Painting",
    icon: Paintbrush,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    href: "/services?category=painting",
    count: "80+ Services",
  },
  {
    name: "AC & HVAC",
    icon: Wind,
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
    href: "/services?category=hvac",
    count: "65+ Services",
  },
  {
    name: "Carpentry",
    icon: Hammer,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    href: "/services?category=carpentry",
    count: "70+ Services",
  },
  {
    name: "Appliance Repair",
    icon: Wrench,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    href: "/services?category=appliance",
    count: "85+ Services",
  },
  {
    name: "Security",
    icon: ShieldCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    href: "/services?category=security",
    count: "40+ Services",
  },
  {
    name: "Moving",
    icon: Truck,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    href: "/services?category=moving",
    count: "50+ Services",
  },
];

export function PopularCategories() {
  return (
    <section className="py-20 bg-white dark:bg-neutral-950">
      <Container>
        <SectionHeading
          title="Popular Categories"
          subtitle="Browse our most popular service categories and find exactly what you need"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group flex flex-col items-center gap-3 rounded-xl border border-neutral-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-800"
            >
              <div
                className={`flex size-14 items-center justify-center rounded-xl ${category.bgColor} transition-transform duration-300 group-hover:scale-110`}
              >
                <category.icon className={`size-7 ${category.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  {category.name}
                </h3>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {category.count}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
