'use client';

import { useEffect, useRef } from 'react';
import { trackActivity } from '@/app/shop/actions';

/** Fires once per public shop page load (visit). */
export function ShopVisitTracker({ shopId }: { shopId: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (!shopId || sent.current) return;
    sent.current = true;
    void trackActivity(shopId, 'visit');
  }, [shopId]);

  return null;
}
