/* eslint-disable @typescript-eslint/no-explicit-any */
import { Play, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthProgramWithSections } from "@/types";

export function ProgramCurriculum({
  program,
  selectedSection,
  onSelectSection,
}: {
  program: HealthProgramWithSections;
  selectedSection: any;
  onSelectSection: (section: any) => void;
}) {
  // Format minutes or seconds into mm:ss
  const formatDuration = (minutes: number) => {
    if (!minutes) return "0:00";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0
      ? `${hrs}:${mins.toString().padStart(2, "0")}:00`
      : `${mins}:00`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="text-primary h-5 w-5" />
          Program Sections
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {program.sections.length === 0 ? (
          <p className="text-sm text-muted-foreground p-4">
            No sections available.
          </p>
        ) : (
          <div className="space-y-1">
            {program.sections.map((section) => {
              const isActive = selectedSection?.id === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => onSelectSection(section)}
                  className={`hover:bg-muted/50 w-full border-l-2 p-4 text-left transition-colors ${
                    isActive
                      ? "border-l-primary bg-primary/5"
                      : "border-l-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Play className="h-3 w-3" />
                      </div>
                      <p
                        className={`text-sm font-medium text-pretty ${
                          isActive ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {section.title}
                      </p>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">
                        {formatDuration(section.totalDuration || 0)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
