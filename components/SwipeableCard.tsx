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
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setStartX(touch.clientX)
    setStartY(touch.clientY)
    setCurrentX(touch.clientX)
    setCurrentY(touch.clientY)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const touch = e.touches[0]
    setCurrentX(touch.clientX)
    setCurrentY(touch.clientY)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    const deltaX = currentX - startX
    const deltaY = currentY - startY
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Determine swipe direction
    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
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

  const transform = isDragging
    ? `translate(${currentX - startX}px, ${currentY - startY}px)`
    : ''

  return (
    <div
      ref={cardRef}
      className={`touch-manipulation select-none ${className}`}
      style={{
        transform,
        transition: isDragging ? 'none' : 'transform 0.2s ease-out'
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