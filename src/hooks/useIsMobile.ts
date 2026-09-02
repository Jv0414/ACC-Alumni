import { useEffect, useState } from 'react';

const MOBILE_MEDIA_QUERY = '(max-width: 768px)';

const checkIsMobileDevice = (): boolean => {
  const ua = navigator.userAgent || '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
  // iPadOS Safari reports itself as Macintosh, so also detect touch-capable Macs
  const isIPad = /Macintosh/i.test(ua) && 'ontouchend' in document;
  const isNarrowViewport = window.matchMedia(MOBILE_MEDIA_QUERY).matches;
  return isMobileUA || isIPad || isNarrowViewport;
};

// Returns true when the app should render the mobile experience.
// Detects real mobile devices via user agent and phones/tablets in narrow
// viewports, and reacts live to window resizes and device rotation.
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(checkIsMobileDevice);

  useEffect(() => {
    const handleChange = () => setIsMobile(checkIsMobileDevice());

    const mediaQueryList = window.matchMedia(MOBILE_MEDIA_QUERY);
    mediaQueryList.addEventListener('change', handleChange);
    window.addEventListener('resize', handleChange);

    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
      window.removeEventListener('resize', handleChange);
    };
  }, []);

  return isMobile;
};