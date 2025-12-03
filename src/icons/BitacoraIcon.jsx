import React from 'react';
export default function BitacoraIcon({ size=24, color='currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" stroke={color} strokeWidth="1.6" />
      <path d="M7 8h10" stroke={color} strokeWidth="1.6" />
      <path d="M7 12h10" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}
