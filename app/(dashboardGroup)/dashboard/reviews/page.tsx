"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Star, MoreVertical, Edit2, Trash2, Calendar, User as UserIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { useReviews, useUpdateReview, useDeleteReview } from "@/hooks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown_menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function CustomerReviewsPage() {
  const { user } = useAuth();
  
  // Use user.id to filter only this customer's reviews
  const { data, isLoading } = useReviews(
    user?.id ? { customerId: user.id, limit: 20 } : {}
  );
  
  const reviews = data?.data ?? [];

  const updateMutation = useUpdateReview();
  const deleteMutation = useDeleteReview();

  const [editingReview, setEditingReview] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const openEdit = (review: any) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleUpdate = () => {
    if (!editingReview) return;
    updateMutation.mutate(
      { id: editingReview.id, data: { rating: editRating, comment: editComment } },
      {
        onSuccess: () => {
          toast.success("Review updated successfully");
          setEditingReview(null);
        },
        onError: () => toast.error("Failed to update review"),
      }
    );
  };

  const handleDelete = () => {
    if (!deletingId) return;
    deleteMutation.mutate(deletingId, {
      onSuccess: () => {
        toast.success("Review deleted");
        setDeletingId(null);
      },
      onError: () => {
        toast.error("Failed to delete review");
        setDeletingId(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={Star}
        title="No Reviews Yet"
        description="You haven't left any reviews for your bookings."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute right-0 top-0 size-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <h1 className="text-2xl font-bold sm:text-3xl">My Reviews</h1>
        <p className="mt-2 max-w-xl text-blue-100">
          Manage the feedback you've left for technicians. Your reviews help others find the best service professionals.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reviews.map((review) => {
          const serviceName = typeof review.service === "object" ? review.service?.name : "Home Service";
          const techName = review.technician?.user?.name ?? "Technician";
          
          return (
            <Card key={review.id} className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white/60 p-5 backdrop-blur-xl transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white line-clamp-1">{serviceName}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <UserIcon className="size-3.5" />
                      {techName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      {review.createdAt ? format(new Date(review.createdAt), "MMM d, yyyy") : "Recently"}
                    </span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(review)} className="gap-2">
                      <Edit2 className="size-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeletingId(review.id!)} className="gap-2 text-red-600 focus:text-red-600">
                      <Trash2 className="size-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mb-3 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-neutral-100 text-neutral-200 dark:fill-neutral-800 dark:text-neutral-800"}`}
                  />
                ))}
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
                "{review.comment}"
              </p>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingReview} onOpenChange={(open) => !open && setEditingReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">Rating</p>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} onClick={() => setEditRating(i + 1)}>
                    <Star className={`size-7 transition-colors ${i < editRating ? "fill-amber-400 text-amber-400" : "text-neutral-300 hover:text-amber-300"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">Comment</p>
              <Textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setEditingReview(null)}>Cancel</Button>
              <Button onClick={handleUpdate} disabled={!editComment.trim() || updateMutation.isPending}>
                {updateMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
