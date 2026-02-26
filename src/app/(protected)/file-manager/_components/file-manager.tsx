/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  Folder,
  File,
  Home,
  FolderPlus,
  FileTextIcon,
  MoreHorizontalIcon,
  XIcon,
  Loader2,
  FileSpreadsheetIcon,
  ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { FileUploadDialog } from "./file-upload-dialog";
import { getFilesByParent, getFileById, deleteFileNode } from "@/actions";
import FileManagerPagination from "./pagination";
import FileManagerAnalytics from "./file-manager-analytics";
import FileManagerHeader from "./file-manager-header";
import { toast } from "sonner";
import { CreateFolderDialog } from "./folder-dialog";

type FileItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  icon: string;
  date: Date;
  size: string;
  ownerName: string;
  ownerAvatar: string;
  parentId: string | null;
  children?: FileItem[];
};

function getFileIcon(iconType: string) {
  switch (iconType) {
    case "folder":
      return <Folder className="h-5 w-5 text-yellow-600" />;
    case "image":
      return <ImageIcon className="h-5 w-5 text-gray-600" />;
    case "xlsx":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded bg-green-700 text-xs font-bold text-white">
          <FileSpreadsheetIcon className="size-3" />
        </div>
      );
    case "figma":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded bg-purple-500 text-xs font-bold text-white">
          F
        </div>
      );
    case "sketch":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded bg-yellow-500 text-xs font-bold text-white">
          S
        </div>
      );
    case "docx":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white">
          W
        </div>
      );
    case "illustrator":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded bg-orange-600 text-xs font-bold text-white">
          Ai
        </div>
      );
    case "photoshop":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-800 text-xs font-bold text-white">
          Ps
        </div>
      );
    case "pdf":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded bg-red-600 text-xs font-bold text-white">
          <FileTextIcon className="size-3" />
        </div>
      );
    case "audio":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded bg-green-600 text-xs font-bold text-white">
          ♪
        </div>
      );
    default:
      return <File className="h-5 w-5 text-gray-500" />;
  }
}

import { Role } from "@prisma/client";

type SortOption = "name" | "date" | "size";
type SortDirection = "asc" | "desc";

interface FileManagerProps {
  userRole?: Role;
}

type PendingDelete =
  | {
      type: "single";
      itemId: string;
      itemName: string;
    }
  | {
      type: "bulk";
      itemIds: string[];
      count: number;
    };

export function FileManager({ userRole }: FileManagerProps) {
  const isAdmin = userRole === Role.ADMIN;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState(""); // file type filter
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [breadcrumbData, setBreadcrumbData] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);

  const currentFolderId = searchParams.get("folderId") || undefined;
  const isMobile = useIsMobile();

  // Fetch files from database
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const files = await getFilesByParent(currentFolderId);
      setFileItems(files as FileItem[]);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  // Build breadcrumb navigation by traversing parent chain
  const buildBreadcrumb = async (folderId?: string) => {
    if (!folderId) {
      setBreadcrumbData([]);
      return;
    }

    const crumbs: Array<{ id: string; name: string }> = [];
    let currentId: string | null = folderId;

    try {
      while (currentId) {
        const folder = await getFileById(currentId);
        if (!folder) break;
        crumbs.unshift({ id: folder.id, name: folder.name });
        currentId = folder.parentId;
      }
      setBreadcrumbData(crumbs);
    } catch (error) {
      console.error("Error building breadcrumb:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
    buildBreadcrumb(currentFolderId);
  }, [currentFolderId]);

  const parseFileSize = (sizeStr: string): number => {
    const size = Number.parseFloat(sizeStr);
    if (sizeStr.includes("GB")) return size * 1024 * 1024 * 1024;
    if (sizeStr.includes("MB")) return size * 1024 * 1024;
    if (sizeStr.includes("KB")) return size * 1024;
    return size;
  };

  const sortItems = (items: FileItem[]): FileItem[] => {
    return [...items].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "size":
          comparison = parseFileSize(a.size) - parseFileSize(b.size);
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  };

  const filteredItems = fileItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "all" || filterType === "" || item.icon === filterType;
    return matchesSearch && matchesType;
  });

  const sortedAndFilteredItems = sortItems(filteredItems);

  useEffect(() => {
    setSelectedItem(null);
    setShowMobileDetails(false);
    setSelectedItems(new Set());
  }, [currentFolderId]);

  const handleSortChange = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(option);
      setSortDirection("asc");
    }
  };

  const handleItemClick = (item: FileItem) => {
    if (item.type === "folder") {
      router.push(`?folderId=${item.id}`);
    } else {
      setSelectedItem(item);
      setShowMobileDetails(true);
    }
  };

  const handleBreadcrumbClick = (folderId?: string) => {
    if (!folderId) {
      router.push("/file-manager");
    } else {
      router.push(`?folderId=${folderId}`);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === sortedAndFilteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(sortedAndFilteredItems.map((item) => item.id)));
    }
  };

  const toggleItemSelection = (itemId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(itemId)) {
      newSelectedItems.delete(itemId);
    } else {
      newSelectedItems.add(itemId);
    }
    setSelectedItems(newSelectedItems);
  };

  const openDeleteDialogForItem = (item: FileItem) => {
    if (!isAdmin) {
      toast.error("Unauthorized: Only administrators can delete files");
      return;
    }

    setPendingDelete({
      type: "single",
      itemId: item.id,
      itemName: item.name,
    });
    setDeleteDialogOpen(true);
  };

  const openDeleteDialogForBulk = () => {
    if (!isAdmin) {
      toast.error("Unauthorized: Only administrators can delete files");
      return;
    }

    if (selectedItems.size === 0) return;

    setPendingDelete({
      type: "bulk",
      itemIds: [...selectedItems],
      count: selectedItems.size,
    });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    const target = pendingDelete;
    if (!target) return;

    setDeleteDialogOpen(false);
    setDeleting(true);

    try {
      if (target.type === "single") {
        await deleteFileNode(target.itemId);
        toast.success("Item deleted successfully");
        if (selectedItem?.id === target.itemId) {
          setSelectedItem(null);
        }
        setSelectedItems((prev) => {
          const next = new Set(prev);
          next.delete(target.itemId);
          return next;
        });
      } else {
        await Promise.all(target.itemIds.map((id) => deleteFileNode(id)));
        toast.success("Selected items deleted successfully");
        setSelectedItems(new Set());
        if (selectedItem && target.itemIds.includes(selectedItem.id)) {
          setSelectedItem(null);
        }
      }

      await fetchFiles();
    } catch (error) {
      console.error("Error deleting item(s):", error);
      toast.error(
        target.type === "single"
          ? "Failed to delete item"
          : "Failed to delete selected items"
      );
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDateShort = (date: Date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${d.getFullYear().toString().slice(-2)}`;
  };

  const FileDetailContent = ({ selectedItem }: { selectedItem: FileItem }) => {
    return (
      <div className="space-y-6 px-4">
        <div className="flex flex-col items-center space-y-8 py-4">
          <div className="flex items-center">
            <div className="scale-[3]">{getFileIcon(selectedItem.icon)}</div>
          </div>
          <h2 className="text-foreground text-center">{selectedItem.name}</h2>
        </div>

        <div>
          <h3 className="text-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
            Info
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Type</span>
              <span className="text-foreground text-sm capitalize">
                {selectedItem.type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Size</span>
              <span className="text-foreground text-sm">
                {selectedItem.size}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Owner</span>
              <span className="text-foreground text-sm">
                {selectedItem.ownerName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Location</span>
              <span className="text-sm">
                {breadcrumbData.length > 0
                  ? `My Files/${breadcrumbData.map((b) => b.name).join("/")}`
                  : "My Files"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Modified</span>
              <span className="text-foreground text-sm">
                {formatDate(selectedItem.date)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Created</span>
              <span className="text-foreground text-sm">
                {formatDate(selectedItem.date)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
            Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-foreground text-sm">File Sharing</span>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground text-sm">Backup</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground text-sm">Sync</span>
              <Switch />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-var(--header-height))] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading files...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="border-border min-w-0 flex-1">
        {/* Breadcrumb Navigation */}
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight">File Manager</h1>
            {breadcrumbData.length > 0 && (
              <>
                <Separator
                  orientation="vertical"
                  className="mx-2 data-[orientation=vertical]:h-4"
                />
                <div className="border-border/50 bg-muted/20 flex items-center overflow-x-auto">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem
                        className="cursor-pointer"
                        onClick={() => handleBreadcrumbClick()}
                      >
                        <Home className="h-4 w-4" />
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      {breadcrumbData.map((crumb, i) => (
                        <>
                          <BreadcrumbItem
                            className="cursor-pointer"
                            key={crumb.id}
                            onClick={() => handleBreadcrumbClick(crumb.id)}
                          >
                            {crumb.name}
                          </BreadcrumbItem>
                          {i < breadcrumbData.length - 1 && (
                            <BreadcrumbSeparator key={`sep-${crumb.id}`} />
                          )}
                        </>
                      ))}
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </>
            )}
          </div>

          <div className="border-border flex items-center justify-between gap-2">
            <FileUploadDialog
              parentId={currentFolderId}
              refreshFiles={fetchFiles}
            />
            <CreateFolderDialog
              parentId={currentFolderId}
              refreshFiles={fetchFiles}
            />
          </div>
        </div>

        {/* File Manager Analytics */}
        <FileManagerAnalytics />

        {/* File Manager Header */}
        <FileManagerHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterType={filterType}
          setFilterType={setFilterType}
          sortBy={sortBy}
          setSortBy={(value: SortOption) => handleSortChange(value)}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {selectedItems.size > 0 && (
          <div
            className="flex items-center justify-between bg-muted border p-3 mt-3 rounded-md shadow-sm"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                checked={
                  selectedItems.size === sortedAndFilteredItems.length &&
                  sortedAndFilteredItems.length > 0
                }
                onClick={toggleSelectAll}
              />
              <span>{selectedItems.size} selected</span>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={openDeleteDialogForBulk}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />{" "}
                      Deleting...
                    </>
                  ) : (
                    "Delete Selected"
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedItems(new Set())}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="flex mt-5 border-t">
          {/* File List */}
          <div className="min-w-0 grow">
            {viewMode === "list" ? (
              // ===== LIST VIEW =====
              <div>
                {sortedAndFilteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "hover:bg-muted flex cursor-pointer items-center justify-between border-b p-2 lg:p-4",
                      selectedItem?.id === item.id && "bg-muted"
                    )}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex min-w-0 items-center space-x-4">
                      <Checkbox
                        checked={selectedItems.has(item.id)}
                        onClick={(e) => toggleItemSelection(item.id, e)}
                      />
                      <div className="shrink-0">{getFileIcon(item.icon)}</div>
                      <div className="min-w-0 truncate">{item.name}</div>
                    </div>

                    <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                      <span className="hidden w-20 text-right lg:inline">
                        {formatDateShort(item.date)}
                      </span>
                      <span className="hidden w-16 text-right lg:inline">
                        {item.size}
                      </span>
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={item.ownerAvatar || "/placeholder.svg"}
                        />
                        <AvatarFallback className="text-xs">
                          {item.ownerName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={deleting}
                          >
                            <MoreHorizontalIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Compress</DropdownMenuItem>
                          <DropdownMenuItem>Archive</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Move</DropdownMenuItem>
                          <DropdownMenuItem>Copy</DropdownMenuItem>
                          {isAdmin && (
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteDialogForItem(item);
                                }}
                            >
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // ===== GRID VIEW =====
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                {sortedAndFilteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "group relative flex flex-col items-center justify-center rounded-lg border p-4 cursor-pointer hover:bg-muted transition-all",
                      selectedItem?.id === item.id && "bg-muted"
                    )}
                  >
                    {/* Checkbox in top-left corner */}
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Checkbox
                        checked={selectedItems.has(item.id)}
                        onClick={(e) => toggleItemSelection(item.id, e)}
                      />
                    </div>

                    {/* Actions in top-right corner */}
                    <div className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={deleting}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Open actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleItemClick(item);
                            }}
                          >
                            {item.type === "folder" ? "Open" : "View Details"}
                          </DropdownMenuItem>
                          {isAdmin && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteDialogForItem(item);
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mb-2">{getFileIcon(item.icon)}</div>
                    <div className="truncate w-[200px] text-center text-sm font-medium">
                      {item.name}
                    </div>

                    <div className="text-muted-foreground text-xs mt-1">
                      {item.size} • {formatDateShort(item.date)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty states and pagination remain the same */}
            {sortedAndFilteredItems.length === 0 && searchQuery && (
              <div className="text-muted-foreground flex items-center justify-center p-8 text-center">
                No files or folders found matching “{searchQuery}”
              </div>
            )}

            {sortedAndFilteredItems.length === 0 && !searchQuery && (
              <div className="flex h-[calc(100vh-var(--header-height)-3rem)] flex-col items-center justify-center">
                <div className="mx-auto max-w-md space-y-4 text-center">
                  <FolderPlus className="mx-auto size-14 opacity-50" />
                  <h2 className="text-muted-foreground">
                    This folder is empty.
                  </h2>
                  <div>
                    <FileUploadDialog
                      parentId={currentFolderId}
                      refreshFiles={fetchFiles}
                    />
                  </div>
                </div>
              </div>
            )}

            {!currentFolderId && sortedAndFilteredItems.length > 0 && (
              <div className="mt-4">
                <FileManagerPagination />
              </div>
            )}
          </div>

          {/* Desktop Right Panel - Details */}
          {selectedItem && !isMobile ? (
            <div className="relative w-80 border-s py-6">
              <Button
                onClick={() => setSelectedItem(null)}
                variant="ghost"
                size="icon"
                className="absolute top-2 right-0"
              >
                <XIcon />
              </Button>
              <FileDetailContent selectedItem={selectedItem} />
            </div>
          ) : null}
        </div>
      </div>

      {selectedItem && isMobile && (
        <Sheet open={showMobileDetails} onOpenChange={setShowMobileDetails}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>File Details</SheetTitle>
            </SheetHeader>
            <FileDetailContent selectedItem={selectedItem} />
          </SheetContent>
        </Sheet>
      )}

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open && !deleting) {
            setPendingDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingDelete?.type === "bulk"
                ? "Delete selected items?"
                : "Delete item?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.type === "bulk"
                ? `This will permanently delete ${pendingDelete.count} selected item(s). This action cannot be undone.`
                : `This will permanently delete "${pendingDelete?.itemName ?? "this item"}". This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting || !pendingDelete}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
