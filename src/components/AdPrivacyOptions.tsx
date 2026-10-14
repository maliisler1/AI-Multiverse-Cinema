import { useSyncExternalStore } from 'react';
import { toast } from 'sonner';
import { ads } from '@/lib/ads';

export function AdPrivacyOptions() {
  const state = useSyncExternalStore(ads.subscribe, ads.getSnapshot, ads.getSnapshot);
  if (!state.privacyRequired) return null;
  return <button className="mt-4 block rounded-full border px-4 py-2" onClick={() => {
    void ads.openPrivacyOptions().catch(() => toast.error('Reklam gizlilik seçenekleri açılamadı. Lütfen tekrar deneyin.'));
  }}>Reklam gizlilik seçenekleri</button>;
}
