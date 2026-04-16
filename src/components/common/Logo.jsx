import React from 'react';

export const LogoIcon = ({ size = 24, color = "#F0C040" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="2" fill="none" />
    <path d="M50 15C30 15 15 30 15 50C15 70 30 85 50 85C70 85 85 70 85 50C85 30 70 15 50 15ZM50 78C34.5 78 22 65.5 22 50C22 34.5 34.5 22 50 22C65.5 22 78 34.5 78 50C78 65.5 65.5 78 50 78Z" fill={color} />
    <path d="M50 30L55 45H70L58 55L63 70L50 60L37 70L42 55L30 45H45L50 30Z" fill="#FF6B00" />
    <path d="M50 5C45 5 45 15 50 15C55 15 55 5 50 5Z" fill={color} />
    <circle cx="50" cy="50" r="10" fill="rgba(255,107,0,0.2)" />
  </svg>
);

export const BhaktiGoLogo = ({ size = 32, showText = true, textColor = "#F0C040", taglineColor = "rgba(255,248,240,0.5)" }) => {
  const isSmall = typeof window !== 'undefined' && window.innerWidth < 480;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: isSmall ? '8px' : '12px' }}>
      <LogoIcon size={isSmall ? size * 0.8 : size} />
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'Cinzel, serif', color: textColor, fontSize: isSmall ? 14 : size * 0.6, fontWeight: 900, lineHeight: 1 }}>BhaktiGo</span>
          {!isSmall && (
            <span style={{ fontSize: size * 0.22, color: taglineColor, letterSpacing: '0.3px', marginTop: '4px', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Bridging You to Divine Services</span>
          )}
        </div>
      )}
    </div>
  );
};
