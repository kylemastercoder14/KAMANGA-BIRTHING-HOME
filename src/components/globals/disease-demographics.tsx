"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A multiple bar chart";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const chartData = months.map((month) => ({
  month,
  hypertension: Math.floor(Math.random() * 400) + 50, // random 50–450
  diabetes: Math.floor(Math.random() * 300) + 20, // random 20–320
  tubercolosis: Math.floor(Math.random() * 600) + 50, // random 50-600
}));

const chartConfig = {
  hypertension: {
    label: "Hypertension",
    color: "hsl(210, 100%, 70%)",
  },
  diabetes: {
    label: "Diabetes",
    color: "hsl(40, 100%, 60%)",
  },
  tubercolosis: {
    label: "Tubercolosis",
    color: "hsl(0, 100%, 70%)",
  },
} satisfies ChartConfig;

export function DiseaseDemographics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Disease Demographics</CardTitle>
        <CardDescription>
          Showing disease demographics over the past year
        </CardDescription>
        <CardAction>
          <div className="flex items-center gap-5">
            {Object.entries(chartConfig).map(([key, { label, color }]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-md"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="w-full aspect-auto h-[505px]"
          config={chartConfig}
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="hypertension"
              fill="var(--color-hypertension)"
              radius={4}
            />
            <Bar dataKey="diabetes" fill="var(--color-diabetes)" radius={4} />
            <Bar
              dataKey="tubercolosis"
              fill="var(--color-tubercolosis)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
