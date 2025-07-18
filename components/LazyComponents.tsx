import React, { Suspense, lazy } from 'react'
import LoadingSpinner from './LoadingSpinner'

// Lazy loaded components
const MapComponent = lazy(() => import('./MapComponent'))
const LeafletMap = lazy(() => import('./LeafletMap'))
const SecondHandForm = lazy(() => import('./SecondHandForm'))
const AuthModal = lazy(() => import('./AuthModal'))

// Lazy loading wrapper component
interface LazyComponentProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export const LazyWrapper: React.FC<LazyComponentProps> = ({ 
  children, 
  fallback = <LoadingSpinner size="md" text="Yükleniyor..." />,
  className = ""
}) => {
  return (
    <Suspense fallback={fallback}>
      <div className={className}>
        {children}
      </div>
    </Suspense>
  )
}

// Specific lazy components
export const LazyMapComponent: React.FC<any> = (props) => (
  <LazyWrapper>
    <MapComponent {...props} />
  </LazyWrapper>
)

export const LazyLeafletMap: React.FC<any> = (props) => (
  <LazyWrapper>
    <LeafletMap {...props} />
  </LazyWrapper>
)

export const LazySecondHandForm: React.FC<any> = (props) => (
  <LazyWrapper>
    <SecondHandForm {...props} />
  </LazyWrapper>
)

export const LazyAuthModal: React.FC<any> = (props) => (
  <LazyWrapper>
    <AuthModal {...props} />
  </LazyWrapper>
)

// Dynamic import utility
export const dynamicImport = (importFn: () => Promise<any>) => {
  return lazy(importFn)
}

// Preload utility
export const preloadComponent = (importFn: () => Promise<any>) => {
  return () => {
    importFn()
  }
}

// Example usage:
// const LazyHeavyComponent = dynamicImport(() => import('./HeavyComponent'))
// const preloadHeavyComponent = preloadComponent(() => import('./HeavyComponent')) 