import React from "react";
import Heading from "@/components/globals/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconDatabase, IconRestore } from "@tabler/icons-react";
import { columns } from "./_components/columns";
import { DataTable } from "@/components/ui/data-table";
import { BackupHistory } from "@prisma/client";

const Page = () => {
  const data: BackupHistory[] = [
    {
      id: "hmywrfyrr42rs9if9um3r45jw7f8g45fgu",
      filename: "restore_2025-10-17T09:08:16.657Z.json",
      action: "Restore",
	  status: "Success",
      createdAt: new Date(),
    },

    {
      id: "hfg420isfpsd9umf43tsadfhjkgifdsg842",
      filename: "backup_2025-10-17T09:06:27.696Z.json",
      action: "Backup",
      status: "Success",
      createdAt: new Date(),
    },
  ];
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Database Backup & Restore"
          description="Backup and restore your data whenever you want"
        />
        <div className="flex items-center gap-3">
          <Button size="sm">
            <Link
              href="/backup-database/download"
              className="flex items-center gap-2"
            >
              <IconDatabase className="size-4" />
              Download Backup
            </Link>
          </Button>
		  <Button variant="secondary" size="sm">
            <Link
              href="/backup-database/restore"
              className="flex items-center gap-2"
            >
              <IconRestore className="size-4" />
              Restore Backup
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-5">
        <DataTable
          columns={columns}
          data={data}
          searchPlaceholder="Filter by date created..."
        />
      </div>
    </div>
  );
};

export default Page;
