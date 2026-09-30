import React from 'react';
import IconBase from './IconBase';

export function IconActivity({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M3 12h3.2l1.3-2 1.6 1.3.9-4.8 2 8.6 1.5-4.3 1.2 1.2H21" />
    </IconBase>
  );
}

export function IconDroplet({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M12 3.5c2.6 3.4 5.8 7.6 5.8 11a5.8 5.8 0 1 1-11.6 0c0-3.4 3.2-7.6 5.8-11Z" />
    </IconBase>
  );
}

export function IconWind({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M3.5 8h11a2.3 2.3 0 1 0-2.3-2.3" />
      <path d="M3.5 12.5h14.7a2.3 2.3 0 1 1-2.3 2.3" />
      <path d="M3.5 17h8.8a2.3 2.3 0 1 1-2.3 2.3" />
    </IconBase>
  );
}

export function IconFlame({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M12 3.5c1.2 2.3-.3 3.6-1.3 4.8-1.3 1.6-2.2 3.1-2.2 5.1a3.5 3.5 0 0 0 3 3.4c-.6-1-.7-2 0-3 .4 1.4 1.3 2 2.2 2.6a3.7 3.7 0 0 0 2.3-3.4c0-1.6-.8-2.6-1.6-3.6.2 1.3-.2 2-1 2.4.3-2.7-.4-5.2-1.4-8.3Z" />
    </IconBase>
  );
}

export function IconSkull({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M6.2 11.5a5.8 5.8 0 1 1 11.6 0c0 1.9-.8 3-1.6 4-.5.6-.8 1.1-.8 1.9v.6a1.3 1.3 0 0 1-1.3 1.3H9.9a1.3 1.3 0 0 1-1.3-1.3v-.6c0-.8-.3-1.3-.8-1.9-.8-1-1.6-2.1-1.6-4Z" />
      <path d="M9.3 11.5c0 1.2-.6 2.1-1.4 2.1s-1.4-.9-1.4-2.1.6-2.1 1.4-2.1 1.4.9 1.4 2.1Z" />
      <path d="M16.5 11.5c0 1.2-.6 2.1-1.4 2.1s-1.4-.9-1.4-2.1.6-2.1 1.4-2.1 1.4.9 1.4 2.1Z" />
      <path d="M10.8 17.3v1.6M12 17.3v1.6M13.2 17.3v1.6" />
    </IconBase>
  );
}

export function IconTrendingUp({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M3.5 16 9 10.5l3.5 3.5L20.5 6" />
      <path d="M14.5 6h6v6" />
    </IconBase>
  );
}

export function IconTrendingDown({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M3.5 8 9 13.5l3.5-3.5L20.5 18" />
      <path d="M14.5 18h6v-6" />
    </IconBase>
  );
}

export function IconEye({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M3 12s3.5-6.5 9-6.5S21 12 21 12s-3.5 6.5-9 6.5S3 12 3 12Z" />
      <circle cx="12" cy="12" r="2.6" />
      <circle cx="12" cy="12" r="0.9" fill={color} stroke="none" />
    </IconBase>
  );
}

export function IconSiren({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M8.5 14v-2a3.5 3.5 0 1 1 7 0v2" />
      <path d="M6.5 14h11a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V15a1 1 0 0 1 1-1Z" />
      <path d="M6.5 19.5h11" />
      <path d="M12 5.3V3.5" />
      <path d="M17.2 6.3l1.3-1.3M6.8 6.3 5.5 5" />
      <path d="M19.5 10.5h1.8M2.7 10.5h1.8" />
    </IconBase>
  );
}
