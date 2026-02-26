import React from "react";
import { AnalyticsCard } from "@/components/globals/analytics-card";
import { PopulationPerSitio } from "@/components/globals/total-population-count";
import { SitioPopulationPercentage } from "@/components/globals/total-population-pie";
import { DiseaseDemographics } from "@/components/globals/disease-demographics";
import UpcomingEvents from "@/components/globals/upcoming-events";
import GalleryDocumentation from "@/components/globals/gallery-documentation";
import db from "@/lib/db";
import { DashboardYearSelect } from "./_components/dashboard-year-select";

const Page = async (props: {
  searchParams?: Promise<{
    year?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const currentYear = new Date().getFullYear();

  const [profileYears, eventYears, fileYears] = await Promise.all([
    db.profile.aggregate({
      _min: { createdAt: true },
      _max: { createdAt: true },
    }),
    db.events.aggregate({
      _min: { start: true },
      _max: { start: true },
    }),
    db.fileNode.aggregate({
      _min: { date: true },
      _max: { date: true },
    }),
  ]);

  const availableYearsSet = new Set<number>([currentYear]);
  const minCandidates = [
    profileYears._min.createdAt?.getFullYear(),
    eventYears._min.start?.getFullYear(),
    fileYears._min.date?.getFullYear(),
  ].filter((year): year is number => typeof year === "number");
  const maxCandidates = [
    currentYear,
    profileYears._max.createdAt?.getFullYear(),
    eventYears._max.start?.getFullYear(),
    fileYears._max.date?.getFullYear(),
  ].filter((year): year is number => typeof year === "number");

  if (minCandidates.length && maxCandidates.length) {
    const minYear = Math.min(...minCandidates);
    const maxYear = Math.max(...maxCandidates);

    for (let year = minYear; year <= maxYear; year++) {
      availableYearsSet.add(year);
    }
  }

  const availableYears = Array.from(availableYearsSet).sort((a, b) => b - a);
  const requestedYear = Number(searchParams?.year);
  const selectedYear = Number.isFinite(requestedYear)
    ? requestedYear
    : currentYear;
  const activeYear = availableYears.includes(selectedYear)
    ? selectedYear
    : currentYear;

  const yearStart = new Date(activeYear, 0, 1);
  const yearEnd = new Date(activeYear + 1, 0, 1);
  const profileYearFilter = {
    createdAt: {
      gte: yearStart,
      lt: yearEnd,
    },
  } as const;

  const totalPopulation = await db.profile.count({
    where: profileYearFilter,
  });

  const newMothers = await db.profile.count({
    where: { ...profileYearFilter, areYouPregnant: true },
  });

  const ipsMembers = await db.profile.count({
    where: { ...profileYearFilter, areYouIps: true },
  });

  const fourPsMembers = await db.profile.count({
    where: { ...profileYearFilter, areYou4ps: true },
  });

  const pwdMembers = await db.profile.count({
    where: { ...profileYearFilter, areYouPwd: true },
  });

  const profilesForSitio = await db.profile.findMany({
    where: profileYearFilter,
    select: {
      household: {
        select: {
          location: true,
        },
      },
    },
  });

  const populationMap = new Map<string, number>();
  for (const profile of profilesForSitio) {
    const sitio = profile.household?.location ?? "Unknown";
    populationMap.set(sitio, (populationMap.get(sitio) ?? 0) + 1);
  }

  const populationPerSitio = Array.from(populationMap.entries())
    .map(([sitio, population]) => ({ sitio, population }))
    .sort((a, b) => a.sitio.localeCompare(b.sitio));

  const events = await db.events.findMany({
    where: {
      start: {
        gte: yearStart,
        lt: yearEnd,
      },
    },
    orderBy: { start: "asc" },
  });

  const gallery = await db.fileNode.findMany({
    where: {
      icon: "image",
      date: {
        gte: yearStart,
        lt: yearEnd,
      },
    },
  });

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Showing dashboard data for {activeYear}
          </p>
        </div>
        <DashboardYearSelect selectedYear={activeYear} years={availableYears} />
      </div>
      <AnalyticsCard
        totalPopulation={totalPopulation}
        newMothers={newMothers}
        ipsMembers={ipsMembers}
        fourPsMembers={fourPsMembers}
        pwdMembers={pwdMembers}
      />
      <div className="mt-5 grid lg:grid-cols-5 grid-cols-1 gap-5">
        <div className="lg:col-span-3">
          <PopulationPerSitio
            populationPerSitio={populationPerSitio}
            year={activeYear}
          />
        </div>
        <div className="lg:col-span-2">
          <SitioPopulationPercentage
            populationPerSitio={populationPerSitio}
            year={activeYear}
          />
        </div>
      </div>
      <div className="mt-5 grid lg:grid-cols-5 grid-cols-1 gap-5">
        <div className="lg:col-span-2">
          <UpcomingEvents events={events} />
        </div>
        <div className="lg:col-span-3">
          <DiseaseDemographics year={activeYear} />
        </div>
      </div>
      <div className="mt-5">
        <GalleryDocumentation gallery={gallery} />
      </div>
    </div>
  );
};

export default Page;
