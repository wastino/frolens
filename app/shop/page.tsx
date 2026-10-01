import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ShopClient from "@/components/ShopClient";
import { fetchPhotosFromS3 } from "@/lib/s3";
import { localPhotos } from "@/lib/photos";
import type { ShopPhoto } from "@/lib/photos";
import { getShopConfigs, getSoldCounts } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop — Frolens by Winston | Fine Art Prints",
  description: "Order fine art prints from Frolens by Winston. Museum-grade archival prints, signed and shipped from Mannheim, Germany.",
};

const DEFAULT_PRICES = { A4: 29, A3: 49, A2: 89, A1: 149 };
const ZERO_SOLD = { A4: 0, A3: 0, A2: 0, A1: 0 };

function photoKey(src: string): string {
  if (!src.startsWith("http")) return "";
  try { return new URL(src).pathname.slice(1); } catch { return ""; }
}

function isShopPhoto(src: string): boolean {
  const key = photoKey(src);
  return key.startsWith("Shop/") || key.startsWith("shop/");
}

export default async function ShopPage() {
  const [s3Photos, configs, sold] = await Promise.all([
    fetchPhotosFromS3(),
    getShopConfigs(),
    getSoldCounts(),
  ]);

  const allPhotos = s3Photos.length > 0 ? s3Photos : localPhotos;
  const configMap = new Map(configs.map((c) => [c.photo_key, c]));

  const shopPhotos: ShopPhoto[] = allPhotos
    .filter((p) => {
      const key = photoKey(p.src);
      return isShopPhoto(p.src) && (!key || p.printable);
    })
    .filter((p) => {
      const key = photoKey(p.src);
      if (!key) return true;
      const cfg = configMap.get(key);
      return cfg ? cfg.enabled : true;
    })
    .map((p) => {
      const key = photoKey(p.src);
      const cfg = configMap.get(key);
      return {
        ...p,
        s3Key: key,
        prices: cfg
          ? { A4: cfg.price_a4, A3: cfg.price_a3, A2: cfg.price_a2, A1: cfg.price_a1 }
          : DEFAULT_PRICES,
        discountPct: cfg?.discount_pct ?? 0,
        editions: cfg
          ? { A4: cfg.editions_a4, A3: cfg.editions_a3, A2: cfg.editions_a2, A1: cfg.editions_a1 }
          : null,
        sold: sold[key] ?? ZERO_SOLD,
      };
    });

  return (
    <>
      <Nav />
      <main>
        <ShopClient photos={shopPhotos} />
      </main>
    </>
  );
}
