import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { PageLoading } from '../../components/LoadingSpinner'

// Dynamically import the heavy client component
const AdminClient = dynamic(() => import('./AdminClient'), {
  loading: () => <PageLoading />,
  ssr: false
})

export default function AdminPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <AdminClient />
    </Suspense>
  )
} 