"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export function ProgramHeader({ title }: { title: string | null }) {
  const router = useRouter();
  return (
    <header className="bg-card/50 border-b backdrop-blur-sm">
      <div className="pb-4 pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => router.push("/health-programs")} variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Healh Programs
            </Button>
            <div className="bg-border h-6 w-px" />
            <h1 className="text-lg font-medium">{title}</h1>
          </div>
        </div>
      </div>
    </header>
  );
}
