import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://mafra-site.vercel.app/", changeFrequency: "monthly", priority: 1 }];
}
