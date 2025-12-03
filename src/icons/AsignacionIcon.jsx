import React from 'react';
export default function AsignacionIcon({ size=24, color='currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 2v6l4 2" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="3" y="10" width="18" height="11" rx="2" stroke={color} strokeWidth="1.6"/>
    </svg>
  );
}
