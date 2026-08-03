"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  MapPin,
  Star,
  Award,
  DollarSign,
  Briefcase,
  ShieldCheck,
  Loader2,
  Save,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardSkeleton } from "@/components/shared/loading";
import { useAuth } from "@/providers/auth-provider";
import { useMyTechnicianProfile, useUpdateTechnicianProfile } from "@/hooks";
import { getAvatarUrl, getInitials, formatCurrency } from "@/utils/format";

const profileSchema = z.object({
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  experience: z.number().min(0, "Experience must be a positive number"),
  hourlyRate: z.number().min(50, "Hourly rate must be at least 50 BDT"),
  location: z.string().optional(),
});

type ProfileFormValues = {
  bio?: string;
  experience: number;
  hourlyRate: number;
  location?: string;
};

export default function TechnicianProfilePage() {
  const { user } = useAuth();
  const { data: profileRes, isLoading } = useMyTechnicianProfile();
  const updateMutation = useUpdateTechnicianProfile();

  const profile = profileRes?.data;

  // Local skills and certifications tag states
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newCert, setNewCert] = useState("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: "",
      experience: 1,
      hourlyRate: 500,
      location: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        bio: profile.bio || "",
        experience: profile.experience || 1,
        hourlyRate: profile.hourlyRate || 500,
        location: profile.location || "",
      });
      if (profile.skills && Array.isArray(profile.skills)) {
        setSkills(profile.skills);
      }
      if (profile.certifications && Array.isArray(profile.certifications)) {
        setCertifications(profile.certifications);
      }
    }
  }, [profile, form]);

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddCert = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const trimmed = newCert.trim();
    if (trimmed && !certifications.includes(trimmed)) {
      setCertifications([...certifications, trimmed]);
      setNewCert("");
    }
  };

  const handleRemoveCert = (certToRemove: string) => {
    setCertifications(certifications.filter((c) => c !== certToRemove));
  };

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateMutation.mutateAsync({
        bio: values.bio,
        experience: values.experience,
        hourlyRate: values.hourlyRate,
        location: values.location,
        skills,
        certifications,
      });
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const name = user?.name || profile?.user?.name || "Technician";
  const email = user?.email || profile?.user?.email || "";
  const avatar = user?.avatar || getAvatarUrl(name);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
          Technician Profile
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Manage your public technician details, skills, hourly rates, and certifications.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <CardSkeleton />
          <div className="lg:col-span-2 space-y-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Overview Card */}
          <div className="space-y-6">
            <Card className="border-neutral-200 dark:border-neutral-800">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="size-24 border-4 border-emerald-100 shadow-sm dark:border-emerald-950">
                      <AvatarImage src={avatar} alt={name} />
                      <AvatarFallback className="text-xl font-bold bg-emerald-600 text-white">
                        {getInitials(name)}
                      </AvatarFallback>
                    </Avatar>
                    {profile?.isVerified && (
                      <div
                        className="absolute bottom-0 right-0 rounded-full bg-emerald-600 p-1 text-white shadow"
                        title="Verified Technician"
                      >
                        <ShieldCheck className="size-4" />
                      </div>
                    )}
                  </div>

                  <h2 className="mt-4 text-xl font-bold text-neutral-900 dark:text-white">
                    {name}
                  </h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{email}</p>

                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      Professional Technician
                    </Badge>
                  </div>

                  <div className="mt-6 grid w-full grid-cols-2 gap-3 border-t border-neutral-100 pt-6 dark:border-neutral-800">
                    <div className="rounded-lg bg-neutral-50 p-3 text-center dark:bg-neutral-900">
                      <div className="flex items-center justify-center gap-1 text-amber-500">
                        <Star className="size-4 fill-amber-400" />
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {(profile?.averageRating || 4.8).toFixed(1)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        {profile?.totalReviews || 12} Reviews
                      </p>
                    </div>
                    <div className="rounded-lg bg-neutral-50 p-3 text-center dark:bg-neutral-900">
                      <div className="flex items-center justify-center gap-1 text-emerald-600">
                        <Briefcase className="size-4" />
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {profile?.completedJobs || 18}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">Completed Jobs</p>
                    </div>
                  </div>

                  <div className="mt-4 w-full space-y-2 text-left text-sm text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-neutral-400" />
                      <span>{profile?.location || "Dhaka, Bangladesh"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="size-4 text-neutral-400" />
                      <span>{formatCurrency(profile?.hourlyRate || 500)} / hr</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Profile Form */}
          <div className="lg:col-span-2">
            <Card className="border-neutral-200 dark:border-neutral-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Edit Profile Details</CardTitle>
                <CardDescription>
                  Keep your service offerings, bio, and hourly rate up to date for customers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Bio */}
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your background, expertise, and what sets your service apart..."
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A short overview shown to customers when they browse your profile.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Hourly Rate & Experience */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="hourlyRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hourly Rate (৳ BDT)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="50"
                                placeholder="500"
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
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
                            <FormLabel>Experience (Years)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="3"
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Location */}
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Area / Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Gulshan, Dhaka" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Skills Tag Input */}
                    <div className="space-y-2">
                      <FormLabel>Skills & Expertise</FormLabel>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a skill (e.g. Pipe Fitting, Wiring) and press Enter"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={handleAddSkill}
                        />
                        <Button type="button" variant="secondary" onClick={handleAddSkill}>
                          <Plus className="size-4 mr-1" /> Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="gap-1.5 py-1 pr-1.5 text-xs font-medium"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="rounded-full p-0.5 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                        {skills.length === 0 && (
                          <p className="text-xs text-neutral-400">No skills added yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Certifications Tag Input */}
                    <div className="space-y-2">
                      <FormLabel>Certifications & Licenses</FormLabel>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a certification (e.g. Certified Electrician) and press Enter"
                          value={newCert}
                          onChange={(e) => setNewCert(e.target.value)}
                          onKeyDown={handleAddCert}
                        />
                        <Button type="button" variant="secondary" onClick={handleAddCert}>
                          <Plus className="size-4 mr-1" /> Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {certifications.map((cert) => (
                          <Badge
                            key={cert}
                            variant="outline"
                            className="gap-1.5 py-1 pr-1.5 text-xs font-medium border-blue-300 text-blue-700 dark:border-blue-800 dark:text-blue-300"
                          >
                            <Award className="size-3" />
                            {cert}
                            <button
                              type="button"
                              onClick={() => handleRemoveCert(cert)}
                              className="rounded-full p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                        {certifications.length === 0 && (
                          <p className="text-xs text-neutral-400">No certifications added yet.</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending ? (
                          <>
                            <Loader2 className="size-4 animate-spin mr-2" />
                            Saving Changes...
                          </>
                        ) : (
                          <>
                            <Save className="size-4 mr-2" />
                            Save Profile
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
