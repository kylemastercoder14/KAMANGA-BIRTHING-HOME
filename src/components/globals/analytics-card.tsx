"use client";

import {
  IconWoman,
  IconUsersGroup,
  IconCategory2,
  IconDisabled2,
  IconHome2,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AnalyticsCardProps {
  totalPopulation: number;
  newMothers: number;
  ipsMembers: number;
  fourPsMembers: number;
  pwdMembers: number;
}

export function AnalyticsCard({
  totalPopulation,
  newMothers,
  ipsMembers,
  fourPsMembers,
  pwdMembers,
}: AnalyticsCardProps) {
  // Helper to compute percentage of total
  const percentOfTotal = (value: number) => {
    if (totalPopulation === 0) return 0;
    return (value / totalPopulation) * 100;
  };

  const cards = [
    {
      label: "Total Population",
      value: totalPopulation,
      percent: 100,
      icon: <IconUsersGroup className="text-emerald-500" />,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "Pregnant Women",
      value: newMothers,
      percent: percentOfTotal(newMothers),
      icon: <IconWoman className="text-lime-500" />,
      color: "bg-lime-500/10 text-lime-600",
    },
    {
      label: "IPS Members",
      value: ipsMembers,
      percent: percentOfTotal(ipsMembers),
      icon: <IconCategory2 className="text-green-500" />,
      color: "bg-green-500/10 text-green-600",
    },
    {
      label: "4Ps Members",
      value: fourPsMembers,
      percent: percentOfTotal(fourPsMembers),
      icon: <IconHome2 className="text-teal-500" />,
      color: "bg-teal-500/10 text-teal-600",
    },
    {
      label: "PWD Members",
      value: pwdMembers,
      percent: percentOfTotal(pwdMembers),
      icon: <IconDisabled2 className="text-emerald-700" />,
      color: "bg-emerald-700/10 text-emerald-700",
    },
  ];

  return (
    <div className="grid lg:grid-cols-5 grid-cols-1 gap-5">
      {cards.map((card) => (
        <Card key={card.label} className="@container/card">
          <CardHeader>
            <CardDescription>{card.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold flex items-center gap-2 @[250px]/card:text-3xl">
              {card.icon} {card.value}
            </CardTitle>
            <CardAction>
              <Badge
                variant="outline"
                className={`${card.color} font-semibold`}
              >
                {card.percent.toFixed(1)}% of total
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
