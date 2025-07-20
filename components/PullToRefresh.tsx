'use client'

import React, { useState, useRef, useEffect } from 'react'

interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh: () => Promise<void>
  threshold?: number
  className?: string
  disabled?: boolean
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  threshold = 80,
  className = '',
  disabled = false
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const currentY = useRef(0)

  const handleTouchStart = (e: TouchEvent) => {
    if (disabled || containerRef.current?.scrollTop !== 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (disabled || !isPulling || isRefreshing) return;

    currentY.current = e.touches[0].clientY;
    const distance = Math.max(0, currentY.current - startY.current)
    
    if (distance > 0) {
      e.preventDefault()
      setPullDistance(distance * 0.5) // Damping factor
    }
  }

  const handleTouchEnd = async () => {
    if (disabled || !isPulling || isRefreshing) return;

    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } catch (error) {
        console.error('Refresh failed:', error)
      } finally {
        setIsRefreshing(false)
      }
    }

    setIsPulling(false)
    setPullDistance(0)
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, isRefreshing, pullDistance, threshold, disabled]);

  const showIndicator = pullDistance > 0 || isRefreshing
  const progress = Math.min(pullDistance / threshold, 1)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Pull indicator */}
      {showIndicator && (
        <div 
          className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-200"
          style={{
            height: `${Math.max(60, pullDistance)}px`,
            transform: `translateY(${isRefreshing ? 0 : -60 + pullDistance}px)`
          }}
        >
          <div className="flex items-center space-x-3">
            {isRefreshing ? (
              <>
                <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-primary-600 font-medium">Yenileniyor...</span>
              </>
            ) : (
              <>
                <div 
                  className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full"
                  style={{
                    transform: `rotate(${progress * 180}deg)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                ></div>
                <span className="text-primary-600 font-medium">
                  {progress >= 1 ? 'Bırakın yenilemek için' : 'Aşağı çekin'}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div 
        ref={containerRef}
        className="h-full overflow-auto"
        style={{
          transform: showIndicator ? `translateY(${pullDistance}px)` : 'none',
          transition: isRefreshing ? 'transform 0.3s ease-out' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default PullToRefresh 