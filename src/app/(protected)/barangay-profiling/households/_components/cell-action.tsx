"use client";

import React from "react";

import { EditIcon, MoreHorizontal, ArchiveIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { HouseholdWithProfile } from '@/types';
import { Role } from "@prisma/client";

const CellActions = ({
  data,
  userRole
}: {
  data: HouseholdWithProfile;
  userRole?: Role;
}) => {
  const isAdmin = userRole === Role.ADMIN;

  // Households are managed through profiles, so we don't have edit/delete here
  // Only show actions menu for ADMIN users
  if (!isAdmin) {
    return null;
  }

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
            toast.info("Household management is done through individual profiles");
          }}
        >
          View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CellActions;
