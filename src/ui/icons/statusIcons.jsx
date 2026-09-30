import React from 'react';
import IconBase from './IconBase';

export function IconCheck({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
    </IconBase>
  );
}

export function IconCheckCircle({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.3 10.8 14.6 15.5 9.7" />
    </IconBase>
  );
}

export function IconX({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </IconBase>
  );
}

export function IconXCircle({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.3 9.3l5.4 5.4M14.7 9.3l-5.4 5.4" />
    </IconBase>
  );
}

export function IconAlertTriangle({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M12 3.8 21 19.5H3Z" />
      <path d="M12 9.5v4.3" />
      <circle cx="12" cy="16.8" r="0.9" fill={color} stroke="none" />
    </IconBase>
  );
}
