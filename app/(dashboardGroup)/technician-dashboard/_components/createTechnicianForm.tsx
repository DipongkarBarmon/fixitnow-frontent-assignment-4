"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  UserCheck,
  MapPin,
  Sparkles,
  ShieldCheck,
  Star,
  DollarSign,
  Briefcase,
  Award,
  Plus,
  X,
  CheckCircle2,
  Loader2,
  Eye,
  Info,
  Wrench,
  Zap,
  Droplet,
  Flame,
  Hammer,
  Paintbrush,
  Tv,
  Shield,
  HelpCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useAuth } from "@/providers/auth-provider";
import { QUERY_KEYS } from "@/constants";
import { formatCurrency, getSafeAvatarUrl, getInitials } from "@/utils/format";
import createTechnicianProfileAction from "../_actions/technicianAction";
import type { TechnicianProfile } from "@/types";

// Popular predefined skills for quick 1-click addition
const POPULAR_SKILLS = [
  { name: "Electrical Wiring", icon: Zap },
  { name: "Circuit Breaker Repair", icon: Zap },
  { name: "Plumbing & Pipe Fitting", icon: Droplet },
  { name: "Leak Detection", icon: Droplet },
  { name: "AC Maintenance & Gas Refill", icon: Flame },
  { name: "HVAC Diagnostics", icon: Flame },
  { name: "Carpentry & Woodwork", icon: Hammer },
  { name: "Interior Painting", icon: Paintbrush },
  { name: "Appliance Repair", icon: Tv },
  { name: "Smart Lock Installation", icon: Shield },
  { name: "CCTV & Security Setup", icon: Shield },
  { name: "Solar Panel Mounting", icon: Zap },
];

// Curated location presets
const LOCATION_PRESETS = [
  "Gulshan, Dhaka",
  "Banani, Dhaka",
  "Dhanmondi, Dhaka",
  "Uttara, Dhaka",
  "Mirpur, Dhaka",
  "Mohammadpur, Dhaka",
  "Bashundhara R/A, Dhaka",
  "Agrabad, Chittagong",
  "Zindabazar, Sylhet",
];

// Curated bio suggestion templates
const BIO_SUGGESTIONS = [
  "Certified electrical technician with 5+ years of hands-on experience in residential wiring, panel upgrades, and smart home lighting installations.",
  "Experienced plumbing specialist dedicated to fast, reliable leak repairs, bathroom fixture installations, and whole-house pipe maintenance.",
  "Professional HVAC and AC technician providing same-day diagnostics, compressor repairs, duct cleaning, and seasonal maintenance.",
];

const createTechnicianSchema = z.object({
  address: z
    .string()
    .min(3, "Address must be at least 3 characters")
    .max(250, "Address is too long"),
  bio: z
    .string()
    .max(1500, "Bio must be 1500 characters or less")
    .optional()
    .or(z.literal("")),
  hourlyRate: z
    .number()
    .min(50, "Hourly rate must be at least 50 BDT")
    .max(50000, "Hourly rate cannot exceed 50,000 BDT"),
  experience: z
    .number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience value is invalid"),
});

type CreateTechnicianFormValues = z.infer<typeof createTechnicianSchema>;

interface CreateTechnicianFormProps {
  onSuccess?: (profile: TechnicianProfile) => void;
  onCancel?: () => void;
}

export function CreateTechnicianForm({ onSuccess, onCancel }: CreateTechnicianFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newCertInput, setNewCertInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBioSuggestions, setShowBioSuggestions] = useState(false);

  const form = useForm<CreateTechnicianFormValues>({
    resolver: zodResolver(createTechnicianSchema),
    defaultValues: {
      address: user?.address || "",
      bio: "",
      hourlyRate: 500,
      experience: 2,
    },
  });

  const watched = form.watch();

  // Skills handlers
  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  // Certifications handlers
  const handleAddCert = (certToAdd: string) => {
    const trimmed = certToAdd.trim();
    if (trimmed && !certifications.includes(trimmed)) {
      setCertifications((prev) => [...prev, trimmed]);
      setNewCertInput("");
    }
  };

  const handleRemoveCert = (certToRemove: string) => {
    setCertifications((prev) => prev.filter((c) => c !== certToRemove));
  };

  const onSubmit = async (values: CreateTechnicianFormValues) => {
    if (skills.length === 0) {
      toast.error("Please add at least one skill to your technician profile.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createTechnicianProfileAction({
        address: values.address,
        bio: values.bio,
        skills,
        experience: values.experience,
        hourlyRate: values.hourlyRate,
        certifications,
        location: values.address,
      });

      if (!res.success) {
        toast.error(res.message || "Failed to create technician profile");
        setIsSubmitting(false);
        return;
      }

      // Invalidate relevant React Query caches
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TECHNICIANS.ALL });
      void queryClient.invalidateQueries({ queryKey: ["auth"] });

      toast.success(res.message || "Technician profile created successfully!");

      if (onSuccess && res.data) {
        onSuccess(res.data);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      console.error("Create technician profile error:", err);
      toast.error(err?.message || "An error occurred while setting up your technician profile.");
      setIsSubmitting(false);
    }
  };

  const displayName = user?.name || "Technician Specialist";
  const displayEmail = user?.email || "technician@fixitnow.com";
  const avatarUrl = getSafeAvatarUrl(user?.profilePhoto || user?.avatar, displayName);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 p-6 text-white shadow-lg">
        <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <UserCheck className="size-3.5" />
              <span>Profile Setup Required</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Create Your Technician Profile
            </h2>
            <p className="max-w-2xl text-xs text-emerald-100 sm:text-sm">
              Set up your public service portfolio, service address, hourly rates, and skills so customers in your area can discover and book your services.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Form on Left (7 cols), Live Preview on Right (5 cols) */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-neutral-200/90 shadow-sm dark:border-neutral-800/90 bg-white dark:bg-neutral-900/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">
                    Profile Information
                  </CardTitle>
                  <CardDescription className="text-xs">
                    All information here will be displayed to customers when viewing your services.
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 text-xs">
                  Prisma Verified
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  {/* Address Field */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                            <MapPin className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Service Address / Operational Area *</span>
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            placeholder="Enter your address (e.g. House 14, Road 7, Sector 3, Uttara, Dhaka)"
                            {...field}
                            className="h-10 text-xs focus-visible:ring-emerald-500"
                          />
                        </FormControl>
                        <FormDescription className="text-[11px]">
                          Type your exact location or neighborhood where you provide services.
                        </FormDescription>

                        {/* Location Quick Presets */}
                        <div className="pt-1">
                          <p className="text-[10px] font-semibold uppercase text-neutral-400 mb-1.5">
                            Quick Location Presets (Optional):
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {LOCATION_PRESETS.slice(0, 6).map((loc) => (
                              <button
                                key={loc}
                                type="button"
                                onClick={() => form.setValue("address", loc, { shouldValidate: true })}
                                className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-all ${
                                  field.value === loc
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                }`}
                              >
                                {loc}
                              </button>
                            ))}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Skills Section */}
                  <div className="space-y-3 rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4 dark:border-neutral-800/80 dark:bg-neutral-900/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Wrench className="size-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-bold text-neutral-900 dark:text-white">
                          Skills & Service Specialties * ({skills.length})
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400">At least 1 required</span>
                    </div>

                    {/* Custom Skill Input (Primary Action) */}
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                        Add Your Custom Skills:
                      </p>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type any skill (e.g. Inverter AC PCB, Security Camera Setup)..."
                          value={newSkillInput}
                          onChange={(e) => setNewSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSkill(newSkillInput);
                            }
                          }}
                          className="text-xs h-9 bg-white dark:bg-neutral-950"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleAddSkill(newSkillInput)}
                          className="text-xs gap-1 shrink-0 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 font-semibold"
                        >
                          <Plus className="size-3.5" /> Add Skill
                        </Button>
                      </div>
                    </div>

                    {/* Skill Badges List */}
                    <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                      {skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 py-1 pl-2.5 pr-1.5 text-xs font-medium dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="rounded-full p-0.5 hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
                          >
                            <X className="size-3" />
                          </button>
                        </Badge>
                      ))}
                      {skills.length === 0 && (
                        <span className="text-xs text-neutral-400 flex items-center">
                          Type a custom skill above or click quick suggestions below
                        </span>
                      )}
                    </div>

                    {/* Popular 1-Click Suggestions (Optional Helper) */}
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                        Quick Suggestions (Click to Add / Remove):
                      </p>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                        {POPULAR_SKILLS.map((item) => {
                          const isAdded = skills.includes(item.name);
                          const IconComp = item.icon;
                          return (
                            <button
                              key={item.name}
                              type="button"
                              onClick={() => (isAdded ? handleRemoveSkill(item.name) : handleAddSkill(item.name))}
                              className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium border transition-all ${
                                isAdded
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-semibold"
                                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400"
                              }`}
                            >
                              <IconComp className="size-3" />
                              <span>{item.name}</span>
                              {isAdded ? (
                                <CheckCircle2 className="size-3 text-emerald-600 ml-0.5" />
                              ) : (
                                <Plus className="size-3 text-neutral-400 ml-0.5" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Hourly Rate & Experience in 2 columns */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="hourlyRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-1">
                            <DollarSign className="size-3.5 text-emerald-600" />
                            <span>Standard Hourly Rate (৳ BDT) *</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="50"
                              min="50"
                              placeholder="500"
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                              className="h-10 text-xs focus-visible:ring-emerald-500"
                            />
                          </FormControl>
                          <FormDescription className="text-[11px]">
                            Base rate used when quoting custom labor.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-1">
                            <Briefcase className="size-3.5 text-blue-600" />
                            <span>Experience (Years) *</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="50"
                              placeholder="3"
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                              className="h-10 text-xs focus-visible:ring-emerald-500"
                            />
                          </FormControl>
                          <FormDescription className="text-[11px]">
                            Total years of professional field experience.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Professional Bio */}
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-xs font-semibold text-neutral-900 dark:text-white">
                            Professional Bio & Introduction
                          </FormLabel>
                          <span
                            className={`text-[11px] ${
                              (field.value?.length || 0) > 1400
                                ? "text-amber-600 font-semibold"
                                : "text-neutral-400"
                            }`}
                          >
                            {field.value?.length || 0} / 1500 chars
                          </span>
                        </div>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder="Write your custom introduction, specialties, work ethics, warranty terms, and why customers should hire you..."
                            {...field}
                            className="text-xs leading-relaxed focus-visible:ring-emerald-500"
                          />
                        </FormControl>

                        {/* Optional Bio suggestion dropdown */}
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => setShowBioSuggestions((prev) => !prev)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                          >
                            <Sparkles className="size-3" />
                            <span>{showBioSuggestions ? "Hide bio templates" : "💡 View bio inspiration templates (optional)"}</span>
                          </button>

                          {showBioSuggestions && (
                            <div className="mt-2 space-y-1.5 rounded-lg border border-neutral-200/80 bg-neutral-50 p-2.5 dark:border-neutral-800 dark:bg-neutral-900/60">
                              <p className="text-[10px] font-semibold uppercase text-neutral-400">
                                Click any template to insert into your bio:
                              </p>
                              {BIO_SUGGESTIONS.map((sug, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => form.setValue("bio", sug, { shouldValidate: true })}
                                  className="block w-full text-left text-[11px] text-neutral-600 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 truncate bg-white dark:bg-neutral-950 p-1.5 rounded border border-neutral-200/60 dark:border-neutral-800 transition-colors"
                                >
                                  &quot;{sug}&quot;
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Certifications (Optional) */}
                  <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Award className="size-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                          Certifications & Licenses (Optional)
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Type license/diploma (e.g. BTEB Electrical Trade Certificate)..."
                        value={newCertInput}
                        onChange={(e) => setNewCertInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCert(newCertInput);
                          }
                        }}
                        className="text-xs h-9 bg-white dark:bg-neutral-950"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAddCert(newCertInput)}
                        className="text-xs gap-1 shrink-0"
                      >
                        <Plus className="size-3.5" /> Add
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {certifications.map((cert) => (
                        <Badge
                          key={cert}
                          variant="outline"
                          className="gap-1.5 border-blue-300 text-blue-700 bg-blue-50/50 py-1 pl-2 pr-1 text-xs dark:border-blue-900 dark:text-blue-300 dark:bg-blue-950/40"
                        >
                          <Award className="size-3" />
                          <span>{cert}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCert(cert)}
                            className="rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800"
                          >
                            <X className="size-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-5 border-t border-neutral-100 dark:border-neutral-800">
                    {onCancel && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 font-semibold text-white hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Creating Technician Profile...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="size-4" />
                          <span>Save & Activate Profile</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Live Marketplace Preview Column */}
        <div className="lg:col-span-5 space-y-6 sticky top-6">
          <Card className="border-neutral-200/90 shadow-sm dark:border-neutral-800/90 overflow-hidden bg-white dark:bg-neutral-900/70 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                  <Eye className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <CardTitle className="text-xs font-bold uppercase tracking-wider">
                    Customer Card Preview
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] font-medium border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/50">
                  Marketplace View
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-5">
              <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 transition-all">
                {/* Header with Avatar and Name */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar className="size-16 border-2 border-emerald-500/40 shadow-sm">
                      <AvatarImage src={avatarUrl} alt={displayName} />
                      <AvatarFallback className="bg-emerald-600 text-white font-bold text-base">
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs"
                      title="Verified Technician Profile"
                    >
                      <ShieldCheck className="size-3.5" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                        {displayName}
                      </h3>
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-0 text-[10px] px-1.5 py-0 font-medium">
                        Pro Tech
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-400 truncate">{displayEmail}</p>

                    <div className="mt-1 flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-300">
                      <MapPin className="size-3 text-neutral-400 shrink-0" />
                      <span className="truncate">{watched.address || "Address not provided"}</span>
                    </div>
                  </div>
                </div>

                {/* Rating & Stats Bar */}
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-neutral-50 p-2.5 text-center dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/80">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-amber-500">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">5.0</span>
                    </div>
                    <p className="text-[10px] text-neutral-400">Rating</p>
                  </div>
                  <div className="border-x border-neutral-200 dark:border-neutral-800">
                    <p className="text-xs font-bold text-neutral-900 dark:text-white">
                      {watched.experience || 0} Yrs
                    </p>
                    <p className="text-[10px] text-neutral-400">Experience</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(watched.hourlyRate || 500)}
                    </p>
                    <p className="text-[10px] text-neutral-400">Per Hour</p>
                  </div>
                </div>

                {/* Bio Snippet */}
                {watched.bio && (
                  <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-300 line-clamp-3 leading-relaxed">
                    {watched.bio}
                  </p>
                )}

                {/* Skills tags preview */}
                <div className="mt-3.5 space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase text-neutral-400">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {skills.slice(0, 6).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-800"
                      >
                        {skill}
                      </span>
                    ))}
                    {skills.length > 6 && (
                      <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-neutral-900">
                        +{skills.length - 6} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Simulated Book Now Button */}
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                    <Clock className="size-3" /> Ready for Bookings
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Book Service →
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Guidelines Card */}
          <Card className="border-neutral-200/80 bg-neutral-50/60 dark:border-neutral-800/80 dark:bg-neutral-900/40">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
                <Info className="size-4 text-emerald-600 dark:text-emerald-400" />
                <CardTitle className="text-xs font-bold">Technician Profile Guidelines</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-1.5 text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>• <strong>Accurate Address:</strong> Enables nearest-first search dispatch for rapid booking response.</p>
              <p>• <strong>Skill Specifics:</strong> Precise skills increase booking match rates by up to 80%.</p>
              <p>• <strong>Competitive Rates:</strong> You can adjust your hourly base rate or service prices at any time.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Export named alias to support both createTechnicianForm and createTechnicianFrom
export const CreateTechnicianFrom = CreateTechnicianForm;
export default CreateTechnicianForm;
