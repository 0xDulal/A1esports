import { sbSelect } from "./supabase/rest";

export interface InvestorHighlight {
  id: string;
  title: string;
  category: string;
  metric: string;
  description: string;
  logo?: string;
}

export const defaultInvestors: InvestorHighlight[] = [
  {
    id: "inv-1",
    title: "South Asian Market Leader",
    category: "Market Position",
    metric: "1.5M+ Fans",
    description: "Commanding the region's largest fan engagement in PUBG Mobile, with expanding operations in regional leagues.",
    logo: "",
  },
  {
    id: "inv-2",
    title: "Multi-Channel Revenue Model",
    category: "Financials",
    metric: "4 Revenue Streams",
    description: "Diversified revenue model spanning e-commerce merchandise, brand sponsorships, tournament prize pools, and digital content.",
    logo: "",
  },
  {
    id: "inv-3",
    title: "Bootcamp & HQ Infrastructure",
    category: "Assets",
    metric: "Dhaka HQ",
    description: "Dedicated pro bootcamps, media production facilities, and strategic infrastructure in Dhaka.",
    logo: "",
  },
];

export async function getInvestors(): Promise<InvestorHighlight[]> {
  const dbData = await sbSelect<InvestorHighlight>("investors");
  if (dbData && dbData.length > 0) {
    return dbData;
  }
  return defaultInvestors;
}
