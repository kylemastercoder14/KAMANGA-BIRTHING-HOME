import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProgramHeader() {
  return (
    <header className="bg-card/50 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="pb-4 pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Healh Programs
            </Button>
            <div className="bg-border h-6 w-px" />
            <h1 className="text-lg font-medium">
              The Ultimate Guide to Maternal Health and Wellness
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
