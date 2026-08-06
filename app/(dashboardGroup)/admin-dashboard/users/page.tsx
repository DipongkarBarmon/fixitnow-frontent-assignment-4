"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Ban,
  CheckCircle2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Filter,
  RotateCw,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Copy,
  Check,
  UserCheck,
  UserX,
  Sparkles,
  ExternalLink,
  Loader2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  useAdminUsers,
  useAdminUserDetail,
  useUpdateUserStatus,
  useBanUser,
  useUnbanUser,
  useDeleteUser,
} from "@/hooks";
import {
  updateUserStatusAction,
  deleteUserAction,
} from "@/app/(dashboardGroup)/admin-dashboard/_actions/userAction";
import { formatDate, getAvatarUrl, getInitials } from "@/utils/format";
import type { User as UserType, UserRole, UserStatus } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Detailed User Modal Component
// ─────────────────────────────────────────────────────────────────────────────
function UserDetailDialog({
  userId,
  open,
  onOpenChange,
  onStatusChange,
  onDelete,
}: {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (user: UserType) => void;
  onDelete: (user: UserType) => void;
}) {
  const [copied, setCopied] = useState(false);
  const { data: detailRes, isLoading, isError, refetch } = useAdminUserDetail(userId);

  const user = detailRes?.data;

  const handleCopyId = () => {
    if (user?.id) {
      void navigator.clipboard.writeText(user.id);
      setCopied(true);
      toast.success("User ID copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isBlocked = user?.status === "BLOCKED" || user?.isBanned === true;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden">
        {/* Banner Header with Role-based Gradient */}
        <div className="relative h-28 w-full bg-gradient-to-r from-teal-600 via-teal-700 to-slate-800 p-6 flex items-end">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {user && (
              <Badge
                variant="outline"
                className="bg-black/40 backdrop-blur-md text-white border-white/20 text-xs font-mono"
              >
                {user.role}
              </Badge>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 pb-6 pt-0 relative">
          {/* Overlapping Avatar */}
          <div className="flex justify-between items-end -mt-12 mb-4">
            <div className="relative">
              <Avatar className="size-20 border-4 border-white shadow-xl dark:border-neutral-900 ring-2 ring-teal-500/30">
                <AvatarImage
                  src={user?.profilePhoto || user?.avatar || (user ? getAvatarUrl(user.name) : "")}
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="text-xl font-bold bg-teal-600 text-white">
                  {user ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              {user && (
                <span
                  className={`absolute bottom-1 right-1 size-4 rounded-full border-2 border-white dark:border-neutral-900 ${
                    !isBlocked ? "bg-emerald-500" : "bg-red-500"
                  }`}
                  title={!isBlocked ? "Active Account" : "Blocked Account"}
                />
              )}
            </div>

            {user && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onStatusChange(user);
                  }}
                  className={`text-xs gap-1.5 ${
                    !isBlocked
                      ? "text-amber-700 border-amber-200 hover:bg-amber-50 dark:text-amber-300 dark:border-amber-900/60"
                      : "text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-300 dark:border-emerald-900/60"
                  }`}
                >
                  {!isBlocked ? <Ban className="size-3.5" /> : <CheckCircle2 className="size-3.5" />}
                  {!isBlocked ? "Block User" : "Activate User"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onDelete(user);
                  }}
                  className="text-xs gap-1.5 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/60"
                >
                  <Trash2 className="size-3.5" /> Delete
                </Button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="size-8 animate-spin text-teal-600" />
              <p className="text-xs text-neutral-500">Loading user profile details...</p>
            </div>
          ) : isError || !user ? (
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-6 text-center dark:border-red-900/40 dark:bg-red-950/20">
              <AlertTriangle className="size-8 mx-auto text-red-500 mb-2" />
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                Failed to load user information
              </p>
              <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">
                The user record could not be fetched from the backend API.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 gap-1.5 text-xs"
                onClick={() => void refetch()}
              >
                <RotateCw className="size-3.5" /> Retry
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    {user.name}
                  </h3>
                  {user.isVerified && (
                    <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300 border-none text-[10px] py-0">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mt-0.5">
                  <Mail className="size-3.5 text-neutral-400" />
                  {user.email}
                </p>
              </div>

              {/* Specification Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-3 dark:border-neutral-800 dark:bg-neutral-900/60">
                  <span className="text-neutral-400 text-[11px] block">User ID</span>
                  <div className="mt-1 flex items-center justify-between font-mono font-medium text-neutral-800 dark:text-neutral-200">
                    <span className="truncate">{user.id}</span>
                    <button
                      onClick={handleCopyId}
                      className="ml-1 p-1 hover:text-teal-600 transition-colors"
                      title="Copy ID"
                    >
                      {copied ? (
                        <Check className="size-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="size-3.5 text-neutral-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-3 dark:border-neutral-800 dark:bg-neutral-900/60">
                  <span className="text-neutral-400 text-[11px] block">Account Status</span>
                  <div className="mt-1 flex items-center gap-1.5 font-semibold">
                    <span
                      className={`size-2 rounded-full ${
                        !isBlocked ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                      }`}
                    />
                    <span className={!isBlocked ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}>
                      {!isBlocked ? "Active / In Good Standing" : "Suspended / Blocked"}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-3 dark:border-neutral-800 dark:bg-neutral-900/60">
                  <span className="text-neutral-400 text-[11px] block">Phone Number</span>
                  <div className="mt-1 flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-200">
                    <Phone className="size-3.5 text-neutral-400" />
                    <span>{user.phoneNumber || user.phone || "Not provided"}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-3 dark:border-neutral-800 dark:bg-neutral-900/60">
                  <span className="text-neutral-400 text-[11px] block">Joined Date</span>
                  <div className="mt-1 flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-200">
                    <Calendar className="size-3.5 text-teal-600" />
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Physical Address */}
              <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-3 dark:border-neutral-800 dark:bg-neutral-900/60 text-xs">
                <span className="text-neutral-400 text-[11px] block">Registered Address / Location</span>
                <div className="mt-1 flex items-start gap-1.5 text-neutral-700 dark:text-neutral-300">
                  <MapPin className="size-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{user.address || "No physical address specified in profile."}</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [page, setPage] = useState(1);

  // Modals state
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [statusChangingUser, setStatusChangingUser] = useState<UserType | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserType | null>(null);

  // TanStack Query & Server Action integration
  const {
    data: usersRes,
    isLoading,
    isRefetching,
    refetch: refetchUsers,
  } = useAdminUsers({
    page,
    limit: 100, // get rich list for smooth client sorting/filtering
    role: roleFilter === "ALL" ? undefined : (roleFilter as UserRole),
    status: statusFilter === "ALL" ? undefined : (statusFilter as UserStatus),
    search: search || undefined,
  });

  const updateStatusMutation = useUpdateUserStatus();
  const deleteMutation = useDeleteUser();

  const allUsers: UserType[] = usersRes?.data ?? [];

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = allUsers.length;
    const customers = allUsers.filter((u) => u.role === "CUSTOMER").length;
    const technicians = allUsers.filter((u) => u.role === "TECHNICIAN").length;
    const admins = allUsers.filter((u) => u.role === "ADMIN").length;
    const blocked = allUsers.filter((u) => u.status === "BLOCKED" || u.isBanned === true).length;
    const active = total - blocked;

    return { total, customers, technicians, admins, blocked, active };
  }, [allUsers]);

  // Client-side filtering & sorting
  const filteredAndSortedUsers = useMemo(() => {
    return allUsers
      .filter((user) => {
        // Keyword Search
        if (search.trim()) {
          const q = search.toLowerCase();
          const nameMatch = (user.name || "").toLowerCase().includes(q);
          const emailMatch = (user.email || "").toLowerCase().includes(q);
          const phoneMatch = (user.phoneNumber || user.phone || "").toLowerCase().includes(q);
          if (!nameMatch && !emailMatch && !phoneMatch) return false;
        }

        // Role Filter
        if (roleFilter !== "ALL" && user.role !== roleFilter) {
          return false;
        }

        // Status Filter
        if (statusFilter !== "ALL") {
          const isBlocked = user.status === "BLOCKED" || user.isBanned === true;
          if (statusFilter === "ACTIVE" && isBlocked) return false;
          if (statusFilter === "BLOCKED" && !isBlocked) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        }
        if (sortBy === "name") {
          return (a.name || "").localeCompare(b.name || "");
        }
        return 0;
      });
  }, [allUsers, search, roleFilter, statusFilter, sortBy]);

  const isUserBlocked = (user: UserType) =>
    user.status === "BLOCKED" || user.isBanned === true;

  // Handle status toggle (ACTIVE <-> BLOCKED)
  const handleConfirmStatusChange = async () => {
    if (!statusChangingUser) return;
    const currentBlocked = isUserBlocked(statusChangingUser);
    const newStatus: "ACTIVE" | "BLOCKED" = currentBlocked ? "ACTIVE" : "BLOCKED";
    const targetId = statusChangingUser.id || (statusChangingUser as any)._id || "";

    try {
      await updateStatusMutation.mutateAsync({
        userId: targetId,
        status: newStatus,
      });

      toast.success(
        `User ${statusChangingUser.name} is now ${newStatus === "ACTIVE" ? "Active" : "Blocked"}`
      );
      setStatusChangingUser(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update user status");
    }
  };

  // Handle delete user
  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    const targetId = deletingUser.id || (deletingUser as any)._id || "";
    try {
      await deleteMutation.mutateAsync(targetId);

      toast.success(`User ${deletingUser.name} permanently deleted`);
      setDeletingUser(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete user");
    }
  };

  // DataTable columns definition
  const columns: ColumnDef<UserType>[] = [
    {
      key: "user",
      header: "User",
      cell: (user) => {
        const photo = user.profilePhoto || user.avatar || getAvatarUrl(user.name);
        const blocked = isUserBlocked(user);
        return (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="size-10 border border-neutral-200 dark:border-neutral-800">
                <AvatarImage src={photo} alt={user.name} />
                <AvatarFallback className="text-xs font-bold bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span
                className={`absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white dark:border-neutral-900 ${
                  !blocked ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
            </div>
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => setViewingUserId(user.id)}
                className="text-left font-bold text-neutral-900 hover:text-teal-600 dark:text-white dark:hover:text-teal-400 text-sm transition-colors truncate block"
              >
                {user.name}
              </button>
              <p className="text-xs text-neutral-500 truncate">{user.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "role",
      header: "Role",
      cell: (user) => {
        if (user.role === "ADMIN") {
          return (
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-xs font-semibold">
              <Shield className="size-3 mr-1" /> Admin
            </Badge>
          );
        }
        if (user.role === "TECHNICIAN") {
          return (
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
              <ShieldCheck className="size-3 mr-1" /> Technician
            </Badge>
          );
        }
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-xs font-semibold">
            Customer
          </Badge>
        );
      },
    },
    {
      key: "phone",
      header: "Phone / Contact",
      hideOnMobile: true,
      cell: (user) => (
        <div className="text-xs space-y-0.5">
          <div className="font-medium text-neutral-800 dark:text-neutral-200">
            {user.phoneNumber || user.phone || "—"}
          </div>
          {user.address && (
            <p className="text-[11px] text-neutral-400 truncate max-w-[160px]">{user.address}</p>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (user) => {
        const blocked = isUserBlocked(user);
        return (
          <Badge
            variant="outline"
            className={
              !blocked
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 text-xs font-semibold"
            }
          >
            <span
              className={`size-1.5 rounded-full mr-1.5 ${
                !blocked ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            {!blocked ? "ACTIVE" : "BLOCKED"}
          </Badge>
        );
      },
    },
    {
      key: "createdAt",
      header: "Joined",
      hideOnMobile: true,
      cell: (user) => (
        <span className="text-xs text-neutral-500 font-medium">{formatDate(user.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (user) => {
        const blocked = isUserBlocked(user);
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg text-neutral-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/50"
              title="View User Details"
              onClick={() => setViewingUserId(user.id)}
            >
              <Eye className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`size-8 rounded-lg ${
                !blocked
                  ? "text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/50"
                  : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/50"
              }`}
              title={!blocked ? "Block Account" : "Activate Account"}
              onClick={() => setStatusChangingUser(user)}
            >
              {!blocked ? <Ban className="size-4" /> : <CheckCircle2 className="size-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
              title="Delete User"
              onClick={() => setDeletingUser(user)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        );
      },
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
            Control platform access, inspect accounts, and moderate customer, technician, and admin roles.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="icon"
            onClick={() => void refetchUsers()}
            disabled={isLoading || isRefetching}
            className="border-neutral-200 dark:border-neutral-800"
            title="Refresh user list"
          >
            <RotateCw
              className={`size-4 ${isRefetching ? "animate-spin text-teal-600" : "text-neutral-600"}`}
            />
          </Button>
          <div className="hidden sm:flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-200/80 dark:border-neutral-800">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              API Live: /api/admin/get-all-users
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <Card className="border-neutral-200/90 shadow-xs dark:border-neutral-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Total Users
              </p>
              <h4 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                {isLoading ? "..." : metrics.total}
              </h4>
              <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                {metrics.active} active ({Math.round((metrics.active / (metrics.total || 1)) * 100)}%)
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
              <Users className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200/90 shadow-xs dark:border-neutral-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Customers
              </p>
              <h4 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                {isLoading ? "..." : metrics.customers}
              </h4>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] px-1.5 py-0 mt-0.5 border-none">
                Customer Base
              </Badge>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              <UserCheck className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200/90 shadow-xs dark:border-neutral-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Technicians
              </p>
              <h4 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                {isLoading ? "..." : metrics.technicians}
              </h4>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] px-1.5 py-0 mt-0.5 border-none">
                Service Providers
              </Badge>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <ShieldCheck className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200/90 shadow-xs dark:border-neutral-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Admins
              </p>
              <h4 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                {isLoading ? "..." : metrics.admins}
              </h4>
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 text-[10px] px-1.5 py-0 mt-0.5 border-none">
                Platform Ops
              </Badge>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              <Shield className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200/90 shadow-xs dark:border-neutral-800 col-span-2 sm:col-span-1">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Suspended
              </p>
              <h4 className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                {isLoading ? "..." : metrics.blocked}
              </h4>
              <Badge
                variant="outline"
                className="border-red-200 text-red-600 text-[10px] px-1.5 py-0 mt-0.5 dark:border-red-900"
              >
                Access Blocked
              </Badge>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
              <UserX className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Bar: Search, Role, Status, Sort & View Toggle */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between rounded-xl border border-neutral-200 bg-white p-3 shadow-xs dark:border-neutral-800 dark:bg-neutral-950">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search users by name, email, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm h-9 border-neutral-200 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-400">Role:</span>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-9 w-[130px] text-xs font-medium">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="CUSTOMER">Customers</SelectItem>
                <SelectItem value="TECHNICIAN">Technicians</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-400">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[125px] text-xs font-medium">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active Only</SelectItem>
                <SelectItem value="BLOCKED">Blocked Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="size-3.5 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 rounded-lg border border-neutral-200 bg-white px-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 dark:border-neutral-800 dark:bg-neutral-900">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-white text-teal-700 shadow-xs dark:bg-neutral-800 dark:text-teal-300"
                  : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="size-3.5" />
              <span className="hidden md:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                viewMode === "table"
                  ? "bg-white text-teal-700 shadow-xs dark:bg-neutral-800 dark:text-teal-300"
                  : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400"
              }`}
              title="Table View"
            >
              <List className="size-3.5" />
              <span className="hidden md:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Card Grid View OR Data Table */}
      {viewMode === "grid" ? (
        <div>
          {isLoading ? (
            /* Skeleton Loading Grid */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="h-20 w-full bg-neutral-200 dark:bg-neutral-800" />
                  <div className="p-4 space-y-3">
                    <div className="size-12 rounded-full bg-neutral-200 dark:bg-neutral-800 -mt-10 border-2 border-white dark:border-neutral-900" />
                    <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-3.5 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-3 w-full rounded bg-neutral-200 dark:bg-neutral-800 mt-2" />
                    <div className="flex justify-between items-center pt-3 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="h-3 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800" />
                      <div className="h-7 w-20 rounded bg-neutral-200 dark:bg-neutral-800" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAndSortedUsers.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/50 py-16 px-4 text-center dark:border-neutral-800 dark:bg-neutral-900/30">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400 shadow-sm">
                <Users className="size-7" />
              </div>
              <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-white">
                {search || roleFilter !== "ALL" || statusFilter !== "ALL"
                  ? "No matching users found"
                  : "No users on platform"}
              </h3>
              <p className="mt-1 max-w-sm text-xs text-neutral-500 dark:text-neutral-400">
                {search || roleFilter !== "ALL" || statusFilter !== "ALL"
                  ? "Try adjusting your search keyword or clearing the filters."
                  : "New user registrations will appear here in real-time."}
              </p>
              {(search || roleFilter !== "ALL" || statusFilter !== "ALL") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setRoleFilter("ALL");
                    setStatusFilter("ALL");
                  }}
                  className="mt-5 text-xs"
                >
                  Reset All Filters
                </Button>
              )}
            </div>
          ) : (
            /* Aesthetic User Cards Grid */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAndSortedUsers.map((user) => {
                const blocked = isUserBlocked(user);
                const photo = user.profilePhoto || user.avatar || getAvatarUrl(user.name);

                return (
                  <Card
                    key={user.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-xl hover:shadow-teal-500/10 dark:border-neutral-800/80 dark:bg-neutral-900"
                  >
                    <div>
                      {/* Top Header Banner with Role Gradient */}
                      <div
                        className={`relative h-20 w-full p-3 flex items-start justify-between ${
                          user.role === "ADMIN"
                            ? "bg-gradient-to-r from-purple-600/90 to-indigo-800/90"
                            : user.role === "TECHNICIAN"
                            ? "bg-gradient-to-r from-emerald-600/90 to-teal-800/90"
                            : "bg-gradient-to-r from-teal-600/80 to-blue-700/80"
                        }`}
                      >
                        <Badge
                          variant="outline"
                          className="bg-black/40 backdrop-blur-md text-white border-white/20 text-[10px] font-semibold px-2 py-0.5 shadow-sm"
                        >
                          {user.role}
                        </Badge>
                        <Badge
                          className={`text-[10px] font-semibold px-2 py-0.5 border-0 shadow-sm ${
                            !blocked
                              ? "bg-emerald-500/90 text-white backdrop-blur-md"
                              : "bg-red-600/90 text-white backdrop-blur-md"
                          }`}
                        >
                          {!blocked ? "ACTIVE" : "BLOCKED"}
                        </Badge>
                      </div>

                      {/* Content Body with Overlapping Avatar */}
                      <div className="p-4 pt-0">
                        <div className="flex items-end justify-between -mt-8 mb-3">
                          <div className="relative">
                            <Avatar className="size-14 border-3 border-white shadow-md dark:border-neutral-900 ring-2 ring-neutral-200/50 dark:ring-neutral-800">
                              <AvatarImage src={photo} alt={user.name} />
                              <AvatarFallback className="text-sm font-bold bg-teal-600 text-white">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span
                              className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white dark:border-neutral-900 ${
                                !blocked ? "bg-emerald-500" : "bg-red-500"
                              }`}
                            />
                          </div>

                          <span className="text-[10px] text-neutral-400 font-mono">
                            ID: {user.id.slice(-6)}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => setViewingUserId(user.id)}
                            className="w-full text-left font-bold text-neutral-900 hover:text-teal-600 dark:text-white dark:hover:text-teal-400 text-base transition-colors line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400"
                            title={user.name}
                          >
                            {user.name}
                          </button>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate flex items-center gap-1">
                            <Mail className="size-3 text-neutral-400 shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </p>
                        </div>

                        {/* Contact Meta Details */}
                        <div className="mt-3.5 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                          <div className="flex items-center gap-1.5 truncate">
                            <Phone className="size-3.5 text-neutral-400 shrink-0" />
                            <span className="truncate">
                              {user.phoneNumber || user.phone || "No phone listed"}
                            </span>
                          </div>
                          {user.address && (
                            <div className="flex items-center gap-1.5 truncate text-[11px] text-neutral-500">
                              <MapPin className="size-3 text-neutral-400 shrink-0" />
                              <span className="truncate">{user.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Joined Date & Action Toolbar */}
                    <div className="p-4 pt-0">
                      <div className="flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800/80">
                        <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                          <Calendar className="size-3 text-neutral-400" />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7.5 rounded-lg text-neutral-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:text-teal-400 dark:hover:bg-teal-950/50 transition-colors"
                            title="Inspect User Details"
                            onClick={() => setViewingUserId(user.id)}
                          >
                            <Eye className="size-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className={`size-7.5 rounded-lg transition-colors ${
                              !blocked
                                ? "text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/50"
                                : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/50"
                            }`}
                            title={!blocked ? "Block Account" : "Activate Account"}
                            onClick={() => setStatusChangingUser(user)}
                          >
                            {!blocked ? <Ban className="size-3.5" /> : <CheckCircle2 className="size-3.5" />}
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/50 transition-colors"
                            title="Delete User"
                            onClick={() => setDeletingUser(user)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Data Table View */
        <DataTable
          columns={columns}
          data={filteredAndSortedUsers}
          isLoading={isLoading}
          searchable={false}
          emptyMessage="No users found"
          emptyDescription="No users match your criteria."
        />
      )}

      {/* User Details Modal (Fetches single user via router.get('api/admin/get-user')) */}
      <UserDetailDialog
        userId={viewingUserId}
        open={!!viewingUserId}
        onOpenChange={(open) => !open && setViewingUserId(null)}
        onStatusChange={(u) => setStatusChangingUser(u)}
        onDelete={(u) => setDeletingUser(u)}
      />

      {/* User Status Change Confirmation Dialog */}
      <ConfirmDialog
        open={!!statusChangingUser}
        onOpenChange={(open) => !open && setStatusChangingUser(null)}
        title={
          statusChangingUser && isUserBlocked(statusChangingUser)
            ? "Restore User Access"
            : "Block User Account"
        }
        description={
          statusChangingUser && isUserBlocked(statusChangingUser)
            ? `Are you sure you want to unblock ${statusChangingUser?.name}? Their account will be restored to ACTIVE status and they will be able to log in.`
            : `Are you sure you want to suspend and block ${statusChangingUser?.name}? They will immediately be prevented from logging in and accessing platform services.`
        }
        confirmLabel={
          statusChangingUser && isUserBlocked(statusChangingUser)
            ? "Activate User"
            : "Block User"
        }
        variant={
          statusChangingUser && isUserBlocked(statusChangingUser) ? "default" : "destructive"
        }
        isLoading={updateStatusMutation.isPending}
        onConfirm={handleConfirmStatusChange}
      />

      {/* Delete User Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        title="Permanently Delete User"
        description={`Are you sure you want to permanently delete ${deletingUser?.name}? This action cannot be undone and will remove all their credentials.`}
        confirmLabel="Delete Permanently"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
