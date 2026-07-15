export interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  halfSleevePrice?: number;
  fullSleevePrice?: number;
  image: string;
  images?: string[];
  category: "JERSEYS" | "HOODIES" | "LIFESTYLE" | "ACCESSORIES";
  isSoldOut: boolean;
  description: string;
  canCustomise?: boolean;
}

export const shopProducts: Product[] = [
  {
    id: "jer-001",
    slug: "a1-away-kit-beauty-red-player-edition",
    title: "A1 Away Kit | Beauty Red – Player Edition",
    price: 850,
    halfSleevePrice: 850,
    fullSleevePrice: 899,
    image: "https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-1-1024x1024.png",
    images: [
      "https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-1-1024x1024.png",
      "https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-2-1024x1024.png",
      "https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-8-1024x1024.png",
      "https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-9-1024x1024.png"
    ],
    category: "JERSEYS",
    isSoldOut: false,
    description: "Official 2026 Season Away Kit. Lightweight, breathable, and optimized for extreme performance.",
    canCustomise: true
  },
  {
    id: "jer-002",
    slug: "a1-away-kit-beauty-red-fan-edition",
    title: "A1 Away Kit | Beauty Red – Fan Edition",
    price: 650,
    halfSleevePrice: 650,
    fullSleevePrice: 699,
    image: "https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-2-1024x1024.png",
    category: "JERSEYS",
    isSoldOut: false,
    description: "Support the team in style with the official fan edition jersey.",
    canCustomise: true
  },
  {
    id: "jer-003",
    slug: "a1-home-kit-signature-purple-player-edition",
    title: "A1 Home Kit | Signature Purple – Player Edition",
    price: 800,
    halfSleevePrice: 800,
    fullSleevePrice: 849,
    image: "https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-8-1024x1024.png",
    category: "JERSEYS",
    isSoldOut: false,
    description: "The iconic purple home kit worn by pros on stage.",
    canCustomise: true
  },
  {
    id: "jer-004",
    slug: "a1-home-kit-signature-purple-fan-edition",
    title: "A1 Home Kit | Signature Purple – Fan Edition",
    price: 600,
    halfSleevePrice: 600,
    fullSleevePrice: 649,
    image: "https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-9-1024x1024.png",
    category: "JERSEYS",
    isSoldOut: false,
    description: "Premium comfort for the ultimate A1ESPORTS fan.",
    canCustomise: true
  },
  {
    id: "acc-001",
    slug: "a1-pro-gaming-mousepad-xl",
    title: "A1 Pro Gaming Mousepad – XL",
    price: 350,
    image: "https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-6-1024x1024.png",
    category: "ACCESSORIES",
    isSoldOut: false,
    description: "Ultra-smooth tracking surface for precision gaming. Features durable stitched edges.",
    canCustomise: false
  },
  {
    id: "life-001",
    slug: "a1-stealth-tee-midnight-black",
    title: "A1 Stealth Tee – Midnight Black",
    price: 450,
    image: "https://a1esportsbd.com/wp-content/uploads/2026/02/POSTER-10-1024x1024.png",
    category: "LIFESTYLE",
    isSoldOut: false,
    description: "Minimalist brand logo on premium 100% cotton tee.",
    canCustomise: false
  },
];
