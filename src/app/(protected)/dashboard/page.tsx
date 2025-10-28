import React from "react";
import { AnalyticsCard } from "@/components/globals/analytics-card";
import { PopulationPerSitio } from "@/components/globals/total-population-count";
import { SitioPopulationPercentage } from "@/components/globals/total-population-pie";
import { DiseaseDemographics } from "@/components/globals/disease-demographics";
import UpcomingEvents from "@/components/globals/upcoming-events";
import GalleryDocumentation from "@/components/globals/gallery-documentation";
import db from "@/lib/db";

const Page = async () => {
  const totalPopulation = await db.profile.count();

  const newMothers = await db.profile.count({
    where: { areYouPregnant: true },
  });

  const ipsMembers = await db.profile.count({
    where: { areYouIps: true },
  });

  const fourPsMembers = await db.profile.count({
    where: { areYou4ps: true },
  });

  const pwdMembers = await db.profile.count({
    where: { areYouPwd: true },
  });

  const sitioData = await db.houseHold.findMany({
    select: {
      location: true,
      profiles: { select: { id: true } },
    },
  });

  const populationPerSitio = sitioData.map((sitio) => ({
    sitio: sitio.location ?? "Unknown",
    population: sitio.profiles.length,
  }));

  const events = await db.events.findMany({
    orderBy: { start: "asc" },
  });

  const gallery = await db.fileNode.findMany({
    where: {
      icon: "image",
    },
  });

  return (
    <div>
      <AnalyticsCard
        totalPopulation={totalPopulation}
        newMothers={newMothers}
        ipsMembers={ipsMembers}
        fourPsMembers={fourPsMembers}
        pwdMembers={pwdMembers}
      />
      <div className="mt-5 grid lg:grid-cols-5 grid-cols-1 gap-5">
        <div className="lg:col-span-3">
          <PopulationPerSitio populationPerSitio={populationPerSitio} />
        </div>
        <div className="lg:col-span-2">
          <SitioPopulationPercentage populationPerSitio={populationPerSitio} />
        </div>
      </div>
      <div className="mt-5 grid lg:grid-cols-5 grid-cols-1 gap-5">
        <div className="lg:col-span-2">
          <UpcomingEvents events={events} />
        </div>
        <div className="lg:col-span-3">
          <DiseaseDemographics />
        </div>
      </div>
      <div className="mt-5">
        <GalleryDocumentation gallery={gallery} />
      </div>
    </div>
  );
};

export default Page;
