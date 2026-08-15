"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Star, MoreVertical, Edit2, Trash2, Calendar, User as UserIcon, Loader2, Quote } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl, getInitials } from "@/utils/format";

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
        <div className="grid gap-6 xl:grid-cols-2">
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
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl shadow-blue-500/20 sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 size-64 rounded-full bg-purple-500/20 blur-3xl" />
        
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">My Reviews</h1>
          <p className="mt-3 max-w-xl text-lg text-blue-100/90 leading-relaxed">
            Manage the feedback you've left for technicians. Your reviews help others find the best service professionals.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {reviews.map((review: any) => {
          const serviceName = (review.service && typeof review.service === "object" ? (review.service.title || review.service.name) : review.service) || "Home Service";
          const techName = review.technician?.user?.name ?? "Technician";
          const techAvatar = review.technician?.user?.avatar ?? getAvatarUrl(techName);
          
          return (
            <Card key={review.id} className="group relative overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-white/60 p-6 backdrop-blur-xl transition-all hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 dark:border-neutral-800 dark:bg-neutral-900/50">
              {/* Subtle background glow */}
              <div className="absolute -right-10 -top-10 -z-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition-opacity group-hover:bg-blue-500/20 dark:bg-blue-500/5" />
              
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="size-14 border-2 border-white shadow-sm dark:border-neutral-800">
                    <AvatarImage src={techAvatar} alt={techName} />
                    <AvatarFallback>{getInitials(techName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white line-clamp-1">{serviceName || "Premium Service"}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-500">
                      <span className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
                        <UserIcon className="size-4 text-blue-500" />
                        {techName}
                      </span>
                      <span className="flex items-center gap-1.5 text-neutral-400">
                        <Calendar className="size-4" />
                        {review.createdAt ? format(new Date(review.createdAt), "MMM d, yyyy") : "Recently"}
                      </span>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white">
                      <MoreVertical className="size-4.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 rounded-xl">
                    <DropdownMenuItem onClick={() => openEdit(review)} className="gap-2 rounded-lg py-2 cursor-pointer font-medium">
                      <Edit2 className="size-4" /> Edit Review
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeletingId(review.id!)} className="gap-2 rounded-lg py-2 cursor-pointer font-medium text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/30">
                      <Trash2 className="size-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mb-4 flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 dark:bg-amber-950/30">
                  <Star className="size-4 fill-amber-500 text-amber-500" />
                  <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{review.rating}.0</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-neutral-100 text-neutral-200 dark:fill-neutral-800 dark:text-neutral-700"}`}
                    />
                  ))}
                </div>
              </div>

              <div className="relative mt-2 rounded-2xl bg-neutral-50/80 p-5 dark:bg-neutral-950/50">
                <Quote className="absolute -left-2 -top-3 size-10 text-blue-500/10 dark:text-blue-400/10" />
                <p className="relative z-10 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                  "{review.comment}"
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingReview} onOpenChange={(open) => !open && setEditingReview(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Your Rating</p>
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} onClick={() => setEditRating(i + 1)} className="transition-transform hover:scale-110">
                    <Star className={`size-8 transition-colors ${i < editRating ? "fill-amber-400 text-amber-400" : "text-neutral-200 hover:text-amber-300 dark:text-neutral-700"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Your Feedback</p>
              <Textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                rows={5}
                className="resize-none rounded-xl bg-neutral-50 dark:bg-neutral-900"
                placeholder="Share more details about your experience..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" className="rounded-xl" onClick={() => setEditingReview(null)}>Cancel</Button>
              <Button className="rounded-xl bg-blue-600 hover:bg-blue-700" onClick={handleUpdate} disabled={!editComment.trim() || updateMutation.isPending}>
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
        description="Are you sure you want to permanently delete this review? This action cannot be undone."
        confirmLabel="Delete Review"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
