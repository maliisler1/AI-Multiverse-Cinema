import { describe, expect, it, vi } from "vitest";
import { createSeasonStore, ownsSeason, SEASON_PRODUCT_ID } from "@/lib/season";
import { hasEpisodeAccess } from "@/lib/playback";

const sdk = (over: Record<string, unknown> = {}) => ({
  isBillingSupported: vi.fn(async () => ({ isBillingSupported: true })),
  getProducts: vi.fn(async () => ({ products: [{ priceString: "$4.99" }] })),
  purchaseProduct: vi.fn(async () => ({
    productIdentifier: SEASON_PRODUCT_ID,
    purchaseState: "1",
  })),
  getPurchases: vi.fn(async () => ({ purchases: [] as unknown[] })),
  ...over,
});

describe("Sezonu Satın Al", () => {
  it("yalnızca geçerli sezon satın almasını sayar", () => {
    expect(ownsSeason([{ productIdentifier: SEASON_PRODUCT_ID, purchaseState: "1" }])).toBe(true);
    expect(ownsSeason([{ productIdentifier: SEASON_PRODUCT_ID, purchaseState: "0" }])).toBe(false);
    expect(ownsSeason([{ productIdentifier: "baska", purchaseState: "1" }])).toBe(false);
  });

  it("satın alınca sezonu açar, fiyatı mağazadan alır", async () => {
    const store = createSeasonStore(sdk() as never, () => true);
    expect(await store.price()).toBe("$4.99");
    expect(await store.buy()).toBe(true);
  });

  it("kullanıcı vazgeçerse hata değil, false döner", async () => {
    const store = createSeasonStore(
      sdk({
        purchaseProduct: vi.fn(async () => {
          throw new Error("User cancelled");
        }),
      }) as never,
      () => true,
    );
    expect(await store.buy()).toBe(false);
  });

  it("Google Play'e ulaşılamazsa durumu değiştirmemek için null döner", async () => {
    const store = createSeasonStore(
      sdk({
        getPurchases: vi.fn(async () => {
          throw new Error("offline");
        }),
      }) as never,
      () => true,
    );
    expect(await store.check()).toBeNull();
    expect(await createSeasonStore(sdk() as never, () => false).check()).toBeNull();
  });

  it("sezon sahibi tüm bölümlere erişir", () => {
    const ep = { id: "e9", n: 9 } as never;
    expect(hasEpisodeAccess(ep, [], 2)).toBe(false);
    expect(hasEpisodeAccess(ep, [], 2, true)).toBe(true);
  });
});
