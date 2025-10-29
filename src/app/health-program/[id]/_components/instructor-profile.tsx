
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HealthProgramWithSections } from '@/types';

export function InstructorProfile({program}: {program: HealthProgramWithSections}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/instructor-maria-santos.jpg" />
            <AvatarFallback>{program.instructor.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-lg font-semibold">{program.instructor}</h3>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed">
              {program.instructorDescription}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
