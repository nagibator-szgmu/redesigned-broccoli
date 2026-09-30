import React from 'react';

/**
 * Base SVG Icon wrapper for MedSim unified 2.0px stroke icons.
 */
export default function IconBase({
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
  style = {},
  children,
  ...props
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0, display: 'block', ...style }}
      {...props}
    >
      {children}
    </svg>
  );
}
