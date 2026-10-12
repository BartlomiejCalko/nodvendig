import type { MetadataRoute } from "next";
import { navigation } from "@/data/navigation";
import { projects } from "@/data/projects";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  if (!siteUrl) {
    return [];
  }

  const routes = [
    "",
    "/construction",
    ...navigation.map((item) => item.href),
    ...projects.map((project) => `/projects/${project.slug}`),
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
