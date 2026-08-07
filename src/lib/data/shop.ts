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

export const shopProducts: Product[] = [];
