export type PhotoCategory =
  | "portraits"
  | "street"
  | "fashion"
  | "corporate"
  | "editorial"
  | "family"
  | "newborn";
export type PrintSize = "A4" | "A3" | "A2" | "A1";
export type SizeMap<T> = { A4: T; A3: T; A2: T; A1: T };

export interface ShopPhoto extends Photo {
  s3Key: string;
  prices: SizeMap<number>;
  discountPct: number;
  editions: SizeMap<number | null> | null;
  sold: SizeMap<number>;
}
export type Category = "all" | PhotoCategory;

export interface Photo {
  id: string;
  src: string;
  alt: string;
  category: PhotoCategory;
  printable: boolean;
}

// Local fallback photos (used when S3 credentials are not configured)
export const localPhotos: Photo[] = [
  // PORTRAITS
  { id: "p1", src: "/work/portraits/02.jpg", alt: "Woman with flowers, outdoor portrait — Frolens by Winston, Warsaw photography", category: "portraits", printable: true },
  { id: "p2", src: "/work/portraits/03.jpg", alt: "Full-length editorial portrait — Frolens by Winston, Warsaw photography", category: "portraits", printable: true },
  { id: "p3", src: "/work/lifestyle/04.jpg", alt: "Café window portrait, direct gaze — Frolens by Winston photography", category: "portraits", printable: true },
  { id: "p4", src: "/work/lifestyle/06.jpg", alt: "Café portrait, contemplative — Frolens by Winston photography", category: "portraits", printable: true },
  // STREET
  { id: "s1", src: "/work/street/01.jpg", alt: "Warsaw metro entrance, symmetrical architecture — Frolens by Winston", category: "street", printable: true },
  { id: "s2", src: "/work/street/02.jpg", alt: "Modern glass architecture, Warsaw Wola district — Frolens by Winston", category: "street", printable: true },
  { id: "s3", src: "/work/street/03.jpg", alt: "Palace of Culture against blue sky, Warsaw — Frolens by Winston", category: "street", printable: true },
  { id: "s4", src: "/work/street/05.jpg", alt: "Wola neon sign, arched building at dusk — Frolens by Winston, Warsaw", category: "street", printable: true },
  // FASHION
  { id: "f1", src: "/work/portraits/04.jpg", alt: "Woman dancing, billowing skirt — Frolens by Winston fashion photography", category: "fashion", printable: true },
  { id: "f2", src: "/work/lifestyle/01.jpg", alt: "Woman applying lipstick, golden light — Frolens by Winston fashion photography", category: "fashion", printable: true },
  { id: "f3", src: "/work/lifestyle/03.jpg", alt: "Candid portrait, contemplative moment — Frolens by Winston fashion photography", category: "fashion", printable: true },
  { id: "f4", src: "/work/lifestyle/05.jpg", alt: "Café portrait, warm window light — Frolens by Winston fashion photography", category: "fashion", printable: true },
];

export const categoryLabels: Record<Category, string> = {
  all: "All",
  portraits: "Portraits",
  street: "Street Photography",
  fashion: "Fashion Photography",
  corporate: "Corporate",
  editorial: "Editorial",
  family: "Family",
  newborn: "Newborn",
};

export const CATEGORY_ORDER: PhotoCategory[] = [
  "portraits",
  "corporate",
  "editorial",
  "family",
  "newborn",
  "street",
  "fashion",
];
