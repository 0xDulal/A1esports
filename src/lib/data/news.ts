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

export const newsArticles: NewsArticle[] = [];
