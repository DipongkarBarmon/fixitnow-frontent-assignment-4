"use client";

import { useState } from "react";
import {
  Users,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Ban,
  CheckCircle,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  useAdminUsers,
  useBanUser,
  useUnbanUser,
  useDeleteUser,
} from "@/hooks";
import { formatDate, getAvatarUrl, getInitials } from "@/utils/format";
import type { User as UserType, UserRole } from "@/types";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [banningUser, setBanningUser] = useState<UserType | null>(null);
  const [unbanningUser, setUnbanningUser] = useState<UserType | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserType | null>(null);

  const { data: usersRes, isLoading } = useAdminUsers({
    page,
    limit: 10,
    role: roleFilter === "ALL" ? undefined : (roleFilter as UserRole),
    search: search || undefined,
  });

  const banMutation = useBanUser();
  const unbanMutation = useUnbanUser();
  const deleteMutation = useDeleteUser();

  const users: UserType[] = usersRes?.data ?? [];
  const meta = usersRes?.meta;

  const handleBan = async () => {
    if (!banningUser) return;
    try {
      await banMutation.mutateAsync(banningUser.id);
      toast.success(`User ${banningUser.name} has been banned`);
      setBanningUser(null);
    } catch {
      toast.error("Failed to ban user");
    }
  };

  const handleUnban = async () => {
    if (!unbanningUser) return;
    try {
      await unbanMutation.mutateAsync(unbanningUser.id);
      toast.success(`User ${unbanningUser.name} has been unbanned`);
      setUnbanningUser(null);
    } catch {
      toast.error("Failed to unban user");
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    try {
      await deleteMutation.mutateAsync(deletingUser.id);
      toast.success(`User ${deletingUser.name} deleted permanently`);
      setDeletingUser(null);
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const columns: ColumnDef<UserType>[] = [
    {
      key: "user",
      header: "User",
      cell: (user) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage src={user.avatar || getAvatarUrl(user.name)} alt={user.name} />
            <AvatarFallback className="text-xs font-bold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-neutral-900 dark:text-white text-sm leading-tight">
              {user.name}
            </p>
            <p className="text-xs text-neutral-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (user) => {
        if (user.role === "ADMIN") {
          return (
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-none text-xs">
              <Shield className="size-3 mr-1" /> Admin
            </Badge>
          );
        }
        if (user.role === "TECHNICIAN") {
          return (
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-none text-xs">
              <ShieldCheck className="size-3 mr-1" /> Technician
            </Badge>
          );
        }
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-none text-xs">
            Customer
          </Badge>
        );
      },
    },
    {
      key: "phone",
      header: "Phone",
      hideOnMobile: true,
      cell: (user) => (
        <span className="text-xs text-neutral-600 dark:text-neutral-400">
          {user.phone || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (user) => (
        <Badge
          variant="outline"
          className={
            !user.isBanned
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 text-xs"
          }
        >
          {!user.isBanned ? "Active" : "Banned"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
      hideOnMobile: true,
      cell: (user) => (
        <span className="text-xs text-neutral-500">
          {formatDate(user.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (user) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            title="View Details"
            onClick={() => setSelectedUser(user)}
          >
            <Eye className="size-4" />
          </Button>

          {!user.isBanned ? (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950"
              title="Ban User"
              onClick={() => setBanningUser(user)}
            >
              <Ban className="size-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950"
              title="Unban User"
              onClick={() => setUnbanningUser(user)}
            >
              <CheckCircle className="size-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
            title="Delete User"
            onClick={() => setDeletingUser(user)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            User Management
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            View all customers, technicians, and administrators with moderation and access controls.
          </p>
        </div>
      </div>

      {/* Role Filter & Search */}
      <Card className="border-neutral-200 dark:border-neutral-800">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              {/* Handled by DataTable search prop or direct custom select */}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-neutral-500">Filter Role:</span>
              <Select
                value={roleFilter}
                onValueChange={(val) => {
                  setRoleFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="CUSTOMER">Customers</SelectItem>
                  <SelectItem value="TECHNICIAN">Technicians</SelectItem>
                  <SelectItem value="ADMIN">Administrators</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={users}
        rowKey="id"
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search users by name or email..."
        emptyMessage="No users found"
        emptyDescription="No users matched your search criteria or role filter."
        meta={meta}
        onPageChange={setPage}
      />

      {/* User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>User Profile Overview</DialogTitle>
            <DialogDescription>
              Complete platform account information for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-2 text-sm">
              <div className="flex items-center gap-4 border-b border-neutral-100 pb-4 dark:border-neutral-800">
                <Avatar className="size-16 border-2 border-neutral-200 dark:border-neutral-700">
                  <AvatarImage
                    src={selectedUser.avatar || getAvatarUrl(selectedUser.name)}
                    alt={selectedUser.name}
                  />
                  <AvatarFallback className="text-base font-bold">
                    {getInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {selectedUser.name}
                  </h3>
                  <p className="text-xs text-neutral-500">{selectedUser.email}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-semibold">
                      {selectedUser.role}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        !selectedUser.isBanned
                          ? "border-emerald-300 text-emerald-700 text-xs"
                          : "border-red-300 text-red-700 text-xs"
                      }
                    >
                      {!selectedUser.isBanned ? "Active" : "Banned"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                  <Phone className="size-4 text-neutral-400" />
                  <span>Phone: {selectedUser.phone || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                  <MapPin className="size-4 text-neutral-400" />
                  <span>Address: {selectedUser.address || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                  <Calendar className="size-4 text-neutral-400" />
                  <span>Account Created: {formatDate(selectedUser.createdAt)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Ban User Confirmation */}
      <ConfirmDialog
        open={!!banningUser}
        onOpenChange={(open) => !open && setBanningUser(null)}
        title="Ban User"
        description={`Are you sure you want to ban ${banningUser?.name}? They will not be able to log in or create bookings.`}
        confirmLabel="Ban User"
        variant="destructive"
        isLoading={banMutation.isPending}
        onConfirm={handleBan}
      />

      {/* Unban User Confirmation */}
      <ConfirmDialog
        open={!!unbanningUser}
        onOpenChange={(open) => !open && setUnbanningUser(null)}
        title="Unban User"
        description={`Restore account access for ${unbanningUser?.name}?`}
        confirmLabel="Unban User"
        isLoading={unbanMutation.isPending}
        onConfirm={handleUnban}
      />

      {/* Delete User Confirmation */}
      <ConfirmDialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        title="Permanently Delete User"
        description={`Are you sure you want to permanently delete ${deletingUser?.name}? This action cannot be undone.`}
        confirmLabel="Delete Permanently"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
