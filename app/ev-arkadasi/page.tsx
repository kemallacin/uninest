import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { PageLoading } from '../../components/LoadingSpinner'

// Dynamically import the heavy client component
const EvArkadasiClient = dynamic(() => import('./EvArkadasiClient'), {
  loading: () => <PageLoading />,
  ssr: false
})

export default function EvArkadasiPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <EvArkadasiClient />
    </Suspense>
  )
}