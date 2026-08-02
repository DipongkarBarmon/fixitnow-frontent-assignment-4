"use client";

import { useAuth } from "@/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials, getAvatarUrl } from "@/utils/format";

export default function ProfilePage() {
  const { user } = useAuth();
  const name = user?.name || "User";
  const avatar = user?.avatar || getAvatarUrl(name);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">My Profile</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="size-20">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="text-lg">{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{name}</CardTitle>
              <p className="text-neutral-500">{user?.email}</p>
              <Badge variant="secondary" className="mt-1">{user?.role || "CUSTOMER"}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><p className="text-sm text-neutral-500">Phone</p><p className="font-medium text-neutral-900 dark:text-white">{user?.phone || "Not set"}</p></div>
            <div><p className="text-sm text-neutral-500">Address</p><p className="font-medium text-neutral-900 dark:text-white">{user?.address || "Not set"}</p></div>
            <div><p className="text-sm text-neutral-500">Verified</p><p className="font-medium text-neutral-900 dark:text-white">{user?.isVerified ? "Yes ✅" : "No"}</p></div>
            <div><p className="text-sm text-neutral-500">Member Since</p><p className="font-medium text-neutral-900 dark:text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
