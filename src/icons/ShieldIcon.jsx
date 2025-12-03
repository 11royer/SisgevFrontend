// ShieldIcon.jsx
import React from 'react';

export default function ShieldIcon({ size = 96, color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M32 2L58 12v11c0 18-11 34-26 39C15 57 4 41 4 23V12L32 2z" fill={color}/>
      <circle cx="32" cy="24" r="7" fill="#fff" />
      <path d="M20 44c4 4 12 6 12 6s8-2 12-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
