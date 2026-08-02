import React from 'react';

/** Sleek vector SVG icon system for MedSim UI */

export function IconCardiac({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.5 12h4l2-3 3 6 2-3h4.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconNeuro({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 0 0 18" opacity="0.3" />
      <path d="M8 12h8M12 8v8M9 9l6 6M15 9l-6 6" strokeWidth="1.5" opacity="0.8" />
    </svg>
  );
}

export function IconRespiratory({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v8M12 8c-3-2-6-1-8 2v5c0 3 2.5 5 5.5 5s4.5-2.5 4.5-5.5V8" />
      <path d="M12 8c3-2 6-1 8 2v5c0 3-2.5 5-5.5 5S10 17.5 10 14.5V8" />
    </svg>
  );
}

export function IconInfectious({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
    </svg>
  );
}

export function IconEndocrine({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v5.5l-4.5 8C4.5 17.5 6 21 9 21h6c3 0 4.5-3.5 3.5-5.5L14 7.5V2" />
      <path d="M8.5 2h7M7 16h10" />
    </svg>
  );
}

export function IconToxicology({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="11" r="7" />
      <circle cx="9.5" cy="10.5" r="1" fill={color} />
      <circle cx="14.5" cy="10.5" r="1" fill={color} />
      <path d="M12 14v2M9.5 18h5M10.5 18v3M13.5 18v3" />
    </svg>
  );
}

export function IconAbdominal({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v10M7 12h10" strokeWidth="1.5" />
    </svg>
  );
}

export function IconHospital({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h6M12 7v6" />
    </svg>
  );
}

export function IconAmbulance({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7h2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M8 10h4M10 8v4" />
    </svg>
  );
}

export function IconXRay({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 12h10M12 7v10M8 8l8 8M16 8l-8 8" opacity="0.5" strokeWidth="1" />
    </svg>
  );
}

export function IconStethoscope({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.8 2.3A.3.3 0 0 0 4.5 2.6V8a5.5 5.5 0 0 0 11 0V2.6a.3.3 0 0 0-.3-.3h-1.4a.3.3 0 0 0-.3.3V8a3.5 3.5 0 0 1-7 0V2.6a.3.3 0 0 0-.3-.3H4.8z" />
      <path d="M10 13.5v3a4.5 4.5 0 0 0 9 0v-1.5" />
      <circle cx="19" cy="13" r="2" />
    </svg>
  );
}

export function IconBed({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20" />
      <circle cx="7" cy="11" r="2" />
    </svg>
  );
}

export function IconPill({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  );
}

export function IconMicroscope({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18h12M12 18v-4M9 14h6M12 10a4 4 0 0 0 4-4V3H8v3a4 4 0 0 0 4 4Z" />
      <path d="M12 3v7" strokeDasharray="1 1" />
    </svg>
  );
}
