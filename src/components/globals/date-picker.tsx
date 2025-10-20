"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date | string; // allow both Date and string
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  className = "",
}) => {
  const [open, setOpen] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  // ✅ Keep internal date synced and always ensure it's a Date object
  React.useEffect(() => {
    if (value) {
      const dateObj = value instanceof Date ? value : new Date(value);
      setInternalDate(dateObj);
    } else {
      setInternalDate(undefined);
    }
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    setInternalDate(date);
    onChange?.(date);
    setOpen(false);
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal"
            disabled={disabled}
          >
            {internalDate ? internalDate.toLocaleDateString() : placeholder}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={internalDate}
            captionLayout="dropdown"
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
