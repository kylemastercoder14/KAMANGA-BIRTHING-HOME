import { Play, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const lessons = [
  { id: 1, title: "Introduction to Maternal Health and Wellness", duration: "2:15", isActive: true },
  { id: 2, title: "Understanding Pregnancy Stages", duration: "5:30", isActive: false },
  { id: 3, title: "Proper Nutrition for Expectant Mothers", duration: "6:42", isActive: false },
  { id: 4, title: "Essential Prenatal Checkups", duration: "4:10", isActive: false },
  { id: 5, title: "Exercise and Safe Physical Activities", duration: "3:58", isActive: false },
  { id: 6, title: "Warning Signs During Pregnancy", duration: "4:21", isActive: false },
  { id: 7, title: "Mental and Emotional Health for Mothers", duration: "3:55", isActive: false },
  { id: 8, title: "Preparing for Labor and Delivery", duration: "5:18", isActive: false },
  { id: 9, title: "Postpartum Care and Recovery", duration: "4:37", isActive: false },
  { id: 10, title: "Newborn Care and Breastfeeding Basics", duration: "6:09", isActive: false },
  { id: 11, title: "Vaccinations and Health Programs for Mothers", duration: "3:48", isActive: false },
  { id: 12, title: "Community Support and Maternal Rights", duration: "2:30", isActive: false }
];

export function ProgramCurriculum() {
  return (
    <div className="space-y-6">
      {/* Course Actions */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Beginner Friendly</Badge>
            <Badge variant="outline">Health Program</Badge>
            <Badge variant="outline">12 Lessons</Badge>
          </div>

          <div className="space-y-3">
            <Button className="w-full" size="lg">
              <Play />
              Watch Now
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Add to Favorites
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Course Curriculum */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="text-primary h-5 w-5" />
            Program Sections
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                className={`hover:bg-muted/50 w-full border-l-2 p-4 text-left transition-colors ${
                  lesson.isActive ? "border-l-primary bg-primary/5" : "border-l-transparent"
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        lesson.isActive ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}>
                      <Play className="h-3 w-3" />
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium text-pretty ${
                          lesson.isActive ? "text-primary" : "text-foreground"
                        }`}>
                        {lesson.title}
                      </p>
                    </div>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">{lesson.duration}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
