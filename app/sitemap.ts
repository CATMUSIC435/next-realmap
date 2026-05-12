import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://dxmdvietnam.vn";

  let projects = [];
  try {
    const res = await fetch("https://dxmdvietnam.vn/wp-json/wp/v2/du-an?per_page=100", { 
      next: { revalidate: 3600 } 
    });
    if (res.ok) {
      projects = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch projects for sitemap", err);
  }

  const projectUrls: MetadataRoute.Sitemap = projects.map((project: any) => ({
    url: `${baseUrl}/du-an/${project.slug}`,
    lastModified: new Date(project.modified || project.date || new Date()).toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...projectUrls,
  ];
}
