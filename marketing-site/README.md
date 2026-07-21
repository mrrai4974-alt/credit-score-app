# Doorstep Bike Service — Marketing Website

The public **marketing website** for the Doorstep Two-Wheeler Service Platform —
the SEO-oriented content site from **BRD section 5.1** (service pages, brand/model
pages, city landing pages, blog, FAQs, About/Media, and franchise/partner
lead-capture).

Built with **Astro**, which outputs **static per-page HTML** — the right tool for
an SEO content site: fast, crawlable pages with per-page `<title>`/meta,
canonical URLs, Open Graph tags, JSON-LD `LocalBusiness` schema, and a generated
`sitemap.xml`. It shares the platform brand with the apps.

## What's implemented (BRD §5.1 marketing content)

| Content | Pages |
|---|---|
| Home / landing (hero, value props, how-it-works, comparison table, testimonials, membership teaser, FAQ) | `pages/index.astro` |
| **Service pages** — catalog + one SEO page per category | `pages/services/index.astro`, `pages/services/[category].astro` |
| **Brand/model pages** — directory + one page per brand | `pages/brands/index.astro`, `pages/brands/[brand].astro` |
| **City landing pages** — directory + one page per city | `pages/cities/index.astro`, `pages/cities/[city].astro` |
| Membership / pricing | `pages/membership.astro` |
| **Franchise** program + lead-capture form | `pages/franchise.astro` |
| **Partner** (mechanic/vendor) program + lead form | `pages/partner.astro` |
| Blog — listing + per-post pages | `pages/blog/index.astro`, `pages/blog/[slug].astro` |
| FAQs | `pages/faqs.astro` |
| About / Media & press | `pages/about.astro` |
| Book / contact + callback form | `pages/contact.astro` |
| `sitemap.xml` + `robots.txt` | `pages/sitemap.xml.ts`, `public/robots.txt` |

Content (services, brands, cities, plans, testimonials, FAQs, blog) is data-driven
from `src/data/site.ts`, so the dynamic routes generate all category/brand/city/post
pages at build time. Prices mirror the BRD catalog (GST-inclusive on the site).
Lead forms are client-side demos (no backend) — the integration points for a CRM.

## Project structure

```
astro.config.mjs           # site URL config
src/
  data/site.ts             # All site content & catalog data
  styles/global.css        # Design system (shared brand)
  layouts/Base.astro       # <head> SEO meta, JSON-LD, header + footer
  components/               # Header, Footer, CTA, LeadForm, FAQList
  pages/                    # Static + dynamic ([category]/[brand]/[city]/[slug]) routes
public/robots.txt
```

## Running

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static build to dist/  (35 pages)
npm run preview    # serve the production build
```

## SEO notes

- Every page sets a unique `<title>`, meta description, canonical URL and Open
  Graph tags via `Base.astro`; a `LocalBusiness` JSON-LD block is injected site-wide.
- Dynamic `[category]`, `[brand]`, `[city]` and blog `[slug]` routes create dedicated,
  crawlable landing pages — the SEO strategy called out in the BRD.
- `dist/` is fully static and deployable to any static host or CDN.
