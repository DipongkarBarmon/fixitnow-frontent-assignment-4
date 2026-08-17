import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceCard } from "@/components/cards/service-card";
import { getAllServiceAction } from "@/app/(publicGroup)/_actions/serviceAction";
import type { Service } from "@/types";

export async function FeaturedServices() {
  const result = await getAllServiceAction();
  let services: Service[] = [];
  
  if (result.success && result.data) {
    services = result.data as any;
    if (services && !Array.isArray(services) && Array.isArray((services as any).data)) {
      services = (services as any).data;
    }
  }

  // Show only up to 6 featured services
  const displayServices = (Array.isArray(services) ? services : []).slice(0, 6);

  return (
    <section className="py-20 bg-neutral-50 dark:bg-neutral-900/50">
      <Container>
        <SectionHeading
          title="Featured Services"
          subtitle="Top-rated services handpicked for quality and reliability"
        />
        {displayServices.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center text-neutral-500 py-10">
            No featured services available at the moment.
          </div>
        )}
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
