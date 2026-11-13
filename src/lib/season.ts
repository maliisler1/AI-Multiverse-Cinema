import { Capacitor } from "@capacitor/core";
import { NativePurchases, PURCHASE_TYPE, type Transaction } from "@capgo/native-purchases";

/**
 * "Sezonu Satın Al": Google Play'de tek seferlik (inapp) ürün.
 * Play Console > Para kazanma > Uygulama içi ürünler altında bu kimlikle açılmalı.
 */
export const SEASON_PRODUCT_ID = "sezon_1";

type Billing = Pick<
  typeof NativePurchases,
  "isBillingSupported" | "getProducts" | "purchaseProduct" | "getPurchases"
>;

/** Android'de satın alma "1" durumundaysa geçerlidir; iade edilenler listeden düşer. */
export function ownsSeason(
  purchases: Pick<Transaction, "productIdentifier" | "purchaseState">[],
): boolean {
  return purchases.some(
    (p) =>
      p.productIdentifier === SEASON_PRODUCT_ID &&
      (p.purchaseState === undefined || p.purchaseState === "1"),
  );
}

export function createSeasonStore(
  sdk: Billing = NativePurchases,
  native = () => Capacitor.getPlatform() === "android",
) {
  async function available(): Promise<boolean> {
    if (!native()) return false;
    try {
      return (await sdk.isBillingSupported()).isBillingSupported;
    } catch {
      return false;
    }
  }

  /** Mağazadaki yerel fiyat (ör. "₺89,99"); bulunamazsa null. */
  async function price(): Promise<string | null> {
    if (!(await available())) return null;
    try {
      const { products } = await sdk.getProducts({
        productIdentifiers: [SEASON_PRODUCT_ID],
        productType: PURCHASE_TYPE.INAPP,
      });
      return products[0]?.priceString ?? null;
    } catch {
      return null;
    }
  }

  /** Satın alma akışını açar. true: sezon artık açık. Kullanıcı vazgeçerse false. */
  async function buy(): Promise<boolean> {
    if (!(await available())) throw new Error("billing_unavailable");
    try {
      const tx = await sdk.purchaseProduct({
        productIdentifier: SEASON_PRODUCT_ID,
        productType: PURCHASE_TYPE.INAPP,
      });
      return ownsSeason([tx]);
    } catch (e) {
      // Kullanıcı ödeme ekranını kapattıysa hata değil, sadece satın alma yok.
      if (
        String((e as Error)?.message ?? e)
          .toLowerCase()
          .includes("cancel")
      )
        return false;
      throw e;
    }
  }

  /**
   * Google Play'deki satın almalara bakar. null: kontrol edilemedi (ağ yok vb.),
   * bu durumda cihazdaki son bilinen durum korunmalı.
   */
  async function check(): Promise<boolean | null> {
    if (!(await available())) return null;
    try {
      const { purchases } = await sdk.getPurchases({ productType: PURCHASE_TYPE.INAPP });
      return ownsSeason(purchases);
    } catch {
      return null;
    }
  }

  return { available, price, buy, check };
}

export const season = createSeasonStore();
