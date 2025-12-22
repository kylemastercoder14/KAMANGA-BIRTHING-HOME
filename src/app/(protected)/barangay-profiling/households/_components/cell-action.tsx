"use client";

import React from "react";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { HouseholdWithProfile } from "@/types";
import { Role } from "@prisma/client";
import { deleteHousehold } from "@/actions";
import { useRouter } from 'next/navigation';

const CellActions = ({
  data,
  userRole,
}: {
  data: HouseholdWithProfile;
  userRole?: Role;
}) => {
  const router = useRouter();

  const handleDelete = async () => {
    // Implement delete functionality here
    const response = await deleteHousehold(data.id);
    if (response.success) {
      toast.success("Household deleted successfully");
      router.refresh();
    } else {
      toast.error(`Failed to delete household: ${response.error || "Unknown error"}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 ml-2.5">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            // Navigate to view household profiles or other admin actions
            toast.info(
              "Household management is done through individual profiles"
            );
          }}
        >
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CellActions;
