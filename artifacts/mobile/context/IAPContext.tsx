import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LEVEL_PACKS } from "@/data/levelActions";

// react-native-iap talks to StoreKit directly — no RevenueCat here, matching
// how this app was originally scoped (three independent non-consumables).
import * as RNIap from "react-native-iap";

const OWNED_STORAGE_KEY = "@effortless_burn_owned_packs";
const ALL_PRODUCT_IDS = Object.values(LEVEL_PACKS).map((p) => p.productId);

interface IAPContextValue {
  ownedProductIds: Set<string>;
  isLevelOwned: (level: 3 | 4 | 5) => boolean;
  buyLevel: (level: 3 | 4 | 5) => Promise<void>;
  restore: () => Promise<void>;
  purchasing: string | null;
  ready: boolean;
}

const IAPContext = createContext<IAPContextValue | null>(null);

async function persistOwned(ids: Set<string>) {
  await AsyncStorage.setItem(OWNED_STORAGE_KEY, JSON.stringify(Array.from(ids)));
}

export function IAPProvider({ children }: { children: React.ReactNode }) {
  const [ownedProductIds, setOwnedProductIds] = useState<Set<string>>(new Set());
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Load any previously unlocked packs from disk immediately, so the UI
  // doesn't flash "locked" for a returning customer before StoreKit responds.
  useEffect(() => {
    AsyncStorage.getItem(OWNED_STORAGE_KEY).then((data) => {
      if (data) {
        try {
          setOwnedProductIds(new Set(JSON.parse(data)));
        } catch {}
      }
    });
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") {
      setReady(true);
      return;
    }

    let purchaseUpdateSub: ReturnType<typeof RNIap.purchaseUpdatedListener> | null = null;
    let purchaseErrorSub: ReturnType<typeof RNIap.purchaseErrorListener> | null = null;

    (async () => {
      try {
        await RNIap.initConnection();
        await RNIap.getProducts({ skus: ALL_PRODUCT_IDS });

        purchaseUpdateSub = RNIap.purchaseUpdatedListener(async (purchase) => {
          const receipt = purchase.transactionReceipt;
          if (receipt) {
            try {
              // Non-consumable: acknowledge/finish so it doesn't re-fire,
              // then mark it owned locally forever.
              await RNIap.finishTransaction({ purchase, isConsumable: false });
              setOwnedProductIds((prev) => {
                const next = new Set(prev);
                next.add(purchase.productId);
                persistOwned(next);
                return next;
              });
            } catch (e) {
              console.warn("finishTransaction failed", e);
            } finally {
              setPurchasing(null);
            }
          }
        });

        purchaseErrorSub = RNIap.purchaseErrorListener((error) => {
          console.warn("Purchase error", error);
          setPurchasing(null);
        });

        setReady(true);
      } catch (e) {
        console.warn("IAP init failed", e);
        setReady(true);
      }
    })();

    return () => {
      purchaseUpdateSub?.remove();
      purchaseErrorSub?.remove();
      RNIap.endConnection();
    };
  }, []);

  const isLevelOwned = useCallback(
    (level: 3 | 4 | 5) => ownedProductIds.has(LEVEL_PACKS[level].productId),
    [ownedProductIds],
  );

  const buyLevel = useCallback(async (level: 3 | 4 | 5) => {
    const productId = LEVEL_PACKS[level].productId;
    if (Platform.OS === "web") {
      // No StoreKit on web preview — simulate unlock so the flow is
      // demoable, real purchases only happen on-device.
      setPurchasing(productId);
      await new Promise((r) => setTimeout(r, 900));
      setOwnedProductIds((prev) => {
        const next = new Set(prev);
        next.add(productId);
        persistOwned(next);
        return next;
      });
      setPurchasing(null);
      return;
    }
    setPurchasing(productId);
    try {
      await RNIap.requestPurchase({ sku: productId });
      // Resolution happens in purchaseUpdatedListener above.
    } catch (e: any) {
      setPurchasing(null);
      if (e?.code !== "E_USER_CANCELLED") throw e;
    }
  }, []);

  const restore = useCallback(async () => {
    if (Platform.OS === "web") return;
    const purchases = await RNIap.getAvailablePurchases();
    setOwnedProductIds((prev) => {
      const next = new Set(prev);
      for (const p of purchases) {
        if (ALL_PRODUCT_IDS.includes(p.productId)) next.add(p.productId);
      }
      persistOwned(next);
      return next;
    });
  }, []);

  return (
    <IAPContext.Provider value={{ ownedProductIds, isLevelOwned, buyLevel, restore, purchasing, ready }}>
      {children}
    </IAPContext.Provider>
  );
}

export function useIAP() {
  const ctx = useContext(IAPContext);
  if (!ctx) throw new Error("useIAP must be used within IAPProvider");
  return ctx;
}
