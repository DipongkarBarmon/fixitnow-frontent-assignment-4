"use client";

import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type SortDirection = "asc" | "desc" | null;

export interface ColumnDef<T> {
  /** Unique identifier for the column */
  key: string;
  /** Column header label */
  header: string;
  /** Render the cell content. Receives the row data and the column key. */
  cell: (row: T) => React.ReactNode;
  /** If true, clicking the header cycles through asc → desc → null */
  sortable?: boolean;
  /** Optional className for the <th> and <td> */
  className?: string;
  /** Hide this column on small screens */
  hideOnMobile?: boolean;
}

export interface DataTableMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DataTableProps<T> {
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Row data */
  data: T[];
  /** Unique key accessor for each row — keyof T or function, defaults to "id" */
  rowKey?: keyof T | ((row: T) => string);
  /** Show a loading skeleton */
  isLoading?: boolean;
  /** Pagination metadata from the API */
  meta?: DataTableMeta;
  /** Called when the page changes */
  onPageChange?: (page: number) => void;
  /** Show a client-side search box */
  searchable?: boolean;
  /** Placeholder for the search input */
  searchPlaceholder?: string;
  /** Called when sort changes. Sort state lives outside for server-side sorting. */
  onSortChange?: (key: string, direction: SortDirection) => void;
  /** Additional class for the wrapper div */
  className?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Empty state description */
  emptyDescription?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function DataTable<T extends object>({
  columns,
  data,
  rowKey = "id" as keyof T,
  isLoading = false,
  meta,
  onPageChange,
  searchable = false,
  searchPlaceholder = "Search…",
  onSortChange,
  className,
  emptyMessage = "No results found",
  emptyDescription = "Try adjusting your filters or search terms.",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  // ── Client-side search (only when !meta, i.e. not paginated) ──────────────
  const filteredData = searchable && !meta
    ? data.filter((row) =>
        columns.some((col) => {
          const cell = col.cell(row);
          if (typeof cell === "string") {
            return cell.toLowerCase().includes(search.toLowerCase());
          }
          return false;
        })
      )
    : data;

  // ── Sort handler ──────────────────────────────────────────────────────────
  function handleSort(key: string) {
    let nextDir: SortDirection;
    if (sortKey !== key) {
      nextDir = "asc";
    } else if (sortDir === "asc") {
      nextDir = "desc";
    } else {
      nextDir = null;
    }
    setSortKey(nextDir === null ? null : key);
    setSortDir(nextDir);
    onSortChange?.(key, nextDir);
  }

  // ── Sort icon ─────────────────────────────────────────────────────────────
  function SortIcon({ colKey }: { colKey: string }) {
    if (sortKey !== colKey) return <ChevronsUpDown className="ml-1 inline size-3.5 text-neutral-400" />;
    if (sortDir === "asc") return <ChevronUp className="ml-1 inline size-3.5 text-blue-500" />;
    return <ChevronDown className="ml-1 inline size-3.5 text-blue-500" />;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search */}
      {searchable && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-900">
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={cn(
                      "whitespace-nowrap font-semibold text-neutral-700 dark:text-neutral-300",
                      col.sortable && "cursor-pointer select-none hover:text-neutral-900 dark:hover:text-white",
                      col.hideOnMobile && "hidden sm:table-cell",
                      col.className
                    )}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  >
                    {col.header}
                    {col.sortable && <SortIcon colKey={col.key} />}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="p-0">
                    <TableSkeleton rows={6} columns={columns.length} />
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <EmptyState
                      title={emptyMessage}
                      description={emptyDescription}
                      className="py-10"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, idx) => {
                  const key =
                    typeof rowKey === "function"
                      ? rowKey(row)
                      : String((row as Record<string, unknown>)[rowKey as string] ?? idx);
                  return (
                    <TableRow
                      key={key}
                      className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/60"
                    >
                      {columns.map((col) => (
                        <TableCell
                          key={col.key}
                          className={cn(
                            col.hideOnMobile && "hidden sm:table-cell",
                            col.className
                          )}
                        >
                          {col.cell(row)}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Showing{" "}
            <span className="font-medium text-neutral-700 dark:text-neutral-200">
              {(meta.page - 1) * meta.limit + 1}–
              {Math.min(meta.page * meta.limit, meta.total)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-neutral-700 dark:text-neutral-200">
              {meta.total}
            </span>{" "}
            results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={meta.page <= 1}
              onClick={() => onPageChange?.(meta.page - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>

            {/* Page numbers (up to 5 shown) */}
            {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={meta.page === page ? "default" : "outline"}
                  size="icon"
                  className="size-8 text-xs"
                  onClick={() => onPageChange?.(page)}
                  aria-label={`Page ${page}`}
                  aria-current={meta.page === page ? "page" : undefined}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={meta.page >= meta.totalPages}
              onClick={() => onPageChange?.(meta.page + 1)}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
