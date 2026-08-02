import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How does FixItNow work?", a: "Simply browse our services, select a technician, choose a date and time, and book! Our verified professionals will arrive at your doorstep as scheduled." },
  { q: "Are technicians background-checked?", a: "Yes, all technicians on FixItNow undergo thorough background verification, skill assessment, and identity checks before being approved on our platform." },
  { q: "What payment methods do you accept?", a: "We accept Stripe and SSLCommerz for secure online payments. You can pay after the service is completed and you're satisfied." },
  { q: "Can I cancel or reschedule a booking?", a: "Yes, you can cancel or reschedule a booking up to 2 hours before the scheduled time at no extra cost." },
  { q: "What if I'm not satisfied with the service?", a: "We offer a satisfaction guarantee. If you're not happy with the service, contact our support team and we'll arrange a re-service or refund." },
  { q: "How do I become a technician on FixItNow?", a: "Sign up as a technician, complete your profile with skills and certifications, and our team will review your application within 48 hours." },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-20 bg-neutral-50 dark:bg-neutral-900/50">
      <Container size="md">
        <SectionHeading title="Frequently Asked Questions" subtitle="Find answers to common questions about our platform" />
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-neutral-200 dark:border-neutral-800">
              <AccordionTrigger className="text-left text-neutral-900 dark:text-white hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-neutral-600 dark:text-neutral-400">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
