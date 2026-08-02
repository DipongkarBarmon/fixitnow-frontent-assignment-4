import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-950">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-neutral-500">Loading...</p>
      </div>
    </div>
  );
}