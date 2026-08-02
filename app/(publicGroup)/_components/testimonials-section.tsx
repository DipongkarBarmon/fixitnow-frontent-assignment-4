import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { StarRating } from "@/components/shared/star-rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  { name: "Sarah Ahmed", avatar: "Sarah", rating: 5, text: "FixItNow saved me during a plumbing emergency at midnight. The technician arrived within 30 minutes and fixed everything perfectly!", role: "Homeowner" },
  { name: "Mohammad Rahim", avatar: "Rahim", rating: 5, text: "I've been using FixItNow for all my electrical needs. The technicians are professional, punctual, and fairly priced.", role: "Business Owner" },
  { name: "Fatima Begum", avatar: "Fatima", rating: 4, text: "Excellent deep cleaning service! My house has never looked this good. The team was thorough and respectful of my space.", role: "Homeowner" },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white dark:bg-neutral-950">
      <Container>
        <SectionHeading title="What Our Customers Say" subtitle="Real reviews from real customers who trust FixItNow" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
              <StarRating rating={t.rating} size="sm" className="mb-4" />
              <p className="mb-6 text-neutral-600 dark:text-neutral-400 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.avatar}`} />
                  <AvatarFallback>{t.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-neutral-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
