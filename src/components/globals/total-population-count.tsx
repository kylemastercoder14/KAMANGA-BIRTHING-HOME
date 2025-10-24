"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
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

export const description = "Total population per sitio (2025)";

// 📊 Data: total population per sitio
const chartData = [
  { sitio: "Sitio 1", population: 550 },
  { sitio: "Sitio 2", population: 890 },
  { sitio: "Sitio 3", population: 720 },
  { sitio: "Sitio 4", population: 610 },
  { sitio: "Sitio 5", population: 950 },
  { sitio: "Sitio 6", population: 780 },
  { sitio: "Sitio 7", population: 670 },
  { sitio: "Sitio 8", population: 820 },
  { sitio: "Sitio 9", population: 910 },
  { sitio: "Sitio 10", population: 1030 },
];

// ✅ Required by ChartContainer
const chartConfig = {
  population: {
    label: "Total Population",
    color: "hsl(210, 100%, 65%)",
  },
} satisfies ChartConfig;

export function PopulationPerSitio() {
  const isMobile = useIsMobile();

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Population per Sitio (2025)</CardTitle>
        <CardDescription>
          Displays the total population count for each sitio.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {/* ✅ Pass `config` here */}
        <ChartContainer config={chartConfig} className="aspect-auto h-[320px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillPopulation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(210, 100%, 65%)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(210, 100%, 65%)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="sitio"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              minTickGap={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{
                value: "Population Count",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <ChartTooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Population of ${value}`}
                  indicator="dot"
                />
              }
            />

            <Area
              type="monotone"
              dataKey="population"
              stroke="hsl(210, 100%, 65%)"
              fill="url(#fillPopulation)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
