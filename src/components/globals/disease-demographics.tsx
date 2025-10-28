/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { getDiseaseDemographics } from "@/actions";

const chartConfig = {
  hypertension: { label: "Hypertension", color: "hsl(210, 100%, 70%)" },
  diabetes: { label: "Diabetes", color: "hsl(40, 100%, 60%)" },
  tubercolosis: { label: "Tubercolosis", color: "hsl(0, 100%, 70%)" },
} satisfies ChartConfig;

export function DiseaseDemographics() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getDiseaseDemographics();
      setChartData(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disease Demographics</CardTitle>
        <CardDescription>
          Showing disease prevalence per sitio (2025)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[400px] text-muted-foreground">
            Loading...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-[400px] text-center text-muted-foreground">
            <p className="text-lg font-medium">No data available</p>
            <p className="text-sm">There are no disease records yet.</p>
          </div>
        ) : (
          <ChartContainer className="w-full h-[505px]" config={chartConfig}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="sitio" tickLine={false} tickMargin={10} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
              <Bar dataKey="hypertension" fill="var(--color-hypertension)" radius={4} />
              <Bar dataKey="diabetes" fill="var(--color-diabetes)" radius={4} />
              <Bar dataKey="tubercolosis" fill="var(--color-tubercolosis)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
