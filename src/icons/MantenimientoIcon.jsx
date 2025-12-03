import React from 'react';
export default function MantenimientoIcon({ size=24, color='currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M21 3l-6 6" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M14 6l4 4" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M3 21l6-6" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
