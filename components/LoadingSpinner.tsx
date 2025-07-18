import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    primary: 'text-purple-500',
    white: 'text-white',
    gray: 'text-gray-500'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size]} ${colorClasses[color]}`} />
    </div>
  );
}

// Page loading component
export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <LoadingSpinner size="lg" color="primary" className="mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
      </div>
    </div>
  );
}

// Inline loading component
export function InlineLoading() {
  return (
    <div className="flex items-center justify-center py-4">
      <LoadingSpinner size="md" color="primary" />
    </div>
  );
} 