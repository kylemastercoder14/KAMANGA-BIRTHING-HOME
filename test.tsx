import React from 'react'
import { ProgramHeader } from '../_components/program-header'
import { VideoPlayer } from '../_components/video-player'
import { ProgramDetails } from '../_components/program-details'
import { InstructorProfile } from '../_components/instructor-profile'
import { ProgramCurriculum } from '../_components/program-curriculum'

const Page = () => {
  return (
	 <div>
	  <ProgramHeader />
	  <main className="py-8">
		<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
		  <div className="space-y-8 lg:col-span-2">
			<VideoPlayer />
			<ProgramDetails />
			<InstructorProfile />
		  </div>

		  {/* Sidebar */}
		  <div className="lg:col-span-1">
			<ProgramCurriculum />
		  </div>
		</div>
	  </main>
	</div>
  )
}

export default Page
