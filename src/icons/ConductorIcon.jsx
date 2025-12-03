import React from 'react';
export default function ConductorIcon({ size=24, color='currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="8" r="3" stroke={color} strokeWidth="1.6" />
      <path d="M5 21c1.5-4 5-6 7-6s5.5 2 7 6" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
