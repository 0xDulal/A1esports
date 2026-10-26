import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://a1esportsbd.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/dashboard/*",
          "/login",
          "/api/",
          "/checkout",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
