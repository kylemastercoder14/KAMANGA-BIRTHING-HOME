"use client";

import React, { useState } from "react";
import Image from "next/image";
import { formatDistanceToNowStrict } from "date-fns";
import Actions from "./actions";
import HeaderFilter from "./header-filter";
import { HealthProgramWithSections } from "@/types";
import { Role } from "@prisma/client";

interface ProgramsGridProps {
  data: HealthProgramWithSections[];
  userRole?: Role;
}

const ProgramsGrid = ({ data, userRole }: ProgramsGridProps) => {
  const [filteredData, setFilteredData] = useState(data);

  // Moved here instead of being passed from the server
  const formatDuration = (minutes: number) => {
    if (!minutes) return "0:00";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}:${mins.toString().padStart(2, "0")}:00`;
    return `${mins}:00`;
  };

  return (
    <>
      {/* Search + Filter */}
      <HeaderFilter data={data} onFilter={setFilteredData} />

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredData.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center">
            No programs found.
          </p>
        )}

        {filteredData.map((program) => {
          const totalDuration = program.sections.reduce(
            (acc, sec) => acc + (sec.totalDuration || 0),
            0
          );

          return (
            <div
              key={program.id}
              className="rounded-xl overflow-hidden hover:shadow-lg border transition-shadow relative group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-muted">
                {program.thumbnailUrl ? (
                  <Image
                    src={program.thumbnailUrl}
                    alt={program.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    No Thumbnail
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-0.5 rounded">
                  {formatDuration(totalDuration)}
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold leading-tight line-clamp-2 mb-1">
                      {program.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {program.instructor}
                    </p>
                  </div>

                  <Actions program={program} userRole={userRole} />
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  {program.viewsCount.toLocaleString()} views •{" "}
                  {formatDistanceToNowStrict(new Date(program.createdAt), {
                    addSuffix: true,
                  })}
                </p>

                {program.tags && program.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {program.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProgramsGrid;
