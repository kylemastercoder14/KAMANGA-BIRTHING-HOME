"use client";

import React from "react";
import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

// 🔹 Props for passing real sitio data
interface SitioPopulationPercentageProps {
  populationPerSitio: {
    sitio: string;
    population: number;
  }[];
}

// 🎨 Generate distinct HSL colors for each sitio
function generateDistinctColors(count: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const hue = Math.round((360 / count) * i);
    const saturation = 70;
    const lightness = 60;
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
}

export function SitioPopulationPercentage({
  populationPerSitio,
}: SitioPopulationPercentageProps) {
  // ✅ Compute total population and percentages
  const totalPopulation = populationPerSitio.reduce(
    (sum, sitio) => sum + sitio.population,
    0
  );

  const colors = generateDistinctColors(populationPerSitio.length);

  const chartData = populationPerSitio.map((s, index) => ({
    sitio: s.sitio,
    population: s.population,
    percentage: ((s.population / totalPopulation) * 100).toFixed(1),
    fill: colors[index],
  }));

  // 🧩 Dynamic chart config
  const chartConfig = populationPerSitio.reduce((acc, s, i) => {
    acc[s.sitio] = { label: s.sitio, color: chartData[i].fill };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Population Percentage per Sitio</CardTitle>
        <CardDescription>
          Showing each sitio’s population as a percentage of the total
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="w-full aspect-auto h-[300px]"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="population"
              nameKey="sitio"
              labelLine={false}
              label={({ percentage }) => `${percentage}%`}
              outerRadius={120}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex items-center mx-auto justify-center flex-wrap gap-5">
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
      </CardFooter>
    </Card>
  );
}
