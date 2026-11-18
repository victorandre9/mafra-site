import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/lab-drones"] }],
    sitemap: "https://mafra-site.vercel.app/sitemap.xml",
  };
}
