import React from 'react';

const UKFlag = ({ className = 'w-8 h-8' }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="6" fill="#00247D"/>
    <path d="M0 0L32 32M32 0L0 32" stroke="#fff" strokeWidth="5"/>
    <path d="M0 0L32 32M32 0L0 32" stroke="#CF142B" strokeWidth="2"/>
    <rect x="13" width="6" height="32" fill="#fff"/>
    <rect y="13" width="32" height="6" fill="#fff"/>
    <rect x="14.5" width="3" height="32" fill="#CF142B"/>
    <rect y="14.5" width="32" height="3" fill="#CF142B"/>
  </svg>
);

export default UKFlag; 