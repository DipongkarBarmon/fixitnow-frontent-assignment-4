"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { registerAction } from "@/services/auth.service";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  role: z.enum(["CUSTOMER", "TECHNICIAN"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterInput = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", role: "CUSTOMER" },
  });

  async function onSubmit(values: RegisterInput) {
    setIsLoading(true);
    try {
      const result = await registerAction({ name: values.name, email: values.email, password: values.password, role: values.role });
      if (result.success) {
        toast.success("Account created successfully!");
        router.replace("/dashboard");
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-neutral-200 shadow-lg dark:border-neutral-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription>Join FixItNow and get started</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                    <Input {...field} placeholder="John Doe" disabled={isLoading} className="pl-9" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                    <Input {...field} type="email" placeholder="your@email.com" disabled={isLoading} className="pl-9" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="role" render={({ field }) => (
              <FormItem>
                <FormLabel>I am a</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                    <SelectItem value="TECHNICIAN">Technician</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                    <Input {...field} type={showPassword ? "text" : "password"} placeholder="••••••••" disabled={isLoading} className="pl-9 pr-9" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                    <Input {...field} type="password" placeholder="••••••••" disabled={isLoading} className="pl-9" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
              {isLoading ? <><Loader2 className="mr-2 size-4 animate-spin" />Creating Account...</> : "Create Account"}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">Login</Link>
        </div>
      </CardContent>
    </Card>
  );
}
