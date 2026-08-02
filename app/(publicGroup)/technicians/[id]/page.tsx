import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Briefcase,
  CheckCircle2,
  Star,
  Calendar,
  ArrowLeft,
  Quote,
  Clock,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/shared/container";
import { StarRating } from "@/components/shared/star-rating";
import { formatCurrency, getInitials } from "@/utils/format";
import type { TechnicianProfile } from "@/types";

// Demo data — will be replaced by API calls
const demoTechnicians: Record<string, TechnicianProfile & { bio: string; reviews: { customerName: string; avatar: string; rating: number; comment: string; date: string; service: string }[] }> = {
  "1": {
    id: "1", userId: "u1",
    user: { id: "u1", name: "Karim Ahmed", email: "karim@example.com", role: "TECHNICIAN", isVerified: true, isBanned: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim", createdAt: "", updatedAt: "" },
    bio: "With over 10 years of experience in residential and commercial plumbing, I specialize in water systems, pipe repair, and fixture installation. I hold a certified plumber's license from the Bangladesh Technical Education Board and have completed over 450 successful jobs with a 4.9-star rating.",
    skills: ["Pipe Repair", "Faucet Installation", "Water Heater", "Drain Cleaning", "Leak Detection", "Bathroom Plumbing"],
    experience: 10, certifications: ["Certified Plumber – BTEB", "Water Safety Level 2"], hourlyRate: 500, completedJobs: 450, averageRating: 4.9, totalReviews: 234, isVerified: true, location: "Dhaka, Gulshan", createdAt: "", updatedAt: "",
    reviews: [
      { customerName: "Farhan Ahmed", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Farhan", rating: 5, service: "Pipe Repair", date: "2025-07-28", comment: "Karim fixed our leaking pipe in under an hour. Professional, clean, and very polite. Highly recommend!" },
      { customerName: "Shakil Ahmed", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shakil", rating: 4, service: "Faucet Installation", date: "2025-07-05", comment: "Good work overall. On time and skilled. Slight price adjustment for parts, but communicated it upfront." },
      { customerName: "Rahela Akter", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahela", rating: 5, service: "Drain Cleaning", date: "2025-06-22", comment: "Cleared our blocked drain quickly. Left the bathroom cleaner than he found it. Will book again!" },
    ],
  },
  "2": {
    id: "2", userId: "u2",
    user: { id: "u2", name: "Rafiq Islam", email: "rafiq@example.com", role: "TECHNICIAN", isVerified: true, isBanned: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafiq", createdAt: "", updatedAt: "" },
    bio: "Expert electrician with 8 years of experience in residential wiring, panel upgrades, and solar panel installation. Licensed by BREB and safety-certified. I take pride in delivering clean, safe electrical work on time.",
    skills: ["Electrical Wiring", "Panel Upgrade", "Solar Panel", "Generator", "Lighting Setup", "CCTV"],
    experience: 8, certifications: ["BREB Licensed Electrician", "Solar Installation Certified"], hourlyRate: 600, completedJobs: 380, averageRating: 4.8, totalReviews: 189, isVerified: true, location: "Dhaka, Banani", createdAt: "", updatedAt: "",
    reviews: [
      { customerName: "Rajib Hossain", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajib", rating: 5, service: "Electrical Wiring", date: "2025-07-20", comment: "Rafiq did a complete home rewiring. Excellent work, very knowledgeable, transparent pricing. 10/10." },
      { customerName: "Tanvir Hassan", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tanvir", rating: 5, service: "Power Issue", date: "2025-06-28", comment: "Diagnosed and fixed a power outage in 45 minutes. Very systematic and professional." },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const tech = demoTechnicians[id];
  const name = tech?.user?.name ?? "Technician";
  return {
    title: `${name} — FixItNow Technician`,
    description: tech?.bio?.slice(0, 160) ?? "View technician profile on FixItNow.",
  };
}

export default async function TechnicianDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const technician = demoTechnicians[id] ?? demoTechnicians["1"]; // fallback for demo
  const name = technician.user?.name ?? "Technician";
  const avatar = technician.user?.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;

  const timeSlots = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"];

  return (
    <div className="min-h-screen py-8">
      <Container>
        {/* Back */}
        <Link
          href="/technicians"
          className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to Technicians
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left Column — Profile */}
          <div className="space-y-8">
            {/* Profile Header */}
            <Card className="border-neutral-200 dark:border-neutral-800">
              <CardContent className="p-6">
                <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                  <div className="relative shrink-0">
                    <Avatar className="size-24 border-4 border-white shadow-md dark:border-neutral-800">
                      <AvatarImage src={avatar} alt={name} />
                      <AvatarFallback className="text-2xl">{getInitials(name)}</AvatarFallback>
                    </Avatar>
                    {technician.isVerified && (
                      <CheckCircle2 className="absolute -bottom-1 -right-1 size-7 fill-blue-500 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{name}</h1>
                      {technician.isVerified && (
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                          ✓ Verified
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <StarRating rating={technician.averageRating} size="sm" />
                      <span className="text-sm text-neutral-500">
                        {technician.averageRating.toFixed(1)} ({technician.totalReviews} reviews)
                      </span>
                    </div>
                    {technician.location && (
                      <div className="mt-2 flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                        <MapPin className="size-4" />
                        {technician.location}
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="size-4" />
                        {technician.experience} years experience
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="size-4 text-emerald-500" />
                        {technician.completedJobs} jobs completed
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bio */}
            <Card className="border-neutral-200 dark:border-neutral-800">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {technician.bio}
                </p>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-neutral-200 dark:border-neutral-800">
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {technician.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            {technician.certifications && technician.certifications.length > 0 && (
              <Card className="border-neutral-200 dark:border-neutral-800">
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {technician.certifications.map((cert) => (
                      <li key={cert} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                        {cert}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card className="border-neutral-200 dark:border-neutral-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="size-5" />
                  Customer Reviews ({technician.reviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {technician.reviews.map((review, i) => (
                  <div key={i} className="relative rounded-xl border border-neutral-100 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/50">
                    <Quote className="absolute right-4 top-4 size-6 text-neutral-200 dark:text-neutral-700" />
                    <div className="mb-3 flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={review.avatar} alt={review.customerName} />
                        <AvatarFallback className="text-xs">{getInitials(review.customerName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">{review.customerName}</p>
                        <p className="text-xs text-neutral-500">{review.service} · {new Date(review.date).toLocaleDateString("en-BD", { month: "short", day: "numeric", year: "numeric" })}</p>
                      </div>
                      <div className="ml-auto">
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column — Booking Card */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card className="border-neutral-200 shadow-sm dark:border-neutral-800">
              <CardContent className="p-6">
                <div className="mb-4 flex items-end gap-1">
                  <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                    {formatCurrency(technician.hourlyRate)}
                  </span>
                  <span className="mb-1 text-sm text-neutral-500 dark:text-neutral-400">/hour</span>
                </div>

                <div className="mb-4 space-y-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Response time</span>
                    <span className="flex items-center gap-1 font-medium text-neutral-900 dark:text-white">
                      <Clock className="size-3.5" /> Under 2 hours
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Availability</span>
                    <span className="flex items-center gap-1 font-medium text-emerald-600">
                      <span className="inline-block size-2 rounded-full bg-emerald-500" />
                      Available Today
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Jobs done</span>
                    <span className="font-medium text-neutral-900 dark:text-white">{technician.completedJobs}+</span>
                  </div>
                </div>

                {/* Time Slots */}
                <p className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
                  <Calendar className="mr-1.5 inline size-4" />
                  Available Slots Today
                </p>
                <div className="mb-5 grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      className="rounded-lg border border-neutral-200 bg-neutral-50 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <Button asChild size="lg" className="w-full">
                  <Link href={`/services`}>Book This Technician</Link>
                </Button>
                <Button variant="outline" size="lg" className="mt-2 w-full">
                  Message
                </Button>
              </CardContent>
            </Card>

            {/* Quick stats */}
            <Card className="border-neutral-200 dark:border-neutral-800">
              <CardContent className="p-5">
                <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-white">Performance</h3>
                <div className="space-y-3">
                  {[
                    { label: "Avg. Rating", value: `${technician.averageRating} ★`, color: "text-amber-600" },
                    { label: "Completion Rate", value: "98%", color: "text-emerald-600" },
                    { label: "On-Time Rate", value: "95%", color: "text-blue-600" },
                    { label: "Repeat Customers", value: "72%", color: "text-purple-600" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-neutral-500 dark:text-neutral-400">{label}</span>
                      <span className={`font-bold ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
