"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { forgotPasswordAction } from "@/services/auth.service";

const schema = z.object({ email: z.string().email("Invalid email address") });

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  async function onSubmit(values: z.infer<typeof schema>) {
    setIsLoading(true);
    try {
      const result = await forgotPasswordAction(values.email);
      if (result.success) { setIsSubmitted(true); toast.success("Reset email sent!"); }
      else { toast.error(result.message || "Failed to send reset email"); }
    } catch { toast.error("An unexpected error occurred"); }
    finally { setIsLoading(false); }
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-8 text-center space-y-4">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <CheckCircle2 className="size-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Check Your Email</h2>
          <p className="text-neutral-600 dark:text-neutral-400">We&apos;ve sent a password reset link to your email address.</p>
          <Button asChild variant="outline"><Link href="/login"><ArrowLeft className="mr-2 size-4" />Back to Login</Link></Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
        <CardDescription>Enter your email to receive a password reset link</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
              {isLoading ? <><Loader2 className="mr-2 size-4 animate-spin" />Sending...</> : "Send Reset Link"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            <ArrowLeft className="mr-1 inline size-3" />Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
