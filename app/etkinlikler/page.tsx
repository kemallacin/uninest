import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { PageLoading } from '../../components/LoadingSpinner'

// Dynamically import the heavy client component
const EtkinliklerClient = dynamic(() => import('./EtkinliklerClient'), {
  loading: () => <PageLoading />,
  ssr: false
})

export default function EtkinliklerPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <EtkinliklerClient />
    </Suspense>
  )
}