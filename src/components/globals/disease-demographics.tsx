"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
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
  desktop: Math.floor(Math.random() * 400) + 50, // random 50–450
  mobile: Math.floor(Math.random() * 300) + 20, // random 20–320
}));

const chartConfig = {
  desktop: {
    label: "Hypertension",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Diabetes",
    color: "var(--chart-2)",
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
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
