import type { Metadata } from "next";
import Link from "next/link";
import {
  Wrench,
  Zap,
  Sparkles,
  Wind,
  Paintbrush,
  Hammer,
  Leaf,
  Shield,
  ChevronRight,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Service Categories",
  description:
    "Browse all home service categories on FixItNow — plumbing, electrical, cleaning, painting, and more.",
};

const categories = [
  {
    slug: "plumbing",
    name: "Plumbing",
    icon: Wrench,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-800",
    description: "Pipe repairs, faucet installations, water heaters, drain cleaning, and full plumbing overhauls.",
    services: ["Pipe Repair", "Faucet Installation", "Water Heater", "Drain Cleaning", "Leak Detection"],
    technicianCount: 45,
    avgRating: 4.8,
    startingPrice: 500,
  },
  {
    slug: "electrical",
    name: "Electrical",
    icon: Zap,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800",
    description: "Wiring, panel upgrades, outlet installations, lighting setup, generator installation.",
    services: ["Wiring", "Panel Upgrade", "Outlet Install", "Lighting", "Generator Setup"],
    technicianCount: 38,
    avgRating: 4.9,
    startingPrice: 800,
  },
  {
    slug: "cleaning",
    name: "Cleaning",
    icon: Sparkles,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800",
    description: "Deep cleaning, move-in/out cleaning, regular maintenance, office and post-construction cleaning.",
    services: ["Deep Clean", "Move-in/out", "Regular Maint.", "Office Clean", "Post-construction"],
    technicianCount: 62,
    avgRating: 4.7,
    startingPrice: 1200,
  },
  {
    slug: "ac-hvac",
    name: "AC & HVAC",
    icon: Wind,
    color: "text-sky-600",
    bg: "bg-sky-50 dark:bg-sky-950/40",
    border: "border-sky-200 dark:border-sky-800",
    description: "AC installation, servicing, repair, refrigeration systems, and full HVAC maintenance.",
    services: ["AC Install", "AC Service", "AC Repair", "HVAC Maint.", "Refrigeration"],
    technicianCount: 28,
    avgRating: 4.6,
    startingPrice: 1500,
  },
  {
    slug: "painting",
    name: "Painting",
    icon: Paintbrush,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    border: "border-purple-200 dark:border-purple-800",
    description: "Interior and exterior painting, wall design, texture finishes, and complete home repaints.",
    services: ["Interior Paint", "Exterior Paint", "Wall Texture", "Wallpaper", "Epoxy Floor"],
    technicianCount: 22,
    avgRating: 4.5,
    startingPrice: 2000,
  },
  {
    slug: "carpentry",
    name: "Carpentry",
    icon: Hammer,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    border: "border-orange-200 dark:border-orange-800",
    description: "Furniture assembly, custom woodwork, cabinet installation, door/window repair and more.",
    services: ["Furniture Assembly", "Custom Cabinets", "Door Repair", "Flooring", "Shelving"],
    technicianCount: 19,
    avgRating: 4.8,
    startingPrice: 700,
  },
  {
    slug: "gardening",
    name: "Gardening",
    icon: Leaf,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/40",
    border: "border-green-200 dark:border-green-800",
    description: "Lawn mowing, garden design, tree trimming, pest control, and landscape maintenance.",
    services: ["Lawn Mowing", "Garden Design", "Tree Trimming", "Pest Control", "Landscaping"],
    technicianCount: 15,
    avgRating: 4.6,
    startingPrice: 600,
  },
  {
    slug: "security",
    name: "Security",
    icon: Shield,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-800",
    description: "CCTV installation, smart locks, alarm systems, access control, and home security setup.",
    services: ["CCTV Install", "Smart Lock", "Alarm System", "Access Control", "Intercom"],
    technicianCount: 12,
    avgRating: 4.7,
    startingPrice: 2500,
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-50 to-neutral-100 py-16 dark:from-neutral-950 dark:to-neutral-900">
        <Container className="text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
            All Service Categories
          </h1>
          <p className="mx-auto mb-6 max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
            From plumbing to painting — browse every type of home service we offer and find the
            right professional for your needs.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Badge variant="secondary" className="text-sm">
              {categories.length} Categories
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {categories.reduce((sum, c) => sum + c.technicianCount, 0)}+ Technicians
            </Badge>
          </div>
        </Container>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map(({ slug, name, icon: Icon, color, bg, border, description, services, technicianCount, avgRating, startingPrice }) => (
              <Link
                key={slug}
                href={`/services?category=${slug}`}
                className="group block rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
              >
                {/* Icon */}
                <div className={`mb-4 flex size-14 items-center justify-center rounded-2xl ${bg} border ${border}`}>
                  <Icon className={`size-7 ${color}`} />
                </div>

                {/* Title */}
                <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">{name}</h2>
                <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">{description}</p>

                {/* Service tags */}
                <div className="mb-4 flex flex-wrap gap-1">
                  {services.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                    >
                      {s}
                    </span>
                  ))}
                  {services.length > 3 && (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                      +{services.length - 3} more
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="mb-4 flex items-center justify-between border-t border-neutral-100 pt-4 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                  <span>{technicianCount} technicians</span>
                  <span>★ {avgRating}</span>
                  <span>from ৳{startingPrice}</span>
                </div>

                {/* CTA */}
                <div className={`flex items-center gap-1 text-sm font-semibold ${color} transition-gap group-hover:gap-2`}>
                  View Services
                  <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-16 dark:border-neutral-800 dark:bg-neutral-900/50">
        <Container className="text-center">
          <SectionHeading
            title="Can't find what you need?"
            subtitle="Contact us and we'll connect you with the right professional for any home service."
          />
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/services">Browse All Services</Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
