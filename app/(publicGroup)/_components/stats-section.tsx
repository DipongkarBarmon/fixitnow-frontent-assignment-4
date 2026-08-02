"use client";

import { Users, Briefcase, Star, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/shared/container";
import type { LucideIcon } from "lucide-react";

interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
  color: string;
  bgColor: string;
}

const stats: StatItem[] = [
  { icon: Users, value: "10,000+", label: "Happy Customers", color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  { icon: Briefcase, value: "500+", label: "Expert Technicians", color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-100 dark:bg-emerald-900/30" },
  { icon: Star, value: "4.8", label: "Average Rating", color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
  { icon: CheckCircle2, value: "50,000+", label: "Jobs Completed", color: "text-purple-600 dark:text-purple-400", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-neutral-900 dark:bg-neutral-950">
      <Container>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`mx-auto mb-4 flex size-14 items-center justify-center rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`size-7 ${stat.color}`} />
              </div>
              <p className="text-3xl font-extrabold text-white sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-neutral-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
