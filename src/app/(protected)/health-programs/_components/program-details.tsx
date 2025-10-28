import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthProgramWithSections } from "@/types";

export function ProgramDetails({
  program,
}: {
  program: HealthProgramWithSections;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-balance">
          {program.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className="text-muted-foreground prose prose-md max-w-none prose-headings:font-bold prose-headings:text-black prose-a:text-black prose-ul:list-disc prose-li:marker:text-black leading-relaxed"
          dangerouslySetInnerHTML={{ __html: program.description }}
        />
      </CardContent>
    </Card>
  );
}
