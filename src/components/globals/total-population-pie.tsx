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
  year?: number;
}

// 🎨 Generate distinct greenish HSL colors for each sitio
function generateDistinctColors(count: number): string[] {
  const colors: string[] = [];
  const baseHue = 140; // green
  const hueRange = 40; // spread around green for subtle variation
  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0.5;
    const hue = baseHue - hueRange / 2 + hueRange * t; // e.g. 120–160
    const saturation = 65 + 10 * (1 - t); // slightly more saturated on first items
    const lightness = 45 + 15 * t; // vary lightness so slices are distinguishable
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
          className="w-full aspect-auto h-[350px]"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="population"
              nameKey="sitio"
              labelLine={false}
              label={false}
              outerRadius={110}
              innerRadius={40}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="pt-4">
        <div className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[200px] overflow-y-auto">
            {chartData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-md flex-shrink-0"
                  style={{ backgroundColor: entry.fill }}
                ></div>
                <span className="text-sm text-muted-foreground truncate">
                  {entry.sitio} ({entry.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
