"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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

export const description = "Age demographics for pregnant women (2025)";

// 📊 New data pattern: goes up → down → up
const chartData = [
  // January 2025 — rising
  {
    date: "2025-01-05",
    "18-20": 40,
    "21-24": 110,
    "25-29": 210,
    "30-34": 90,
    "35+": 40,
  },
  {
    date: "2025-01-12",
    "18-20": 48,
    "21-24": 125,
    "25-29": 225,
    "30-34": 95,
    "35+": 45,
  },
  {
    date: "2025-01-19",
    "18-20": 55,
    "21-24": 140,
    "25-29": 240,
    "30-34": 100,
    "35+": 50,
  },
  {
    date: "2025-01-26",
    "18-20": 60,
    "21-24": 155,
    "25-29": 250,
    "30-34": 110,
    "35+": 55,
  },

  // February 2025 — dropping
  {
    date: "2025-02-02",
    "18-20": 58,
    "21-24": 145,
    "25-29": 235,
    "30-34": 105,
    "35+": 52,
  },
  {
    date: "2025-02-09",
    "18-20": 50,
    "21-24": 130,
    "25-29": 220,
    "30-34": 95,
    "35+": 50,
  },
  {
    date: "2025-02-16",
    "18-20": 45,
    "21-24": 120,
    "25-29": 210,
    "30-34": 90,
    "35+": 48,
  },
  {
    date: "2025-02-23",
    "18-20": 42,
    "21-24": 115,
    "25-29": 205,
    "30-34": 88,
    "35+": 45,
  },

  // March 2025 — rising again
  {
    date: "2025-03-02",
    "18-20": 48,
    "21-24": 130,
    "25-29": 220,
    "30-34": 95,
    "35+": 50,
  },
  {
    date: "2025-03-09",
    "18-20": 55,
    "21-24": 140,
    "25-29": 230,
    "30-34": 100,
    "35+": 52,
  },
  {
    date: "2025-03-16",
    "18-20": 60,
    "21-24": 150,
    "25-29": 240,
    "30-34": 110,
    "35+": 55,
  },
  {
    date: "2025-03-23",
    "18-20": 65,
    "21-24": 160,
    "25-29": 255,
    "30-34": 115,
    "35+": 60,
  },
  {
    date: "2025-03-30",
    "18-20": 68,
    "21-24": 165,
    "25-29": 260,
    "30-34": 120,
    "35+": 62,
  },

  // April 2025 — small dip
  {
    date: "2025-04-06",
    "18-20": 63,
    "21-24": 155,
    "25-29": 250,
    "30-34": 110,
    "35+": 58,
  },
  {
    date: "2025-04-13",
    "18-20": 58,
    "21-24": 145,
    "25-29": 240,
    "30-34": 105,
    "35+": 55,
  },
  {
    date: "2025-04-20",
    "18-20": 55,
    "21-24": 140,
    "25-29": 235,
    "30-34": 100,
    "35+": 52,
  },
  {
    date: "2025-04-27",
    "18-20": 52,
    "21-24": 135,
    "25-29": 230,
    "30-34": 98,
    "35+": 50,
  },

  // May 2025 — sharp increase
  {
    date: "2025-05-04",
    "18-20": 60,
    "21-24": 150,
    "25-29": 245,
    "30-34": 105,
    "35+": 55,
  },
  {
    date: "2025-05-11",
    "18-20": 68,
    "21-24": 165,
    "25-29": 260,
    "30-34": 115,
    "35+": 60,
  },
  {
    date: "2025-05-18",
    "18-20": 75,
    "21-24": 180,
    "25-29": 275,
    "30-34": 125,
    "35+": 65,
  },
  {
    date: "2025-05-25",
    "18-20": 82,
    "21-24": 190,
    "25-29": 285,
    "30-34": 135,
    "35+": 68,
  },

  // June 2025 — peak then slight drop
  {
    date: "2025-06-01",
    "18-20": 90,
    "21-24": 200,
    "25-29": 300,
    "30-34": 140,
    "35+": 70,
  },
  {
    date: "2025-06-08",
    "18-20": 88,
    "21-24": 195,
    "25-29": 295,
    "30-34": 138,
    "35+": 68,
  },
  {
    date: "2025-06-15",
    "18-20": 85,
    "21-24": 190,
    "25-29": 290,
    "30-34": 135,
    "35+": 66,
  },
  {
    date: "2025-06-22",
    "18-20": 83,
    "21-24": 185,
    "25-29": 280,
    "30-34": 130,
    "35+": 64,
  },
  {
    date: "2025-06-29",
    "18-20": 80,
    "21-24": 180,
    "25-29": 275,
    "30-34": 125,
    "35+": 62,
  },
];

const chartConfig = {
  "18-20": { label: "18–20 years", color: "hsl(210, 100%, 70%)" },
  "21-24": { label: "21–24 years", color: "hsl(150, 100%, 65%)" },
  "25-29": { label: "25–29 years", color: "hsl(40, 100%, 60%)" },
  "30-34": { label: "30–34 years", color: "hsl(280, 100%, 70%)" },
  "35+": { label: "35+ years", color: "hsl(0, 100%, 70%)" },
} satisfies ChartConfig;

export function AgeDemographics() {
  const isMobile = useIsMobile();

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Age Demographics (Pregnant Women, 2025)</CardTitle>
        <CardDescription>
          Distribution by age group from January–June 2025
        </CardDescription>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              {Object.keys(chartConfig).map((key) => (
                <linearGradient
                  key={key}
                  id={`fill${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={
                      chartConfig[key as keyof typeof chartConfig].color
                    }
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={
                      chartConfig[key as keyof typeof chartConfig].color
                    }
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            {Object.keys(chartConfig).map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={`url(#fill${key})`}
                stroke={chartConfig[key as keyof typeof chartConfig].color}
                stackId="a"
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>

      {/* ✅ Legend Section */}
      <CardFooter className="flex flex-wrap items-center justify-center gap-4 border-t pt-4">
        {Object.entries(chartConfig).map(([key, { label, color }]) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-md"
              style={{ backgroundColor: color }}
            ></div>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}
