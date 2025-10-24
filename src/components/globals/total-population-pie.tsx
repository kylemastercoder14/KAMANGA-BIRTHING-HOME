"use client";

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

export const description = "Total population percentage per sitio (2025)";

// 🧭 Raw sitio population counts
const sitioData = [
  { sitio: "Sitio 1", population: 550 },
  { sitio: "Sitio 2", population: 890 },
  { sitio: "Sitio 3", population: 720 },
  { sitio: "Sitio 4", population: 610 },
  { sitio: "Sitio 5", population: 950 },
  { sitio: "Sitio 6", population: 430 },
  { sitio: "Sitio 7", population: 380 },
];

// 🎨 Generate distinct colors using HSL (evenly spaced hues)
function generateDistinctColors(count: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const hue = Math.round((360 / count) * i); // evenly spaced hues
    const saturation = 70; // stay colorful
    const lightness = 60; // stay readable
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
}

const distinctColors = generateDistinctColors(sitioData.length);

// ✅ Calculate total and percentages
const totalPopulation = sitioData.reduce((sum, s) => sum + s.population, 0);
const chartData = sitioData.map((s, index) => ({
  sitio: s.sitio,
  population: s.population,
  percentage: ((s.population / totalPopulation) * 100).toFixed(1),
  fill: distinctColors[index],
}));

// 🧩 Build chart config dynamically
const chartConfig = sitioData.reduce((acc, s, i) => {
  acc[s.sitio] = { label: s.sitio, color: chartData[i].fill };
  return acc;
}, {} as ChartConfig);

export function SitioPopulationPercentage() {
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
