import React from "react";
import { AnalyticsCard } from "@/components/globals/analytics-card";
import { AgeDemographics } from "@/components/globals/age-demographics";
import { CategoryDemographics } from "@/components/globals/category-demographics";
import { DiseaseDemographics } from '@/components/globals/disease-demographics';
import UpcomingEvents from "@/components/globals/upcoming-events";

const Page = () => {
  return (
    <div>
      <AnalyticsCard />
      <div className="mt-5 grid lg:grid-cols-5 grid-cols-1 gap-5">
        <div className="lg:col-span-3">
          <AgeDemographics />
        </div>
        <div className="lg:col-span-2">
          <CategoryDemographics />
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
    </div>
  );
};

export default Page;
