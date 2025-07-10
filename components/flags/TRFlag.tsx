import React from 'react';

const TRFlag = ({ className = 'w-8 h-8' }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="6" fill="#E30A17"/>
    {/* Ay */}
    <circle cx="14" cy="16" r="7" fill="#fff"/>
    <circle cx="16.5" cy="16" r="6" fill="#E30A17"/>
    {/* Yıldız */}
    <polygon points="22,16 20.755,16.809 21.224,15.404 20,14.5 21.51,14.5 22,13 22.49,14.5 24,14.5 22.776,15.404 23.245,16.809" fill="#fff"/>
  </svg>
);

export default TRFlag; 