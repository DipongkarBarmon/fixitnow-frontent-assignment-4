import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { TechnicianCard } from "@/components/cards/technician-card";
import type { TechnicianProfile } from "@/types";

const demoTechnicians: TechnicianProfile[] = [
  {
    id: "1",
    userId: "u1",
    user: { id: "u1", name: "Karim Ahmed", email: "karim@example.com", role: "TECHNICIAN", isVerified: true, isBanned: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim", createdAt: "", updatedAt: "" },
    bio: "Expert plumber with 10+ years of experience",
    skills: ["Plumbing", "Pipe Fitting", "Water Heater"],
    experience: 10,
    certifications: ["Licensed Plumber"],
    hourlyRate: 500,
    completedJobs: 450,
    averageRating: 4.9,
    totalReviews: 234,
    isVerified: true,
    location: "Dhaka, Gulshan",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "2",
    userId: "u2",
    user: { id: "u2", name: "Rafiq Islam", email: "rafiq@example.com", role: "TECHNICIAN", isVerified: true, isBanned: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafiq", createdAt: "", updatedAt: "" },
    bio: "Certified electrician specializing in home wiring",
    skills: ["Electrical", "Wiring", "Solar Panel", "Generator"],
    experience: 8,
    certifications: ["Master Electrician"],
    hourlyRate: 600,
    completedJobs: 380,
    averageRating: 4.8,
    totalReviews: 189,
    isVerified: true,
    location: "Dhaka, Banani",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "3",
    userId: "u3",
    user: { id: "u3", name: "Sumon Das", email: "sumon@example.com", role: "TECHNICIAN", isVerified: true, isBanned: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sumon", createdAt: "", updatedAt: "" },
    bio: "Professional AC technician with factory training",
    skills: ["AC Repair", "HVAC", "Refrigeration"],
    experience: 6,
    certifications: ["HVAC Certified"],
    hourlyRate: 700,
    completedJobs: 220,
    averageRating: 4.7,
    totalReviews: 156,
    isVerified: true,
    location: "Dhaka, Dhanmondi",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "4",
    userId: "u4",
    user: { id: "u4", name: "Anwar Hossain", email: "anwar@example.com", role: "TECHNICIAN", isVerified: false, isBanned: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anwar", createdAt: "", updatedAt: "" },
    bio: "Experienced painter for interior and exterior work",
    skills: ["Interior Paint", "Exterior Paint", "Wall Design"],
    experience: 12,
    certifications: [],
    hourlyRate: 400,
    completedJobs: 560,
    averageRating: 4.6,
    totalReviews: 98,
    isVerified: false,
    location: "Dhaka, Mirpur",
    createdAt: "",
    updatedAt: "",
  },
];

export function TopTechnicians() {
  return (
    <section className="py-20 bg-white dark:bg-neutral-950">
      <Container>
        <SectionHeading
          title="Top-Rated Technicians"
          subtitle="Meet our highest-rated professionals trusted by thousands of customers"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {demoTechnicians.map((tech) => (
            <TechnicianCard key={tech.id} technician={tech} />
          ))}
        </div>
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
