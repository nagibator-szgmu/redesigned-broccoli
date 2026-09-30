import React from 'react';
import IconBase from './IconBase';

export function IconSearch({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.3 15.3 20 20" />
    </IconBase>
  );
}

export function IconMenu({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </IconBase>
  );
}

export function IconClock({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.5 1.5" />
    </IconBase>
  );
}

export function IconRefresh({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M4.5 12a7.5 7.5 0 0 1 12.6-5.5l1.9 1.8" />
      <path d="M19.5 4.5v4.3h-4.3" />
      <path d="M19.5 12a7.5 7.5 0 0 1-12.6 5.5l-1.9-1.8" />
      <path d="M4.5 19.5v-4.3h4.3" />
    </IconBase>
  );
}

export function IconUser({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.6-3.6 3.3-5.8 7-5.8s6.4 2.2 7 5.8" />
    </IconBase>
  );
}

export function IconGear({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v2.3M12 18.2v2.3M20.5 12h-2.3M5.8 12H3.5M17.8 6.2l-1.6 1.6M7.8 16.2l-1.6 1.6M17.8 17.8l-1.6-1.6M7.8 7.8 6.2 6.2" />
    </IconBase>
  );
}

export function IconBell({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M6 17v-5.5a6 6 0 1 1 12 0V17l1.5 2H4.5Z" />
      <path d="M10.3 20.5a1.8 1.8 0 0 0 3.4 0" />
    </IconBase>
  );
}

export function IconLock({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <circle cx="12" cy="15" r="1.1" fill={color} stroke="none" />
    </IconBase>
  );
}

export function IconLogOut({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M11 19.5H6a1.5 1.5 0 0 1-1.5-1.5V6A1.5 1.5 0 0 1 6 4.5h5" />
      <path d="M15.5 8.5 19.5 12l-4 3.5" />
      <path d="M19.5 12H9.5" />
    </IconBase>
  );
}

export function IconPlay({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M7 5.3v13.4a1 1 0 0 0 1.5.9l11-6.7a1 1 0 0 0 0-1.8l-11-6.7A1 1 0 0 0 7 5.3Z" />
    </IconBase>
  );
}

export function IconPause({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M8.5 5.5v13" />
      <path d="M15.5 5.5v13" />
    </IconBase>
  );
}

export function IconVolume2({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M4 10v4h3.5l4.3 4V6l-4.3 4Z" />
      <path d="M16.3 9.5a3.5 3.5 0 0 1 0 5" />
      <path d="M18.7 7.2a7 7 0 0 1 0 9.6" />
    </IconBase>
  );
}

export function IconVolumeX({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M4 10v4h3.5l4.3 4V6l-4.3 4Z" />
      <path d="M16 10.5l4.5 4.5M20.5 10.5 16 15" />
    </IconBase>
  );
}
