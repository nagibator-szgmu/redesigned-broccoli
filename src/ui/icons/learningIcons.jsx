import React from 'react';
import IconBase from './IconBase';

export function IconTheory({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M3.5 6.2c2.5-1.4 5.4-1.4 8 0v13c-2.6-1.4-5.5-1.4-8 0Z" />
      <path d="M20.5 6.2c-2.5-1.4-5.4-1.4-8 0v13c2.6-1.4 5.5-1.4 8 0Z" />
      <path d="M15.3 5.2v5.5l1.5-1 1.5 1V5.2" />
    </IconBase>
  );
}

export function IconBook({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M4 5.5c2.4-1.2 5.3-1.2 8 .3 2.7-1.5 5.6-1.5 8-.3v13c-2.4-1.2-5.3-1.2-8 .3-2.7-1.5-5.6-1.5-8-.3Z" />
      <path d="M12 5.8v13" />
    </IconBase>
  );
}

export function IconTarget({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2" />
    </IconBase>
  );
}

export function IconMap({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M4 6.5 9 4l6 2.3 5-2.3v14l-5 2.3L9 18l-5 2.3Z" />
      <path d="M9 4v14M15 6.3v14" />
      <circle cx="9" cy="9.5" r="1" fill={color} stroke="none" />
      <circle cx="15" cy="13.5" r="1" fill={color} stroke="none" />
      <circle cx="9" cy="16.5" r="1" fill={color} stroke="none" />
    </IconBase>
  );
}

export function IconRoute({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 6h5a3 3 0 0 1 3 3v2.5" />
      <path d="M16 15.5V18h-3.5a3 3 0 0 1-3-3V9" />
    </IconBase>
  );
}

export function IconShield({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M12 3.5 19 6v5.5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z" />
      <path d="M12 8.5v6M9 11.5h6" />
    </IconBase>
  );
}

export function IconFileText({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M6.5 3.5h8l4 4V20a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M14.5 3.5V7a1 1 0 0 0 1 1h3.5" />
      <path d="M8.5 12.5h7M8.5 15.5h7M8.5 18.5h4.5" />
    </IconBase>
  );
}

export function IconScale({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M12 3.5v17" />
      <path d="M7 6.5h10" />
      <path d="M9 20.5h6" />
      <path d="M7 6.5 3.5 12.8a3.6 3.6 0 0 0 7 0Z" />
      <path d="M17 6.5 13.5 12.8a3.6 3.6 0 0 0 7 0Z" />
    </IconBase>
  );
}
