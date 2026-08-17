import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { TechnicianCard } from "@/components/cards/technician-card";
import { getAllTechnicianProfilesAction } from "@/app/(dashboardGroup)/technician-dashboard/_actions/technicianAction";
import type { TechnicianProfile } from "@/types";

export async function TopTechnicians() {
  const result = await getAllTechnicianProfilesAction();
  let technicians: TechnicianProfile[] = [];

  if (result.success && result.data) {
    technicians = result.data as any;
    if (technicians && !Array.isArray(technicians) && Array.isArray((technicians as any).data)) {
      technicians = (technicians as any).data;
    }
  }

  // Show only top 4 technicians by rating (if data has ratings, or just first 4)
  const displayTechnicians = (Array.isArray(technicians) ? technicians : [])
    .sort((a, b) => Number(b.averageRating || 0) - Number(a.averageRating || 0))
    .slice(0, 4);

  return (
    <section className="py-20 bg-white dark:bg-neutral-950">
      <Container>
        <SectionHeading
          title="Top-Rated Technicians"
          subtitle="Meet our highest-rated professionals trusted by thousands of customers"
        />
        {displayTechnicians.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayTechnicians.map((tech) => (
              <TechnicianCard key={tech.id} technician={tech} />
            ))}
          </div>
        ) : (
          <div className="text-center text-neutral-500 py-10">
            No technicians available at the moment.
          </div>
        )}
        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/technicians">
              View All Technicians
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
