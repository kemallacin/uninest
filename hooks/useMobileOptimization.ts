import { useState, useEffect } from 'react'

interface MobileOptimizationReturn {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLandscape: boolean
  isPortrait: boolean
  screenWidth: number
  screenHeight: number
  isTouchDevice: boolean
  isLowBandwidth: boolean
  isReducedMotion: boolean
}

export const useMobileOptimization = (): MobileOptimizationReturn => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)
  const [isPortrait, setIsPortrait] = useState(false)
  const [screenWidth, setScreenWidth] = useState(0)
  const [screenHeight, setScreenHeight] = useState(0)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isLowBandwidth, setIsLowBandwidth] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setScreenWidth(width)
      setScreenHeight(height)
      
      // Device type detection
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setIsDesktop(width >= 1024)
      
      // Orientation detection
      setIsLandscape(width > height)
      setIsPortrait(height > width)
    }

    // Touch device detection
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }

    // Low bandwidth detection
    const checkLowBandwidth = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        setIsLowBandwidth(
          connection.effectiveType === 'slow-2g' ||
          connection.effectiveType === '2g' ||
          connection.effectiveType === '3g' ||
          connection.saveData
        )
      }
    }

    // Reduced motion detection
    const checkReducedMotion = () => {
      setIsReducedMotion(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      )
    }

    // Initial setup
    updateDimensions()
    checkTouchDevice()
    checkLowBandwidth()
    checkReducedMotion()

    // Event listeners
    window.addEventListener('resize', updateDimensions)
    window.addEventListener('orientationchange', updateDimensions)

    // Media query listeners
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionQuery.addEventListener('change', checkReducedMotion)

    return () => {
      window.removeEventListener('resize', updateDimensions)
      window.removeEventListener('orientationchange', updateDimensions)
      reducedMotionQuery.removeEventListener('change', checkReducedMotion)
    }
  }, [])

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLandscape,
    isPortrait,
    screenWidth,
    screenHeight,
    isTouchDevice,
    isLowBandwidth,
    isReducedMotion
  }
}

// Utility functions
export const getOptimalImageSize = (screenWidth: number): string => {
  if (screenWidth < 480) return 'small'
  if (screenWidth < 768) return 'medium'
  if (screenWidth < 1024) return 'large'
  return 'xlarge'
}

export const shouldLazyLoad = (isLowBandwidth: boolean, isMobile: boolean): boolean => {
  return isLowBandwidth || isMobile
}

export const getAnimationDuration = (isReducedMotion: boolean, isLowBandwidth: boolean): number => {
  if (isReducedMotion) return 0
  if (isLowBandwidth) return 200
  return 300
} 