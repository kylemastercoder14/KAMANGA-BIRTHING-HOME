import React from "react";
import { AnalyticsCard } from "@/components/globals/analytics-card";
import { PopulationPerSitio } from "@/components/globals/total-population-count";
import { SitioPopulationPercentage } from "@/components/globals/total-population-pie";
import { DiseaseDemographics } from "@/components/globals/disease-demographics";
import UpcomingEvents from "@/components/globals/upcoming-events";
import GalleryDocumentation from "@/components/globals/gallery-documentation";

const Page = () => {
  return (
    <div>
      <AnalyticsCard />
      <div className="mt-5 grid lg:grid-cols-5 grid-cols-1 gap-5">
        <div className="lg:col-span-3">
          <PopulationPerSitio />
        </div>
        <div className="lg:col-span-2">
          <SitioPopulationPercentage />
        </div>
      </div>
      <div className="mt-5 grid lg:grid-cols-5 grid-cols-1 gap-5">
        <div className="lg:col-span-2">
          <UpcomingEvents />
        </div>
        <div className="lg:col-span-3">
          <DiseaseDemographics />
        </div>
      </div>
      <div className="mt-5">
        <GalleryDocumentation />
      </div>
    </div>
  );
};

export default Page;
