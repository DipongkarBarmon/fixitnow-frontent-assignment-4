"use client";

import { useState } from "react";
import { Search, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown_menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAvatarUrl, getInitials } from "@/utils/format";

const users = [
  { id: "1", name: "Mohammad Ali", email: "ali@example.com", role: "CUSTOMER", isBanned: false, joined: "Jan 15, 2026" },
  { id: "2", name: "Karim Ahmed", email: "karim@example.com", role: "TECHNICIAN", isBanned: false, joined: "Feb 20, 2026" },
  { id: "3", name: "Sarah Khan", email: "sarah@example.com", role: "CUSTOMER", isBanned: true, joined: "Mar 10, 2026" },
  { id: "4", name: "Rafiq Islam", email: "rafiq@example.com", role: "TECHNICIAN", isBanned: false, joined: "Apr 05, 2026" },
  { id: "5", name: "Nadia Begum", email: "nadia@example.com", role: "CUSTOMER", isBanned: false, joined: "May 12, 2026" },
];

const roleColors: Record<string, string> = {
  CUSTOMER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  TECHNICIAN: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const filtered = users.filter((u) => {
    const matchesSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">User Management</h1>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter by role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="CUSTOMER">Customer</SelectItem>
            <SelectItem value="TECHNICIAN">Technician</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader><CardTitle>{filtered.length} Users</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filtered.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={getAvatarUrl(u.name)} alt={u.name} />
                    <AvatarFallback>{getInitials(u.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-neutral-900 dark:text-white">{u.name}</p>
                      {u.isBanned && <Badge variant="destructive" className="text-xs">Banned</Badge>}
                    </div>
                    <p className="text-sm text-neutral-500">{u.email} • Joined {u.joined}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={roleColors[u.role]}>{u.role}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>{u.isBanned ? "Unban User" : "Ban User"}</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete User</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
