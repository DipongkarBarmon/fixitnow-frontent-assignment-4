"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Container } from "@/components/shared/container";
import { Card, CardContent } from "@/components/ui/card";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(20, "Message must be at least 20 characters").max(1000, "Message too long"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const contactInfo = [
  { icon: Mail, label: "Email", value: "support@fixitnow.com", href: "mailto:support@fixitnow.com" },
  { icon: Phone, label: "Phone", value: "+880 1234-567890", href: "tel:+8801234567890" },
  { icon: MapPin, label: "Address", value: "Gulshan-1, Dhaka 1212, Bangladesh", href: "#" },
  { icon: Clock, label: "Hours", value: "Sat–Thu, 9am – 6pm BST", href: "#" },
];

export default function ContactPageClient() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  async function onSubmit(values: ContactFormValues) {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    console.log("[Contact]", values);
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setSubmitted(true);
    form.reset();
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-50 to-neutral-100 py-16 dark:from-neutral-950 dark:to-neutral-900">
        <Container className="text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
            Have a question, feedback, or need help? We&apos;re here for you. Reach out and our
            team will respond within 24 hours.
          </p>
        </Container>
      </section>

      {/* Contact Grid */}
      <section className="py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            {/* Info Cards */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Get In Touch</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                We love hearing from our users — whether you have a question, a suggestion, or need
                technical support.
              </p>
              <div className="space-y-3">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-blue-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-700"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40">
                      <Icon className="size-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</p>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">{value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div className="flex h-48 items-center justify-center bg-neutral-100 dark:bg-neutral-800">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-2 size-8 text-neutral-400" />
                    <p className="text-sm text-neutral-500">Gulshan-1, Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <Card className="border-neutral-200 dark:border-neutral-800">
              <CardContent className="p-8">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                      <Send className="size-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-white">Message Sent!</h3>
                    <p className="mb-6 text-neutral-600 dark:text-neutral-400">
                      Thank you for reaching out. We&apos;ll respond within 24 hours.
                    </p>
                    <Button onClick={() => setSubmitted(false)} variant="outline">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="mb-6 text-xl font-bold text-neutral-900 dark:text-white">
                      Send a Message
                    </h2>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="your@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a topic" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="general">General Inquiry</SelectItem>
                                  <SelectItem value="booking">Booking Issue</SelectItem>
                                  <SelectItem value="payment">Payment Problem</SelectItem>
                                  <SelectItem value="technician">Technician Feedback</SelectItem>
                                  <SelectItem value="partnership">Partnership</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us how we can help..."
                                  className="min-h-32 resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full gap-2"
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="size-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
