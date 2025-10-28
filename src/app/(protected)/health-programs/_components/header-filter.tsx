"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { HealthProgramWithSections } from "@/types";

interface HeaderFilterProps {
  data: HealthProgramWithSections[];
  onFilter: (filtered: HealthProgramWithSections[]) => void;
}

const HeaderFilter = ({ data, onFilter }: HeaderFilterProps) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("recent");

  const handleFilter = (searchValue: string, filterValue: string) => {
    const filteredData = data
      .filter((program) =>
        program.title.toLowerCase().includes(searchValue.toLowerCase())
      )
      .sort((a, b) => {
        if (filterValue === "az") return a.title.localeCompare(b.title);
        if (filterValue === "za") return b.title.localeCompare(a.title);
        if (filterValue === "recent")
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        if (filterValue === "oldest")
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        return 0;
      });

    onFilter(filteredData);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    handleFilter(value, filter);
  };

  const handleSelectChange = (value: string) => {
    setFilter(value);
    handleFilter(search, value);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 mb-6">
      <Input
        placeholder="Search programs..."
        value={search}
        onChange={handleSearchChange}
        className="w-full sm:w-[400px]"
      />

      <Select value={filter} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Most Recent</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="az">Title: A → Z</SelectItem>
          <SelectItem value="za">Title: Z → A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default HeaderFilter;
