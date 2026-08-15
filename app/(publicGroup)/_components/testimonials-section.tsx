import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { StarRating } from "@/components/shared/star-rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllReviewsAction } from "../reviews/_actions/reviewAction";
import { getInitials } from "@/utils/format";

export async function TestimonialsSection() {
  const allReviews = await getAllReviewsAction(10);
  
  // Get up to 3 reviews that have a comment, preferably 4-5 stars
  const testimonials = allReviews
    .filter(r => r.comment && r.rating >= 4)
    .slice(0, 3);
    
  if (testimonials.length === 0) return null; // Or show fallback/empty state

  return (
    <section className="py-20 bg-white dark:bg-neutral-950">
      <Container>
        <SectionHeading title="What Our Customers Say" subtitle="Real reviews from real customers who trust FixItNow" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => {
            const customerName = t.customer?.name || t.customerName || "Customer";
            return (
              <div key={t.id || i} className="rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
                <StarRating rating={t.rating || 5} size="sm" className="mb-4" />
                <p className="mb-6 text-neutral-600 dark:text-neutral-400 leading-relaxed">&ldquo;{t.comment}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={t.customer?.avatar || t.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${customerName}`} />
                    <AvatarFallback>{getInitials(customerName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">{customerName}</p>
                    <p className="text-xs text-neutral-500">
                      {typeof t.service === 'object' ? t.service?.name : t.service || "Verified Booking"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
