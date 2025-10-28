"use client";

import React, { useState, useTransition } from "react";
import { HealthProgramWithSections } from "@/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, FileText, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import AlertModal from "@/components/ui/alert-modal";
import { deleteProgram } from "@/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Actions = ({ program }: { program: HealthProgramWithSections }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await deleteProgram(program.id);
        router.refresh();
        setIsOpen(false);
      } catch (error) {
        console.error("Failed to delete program:", error);
        toast.error("Failed to delete program. Please try again.");
      }
    });
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        loading={isPending}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link
              href={`/health-programs/${program.id}/view-details`}
              className="flex items-center gap-2"
            >
              <FileText className="size-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/health-programs/${program.id}`}>
              <Edit className="size-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500 focus:text-red-500"
            onClick={() => setIsOpen(true)}
          >
            <Trash className="size-4 text-red-500 focus:text-red-500" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Actions;
