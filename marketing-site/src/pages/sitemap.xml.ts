import type { APIRoute } from 'astro';

import { brands, categories, blog, cities, slugify } from '../data/site';

const STATIC = ['', 'services', 'brands', 'cities', 'membership', 'franchise', 'partner', 'about', 'blog', 'faqs', 'contact'];

export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL('https://www.doorstepbike.example')).origin;
  const urls = [
    ...STATIC.map((p) => `${base}/${p}`.replace(/\/$/, '') + '/'),
    ...categories.map((c) => `${base}/services/${c.key}/`),
    ...brands.map((b) => `${base}/brands/${slugify(b.name)}/`),
    ...cities.map((c) => `${base}/cities/${slugify(c.name)}/`),
    ...blog.map((b) => `${base}/blog/${b.slug}/`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
