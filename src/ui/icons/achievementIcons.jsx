import React from 'react';
import IconBase from './IconBase';

export function IconTrophy({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M7.5 4h9v5.5a4.5 4.5 0 0 1-9 0Z" />
      <path d="M7.5 5.5H5a2 2 0 0 0-2 2v.5a3.5 3.5 0 0 0 3.5 3.5h1" />
      <path d="M16.5 5.5H19a2 2 0 0 1 2 2v.5a3.5 3.5 0 0 1-3.5 3.5h-1" />
      <path d="M12 14v3" />
      <path d="M8.5 21h7" />
      <path d="M9.5 21c0-1.8.9-2.7 2.5-3 1.6.3 2.5 1.2 2.5 3" />
    </IconBase>
  );
}

export function IconGraduationCap({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M2.5 9.5 12 5l9.5 4.5-9.5 4.5-9.5-4.5Z" />
      <path d="M6.5 11.5v4c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-4" />
      <path d="M21.5 9.5v5" />
      <path d="M21.5 14.5c-.6.4-1 1-1 1.7 0 .5.3 1 .8 1.3" />
    </IconBase>
  );
}

export function IconChartBar({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M4 20.5V4" />
      <path d="M4 20.5h16" />
      <path d="M7.5 18v-4.5" />
      <path d="M12 18V9" />
      <path d="M16.5 18v-7.5" />
    </IconBase>
  );
}

export function IconSparkles({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M11.5 3.5c.4 2.4 1.1 3.9 2 4.8.9.9 2.4 1.6 4.8 2-2.4.4-3.9 1.1-4.8 2-.9.9-1.6 2.4-2 4.8-.4-2.4-1.1-3.9-2-4.8-.9-.9-2.4-1.6-4.8-2 2.4-.4 3.9-1.1 4.8-2 .9-.9 1.6-2.4 2-4.8Z" />
      <path d="M18.5 16.5c.2 1 .5 1.7.9 2.1.4.4 1.1.7 2.1.9-1 .2-1.7.5-2.1.9-.4.4-.7 1.1-.9 2.1-.2-1-.5-1.7-.9-2.1-.4-.4-1.1-.7-2.1-.9 1-.2 1.7-.5 2.1-.9.4-.4.7-1.1.9-2.1Z" />
    </IconBase>
  );
}

export function IconStar({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M12 3.5 14.6 9l6 .8-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.3-4.2 6-.8Z" />
    </IconBase>
  );
}

export function IconGrid({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <rect x="3.5" y="3.5" width="7.2" height="7.2" rx="1.5" />
      <rect x="13.3" y="3.5" width="7.2" height="7.2" rx="1.5" />
      <rect x="3.5" y="13.3" width="7.2" height="7.2" rx="1.5" />
      <rect x="13.3" y="13.3" width="7.2" height="7.2" rx="1.5" />
    </IconBase>
  );
}

export function IconLightbulb({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M8 10.5a4 4 0 1 1 8 0c0 1.8-1 2.7-1.8 3.6-.5.6-.7 1.1-.7 1.9h-3c0-.8-.2-1.3-.7-1.9-.8-.9-1.8-1.8-1.8-3.6Z" />
      <path d="M9.8 18.5h4.4" />
      <path d="M10.3 21h3.4" />
      <path d="M12 3v1.6M6.8 4.3l1 1.3M17.2 4.3l-1 1.3" />
    </IconBase>
  );
}

export function IconBot({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <rect x="5" y="7" width="14" height="12" rx="2.5" />
      <path d="M12 7V4.3" />
      <circle cx="12" cy="3.5" r="0.9" fill={color} stroke="none" />
      <path d="M8.5 12.5h7v3h-7z" />
      <path d="M5 11.5H3M5 15.5H3M21 11.5h-2M21 15.5h-2" />
    </IconBase>
  );
}

export function IconParty({ size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...props }) {
  return (
    <IconBase size={size} color={color} strokeWidth={strokeWidth} className={className} style={style} {...props}>
      <path d="M5 19 15.5 8.5a3 3 0 0 1 4.2 4.2L9.7 23.2" />
      <path d="M5 19 3.3 20.7" />
      <path d="M13.5 6.5l1-1M17 10l1-1M16.3 5.3l.7-1.4M19.7 8.7l1.4-.7" />
      <path d="M8 14.5c1 .3 1.6 1 1.9 2M11 11.5c1 .3 1.6 1 1.9 2" />
    </IconBase>
  );
}
