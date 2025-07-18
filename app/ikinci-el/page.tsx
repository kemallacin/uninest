import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { PageLoading } from '../../components/LoadingSpinner'

// Dynamically import the heavy client component
const IkinciElClient = dynamic(() => import('./IkinciElClient'), {
  loading: () => <PageLoading />,
  ssr: false
})

export default function IkinciElPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <IkinciElClient />
    </Suspense>
  )
} 