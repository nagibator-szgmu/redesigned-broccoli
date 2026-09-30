import React from 'react';
import IconBase from './IconBase';

export function IconArrowLeft({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </IconBase>
  );
}

export function IconArrowRight({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </IconBase>
  );
}

export function IconChevronDown({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M6 9l6 6 6-6" />
    </IconBase>
  );
}

export function IconChevronUp({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M18 15l-6-6-6 6" />
    </IconBase>
  );
}

export function IconChevronLeft({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M15 18l-6-6 6-6" />
    </IconBase>
  );
}

export function IconChevronRight({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M9 18l6-6-6-6" />
    </IconBase>
  );
}
