import { cn } from "@/lib/utils";
import React from "react";

interface CircularProgressProps {
  value: number; // percentage (0–100)
  childrenLabel?: React.ReactNode;
  renderLabel?: (progress: number) => number | string;
  size?: number;
  strokeWidth?: number;
  circleStrokeWidth?: number;
  progressStrokeWidth?: number;
  shape?: "square" | "round";
  className?: string;
  progressClassName?: string;
  labelClassName?: string;
  showLabel?: boolean;
}

const CircularProgress = ({
  value,
  renderLabel,
  childrenLabel,
  className,
  progressClassName,
  labelClassName,
  showLabel = false,
  shape = "round",
  size = 100,
  circleStrokeWidth = 5,
  progressStrokeWidth = 5,
}: CircularProgressProps) => {
  // Ensure percentage is within 0–100
  const progress = Math.max(0, Math.min(value, 100));

  const radius = (size - progressStrokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Base Circle */}
        <circle
          stroke="currentColor"
          className={cn("text-primary/20", className)}
          strokeWidth={circleStrokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        {/* Progress Circle */}
        <circle
          stroke="currentColor"
          className={cn("text-primary transition-all duration-500 ease-in-out", progressClassName)}
          strokeWidth={progressStrokeWidth}
          strokeLinecap={shape}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      {/* Label */}
      {showLabel && (
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center text-center",
            labelClassName
          )}
        >
          {childrenLabel ? (
            childrenLabel
          ) : renderLabel ? (
            renderLabel(progress)
          ) : (
            <span className="text-sm font-semibold">{Math.round(progress)}%</span>
          )}
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
