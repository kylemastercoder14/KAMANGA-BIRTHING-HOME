import React, { Suspense } from 'react'
import { FileManager } from './_components/file-manager'
import { useUser } from '@/hooks/use-user'

const Page = async () => {
  const { user } = await useUser()
  return (
	<Suspense fallback={<div>Loading...</div>}>
	  <FileManager userRole={user?.role} />
	</Suspense>
  )
}

export default Page
