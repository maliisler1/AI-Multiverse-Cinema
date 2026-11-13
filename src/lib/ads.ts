import { Capacitor } from '@capacitor/core';
import {
  AdMob, AdmobConsentStatus, BannerAdPosition, BannerAdSize,
  BannerAdPluginEvents, InterstitialAdPluginEvents, RewardAdPluginEvents,
} from '@capacitor-community/admob';

export const AD_UNITS = {
  banner: 'ca-app-pub-9404448916585248/5845378885',
  interstitial: 'ca-app-pub-9404448916585248/6866808514',
  // AdMob "Bölüm Aç Ödüllü" (ödüllü): kilitli bölümü reklam izleyerek açma.
  rewarded: 'ca-app-pub-9404448916585248/2363965458',
} as const;
const TEST_UNITS = (import.meta.env.VITE_ADMOB_TEST === 'true' || import.meta.env.DEV) ? {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
} as const : null;
type AdsState = { bannerHeight: number; privacyRequired: boolean };

export function createAdsController(
  sdk = AdMob,
  native = () => Capacitor.getPlatform() === 'android',
  now = () => Date.now(),
  testing = import.meta.env.VITE_ADMOB_TEST === 'true' || import.meta.env.DEV,
) {
  let state: AdsState = { bannerHeight: 0, privacyRequired: false };
  const subscriptions = new Set<() => void>();
  const units = testing && TEST_UNITS ? TEST_UNITS : AD_UNITS;
  let starting: Promise<void> | undefined;
  let sdkReady = false;
  let canRequestAds = false;
  let interstitialReady = false;
  let preparing = false;
  let showing = false;
  let privacyOpen = false;
  let completedViews = 0;
  let lastInterstitial = now();
  let listenersReady = false;
  let consentGeneration = 0;
  let adFree = false;

  function publish(next: Partial<AdsState>) {
    state = { ...state, ...next };
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--ad-banner-height', `${state.bannerHeight}px`);
    }
    subscriptions.forEach(fn => fn());
  }

  async function prepare() {
    if (!sdkReady || !canRequestAds || preparing || interstitialReady || privacyOpen) return;
    preparing = true;
    const generation = consentGeneration;
    try {
      await sdk.prepareInterstitial({ adId: units.interstitial, isTesting: testing });
      interstitialReady = canRequestAds && !privacyOpen && generation === consentGeneration;
    } catch {
      interstitialReady = false;
    } finally {
      preparing = false;
    }
  }

  async function addListeners() {
    if (listenersReady) return;
    await sdk.addListener(BannerAdPluginEvents.SizeChanged, ({ height }) => {
      if (canRequestAds && !privacyOpen) publish({ bannerHeight: Math.max(0, height) });
    });
    await sdk.addListener(BannerAdPluginEvents.FailedToLoad, () => publish({ bannerHeight: 0 }));
    const finish = () => {
      showing = false;
      void prepare();
    };
    await sdk.addListener(InterstitialAdPluginEvents.Dismissed, finish);
    await sdk.addListener(InterstitialAdPluginEvents.FailedToShow, finish);
    listenersReady = true;
  }

  async function authorizeAndLoad() {
    let info = await sdk.requestConsentInfo();
    if (info.status === AdmobConsentStatus.REQUIRED && info.isConsentFormAvailable) {
      info = await sdk.showConsentForm();
    }
    canRequestAds = info.canRequestAds === true;
    publish({ privacyRequired: info.privacyOptionsRequirementStatus === 'REQUIRED' });
    if (!canRequestAds) {
      interstitialReady = false;
      publish({ bannerHeight: 0 });
      if (sdkReady) await sdk.removeBanner().catch(() => {});
      return;
    }
    if (!sdkReady) {
      await sdk.initialize();
      sdkReady = true;
    }
    await addListeners();
    if (adFree) return;
    await sdk.showBanner({
      adId: units.banner, isTesting: testing, adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER, margin: 0,
    }).catch(() => publish({ bannerHeight: 0 }));
    void prepare();
  }

  function start() {
    if (!native() || adFree) return Promise.resolve();
    if (!starting) {
      starting = authorizeAndLoad().catch(() => {
        // No consent/network response: the application remains usable without ads.
        canRequestAds = false;
        interstitialReady = false;
        publish({ bannerHeight: 0 });
        starting = undefined;
      });
    }
    return starting;
  }

  async function atSeriesEnd() {
    if (!native() || adFree || !canRequestAds || showing || privacyOpen) return;
    completedViews++;
    // Only an explicit completed-browsing action can show a cached ad. Never
    // delay navigation to wait for a network request, or show ads on app exit.
    if (completedViews < 3 || now() - lastInterstitial < 120_000) return;
    if (!interstitialReady) { void prepare(); return; }
    interstitialReady = false;
    showing = true;
    completedViews = 0;
    lastInterstitial = now();
    try {
      await sdk.showInterstitial({ adId: units.interstitial });
    } catch {
      showing = false;
      void prepare();
    }
  }

  async function openPrivacyOptions() {
    if (!native() || !state.privacyRequired || privacyOpen || showing) return;
    privacyOpen = true;
    consentGeneration++;
    canRequestAds = false;
    interstitialReady = false;
    publish({ bannerHeight: 0 });
    await sdk.removeBanner().catch(() => {});
    try {
      await sdk.showPrivacyOptionsForm();
      privacyOpen = false;
      await authorizeAndLoad();
    } finally {
      privacyOpen = false;
    }
  }

  /** Sezonu satın alan kullanıcıya reklam gösterilmez. */
  async function setAdFree(value: boolean) {
    if (adFree === value) return;
    adFree = value;
    if (!value) { void start(); return; }
    interstitialReady = false;
    publish({ bannerHeight: 0 });
    if (sdkReady) await sdk.removeBanner().catch(() => {});
  }

  /** Ödüllü reklam bu cihazda gösterilebilir mi? */
  function canReward() {
    return native() && !!units.rewarded;
  }

  /**
   * Ödüllü reklamı gösterir. "rewarded": kullanıcı reklamı sonuna kadar izledi.
   * "dismissed": erken kapattı. "unavailable": reklam yüklenemedi/izin yok.
   */
  async function showRewarded(): Promise<'rewarded' | 'dismissed' | 'unavailable'> {
    if (!canReward() || showing || privacyOpen) return 'unavailable';
    await start();
    if (!canRequestAds) return 'unavailable';
    showing = true;
    let earned = false;
    const handles: { remove: () => Promise<void> }[] = [];
    try {
      await sdk.prepareRewardVideoAd({ adId: units.rewarded, isTesting: testing });
      let resolveClosed = () => {};
      const closed = new Promise<void>((resolve) => { resolveClosed = resolve; });
      handles.push(await sdk.addListener(RewardAdPluginEvents.Rewarded, () => { earned = true; }));
      handles.push(await sdk.addListener(RewardAdPluginEvents.Dismissed, () => resolveClosed()));
      handles.push(await sdk.addListener(RewardAdPluginEvents.FailedToShow, () => resolveClosed()));
      void sdk.showRewardVideoAd().then(() => { earned = true; }).catch(() => resolveClosed());
      await closed;
      return earned ? 'rewarded' : 'dismissed';
    } catch {
      return 'unavailable';
    } finally {
      showing = false;
      await Promise.all(handles.map((h) => Promise.resolve().then(() => h.remove()).catch(() => {})));
    }
  }

  return {
    start, atSeriesEnd, openPrivacyOptions, setAdFree, canReward, showRewarded,
    getSnapshot: () => state,
    subscribe: (callback: () => void) => {
      subscriptions.add(callback);
      return () => { subscriptions.delete(callback); };
    },
  };
}

export const ads = createAdsController();
