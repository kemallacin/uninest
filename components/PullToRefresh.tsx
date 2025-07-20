'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'

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
  const containerRef = useRef<HTMLDivElement>(null)
  const gestureState = useRef({
    startY: 0,
    startX: 0,
    isPulling: false,
    direction: 'initial' as 'initial' | 'vertical' | 'horizontal'
  }).current

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const container = containerRef.current;
    if (disabled || !container || container.scrollTop !== 0) {
      return;
    }
    gestureState.startY = e.touches[0].clientY;
    gestureState.startX = e.touches[0].clientX;
    gestureState.isPulling = true;
    gestureState.direction = 'initial';
  }, [disabled, gestureState]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!gestureState.isPulling || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = currentY - gestureState.startY;
    const deltaX = currentX - gestureState.startX;

    if (gestureState.direction === 'initial') {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        gestureState.direction = 'horizontal';
      } else {
        gestureState.direction = 'vertical';
      }
    }

    if (gestureState.direction === 'horizontal') {
      gestureState.isPulling = false; // Yatay kaydırma, pull işlemini iptal et
      return;
    }

    // Yalnızca dikey ve aşağı doğru çekme hareketi ise devam et
    if (deltaY > 0) {
      e.preventDefault();
      const distance = Math.max(0, deltaY);
      setPullDistance(distance * 0.5); // Damping factor
    }
  }, [isRefreshing, gestureState]);

  const handleTouchEnd = useCallback(async () => {
    if (!gestureState.isPulling || isRefreshing) {
        // Durumu sıfırla, isPulling zaten false olabilir
        gestureState.isPulling = false;
        gestureState.direction = 'initial';
        return;
    };

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

    gestureState.isPulling = false
    gestureState.direction = 'initial';
    setPullDistance(0)
  }, [isRefreshing, pullDistance, threshold, onRefresh, gestureState]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [disabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  const showIndicator = pullDistance > 0 || isRefreshing
  const progress = Math.min(pullDistance / threshold, 1)

  return (
    <div className={`relative ${className}`}>
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
        className="h-full overflow-y-auto"
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