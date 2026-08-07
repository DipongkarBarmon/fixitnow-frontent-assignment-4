"use client";

import Link from "next/link";
import {
  MapPin,
  Star,
  ShieldCheck,
  Briefcase,
  DollarSign,
  Award,
  Edit,
  Wrench,
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle2,
  Phone,
  Mail,
  User,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency, formatRating, getSafeAvatarUrl, getInitials } from "@/utils/format";
import type { TechnicianProfile } from "@/types";

interface TechnicianProfileCardProps {
  profile: TechnicianProfile;
  onEditClick?: () => void;
}

export function TechnicianProfileCard({
  profile,
  onEditClick,
}: TechnicianProfileCardProps) {
  const name = profile.user?.name || "Technician";
  const email = profile.user?.email || "";
  const phone = profile.user?.phone || profile.user?.phoneNumber || "";
  const rawPhoto =
    profile.user?.profilePhoto ||
    profile.user?.avatar ||
    (profile as any).profilePhoto ||
    (profile as any).avatar;
  const avatar = getSafeAvatarUrl(rawPhoto, name);
  const address = profile.address || profile.location || "Service Area Unspecified";
  const hourlyRate = profile.hourlyRate || 500;
  const rating = Number(profile.averageRating) || 5.0;
  const completedJobs = profile.completedJobs || 0;
  const experience = profile.experience || 1;
  const skills = profile.skills || [];
  const certs = profile.certifications || [];
  const services = profile.services || [];

  return (
    <div className="space-y-6">
      {/* Hero Overview Card */}
      <Card className="overflow-hidden border-neutral-200/90 shadow-sm dark:border-neutral-800/90 bg-white dark:bg-neutral-900/80">
        {/* Banner Header */}
        <div className="relative h-32 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 sm:h-40">
          <div className="absolute right-4 top-4 flex items-center gap-2">
            {profile.isVerified ? (
              <Badge className="bg-emerald-950/80 text-emerald-200 backdrop-blur-md border-emerald-400/30 gap-1 px-2.5 py-1 text-xs">
                <ShieldCheck className="size-3.5 text-emerald-400" />
                <span>Verified Pro</span>
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-white/80 text-neutral-800 backdrop-blur-md text-xs">
                Pending Verification
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="relative px-6 pb-6 pt-0">
          {/* Avatar & Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-14 sm:-mt-16 gap-4">
            <div className="relative inline-block">
              <Avatar className="size-24 sm:size-28 border-4 border-white shadow-lg dark:border-neutral-900 ring-2 ring-emerald-500/30">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback className="bg-emerald-600 text-white font-bold text-2xl">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              {profile.isVerified && (
                <div
                  className="absolute bottom-1 right-1 flex size-7 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md ring-2 ring-white dark:ring-neutral-900"
                  title="Verified Professional"
                >
                  <ShieldCheck className="size-4" />
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {onEditClick && (
                <Button
                  onClick={onEditClick}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 border-neutral-300 dark:border-neutral-700 text-xs font-semibold"
                >
                  <Edit className="size-3.5" />
                  <span>Edit Profile</span>
                </Button>
              )}
              <Button
                asChild
                size="sm"
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
              >
                <Link href={`/technicians/${profile.id || profile.userId}`} target="_blank">
                  <ExternalLink className="size-3.5" />
                  <span>Public View</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Main Info */}
          <div className="mt-4 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                {name}
              </h2>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 text-xs">
                Technician
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-neutral-500 dark:text-neutral-400">
              {email && (
                <span className="flex items-center gap-1">
                  <Mail className="size-3.5 text-neutral-400" />
                  {email}
                </span>
              )}
              {phone && (
                <span className="flex items-center gap-1">
                  <Phone className="size-3.5 text-neutral-400" />
                  {phone}
                </span>
              )}
              <span className="flex items-center gap-1 font-medium text-neutral-700 dark:text-neutral-300">
                <MapPin className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                {address}
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="text-center sm:text-left">
              <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Rating</span>
              <div className="mt-1 flex items-center justify-center sm:justify-start gap-1 text-amber-500">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span className="text-lg font-bold text-neutral-900 dark:text-white">
                  {formatRating(rating)}
                </span>
                <span className="text-xs text-neutral-400">/ 5.0</span>
              </div>
            </div>

            <div className="text-center sm:text-left sm:border-l sm:border-neutral-200 sm:dark:border-neutral-800 sm:pl-4">
              <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Completed</span>
              <div className="mt-1 flex items-center justify-center sm:justify-start gap-1 text-emerald-600 dark:text-emerald-400">
                <Briefcase className="size-4" />
                <span className="text-lg font-bold text-neutral-900 dark:text-white">
                  {completedJobs}
                </span>
                <span className="text-xs text-neutral-400">Jobs</span>
              </div>
            </div>

            <div className="text-center sm:text-left sm:border-l sm:border-neutral-200 sm:dark:border-neutral-800 sm:pl-4">
              <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Hourly Rate</span>
              <div className="mt-1 flex items-center justify-center sm:justify-start gap-0.5 text-blue-600 dark:text-blue-400">
                <span className="text-lg font-bold text-neutral-900 dark:text-white">
                  {formatCurrency(hourlyRate)}
                </span>
                <span className="text-xs text-neutral-400">/hr</span>
              </div>
            </div>

            <div className="text-center sm:text-left sm:border-l sm:border-neutral-200 sm:dark:border-neutral-800 sm:pl-4">
              <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Experience</span>
              <div className="mt-1 flex items-center justify-center sm:justify-start gap-1 text-purple-600 dark:text-purple-400">
                <Clock className="size-4" />
                <span className="text-lg font-bold text-neutral-900 dark:text-white">
                  {experience}
                </span>
                <span className="text-xs text-neutral-400">Years</span>
              </div>
            </div>
          </div>

          {/* Professional Bio */}
          {profile.bio && (
            <div className="mt-6 space-y-2 pt-6 border-t border-neutral-100 dark:border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Professional Bio & Overview
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Skills Badges */}
          <div className="mt-6 space-y-2.5 pt-6 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Wrench className="size-3.5 text-emerald-600" />
                <span>Specialized Skills & Expertise ({skills.length})</span>
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50 py-1 px-2.5 text-xs font-medium"
                >
                  <CheckCircle2 className="size-3 mr-1 text-emerald-600" />
                  {skill}
                </Badge>
              ))}
              {skills.length === 0 && (
                <p className="text-xs text-neutral-400">No skills added yet.</p>
              )}
            </div>
          </div>

          {/* Certifications */}
          {certs.length > 0 && (
            <div className="mt-6 space-y-2.5 pt-6 border-t border-neutral-100 dark:border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Award className="size-3.5 text-blue-600" />
                <span>Licenses & Credentials</span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {certs.map((cert) => (
                  <Badge
                    key={cert}
                    variant="outline"
                    className="border-blue-300 text-blue-700 bg-blue-50/40 dark:border-blue-900 dark:text-blue-300 dark:bg-blue-950/40 py-1 px-2.5 text-xs font-medium"
                  >
                    <Award className="size-3 mr-1" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Quick Links Footer */}
          <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="text-xs">
                <Link href="/technician-dashboard/services">
                  <Wrench className="size-3.5 mr-1" /> Manage Services
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="text-xs">
                <Link href="/technician-dashboard/availability">
                  <Calendar className="size-3.5 mr-1" /> Availability Calendar
                </Link>
              </Button>
            </div>

            <p className="text-[11px] text-neutral-400">
              Member since {new Date(profile.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TechnicianProfileCard;
