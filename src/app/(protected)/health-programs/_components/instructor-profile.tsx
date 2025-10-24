
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function InstructorProfile() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/instructor-maria-santos.jpg" />
            <AvatarFallback>MS</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-lg font-semibold">Maria Santos, R.N., MPH</h3>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed">
              Maria Santos is a registered nurse and public health educator with over 12 years of
              experience in maternal and child health. She has led community-based health programs
              focusing on prenatal care, safe motherhood, and proper nutrition for pregnant women.
              Her passion is empowering expectant mothers through knowledge—helping them make
              healthy choices before, during, and after pregnancy. Maria also trains local health
              workers in early detection of pregnancy-related risks and promoting safe delivery
              practices in rural communities.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
