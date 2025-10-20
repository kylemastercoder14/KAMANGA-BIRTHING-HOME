"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxCardProps {
  value: string;
  label: string;
  description?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (value: string, checked: boolean) => void;
  className?: string;
  icon?: React.ReactNode;
}

export const CheckboxCard: React.FC<CheckboxCardProps> = ({
  value,
  label,
  description,
  checked = false,
  disabled = false,
  onChange,
  className,
  icon,
}) => {
  const handleClick = () => {
    if (disabled) return;
    onChange?.(value, !checked);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all",
        "hover:border-primary/60 hover:bg-primary/5",
        checked ? "border-primary bg-primary/10" : "border-muted",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className
      )}
    >
      <div className="flex items-center gap-3 w-full">
        {/* Optional Icon */}
        {icon && <div className="text-primary">{icon}</div>}

        <div className="flex-1">
          <p className="font-medium text-sm">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Checkmark Indicator */}
        <div
          className={cn(
            "flex size-4 items-center justify-center rounded-md border transition-colors",
            checked
              ? "bg-primary border-primary text-white"
              : "border-muted bg-background"
          )}
        >
          {checked && <Check size={14} strokeWidth={3} />}
        </div>
      </div>
    </button>
  );
};
