"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileNode } from "@/actions";
import { toast } from "sonner";
import { Folder } from "lucide-react";

interface CreateFolderDialogProps {
  parentId?: string;
  refreshFiles?: () => void;
}

export function CreateFolderDialog({
  parentId,
  refreshFiles,
}: CreateFolderDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [folderName, setFolderName] = React.useState("");
  const [creating, setCreating] = React.useState(false);

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return toast.error("Folder name cannot be empty");
    setCreating(true);

    try {
      await createFileNode({
        name: folderName.trim(),
        type: "folder",
        icon: "folder",
        size: "0 KB",
        parentId,
      });

      toast.success("Folder created successfully");
      setFolderName("");
      setOpen(false);

      if (refreshFiles) refreshFiles();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create folder");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Folder className="size-4" />
        <span className='lg:block hidden'>New Folder</span>
      </Button>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-2">
          <Label htmlFor="folderName">Folder Name</Label>
          <Input
            id="folderName"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
          />
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={creating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateFolder}
            disabled={creating || !folderName.trim()}
          >
            {creating ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
