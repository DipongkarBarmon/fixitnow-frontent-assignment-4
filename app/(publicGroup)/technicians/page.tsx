import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { TechnicianCard } from "@/components/cards/technician-card";
import type { TechnicianProfile } from "@/types";

export const metadata: Metadata = { title: "Technicians", description: "Browse expert technicians on FixItNow." };

const demoTechnicians: TechnicianProfile[] = [
  { id: "1", userId: "u1", user: { id: "u1", name: "Karim Ahmed", email: "", role: "TECHNICIAN", isVerified: true, isBanned: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim", createdAt: "", updatedAt: "" }, bio: "", skills: ["Plumbing", "Pipe Fitting", "Water Heater"], experience: 10, certifications: [], hourlyRate: 500, completedJobs: 450, averageRating: 4.9, totalReviews: 234, isVerified: true, location: "Dhaka, Gulshan", createdAt: "", updatedAt: "" },
  { id: "2", userId: "u2", user: { id: "u2", name: "Rafiq Islam", email: "", role: "TECHNICIAN", isVerified: true, isBanned: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafiq", createdAt: "", updatedAt: "" }, bio: "", skills: ["Electrical", "Wiring", "Solar Panel", "Generator"], experience: 8, certifications: [], hourlyRate: 600, completedJobs: 380, averageRating: 4.8, totalReviews: 189, isVerified: true, location: "Dhaka, Banani", createdAt: "", updatedAt: "" },
  { id: "3", userId: "u3", user: { id: "u3", name: "Sumon Das", email: "", role: "TECHNICIAN", isVerified: true, isBanned: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sumon", createdAt: "", updatedAt: "" }, bio: "", skills: ["AC Repair", "HVAC", "Refrigeration"], experience: 6, certifications: [], hourlyRate: 700, completedJobs: 220, averageRating: 4.7, totalReviews: 156, isVerified: true, location: "Dhaka, Dhanmondi", createdAt: "", updatedAt: "" },
  { id: "4", userId: "u4", user: { id: "u4", name: "Anwar Hossain", email: "", role: "TECHNICIAN", isVerified: false, isBanned: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anwar", createdAt: "", updatedAt: "" }, bio: "", skills: ["Interior Paint", "Exterior Paint", "Wall Design"], experience: 12, certifications: [], hourlyRate: 400, completedJobs: 560, averageRating: 4.6, totalReviews: 98, isVerified: false, location: "Dhaka, Mirpur", createdAt: "", updatedAt: "" },
  { id: "5", userId: "u5", user: { id: "u5", name: "Jamal Uddin", email: "", role: "TECHNICIAN", isVerified: true, isBanned: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamal", createdAt: "", updatedAt: "" }, bio: "", skills: ["Carpentry", "Furniture", "Woodwork"], experience: 15, certifications: [], hourlyRate: 450, completedJobs: 620, averageRating: 4.9, totalReviews: 301, isVerified: true, location: "Dhaka, Uttara", createdAt: "", updatedAt: "" },
  { id: "6", userId: "u6", user: { id: "u6", name: "Nasir Khan", email: "", role: "TECHNICIAN", isVerified: true, isBanned: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nasir", createdAt: "", updatedAt: "" }, bio: "", skills: ["Deep Cleaning", "Move-in Cleaning", "Office Cleaning"], experience: 5, certifications: [], hourlyRate: 350, completedJobs: 190, averageRating: 4.5, totalReviews: 87, isVerified: true, location: "Dhaka, Mohammadpur", createdAt: "", updatedAt: "" },
];

export default function TechniciansPage() {
  return (
    <section className="py-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Expert Technicians</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Find trusted professionals for your home services</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {demoTechnicians.map((tech) => (
            <TechnicianCard key={tech.id} technician={tech} />
          ))}
        </div>
      </Container>
    </section>
  );
}
