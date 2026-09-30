import React from 'react';
import IconBase from './IconBase';

export function IconCardiac({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M12 20.2c-4-2.6-7.5-5.9-7.5-9.9A4.3 4.3 0 0 1 12 7.1a4.3 4.3 0 0 1 7.5 3.2c0 4-3.5 7.3-7.5 9.9z" />
      <path d="M6.2 12h2.3l1.3-2.6 2 5.2 1.3-2.6h4.7" />
    </IconBase>
  );
}

export function IconNeuro({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <circle cx="8.5" cy="9" r="2.6" />
      <path d="M6.4 7.2 4.2 5.3M6 8.7 3 8.3M6.6 10.8 4 12.5" />
      <path d="M11 9.8 17 15" />
      <path d="M17 15 20.2 13.3M17 15 20.4 15.6M17 15 19 18.4" />
    </IconBase>
  );
}

export function IconBrain({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M9.3 4.4c-1.9 0-3.4 1.5-3.4 3.3 0 .6.1 1.1.4 1.6-1 .6-1.6 1.7-1.6 2.9 0 1.4.9 2.6 2.1 3.1-.1.3-.1.6-.1 1 0 1.9 1.5 3.4 3.4 3.4.9 0 1.7-.3 2.3-.9.5.4 1.2.7 1.9.7 1.7 0 3-1.3 3-3 0-.3 0-.6-.1-.9 1.2-.5 2-1.7 2-3.1 0-1.1-.5-2.1-1.4-2.7.1-.3.2-.7.2-1.1 0-1.9-1.5-3.4-3.4-3.4-.5 0-.9.1-1.3.3-.7-.8-1.7-1.2-2.8-1.2-.6 0-1.2.1-1.7.4-.4-.2-.9-.4-1.5-.4Z" />
      <path d="M8.6 8.2c.9.5 1.9.5 2.8 0" />
      <path d="M9.3 12c1.3.7 2.7.7 4 0" />
      <path d="M13 6.4c.6.5.9 1.1 1 1.9" />
    </IconBase>
  );
}

export function IconRespiratory({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M12 3v6" />
      <path d="M12 7.5l-2.5 2.5M12 7.5l2.5 2.5" />
      <path d="M9.5 10l-2 2.5M14.5 10l2 2.5" />
      <path d="M9.5 10.5c-3 0-5 2-5 5.5 0 3 2 4.5 4.5 4.5 2 0 3-1.5 3-4" />
      <path d="M14.5 10.5c3 0 5 2 5 5.5 0 3-2 4.5-4.5 4.5-2 0-3-1.5-3-4" />
    </IconBase>
  );
}

export function IconInfectious({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <circle cx="12" cy="12" r="5" />
      <path d="M17 12h2.5M4.5 12H7M12 17v2.5M12 4.5V7" />
      <path d="M15.5 15.5 17.3 17.3M6.7 6.7 8.5 8.5M15.5 8.5 17.3 6.7M6.7 17.3 8.5 15.5" />
      <circle cx="20" cy="12" r="0.6" fill={color} stroke="none" />
      <circle cx="12" cy="20" r="0.6" fill={color} stroke="none" />
      <circle cx="4" cy="12" r="0.6" fill={color} stroke="none" />
      <circle cx="12" cy="4" r="0.6" fill={color} stroke="none" />
      <circle cx="17.7" cy="17.7" r="0.6" fill={color} stroke="none" />
      <circle cx="6.3" cy="6.3" r="0.6" fill={color} stroke="none" />
      <circle cx="17.7" cy="6.3" r="0.6" fill={color} stroke="none" />
      <circle cx="6.3" cy="17.7" r="0.6" fill={color} stroke="none" />
    </IconBase>
  );
}

export function IconEndocrine({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M19 12c-3-1-7-1-10 1-2.5 1.7-4 1-4.5-.5-.6-2 .5-3.5 2-4 3-1 7-1 10 1" />
      <path d="M18.5 12.5c.8.5 1.5 1.3 1.5 2.2 0 1.8-1.7 3.3-3.8 3.3-1.5 0-2.8-.7-3.4-1.8" />
      <path d="M8 12.5c2 0 4-.5 6-1.5" />
      <circle cx="16" cy="15" r="0.8" fill={color} stroke="none" />
    </IconBase>
  );
}

export function IconToxicology({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M9 3h6M10 3v3a2 2 0 0 1-.6 1.4L6.5 11c-1.2 1.3-1.5 2.5-1.5 4 0 3.5 3 6 7 6s7-2.5 7-6c0-1.5-.3-2.7-1.5-4l-2.9-3.6A2 2 0 0 1 14 6V3" />
      <path d="M10.5 15h3M12 13.5v3" />
      <circle cx="12" cy="11" r="0.8" fill={color} stroke="none" />
    </IconBase>
  );
}

export function IconGastro({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M10.5 3v4.5" />
      <path d="M10.5 7.5C8 7.5 6 9.5 6 12.5c0 4.5 3.5 8 8 8 3.5 0 5.5-2.5 5.5-5.5 0-3-2-4.5-4.5-4.5H13" />
      <path d="M13.5 10.5c1.8 0 3.2-.8 3.8-2.2.4-1.2.2-3.3-.3-5.3" />
      <path d="M15 20.5c2 0 3.5-1.5 3.5-3.5v-1.5" />
    </IconBase>
  );
}

export function IconAbdominal({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M8.3 4.3C6.9 5.3 6.2 7 6.2 9v6c0 3.3 2.6 6 5.8 6s5.8-2.7 5.8-6V9c0-2-.7-3.7-2.1-4.7" />
      <path d="M12 5v16" />
      <path d="M6.5 13h11" />
      <circle cx="12" cy="13" r="0.7" fill={color} stroke="none" />
    </IconBase>
  );
}

export function IconLiver({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M4.5 11c0-3.1 2.6-5.3 6-5.3 1.9 0 3.4 1 4.3 2.4 1.4-.7 3.1-.5 4.3.7 1.9 1.9 1.8 5.1-.3 6.9-1.6 1.4-3.9 2.1-6.5 2.1-4 0-7.8-1.6-7.8-5V11Z" />
      <path d="M9.8 6.4c.5 1.4.5 2.9 0 4.3" />
    </IconBase>
  );
}

export function IconKidneys({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M10.6 4.6c-2.7-.8-5.1 1.1-5.1 4 0 1.5.8 2.4 1.9 2.9-1.1.5-1.9 1.4-1.9 2.9 0 2.7 2.3 4.6 5 3.9" />
      <path d="M13.4 4.6c2.7-.8 5.1 1.1 5.1 4 0 1.5-.8 2.4-1.9 2.9 1.1.5 1.9 1.4 1.9 2.9 0 2.7-2.3 4.6-5 3.9" />
      <path d="M10.8 17.5c0 1.7.5 2.8 1.2 3.9" />
      <path d="M13.2 17.5c0 1.7-.5 2.8-1.2 3.9" />
    </IconBase>
  );
}

export function IconHospital({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M4.5 21V8.5a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1V21" />
      <path d="M4.5 21h15" />
      <path d="M12 9.5v4.5M9.75 11.75h4.5" />
      <path d="M10 21v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4" />
      <path d="M7.5 15.5h1.5M15 15.5h1.5" />
    </IconBase>
  );
}

export function IconAmbulance({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M3 17V11a1 1 0 0 1 1-1h9l4 4h1.5a1.5 1.5 0 0 1 1.5 1.5V17" />
      <path d="M3 17h1.6M9.5 17h5M19.5 17H21" />
      <path d="M9.5 10v6" />
      <circle cx="7" cy="17.3" r="1.8" />
      <circle cx="17" cy="17.3" r="1.8" />
      <path d="M9.8 5.5v3M8.3 7h3" />
      <path d="M6.2 12.7h2M7.2 11.7v2" />
    </IconBase>
  );
}

export function IconBed({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M2.5 20v-6.5a2 2 0 0 1 2-2h3.5l3.3-2.7a1.5 1.5 0 0 1 1-.3h4.7a1.5 1.5 0 0 1 1.5 1.5v3" />
      <path d="M2.5 15.5h16a2 2 0 0 1 2 2V20" />
      <path d="M3.5 20v-1.5M20.5 20v-1.5" />
      <path d="M18 4v6.5" />
      <path d="M16.6 4.3h2.8v2h-2.8z" />
    </IconBase>
  );
}

export const IconHeart = IconCardiac;
