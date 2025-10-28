"use client";

import React, { useState } from "react";
import { VideoPlayer } from "../../_components/video-player";
import { ProgramDetails } from "../../_components/program-details";
import { InstructorProfile } from "../../_components/instructor-profile";
import { ProgramCurriculum } from "../../_components/program-curriculum";
import { ProgramHeader } from "../../_components/program-header";
import { HealthProgramWithSections } from "@/types";

const Client = ({ data }: { data: HealthProgramWithSections }) => {
  const [selectedSection, setSelectedSection] = useState(
    data.sections[0] || null
  );
  return (
    <div>
      <ProgramHeader title={data.title} />
      <main className="py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <VideoPlayer section={selectedSection} />
            <ProgramDetails program={data} />
            <InstructorProfile program={data} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProgramCurriculum
              program={data}
              selectedSection={selectedSection}
              onSelectSection={setSelectedSection}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Client;
