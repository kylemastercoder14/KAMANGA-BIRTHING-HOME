import React, { Suspense } from 'react'
import { FileManager } from './_components/file-manager'

const Page = () => {
  return (
	<Suspense fallback={<div>Loading...</div>}>
	  <FileManager />
	</Suspense>
  )
}

export default Page
