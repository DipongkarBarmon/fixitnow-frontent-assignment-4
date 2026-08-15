import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/star-rating";
import { formatCurrency } from "@/utils/format";
import { Star, Users, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getAllReviewsAction } from "../../reviews/_actions/reviewAction";
import { getInitials } from "@/utils/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata: Metadata = { title: "Service Details" };

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const reviews = await getAllReviewsAction(5, id);
  
  // Demo data - will be replaced with API call
  const service = {
    id, name: "Complete Plumbing Repair", description: "Expert plumbing repair services for pipes, faucets, drains, and water heaters. Our certified plumbers handle everything from minor leaks to major pipe replacements. Available 24/7 for emergency services.", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
    category: { id: "1", name: "Plumbing", slug: "plumbing" },
    startingPrice: 500, averageRating: 4.8, totalReviews: 234, technicianCount: 45, duration: 60,
    features: ["24/7 Emergency Service", "Licensed & Insured", "90-Day Warranty", "Transparent Pricing", "Background-checked Technicians"],
  };

  return (
    <section className="py-8">
      <Container>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
              <Image src={service.image} alt={service.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" priority />
              <Badge className="absolute left-4 top-4 bg-white/90 text-neutral-900">{service.category.name}</Badge>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{service.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-neutral-900 dark:text-white">{service.averageRating}</span>
                  <span>({service.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1"><Users className="size-4" /><span>{service.technicianCount} technicians</span></div>
                <div className="flex items-center gap-1"><Clock className="size-4" /><span>~{service.duration} min</span></div>
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold text-neutral-900 dark:text-white">About This Service</h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{service.description}</p>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold text-neutral-900 dark:text-white">What&apos;s Included</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />{f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews Preview */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-white">Customer Reviews</h2>
              <div className="space-y-4">
                {reviews.length > 0 ? reviews.map((r: any, i: number) => {
                  const customerName = r.customer?.name || r.customerName || "Customer";
                  return (
                    <div key={r.id || i} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="size-6">
                          <AvatarImage src={r.customer?.avatar || r.avatar} alt={customerName} />
                          <AvatarFallback className="text-[10px]">{getInitials(customerName)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm text-neutral-900 dark:text-white">{customerName}</span>
                        <StarRating rating={r.rating || 5} size="sm" />
                        <span className="ml-auto text-xs text-neutral-500">
                          {new Date(r.createdAt || r.date || Date.now()).toLocaleDateString("en-BD", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{r.comment}</p>
                    </div>
                  );
                }) : (
                  <div className="text-center py-6 text-sm text-neutral-500">
                    No reviews yet for this service.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="mb-4">
                <span className="text-sm text-neutral-500">Starting from</span>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">{formatCurrency(service.startingPrice)}</p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm"><span className="text-neutral-500">Category</span><span className="font-medium text-neutral-900 dark:text-white">{service.category.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-neutral-500">Duration</span><span className="font-medium text-neutral-900 dark:text-white">~{service.duration} min</span></div>
                <div className="flex justify-between text-sm"><span className="text-neutral-500">Rating</span><span className="font-medium text-neutral-900 dark:text-white">{service.averageRating} ⭐</span></div>
              </div>
              <Button asChild className="w-full gap-2" size="lg">
                <Link href={`/booking?serviceId=${service.id}`}>Book Now <ArrowRight className="size-4" /></Link>
              </Button>
              <p className="mt-3 text-center text-xs text-neutral-500">No payment required until service is complete</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
