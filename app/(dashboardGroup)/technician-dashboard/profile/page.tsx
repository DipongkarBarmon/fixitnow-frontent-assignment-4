"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  Star,
  Briefcase,
  MapPin,
  DollarSign,
  Edit,
  Eye,
  Plus,
  Wrench,
  Calendar,
  Sparkles,
  Award,
  Clock,
  ArrowRight,
  TrendingUp,
  Settings,
  RefreshCw,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardSkeleton } from "@/components/shared/loading";
import { useAuth } from "@/providers/auth-provider";
import { useMyTechnicianProfile } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { formatCurrency, getAvatarUrl, getInitials } from "@/utils/format";
import { CreateTechnicianForm } from "../_components/createTechnicianForm";
import { EditTechnicianProfileForm } from "../_components/editTechnicianProfileForm";
import { TechnicianProfileCard } from "../_components/technicianProfileCard";
import type { TechnicianProfile } from "@/types";

export default function TechnicianProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: profileRes, isLoading, refetch } = useMyTechnicianProfile();
  const [activeTab, setActiveTab] = useState<"overview" | "edit">("overview");

  const profile: TechnicianProfile | undefined = profileRes?.data;
  const hasProfile = Boolean(profile && (profile.id || profile.userId || profile.address));

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="h-4 w-96 bg-neutral-100 dark:bg-neutral-900 rounded animate-pulse" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <CardSkeleton />
          <div className="lg:col-span-2 space-y-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // 1. If technician has NO profile (or just deleted it): Show ONLY Create Form
  if (!hasProfile || !profile) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            Technician Profile Setup
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Create your professional profile to publish your services and start receiving bookings on FixItNow.
          </p>
        </div>

        <CreateTechnicianForm
          onSuccess={(created) => {
            queryClient.setQueryData([...QUERY_KEYS.TECHNICIANS.ALL, "profile"], {
              success: true,
              data: created,
            });
            void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TECHNICIANS.ALL });
            void refetch();
            setActiveTab("overview");
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-neutral-200/80 pb-5 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
              Technician Profile
            </h1>
            {profile.isVerified ? (
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-0 text-[11px] gap-1">
                <ShieldCheck className="size-3.5" /> Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[11px] text-amber-600 border-amber-300">
                Pending Verification
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Manage your service operations, address area, hourly rates, specialties, and credentials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            className="text-xs gap-1.5 border-neutral-300 dark:border-neutral-700"
          >
            <RefreshCw className="size-3.5" />
            <span>Sync</span>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 border-neutral-300 dark:border-neutral-700"
          >
            <Link href={`/technicians/${profile.id || profile.userId}`} target="_blank">
              <Eye className="size-3.5" />
              <span>Public Preview</span>
            </Link>
          </Button>

          <Button
            size="sm"
            onClick={() => setActiveTab(activeTab === "edit" ? "overview" : "edit")}
            className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
          >
            <Edit className="size-3.5" />
            <span>{activeTab === "edit" ? "View Profile" : "Edit Profile"}</span>
          </Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "overview" | "edit")}
        className="space-y-6"
      >
        <TabsList className="bg-neutral-100 dark:bg-neutral-900 p-1 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <TabsTrigger
            value="overview"
            className="rounded-lg text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-950 data-[state=active]:shadow-xs"
          >
            Profile Overview
          </TabsTrigger>
          <TabsTrigger
            value="edit"
            className="rounded-lg text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-950 data-[state=active]:shadow-xs"
          >
            Edit Profile Details
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6 mt-0">
          <TechnicianProfileCard
            profile={profile}
            onEditClick={() => setActiveTab("edit")}
          />

          {/* Quick Hub Grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/technician-dashboard/services"
              className="group flex flex-col justify-between rounded-xl border border-neutral-200/90 bg-white p-5 transition-all hover:border-emerald-500 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <Wrench className="size-5" />
                </div>
                <ArrowRight className="size-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  My Service Catalog
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Add, update or price individual fixed services you offer.
                </p>
              </div>
            </Link>

            <Link
              href="/technician-dashboard/availability"
              className="group flex flex-col justify-between rounded-xl border border-neutral-200/90 bg-white p-5 transition-all hover:border-blue-500 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <Calendar className="size-5" />
                </div>
                <ArrowRight className="size-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Schedule & Availability
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Set your working hours, weekly days off, and booking windows.
                </p>
              </div>
            </Link>

            <Link
              href="/technician-dashboard/reviews"
              className="group flex flex-col justify-between rounded-xl border border-neutral-200/90 bg-white p-5 transition-all hover:border-amber-500 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  <Star className="size-5" />
                </div>
                <ArrowRight className="size-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Ratings & Reviews
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  View customer feedback and maintain high reputation scores.
                </p>
              </div>
            </Link>
          </div>
        </TabsContent>

        {/* Edit Tab Content */}
        <TabsContent value="edit" className="space-y-6 mt-0">
          <EditTechnicianProfileForm
            profile={profile}
            onSuccess={(updated) => {
              queryClient.setQueryData([...QUERY_KEYS.TECHNICIANS.ALL, "profile"], {
                success: true,
                data: updated,
              });
              void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TECHNICIANS.ALL });
              void refetch();
              setActiveTab("overview");
            }}
            onCancel={() => setActiveTab("overview")}
            onDeleteSuccess={() => {
              queryClient.setQueryData([...QUERY_KEYS.TECHNICIANS.ALL, "profile"], null);
              queryClient.removeQueries({ queryKey: [...QUERY_KEYS.TECHNICIANS.ALL, "profile"] });
              void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TECHNICIANS.ALL });
              void refetch();
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
