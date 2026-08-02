import type { Metadata } from "next";
import Link from "next/link";
import {
  Wrench,
  Shield,
  Users,
  Star,
  ArrowRight,
  CheckCircle2,
  Target,
  Lightbulb,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about FixItNow — our mission, values, and the team dedicated to connecting homeowners with trusted technicians.",
};

const stats = [
  { label: "Happy Customers", value: "10,000+", icon: Users },
  { label: "Verified Technicians", value: "500+", icon: Shield },
  { label: "Services Completed", value: "50,000+", icon: CheckCircle2 },
  { label: "Average Rating", value: "4.8 ★", icon: Star },
];

const values = [
  {
    icon: Shield,
    title: "Trust & Safety",
    description:
      "Every technician is background-checked, verified, and rated by real customers. Your safety is our top priority.",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/40",
  },
  {
    icon: Target,
    title: "Quality First",
    description:
      "We partner only with skilled professionals who meet our strict quality standards and commit to excellence.",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "From instant booking to real-time tracking, we continuously innovate to make home services effortless.",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/40",
  },
  {
    icon: Heart,
    title: "Community",
    description:
      "We believe in empowering local technicians and building a community that supports both homeowners and professionals.",
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-950/40",
  },
];

const team = [
  {
    name: "Rahman Hossain",
    role: "CEO & Co-Founder",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahman&backgroundColor=b6e3f4",
    bio: "10 years in tech entrepreneurship. Passionate about solving everyday problems through technology.",
  },
  {
    name: "Fatima Akter",
    role: "CTO & Co-Founder",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima&backgroundColor=d1d4f9",
    bio: "Full-stack engineer with expertise in marketplace platforms and distributed systems.",
  },
  {
    name: "Kamal Hosen",
    role: "Head of Operations",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kamal&backgroundColor=c0aede",
    bio: "15 years in logistics and operations. Ensures every booking runs smoothly from start to finish.",
  },
  {
    name: "Nadia Islam",
    role: "Head of Technician Relations",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nadia&backgroundColor=ffd5dc",
    bio: "Dedicated to onboarding the best technicians and maintaining our high-quality service standards.",
  },
];

const timeline = [
  { year: "2021", event: "FixItNow founded in Dhaka with 5 technicians and a dream" },
  { year: "2022", event: "Launched beta platform; 200+ technicians onboarded within 6 months" },
  { year: "2023", event: "Expanded to 8 cities, reached 5,000 customers milestone" },
  { year: "2024", event: "Introduced real-time tracking, reviews, and payment integrations" },
  { year: "2025", event: "10,000+ customers, 500+ verified technicians nationwide" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 size-[500px] rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-600/5" />
          <div className="absolute -left-40 bottom-0 size-[400px] rounded-full bg-purple-400/10 blur-3xl dark:bg-purple-600/5" />
        </div>
        <Container className="relative text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
            <Wrench className="size-3.5" />
            Our Story
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
            Building the Future of{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Home Services
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
            FixItNow was born from a simple idea: finding a trusted technician for your home
            shouldn&apos;t be stressful. We connect homeowners with verified professionals — fast,
            reliably, and transparently.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/services">
              Explore Services <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Container>
      </section>

      {/* Stats */}
      <section className="border-y border-neutral-200 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-950">
        <Container>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="mb-2 flex justify-center">
                  <Icon className="size-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-3xl font-extrabold text-neutral-900 dark:text-white">{value}</p>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Mission */}
      <section className="py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                title="Our Mission"
                subtitle="We exist to make home maintenance stress-free. Every homeowner deserves fast access to
                qualified, trusted technicians — and every technician deserves a platform that helps
                them grow their business."
                align="left"
              />
              <ul className="mt-6 space-y-3">
                {[
                  "Verify every technician through background checks",
                  "Provide transparent pricing with no hidden fees",
                  "Enable real-time booking and tracking",
                  "Ensure satisfaction through ratings and guarantees",
                  "Empower local professionals with a fair marketplace",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                    <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-white shadow-2xl">
                <Wrench className="mb-4 size-12 opacity-80" />
                <h3 className="mb-3 text-2xl font-bold">Trusted Since 2021</h3>
                <p className="text-blue-100">
                  From a 5-person startup to Bangladesh&apos;s leading home service marketplace,
                  we&apos;ve helped tens of thousands of families get the help they need.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-6">
                  <div>
                    <p className="text-2xl font-bold">98%</p>
                    <p className="text-sm text-blue-200">Satisfaction Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{"<"} 2h</p>
                    <p className="text-sm text-blue-200">Avg. Response Time</p>
                  </div>
                </div>
              </div>
              {/* Decorative rings */}
              <div className="absolute -right-6 -top-6 size-24 rounded-full border-4 border-blue-200/40 dark:border-blue-800/40" />
              <div className="absolute -bottom-4 -left-4 size-16 rounded-full border-4 border-purple-200/40 dark:border-purple-800/40" />
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="bg-neutral-50 py-20 dark:bg-neutral-900/50">
        <Container>
          <SectionHeading
            title="Our Values"
            subtitle="The principles that guide everything we do"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description, color, bg }) => (
              <Card key={title} className="border-neutral-200 dark:border-neutral-800">
                <CardContent className="p-6">
                  <div className={`mb-4 flex size-12 items-center justify-center rounded-xl ${bg}`}>
                    <Icon className={`size-6 ${color}`} />
                  </div>
                  <h3 className="mb-2 font-semibold text-neutral-900 dark:text-white">{title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <Container>
          <SectionHeading title="Our Journey" subtitle="How we got here" />
          <div className="relative mt-12">
            <div className="absolute left-4 top-0 h-full w-0.5 bg-neutral-200 dark:bg-neutral-800 sm:left-1/2" />
            <div className="space-y-10">
              {timeline.map(({ year, event }, i) => (
                <div
                  key={year}
                  className={`relative flex items-start gap-6 sm:items-center ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}
                >
                  <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                    {year.slice(2)}
                  </div>
                  <div className={`ml-6 sm:ml-0 sm:w-[calc(50%-3rem)] ${i % 2 === 0 ? "sm:text-right" : "sm:text-left sm:ml-auto"}`}>
                    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                      <p className="mb-1 text-xs font-bold text-blue-600 dark:text-blue-400">{year}</p>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">{event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="bg-neutral-50 py-20 dark:bg-neutral-900/50">
        <Container>
          <SectionHeading
            title="Meet the Team"
            subtitle="The people behind FixItNow"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map(({ name, role, avatar, bio }) => (
              <Card key={name} className="border-neutral-200 text-center dark:border-neutral-800">
                <CardContent className="p-6">
                  <img
                    src={avatar}
                    alt={name}
                    className="mx-auto mb-4 size-20 rounded-full border-4 border-white shadow-md dark:border-neutral-800"
                  />
                  <h3 className="font-semibold text-neutral-900 dark:text-white">{name}</h3>
                  <p className="mb-3 text-sm text-blue-600 dark:text-blue-400">{role}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20">
        <Container>
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-16 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
            <p className="mb-8 text-blue-100">
              Join thousands of homeowners who trust FixItNow for their home service needs.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" variant="secondary" className="gap-2">
                <Link href="/services">
                  Browse Services <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link href="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
