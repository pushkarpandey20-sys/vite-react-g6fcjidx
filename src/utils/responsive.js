import { useState, useEffect } from 'react';

export const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= 768;
export const isSmall  = () => typeof window !== 'undefined' && window.innerWidth <= 480;

export function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return mobile;
}
