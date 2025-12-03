import React from 'react';
export default function DashboardIcon({ size=24, color='currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="3" width="8" height="8" rx="1" stroke={color} strokeWidth="1.6"/>
      <rect x="13" y="3" width="8" height="5" rx="1" stroke={color} strokeWidth="1.6"/>
      <rect x="13" y="10" width="8" height="11" rx="1" stroke={color} strokeWidth="1.6"/>
      <rect x="3" y="13" width="8" height="8" rx="1" stroke={color} strokeWidth="1.6"/>
    </svg>
  );
}
