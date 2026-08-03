"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Phone, MapPin, Mail, Loader2, Camera } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/auth-provider";
import { useUpdateProfile } from "@/hooks";
import { getInitials, getAvatarUrl, formatDate } from "@/utils/format";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type ProfileInput = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const updateProfile = useUpdateProfile();

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", phone: "", address: "" },
  });

  // Populate form when user loads
  useEffect(() => {
    if (user) {
      form.reset({ name: user.name, phone: user.phone ?? "", address: user.address ?? "" });
    }
  }, [user, form]);

  const onSubmit = async (values: ProfileInput) => {
    try {
      const result = await updateProfile.mutateAsync(values);
      if (result.success && result.data) {
        setUser(result.data);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(result.message ?? "Failed to update profile.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  const name = user?.name ?? "User";
  const avatar = user?.avatar ?? getAvatarUrl(name);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">My Profile</h1>
        <p className="text-neutral-500">Manage your personal information</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar Card */}
        <Card>
          <CardContent className="flex flex-col items-center gap-4 pt-8 pb-6">
            <div className="relative">
              <Image
                src={avatar} alt={name} width={96} height={96}
                className="size-24 rounded-full border-4 border-white object-cover shadow-md dark:border-neutral-800"
              />
              <button
                className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors"
                title="Change avatar (coming soon)"
              >
                <Camera className="size-4" />
              </button>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-neutral-900 dark:text-white">{name}</p>
              <p className="text-sm text-neutral-500">{user?.email}</p>
              <Badge variant="secondary" className="mt-2">{user?.role ?? "CUSTOMER"}</Badge>
            </div>
            <Separator />
            <div className="w-full space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Member since</span>
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  {user?.createdAt ? formatDate(user.createdAt, "MMM yyyy") : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Email verified</span>
                <span className={user?.isVerified ? "font-medium text-emerald-600" : "font-medium text-amber-600"}>
                  {user?.isVerified ? "✅ Verified" : "⚠️ Unverified"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile details below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Name */}
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                        <Input {...field} placeholder="Your full name" className="pl-9" disabled={updateProfile.isPending} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Email (read-only) */}
                <div>
                  <p className="mb-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">Email Address</p>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                    <Input value={user?.email ?? ""} readOnly className="pl-9 bg-neutral-50 text-neutral-500 dark:bg-neutral-800" />
                  </div>
                  <p className="mt-1 text-xs text-neutral-400">Email cannot be changed.</p>
                </div>

                {/* Phone */}
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                        <Input {...field} placeholder="+880 1234-567890" className="pl-9" disabled={updateProfile.isPending} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Address */}
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                        <Input {...field} placeholder="Your address" className="pl-9" disabled={updateProfile.isPending} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={updateProfile.isPending} className="gap-2">
                    {updateProfile.isPending ? <><Loader2 className="size-4 animate-spin" />Saving…</> : "Save Changes"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => form.reset()} disabled={updateProfile.isPending}>
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Initials placeholder display */}
      {!user?.avatar && (
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600 dark:bg-blue-900/30">
              {getInitials(name)}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Profile Picture</p>
              <p className="text-xs text-neutral-500">Avatar image upload coming soon. Your initials are displayed for now.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
