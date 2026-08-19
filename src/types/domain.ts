export interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  halfSleevePrice?: number;
  fullSleevePrice?: number;
  image: string;
  images?: string[];
  category: "JERSEYS" | "HOODIES" | "LIFESTYLE" | "ACCESSORIES" | string;
  isSoldOut: boolean;
  description: string;
  canCustomise: boolean;
}

export interface PlayerSocials {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
}

export interface Player {
  id?: string;
  ign: string;
  name: string;
  role: string;
  image: string;
  socials?: PlayerSocials;
}

export interface TeamAchievement {
  title: string;
  rank: string;
  event: string;
  year: string;
}

export interface Team {
  id: string;
  name: string;
  game: string;
  logo: string;
  banner?: string;
  players: Player[];
  achievements?: TeamAchievement[];
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  category: "TOURNAMENT" | "ANNOUNCEMENT" | "ROSTER" | "COMMUNITY";
  date: string;
  readTime: string;
  author: string;
  image: string;
  summary: string;
  content: string[];
  tags: string[];
}

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  size?: string;
  sleeveType?: "half" | "full";
  customName?: string;
}

export interface OrderCustomer {
  name: string;
  email?: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  district?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  country: string;
  shipping_address: string;
  items: OrderItem[];
  total_amount: number;
  payment_method: string;
  payment_number?: string;
  transaction_id?: string;
  payment_proof_url?: string;
  coupon_code?: string;
  discount_amount?: number;
  payment_status: "Pending" | "Paid (100% Coupon)" | "Awaiting Verification" | "Verified" | "Rejected" | string;
  order_status: "Processing" | "Completed" | "Cancelled" | string;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number;
  max_uses?: number;
  uses_count?: number;
  is_active: boolean;
  expires_at?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: "cod" | "digital";
  account_number: string;
  instructions: string;
  is_active: boolean;
}

export interface DeliveryCharges {
  inside_dhaka: number;
  outside_dhaka: number;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  website_url?: string;
  display_order?: number;
}

export interface Investor {
  id: string;
  name: string;
  logo: string;
  website_url?: string;
  display_order?: number;
}

export interface Achievement {
  id?: string;
  date: string;
  place: string;
  tier: string;
  tournament: string;
  prize: string;
}
