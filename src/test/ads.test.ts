import { describe, expect, it, vi } from 'vitest';
import { AdMob, BannerAdPluginEvents, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { AD_UNITS, createAdsController } from '../lib/ads';

function fixture(canRequestAds = true, testing = false) {
  const events = new Map<string, (data?: any) => void>();
  let clock = 0;
  const info = { status: 'NOT_REQUIRED', canRequestAds, privacyOptionsRequirementStatus: 'REQUIRED', isConsentFormAvailable: false };
  const mocks = {
    requestConsentInfo: vi.fn().mockResolvedValue(info),
    showConsentForm: vi.fn().mockResolvedValue(info),
    initialize: vi.fn().mockResolvedValue(undefined),
    showBanner: vi.fn().mockResolvedValue(undefined),
    removeBanner: vi.fn().mockResolvedValue(undefined),
    prepareInterstitial: vi.fn().mockResolvedValue({ adId: AD_UNITS.interstitial }),
    showInterstitial: vi.fn().mockResolvedValue(undefined),
    showPrivacyOptionsForm: vi.fn().mockResolvedValue(undefined),
    addListener: vi.fn(async (event: string, fn: (data?: any) => void) => {
      events.set(event, fn);
      return { remove: vi.fn() };
    }),
  };
  const ads = createAdsController(mocks as unknown as typeof AdMob, () => true, () => clock, testing);
  return { ads, mocks, events, setTime: (value: number) => { clock = value; } };
}

describe('AdMob integration', () => {
  it('does not invoke the native SDK in a web preview', async () => {
    const { mocks } = fixture();
    const ads = createAdsController(mocks as unknown as typeof AdMob, () => false);
    await ads.start();
    await ads.atSeriesEnd();
    expect(mocks.requestConsentInfo).not.toHaveBeenCalled();
    expect(mocks.showInterstitial).not.toHaveBeenCalled();
  });

  it('shows a required consent form before initializing the ads SDK', async () => {
    const { ads, mocks } = fixture();
    mocks.requestConsentInfo.mockResolvedValue({ status: 'REQUIRED', canRequestAds: false, privacyOptionsRequirementStatus: 'REQUIRED', isConsentFormAvailable: true });
    mocks.showConsentForm.mockResolvedValue({ status: 'OBTAINED', canRequestAds: true, privacyOptionsRequirementStatus: 'REQUIRED' });
    await ads.start();
    expect(mocks.showConsentForm).toHaveBeenCalledTimes(1);
    expect(mocks.showConsentForm.mock.invocationCallOrder[0]).toBeLessThan(mocks.initialize.mock.invocationCallOrder[0]!);
    expect(mocks.showBanner).toHaveBeenCalled();
  });

  it('does not initialize or request ads without consent permission', async () => {
    const { ads, mocks } = fixture(false);
    await ads.start();
    expect(mocks.initialize).not.toHaveBeenCalled();
    expect(mocks.showBanner).not.toHaveBeenCalled();
    expect(mocks.prepareInterstitial).not.toHaveBeenCalled();
  });

  it('uses both supplied production IDs and initializes once across route mounts', async () => {
    const { ads, mocks } = fixture();
    await Promise.all([ads.start(), ads.start()]);
    expect(mocks.initialize).toHaveBeenCalledTimes(1);
    expect(mocks.showBanner).toHaveBeenCalledWith(expect.objectContaining({ adId: AD_UNITS.banner, isTesting: false }));
    expect(mocks.prepareInterstitial).toHaveBeenCalledWith(expect.objectContaining({ adId: AD_UNITS.interstitial, isTesting: false }));
    expect(mocks.requestConsentInfo.mock.invocationCallOrder[0]).toBeLessThan(mocks.initialize.mock.invocationCallOrder[0]!);
  });

  it('keeps navigation above the banner and releases space on load failure', async () => {
    const { ads, events } = fixture();
    await ads.start();
    events.get(BannerAdPluginEvents.SizeChanged)!({ height: 64 });
    expect(document.documentElement.style.getPropertyValue('--ad-banner-height')).toBe('64px');
    events.get(BannerAdPluginEvents.FailedToLoad)!();
    expect(ads.getSnapshot().bannerHeight).toBe(0);
  });

  it('limits interstitials to completed browsing with a two-minute cooldown', async () => {
    const { ads, mocks, setTime, events } = fixture();
    await ads.start();
    await ads.atSeriesEnd();
    await ads.atSeriesEnd();
    expect(mocks.showInterstitial).not.toHaveBeenCalled();
    setTime(120_001);
    await ads.atSeriesEnd();
    expect(mocks.showInterstitial).toHaveBeenCalledTimes(1);
    events.get(InterstitialAdPluginEvents.Dismissed)!();
    await Promise.resolve();
    await ads.atSeriesEnd(); await ads.atSeriesEnd(); await ads.atSeriesEnd();
    expect(mocks.showInterstitial).toHaveBeenCalledTimes(1);
  });

  it('removes banners and disables interstitials when privacy choices prevent ads', async () => {
    const { ads, mocks, setTime } = fixture();
    await ads.start();
    mocks.requestConsentInfo.mockResolvedValue({ status: 'REQUIRED', canRequestAds: false, privacyOptionsRequirementStatus: 'REQUIRED', isConsentFormAvailable: false });
    await ads.openPrivacyOptions();
    setTime(500_000);
    await ads.atSeriesEnd(); await ads.atSeriesEnd(); await ads.atSeriesEnd();
    expect(mocks.removeBanner).toHaveBeenCalled();
    expect(ads.getSnapshot().bannerHeight).toBe(0);
    expect(mocks.showInterstitial).not.toHaveBeenCalled();
  });

  it('uses Google demo units in the test build', async () => {
    const { ads, mocks } = fixture(true, true);
    await ads.start();
    expect(mocks.showBanner).toHaveBeenCalledWith(expect.objectContaining({ adId: 'ca-app-pub-3940256099942544/6300978111', isTesting: true }));
    expect(mocks.prepareInterstitial).toHaveBeenCalledWith(expect.objectContaining({ adId: 'ca-app-pub-3940256099942544/1033173712', isTesting: true }));
  });

  it('continues without ads when the consent request fails offline', async () => {
    const { ads, mocks } = fixture();
    mocks.requestConsentInfo.mockRejectedValue(new Error('offline'));
    await expect(ads.start()).resolves.toBeUndefined();
    expect(mocks.initialize).not.toHaveBeenCalled();
  });
});
