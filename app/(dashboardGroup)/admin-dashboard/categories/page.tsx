"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";

const categories = [
  { id: "1", name: "Plumbing", services: 45, icon: "💧" },
  { id: "2", name: "Electrical", services: 38, icon: "⚡" },
  { id: "3", name: "Cleaning", services: 62, icon: "🧹" },
  { id: "4", name: "AC & HVAC", services: 28, icon: "❄️" },
  { id: "5", name: "Painting", services: 22, icon: "🎨" },
  { id: "6", name: "Carpentry", services: 19, icon: "🪚" },
  { id: "7", name: "Security", services: 15, icon: "🔒" },
  { id: "8", name: "Moving", services: 12, icon: "📦" },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Category Management</h1>
        <Button className="gap-2"><Plus className="size-4" />Add Category</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((cat) => (
          <Card key={cat.id} className="group">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <CardTitle className="text-base">{cat.name}</CardTitle>
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="ghost" size="icon" className="size-8"><Edit2 className="size-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="size-8 text-red-500"><Trash2 className="size-3.5" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-500">{cat.services} services</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
