'use client'

import React, { useState, useRef, useEffect } from 'react'

interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  className?: string
  disableHorizontalSwipe?: boolean // Horizontal scroll için özel durum
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className = '',
  disableHorizontalSwipe = false
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [isHorizontalScroll, setIsHorizontalScroll] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setStartX(touch.clientX)
    setStartY(touch.clientY)
    setCurrentX(touch.clientX)
    setCurrentY(touch.clientY)
    setIsDragging(true)
    setIsHorizontalScroll(false)
    
    // Horizontal scroll konteyner kontrolü
    const target = e.target as HTMLElement
    const scrollContainer = target.closest('.overflow-x-auto, .mobile-horizontal-scroll, [class*="overflow-x"]')
    if (scrollContainer && disableHorizontalSwipe) {
      setIsHorizontalScroll(true)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const touch = e.touches[0]
    const deltaX = touch.clientX - startX
    const deltaY = touch.clientY - startY
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    
    setCurrentX(touch.clientX)
    setCurrentY(touch.clientY)
    
    // Horizontal scroll container'da yatay kaydırma varsa swipe'ı engelle
    if (isHorizontalScroll && absDeltaX > absDeltaY) {
      return // Native scroll'a izin ver
    }
    
    // Eğer belirgin bir yön belirlendiyse sadece o yönde prevent et
    if (absDeltaX > 10 || absDeltaY > 10) {
      if (absDeltaX > absDeltaY && !isHorizontalScroll) {
        // Horizontal swipe - sadece scroll container değilse prevent et
        e.preventDefault()
      } else if (absDeltaY > absDeltaX) {
        // Vertical swipe - sayfa scroll'unu engelle
        e.preventDefault()
      }
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    const deltaX = currentX - startX
    const deltaY = currentY - startY
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Horizontal scroll container'da yatay kaydırma varsa swipe'ı engelle
    if (isHorizontalScroll && absDeltaX > absDeltaY) {
      setIsDragging(false)
      setCurrentX(0)
      setCurrentY(0)
      return
    }

    // Determine swipe direction
    if (absDeltaX > absDeltaY && absDeltaX > threshold && !disableHorizontalSwipe) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    } else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown()
      } else if (deltaY < 0 && onSwipeUp) {
        onSwipeUp()
      }
    }

    setIsDragging(false)
    setCurrentX(0)
    setCurrentY(0)
  }

  // Mouse events for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX)
    setStartY(e.clientY)
    setCurrentX(e.clientX)
    setCurrentY(e.clientY)
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setCurrentX(e.clientX)
    setCurrentY(e.clientY)
  }

  const handleMouseUp = () => {
    handleTouchEnd()
  }

  // Prevent text selection during drag
  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none'
    } else {
      document.body.style.userSelect = ''
    }

    return () => {
      document.body.style.userSelect = ''
    }
  }, [isDragging])

  // Transform'u sadece horizontal scroll yoksa uygula
  const transform = isDragging && !isHorizontalScroll
    ? `translate(${currentX - startX}px, ${currentY - startY}px)`
    : ''

  return (
    <div
      ref={cardRef}
      className={`select-none ${className}`}
      style={{
        transform,
        transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        touchAction: disableHorizontalSwipe ? 'pan-x pan-y' : 'manipulation'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
    </div>
  )
}

export default SwipeableCard 