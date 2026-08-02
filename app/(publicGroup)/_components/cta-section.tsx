import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

export function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <Container className="text-center">
        <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Ready to Get Started?
        </h2>
        <p className="mb-8 mx-auto max-w-xl text-lg text-blue-100">
          Join thousands of satisfied homeowners. Book your first service today and experience the FixItNow difference.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" variant="secondary" className="gap-2 px-8 text-blue-700">
            <Link href="/services">
              Book a Service <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/30 px-8 text-white hover:bg-white/10">
            <Link href="/register">Create Free Account</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
