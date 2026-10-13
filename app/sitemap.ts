import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const pages = [
    { path: "", priority: 1 },
    { path: "/fleet", priority: 0.9 },
    { path: "/about", priority: 0.8 },
    { path: "/our-story", priority: 0.8 },
    { path: "/enquire", priority: 0.7 },
  ];

  return pages.map(({ path, priority }) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority,
  }));
}
