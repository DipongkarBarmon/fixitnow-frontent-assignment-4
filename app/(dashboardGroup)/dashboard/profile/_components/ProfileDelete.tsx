"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, TriangleAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";
import { deleteUserProfileAction } from "../_actions/profileAction";

export function ProfileDelete() {
  const { logout } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteUserProfileAction();
        if (result.success) {
          toast.success("Profile deleted successfully.");
          await logout();
          router.push("/");
        } else {
          toast.error(result.message || "Failed to delete profile.");
        }
      } catch {
        toast.error("An unexpected error occurred.");
      }
    });
  };

  return (
    <Card className="mt-6 border-red-200/70 bg-gradient-to-br from-red-50 to-white shadow-sm dark:border-red-900/40 dark:from-red-950/20 dark:to-neutral-950 lg:col-span-3">
      <CardHeader className="border-b border-red-100 dark:border-red-900/40">
        <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <TriangleAlert className="size-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
            <Trash2 className="size-4 text-red-500" />
            Delete Account
          </div>
          <p className="max-w-xl text-sm text-neutral-500 dark:text-neutral-400">
            Once you delete your account, there is no going back. Please be certain before continuing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isPending}
            className="gap-2 shadow-sm"
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
