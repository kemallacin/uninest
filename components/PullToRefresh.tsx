'use client'

import React from 'react'

interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh?: () => Promise<void> | void
  className?: string
  disabled?: boolean
}

// Simplified PullToRefresh: no interception, just passthrough.
// Mobile browsers already implement native pull-to-refresh; this avoids touch conflicts.
export default function PullToRefreshPassthrough({ children, className = '' }: PullToRefreshProps) {
  return <div className={className}>{children}</div>
} 