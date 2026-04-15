'use client';

let sessionId = '';

if (typeof window !== 'undefined') {
  // Module-level variables in Next.js client components persist as long as the page hasn't been hard-refreshed.
  // We use this to track the "lifespan" of blob URLs created with URL.createObjectURL.
  if (!(window as any)._NEXA_SESSION_ID) {
    (window as any)._NEXA_SESSION_ID = Math.random().toString(36).substring(2, 11);
  }
  sessionId = (window as any)._NEXA_SESSION_ID;
}

export const getSessionId = () => sessionId;
