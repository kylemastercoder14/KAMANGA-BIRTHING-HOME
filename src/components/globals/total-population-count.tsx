"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// 🔹 Define prop type
interface PopulationPerSitioProps {
  populationPerSitio: {
    sitio: string;
    population: number;
  }[];
}

// ✅ Chart config
const chartConfig = {
  population: {
    label: "Total Population",
    // Emerald green accent
    color: "hsl(142, 70%, 45%)",
  },
} satisfies ChartConfig;

export function PopulationPerSitio({ populationPerSitio }: PopulationPerSitioProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Population (2025)</CardTitle>
        <CardDescription>
          Displays the total population count for each sitio.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[450px] w-full">
          <AreaChart data={populationPerSitio} margin={{ bottom: 100, left: 10, right: 10, top: 10 }}>
            <defs>
              <linearGradient id="fillPopulation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.9} />
                <stop offset="95%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="sitio"
              tickLine={false}
              axisLine={false}
              tickMargin={20}
              angle={-60}
              textAnchor="end"
              height={100}
              interval="preserveStartEnd"
              minTickGap={30}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => {
                // Truncate long sitio names
                if (value.length > 15) {
                  return value.substring(0, 12) + "...";
                }
                return value;
              }}
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
              stroke="hsl(142, 70%, 40%)"
              fill="url(#fillPopulation)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
