"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  Sparkles,
  ShieldCheck,
  DollarSign,
  Briefcase,
  Award,
  Plus,
  X,
  CheckCircle2,
  Loader2,
  Wrench,
  Zap,
  Droplet,
  Flame,
  Hammer,
  Paintbrush,
  Tv,
  Shield,
  Save,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { QUERY_KEYS } from "@/constants";
import {
  updateTechnicianProfileAction,
  deleteTechnicianProfileAction,
} from "../_actions/technicianAction";
import type { TechnicianProfile } from "@/types";

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

const editProfileSchema = z.object({
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

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface EditTechnicianProfileFormProps {
  profile: TechnicianProfile;
  onSuccess?: (updated: TechnicianProfile) => void;
  onCancel?: () => void;
  onDeleteSuccess?: () => void;
}

export function EditTechnicianProfileForm({
  profile,
  onSuccess,
  onCancel,
  onDeleteSuccess,
}: EditTechnicianProfileFormProps) {
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState<string[]>(profile?.skills || []);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [certifications, setCertifications] = useState<string[]>(
    profile?.certifications || []
  );
  const [newCertInput, setNewCertInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      address: profile?.address || profile?.location || "",
      bio: profile?.bio || "",
      hourlyRate: profile?.hourlyRate || 500,
      experience: profile?.experience || 1,
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        address: profile.address || profile.location || "",
        bio: profile.bio || "",
        hourlyRate: profile.hourlyRate || 500,
        experience: profile.experience || 1,
      });
      setSkills(profile.skills || []);
      setCertifications(profile.certifications || []);
    }
  }, [profile, form]);

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

  const onSubmit = async (values: EditProfileFormValues) => {
    if (skills.length === 0) {
      toast.error("Please include at least one skill or specialty.");
      return;
    }

    setIsSubmitting(true);
    try {
      const targetId = profile.id || profile.userId;
      const fallbackId = profile.userId && profile.userId !== targetId ? profile.userId : undefined;
      const res = await updateTechnicianProfileAction(
        targetId,
        {
          address: values.address,
          bio: values.bio,
          skills,
          experience: values.experience,
          hourlyRate: values.hourlyRate,
          certifications,
          location: values.address,
        },
        fallbackId
      );

      if (!res.success) {
        toast.error(res.message || "Failed to update technician profile");
        setIsSubmitting(false);
        return;
      }

      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TECHNICIANS.ALL });
      void queryClient.invalidateQueries({ queryKey: ["auth"] });

      toast.success(res.message || "Profile updated successfully!");

      if (onSuccess && res.data) {
        onSuccess(res.data);
      }
    } catch (err: any) {
      console.error("Update profile error:", err);
      toast.error(err?.message || "An unexpected error occurred while updating profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProfile = async () => {
    setIsDeleting(true);
    try {
      const targetId = profile.id || profile.userId;
      const fallbackId = profile.userId && profile.userId !== targetId ? profile.userId : undefined;
      const res = await deleteTechnicianProfileAction(targetId, fallbackId);
      if (!res.success) {
        toast.error(res.message || "Failed to delete technician profile");
        setIsDeleting(false);
        return;
      }

      toast.success(res.message || "Technician profile deleted successfully");
      setIsDeleteDialogOpen(false);

      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TECHNICIANS.ALL });
      void queryClient.invalidateQueries({ queryKey: ["auth"] });

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (err: any) {
      console.error("Delete profile error:", err);
      toast.error(err?.message || "An unexpected error occurred while deleting profile.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-neutral-200/90 shadow-sm dark:border-neutral-800/90 bg-white dark:bg-neutral-900/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">
                Edit Technician Profile
              </CardTitle>
              <CardDescription className="text-xs">
                Update your service operational address, bio, active skills, and rate.
              </CardDescription>
            </div>
            {profile?.isVerified && (
              <Badge variant="secondary" className="gap-1 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300">
                <ShieldCheck className="size-3 text-emerald-600" />
                <span>Verified Account</span>
              </Badge>
            )}
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
                    <FormLabel className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Operational Address / Service Area *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Road 11, Block D, Banani, Dhaka"
                        {...field}
                        className="h-10 text-xs focus-visible:ring-emerald-500"
                      />
                    </FormControl>
                    <FormDescription className="text-[11px]">
                      Visible to customers searching for local technicians in this region.
                    </FormDescription>

                    {/* Location Quick Presets */}
                    <div className="pt-1">
                      <p className="text-[10px] font-semibold uppercase text-neutral-400 mb-1.5">
                        Quick Area Chips:
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

              {/* Skills Tag Management */}
              <div className="space-y-3 rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4 dark:border-neutral-800/80 dark:bg-neutral-900/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Wrench className="size-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      Skills & Specialties * ({skills.length})
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400">At least 1 required</span>
                </div>

                {/* Existing Skills Badges */}
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
                </div>

                {/* Custom Skill Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a custom skill (e.g. PCB Repair)..."
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
                    className="text-xs gap-1 shrink-0 bg-emerald-600 text-white hover:bg-emerald-700 font-semibold"
                  >
                    <Plus className="size-3.5" /> Add
                  </Button>
                </div>

                {/* Popular Suggestions */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                    Quick Add Suggestions:
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
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

              {/* Hourly Rate & Experience */}
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-1">
                        <DollarSign className="size-3.5 text-emerald-600" />
                        <span>Hourly Labor Rate (৳ BDT) *</span>
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
                        <span>Field Experience (Years) *</span>
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
                        Professional Bio & Overview
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
                        rows={4}
                        placeholder="Describe your background, specialty areas, guarantee on work, and certifications..."
                        {...field}
                        className="text-xs leading-relaxed focus-visible:ring-emerald-500"
                      />
                    </FormControl>
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
                    placeholder="e.g. BTEB Electrical Trade Certificate"
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

              {/* Actions */}
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
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 font-semibold text-white shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Updating Profile...</span>
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Danger Zone: Delete Profile */}
      <Card className="border-red-200 bg-red-50/30 dark:border-red-950 dark:bg-red-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="size-4" />
            <CardTitle className="text-sm font-bold">Danger Zone: Delete Profile</CardTitle>
          </div>
          <CardDescription className="text-xs text-red-600/80 dark:text-red-400/80">
            Deleting your technician profile removes your marketplace listing, public card, and specialties. Your user account remains intact.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Once deleted, you will need to complete onboarding setup again to receive new bookings.
            </p>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-xs gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold shrink-0"
            >
              <Trash2 className="size-3.5" />
              <span>Delete Technician Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Technician Profile?"
        description="Are you sure you want to permanently delete your technician profile? This action will remove your public listing from FixItNow marketplace."
        confirmLabel="Yes, Delete Profile"
        cancelLabel="Keep Profile"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDeleteProfile}
      />
    </div>
  );
}

export default EditTechnicianProfileForm;
