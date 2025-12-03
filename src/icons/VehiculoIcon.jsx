import React from 'react';
export default function VehiculoIcon({ size=24, color='currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M3 12h1l2-4h10l2 4h1v5H3v-5z" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7.5" cy="17.5" r="1.5" fill={color} />
      <circle cx="16.5" cy="17.5" r="1.5" fill={color} />
    </svg>
  );
}
