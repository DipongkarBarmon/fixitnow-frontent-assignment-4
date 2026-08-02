import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceCard } from "@/components/cards/service-card";
import type { Service } from "@/types";

// Demo data for the landing page (will be replaced by API data)
const demoServices: Service[] = [
  {
    id: "1",
    name: "Complete Plumbing Repair",
    slug: "complete-plumbing-repair",
    description: "Expert plumbing repair services for pipes, faucets, drains, and water heaters. Available 24/7 for emergencies.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600",
    categoryId: "1",
    category: { id: "1", name: "Plumbing", slug: "plumbing", createdAt: "", updatedAt: "" },
    startingPrice: 500,
    averageRating: 4.8,
    totalReviews: 234,
    technicianCount: 45,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "2",
    name: "Electrical Installation & Repair",
    slug: "electrical-installation-repair",
    description: "Professional electrical services including wiring, panel upgrades, and fixture installation.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600",
    categoryId: "2",
    category: { id: "2", name: "Electrical", slug: "electrical", createdAt: "", updatedAt: "" },
    startingPrice: 800,
    averageRating: 4.9,
    totalReviews: 189,
    technicianCount: 38,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "3",
    name: "Deep House Cleaning",
    slug: "deep-house-cleaning",
    description: "Thorough cleaning service for homes including kitchen, bathroom, floors, and windows.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600",
    categoryId: "3",
    category: { id: "3", name: "Cleaning", slug: "cleaning", createdAt: "", updatedAt: "" },
    startingPrice: 1200,
    averageRating: 4.7,
    totalReviews: 312,
    technicianCount: 62,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "4",
    name: "AC Installation & Maintenance",
    slug: "ac-installation-maintenance",
    description: "Complete AC services including installation, repair, gas refill, and annual maintenance.",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600",
    categoryId: "4",
    category: { id: "4", name: "AC & HVAC", slug: "hvac", createdAt: "", updatedAt: "" },
    startingPrice: 1500,
    averageRating: 4.6,
    totalReviews: 156,
    technicianCount: 28,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "5",
    name: "Interior & Exterior Painting",
    slug: "interior-exterior-painting",
    description: "Professional painting services for walls, ceilings, and exteriors with premium quality paints.",
    image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600",
    categoryId: "5",
    category: { id: "5", name: "Painting", slug: "painting", createdAt: "", updatedAt: "" },
    startingPrice: 2000,
    averageRating: 4.5,
    totalReviews: 98,
    technicianCount: 22,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "6",
    name: "Furniture Assembly & Repair",
    slug: "furniture-assembly-repair",
    description: "Expert carpentry for custom furniture, assembly, repair, and wooden fixture installation.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600",
    categoryId: "6",
    category: { id: "6", name: "Carpentry", slug: "carpentry", createdAt: "", updatedAt: "" },
    startingPrice: 700,
    averageRating: 4.8,
    totalReviews: 143,
    technicianCount: 19,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
];

export function FeaturedServices() {
  return (
    <section className="py-20 bg-neutral-50 dark:bg-neutral-900/50">
      <Container>
        <SectionHeading
          title="Featured Services"
          subtitle="Top-rated services handpicked for quality and reliability"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {demoServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/services">
              View All Services
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
