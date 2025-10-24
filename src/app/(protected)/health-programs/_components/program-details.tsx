import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProgramDetails() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-balance">
          The Ultimate Guide to Maternal Health and Wellness
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">
          This comprehensive program is designed to educate and support expectant mothers through every stage of pregnancy.
          It covers essential topics such as prenatal care, proper nutrition, emotional wellness, safe delivery, and postpartum recovery.
          Whether you’re a first-time mom or already caring for a growing family, this program equips you with practical knowledge and guidance
          to ensure a healthy and safe pregnancy journey.
        </p>

        <div className="space-y-4">
          <div className='mt-4'>
            <h3 className="mb-2 font-semibold">Prenatal Health:</h3>
            <p className="text-muted-foreground leading-relaxed">
              Learn about the importance of regular checkups, prenatal vitamins, and early detection of pregnancy-related risks.
              The lessons also include guidance on maintaining a balanced diet, safe physical activity, and monitoring your baby’s development.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Maternal Wellness and Support:</h3>
            <p className="text-muted-foreground leading-relaxed">
              Explore emotional and mental health topics that promote confidence and reduce anxiety during pregnancy.
              You’ll also discover local health programs, community resources, and support systems available for mothers,
              ensuring that you never go through this journey alone.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Postpartum and Newborn Care:</h3>
            <p className="text-muted-foreground leading-relaxed">
              Understand how to care for yourself and your newborn after delivery.
              Topics include proper breastfeeding practices, postpartum nutrition, physical recovery, and when to seek medical advice.
              The program also encourages bonding and healthy early child development practices.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
