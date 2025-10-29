"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { IconLayoutGrid, IconList } from "@tabler/icons-react";

type SortOption = "name" | "date" | "size";

interface FileManagerHeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  sortBy: string;
  setSortBy: (value: SortOption) => void;
  viewMode: "list" | "grid";
  setViewMode: (value: "list" | "grid") => void;
}

const FileManagerHeader: React.FC<FileManagerHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="flex mt-5 items-center lg:flex-row flex-col gap-3 justify-between">
      <div className="flex items-center w-full gap-3">
        <h3 className="text-xl lg:block hidden font-semibold">All Files</h3>

        <Select onValueChange={setFilterType} value={filterType}>
          <SelectTrigger className="lg:w-[180px] w-full">
            <SelectValue placeholder="File Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="folder">Folder</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="docx">Docs</SelectItem>
            <SelectItem value="xlsx">XLSX</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Video</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setSortBy} value={sortBy}>
          <SelectTrigger className="lg:w-[180px] w-full">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="date">Last Modified</SelectItem>
            <SelectItem value="size">File Size</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative lg:w-[300px] w-full flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring pl-2">
          <Search className="h-5 w-5" />
          <Input
            placeholder="Search by file name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 shadow-none"
          />
        </div>

        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(val) => setViewMode(val as "list" | "grid")}
          variant="outline"
        >
          <ToggleGroupItem value="list" aria-label="Toggle list">
            <IconList className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="Toggle grid">
            <IconLayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default FileManagerHeader;
