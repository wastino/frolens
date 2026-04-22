export type Category = "all" | "portraits" | "street" | "lifestyle";

export interface Photo {
  id: string;
  src: string;
  alt: string;
  category: Exclude<Category, "all">;
  aspect: "portrait" | "landscape" | "square";
  featured?: boolean;
}

export const photos: Photo[] = [
  // ── PORTRAITS — green jacket / flowers series ────────────────────────────
  {
    id: "p1",
    src: "/work/portraits/01.jpg",
    alt: "Portrait with flowers",
    category: "portraits",
    aspect: "portrait",
  },
  {
    id: "p2",
    src: "/work/portraits/02.jpg",
    alt: "Portrait — looking away",
    category: "portraits",
    aspect: "landscape",
    featured: true,          // wide editorial shot, gets extra grid width
  },
  {
    id: "p3",
    src: "/work/portraits/03.jpg",
    alt: "Portrait — full length",
    category: "portraits",
    aspect: "portrait",
  },
  {
    id: "p4",
    src: "/work/portraits/04.jpg",
    alt: "Portrait — dynamic pose",
    category: "portraits",
    aspect: "portrait",
    featured: true,          // striking skirt/movement shot
  },

  // ── LIFESTYLE — lipstick / candid series ─────────────────────────────────
  {
    id: "l1",
    src: "/work/lifestyle/01.jpg",
    alt: "Candid — golden light lipstick",
    category: "lifestyle",
    aspect: "landscape",
    featured: true,          // strongest lipstick shot — warm cinematic light
  },
  {
    id: "l2",
    src: "/work/lifestyle/02.jpg",
    alt: "Candid — laughing",
    category: "lifestyle",
    aspect: "landscape",
  },
  {
    id: "l3",
    src: "/work/lifestyle/03.jpg",
    alt: "Candid — contemplative",
    category: "lifestyle",
    aspect: "landscape",
  },

  // ── LIFESTYLE — café window series ───────────────────────────────────────
  {
    id: "l4",
    src: "/work/lifestyle/04.jpg",
    alt: "Café — direct gaze through glass",
    category: "lifestyle",
    aspect: "landscape",
    featured: true,          // best wide café composition
  },
  {
    id: "l5",
    src: "/work/lifestyle/05.jpg",
    alt: "Café — warm light stare",
    category: "lifestyle",
    aspect: "landscape",
  },
  {
    id: "l6",
    src: "/work/lifestyle/06.jpg",
    alt: "Café — hand to chin",
    category: "lifestyle",
    aspect: "portrait",
  },

  // ── STREET — Warsaw city ─────────────────────────────────────────────────
  {
    id: "s1",
    src: "/work/street/01.jpg",
    alt: "Warsaw — metro entrance",
    category: "street",
    aspect: "landscape",
    featured: true,          // most striking geometric composition
  },
  {
    id: "s2",
    src: "/work/street/02.jpg",
    alt: "Warsaw — glass architecture",
    category: "street",
    aspect: "landscape",
  },
  {
    id: "s3",
    src: "/work/street/03.jpg",
    alt: "Warsaw — Palace of Culture",
    category: "street",
    aspect: "portrait",
  },
  {
    id: "s4",
    src: "/work/street/04.jpg",
    alt: "Warsaw — monument at dusk",
    category: "street",
    aspect: "portrait",
  },
  {
    id: "s5",
    src: "/work/street/05.jpg",
    alt: "Warsaw — Wola district",
    category: "street",
    aspect: "landscape",
  },
];

export const categoryLabels: Record<Category, string> = {
  all: "All",
  portraits: "Portraits",
  street: "Street",
  lifestyle: "Lifestyle",
};
