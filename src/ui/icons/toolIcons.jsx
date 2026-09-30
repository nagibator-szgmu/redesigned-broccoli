import React from 'react';
import IconBase from './IconBase';

export function IconStethoscope({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <circle cx="7.2" cy="4" r="1.2" />
      <circle cx="10.6" cy="4" r="1.2" />
      <path d="M7.2 5.2v2.6a2.7 2.7 0 0 0 2.7 2.7 2.7 2.7 0 0 0 2.7-2.7V5.2" />
      <path d="M10.6 10.5v2.7a4.3 4.3 0 0 0 4.3 4.3h.6" />
      <circle cx="17.5" cy="17.5" r="2.3" />
      <circle cx="17.5" cy="17.5" r="0.7" fill={color} stroke="none" />
    </IconBase>
  );
}

export function IconMicroscope({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M6 3h5M8.5 3v13a2.5 2.5 0 0 0 5 0V3M11 3h5" />
      <path d="M8.5 7h2M8.5 10h2M8.5 13h2" />
      <path d="M18 7v6a2 2 0 0 1-2 2h-1" />
      <path d="M18 4l2-2" />
    </IconBase>
  );
}

export function IconXRay({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
      <path d="M12 6.5v11" />
      <path d="M12 8.2c-1.9 0-3.5.8-4 2.5M12 8.2c1.9 0 3.5.8 4 2.5" />
      <path d="M12 11.2c-2.1 0-3.9.9-4.4 2.7M12 11.2c2.1 0 3.9.9 4.4 2.7" />
      <path d="M12 14.2c-1.7 0-3.1.7-3.6 2.1M12 14.2c1.7 0 3.1.7 3.6 2.1" />
    </IconBase>
  );
}

export function IconVial({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M7.5 3.5 20.5 16.5a2.9 2.9 0 0 1-4.1 4.1L3.4 7.6" />
      <path d="M5.6 5.6 9.4 9.4" />
      <path d="M10 13.3 13.8 17.1" />
      <path d="M12.6 10.5 15 12.9" />
      <path d="M14.8 8.3 16.5 10" />
    </IconBase>
  );
}

export function IconSyringe({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M20.5 3.5 17 7" />
      <path d="M18.7 5.2 16 7.9" />
      <path d="M15.5 6.4l2.1 2.1-6.9 6.9-2.5-.4-.4-2.5 6.9-6.9z" />
      <path d="M12.3 9.6l2.1 2.1" />
      <path d="M10.1 11.8l2.1 2.1" />
      <path d="M7.8 15.5 4 19.3" />
      <path d="M6 17.3 4.8 18.5" />
    </IconBase>
  );
}

export function IconPill({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <rect x="3.8" y="10.2" width="16.4" height="7.2" rx="3.6" transform="rotate(-40 12 13.8)" />
      <path d="M9.6 8.7 15.3 18.9" />
    </IconBase>
  );
}

export function IconClipboard({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <rect x="5" y="4.5" width="14" height="17" rx="2" />
      <path d="M9.5 4.5a2.5 2.5 0 0 1 5 0" />
      <rect x="9.3" y="3.2" width="5.4" height="2.6" rx="1" />
      <path d="M8.5 12h7M8.5 15h7M8.5 18h4.5" />
    </IconBase>
  );
}

export function IconThermometer({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M12 4a1.8 1.8 0 0 0-1.8 1.8v8.4a3.2 3.2 0 1 0 3.6 0V5.8A1.8 1.8 0 0 0 12 4Z" />
      <path d="M14.2 7.5h1.6M14.2 10h1.6M14.2 12.5h1.6" />
      <circle cx="12" cy="17.2" r="1.4" fill={color} stroke="none" />
    </IconBase>
  );
}
