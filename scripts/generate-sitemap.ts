import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { EXTENDED_BLOG_POSTS, LEGAL_DOCUMENTS } from '../src/data/extendedData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const APP_FILE = path.join(ROOT_DIR, 'src', 'App.tsx');
const OUTPUT_FILE = path.join(ROOT_DIR, 'public', 'sitemap.xml');

// Routes intentionally excluded from public search indexation (matches robots.txt)
const EXCLUDED_ROUTES = new Set([
  '*',
  '/dashboard',
  '/login',
  '/signup',
  '/forgot-password',
]);

interface SitemapRule {
  priority: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
}

function getRuleForPath(routePath: string): SitemapRule {
  if (routePath === '/') {
    return { priority: '1.0', changefreq: 'weekly' };
  }
  if (['/training', '/mentorship', '/signals', '/pricing'].includes(routePath)) {
    return { priority: '0.9', changefreq: 'weekly' };
  }
  if (routePath === '/investment' || routePath === '/blog' || routePath.startsWith('/blog/')) {
    return { priority: '0.8', changefreq: 'weekly' };
  }
  if (routePath.startsWith('/legal/')) {
    return { priority: '0.5', changefreq: 'monthly' };
  }
  return { priority: '0.7', changefreq: 'monthly' };
}

function resolveBaseUrl(): string {
  const candidate = process.env.SITE_URL || process.env.APP_URL || '';
  if (candidate && candidate !== 'MY_APP_URL' && /^https?:\/\//i.test(candidate)) {
    return candidate.replace(/\/+$/, '');
  }
  return 'https://bullishtitan.example';
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function extractRoutesFromApp(source: string): string[] {
  const routeRegex = /<Route\b[^>]*\bpath\s*=\s*["']([^"']+)["']/g;
  const discovered: string[] = [];
  let match: RegExpExecArray | null = null;

  while ((match = routeRegex.exec(source)) !== null) {
    discovered.push(match[1]);
  }
  return discovered;
}

function expandDynamicRoute(routePattern: string): string[] {
  if (routePattern === '/blog/:slug') {
    return EXTENDED_BLOG_POSTS.map((post) => `/blog/${post.slug}`);
  }
  if (routePattern === '/legal/:doc') {
    return Object.keys(LEGAL_DOCUMENTS).map((doc) => `/legal/${doc}`);
  }
  // Ignore unrecognized parameterized routes cleanly
  if (routePattern.includes(':')) {
    return [];
  }
  return [routePattern];
}

function generateSitemap(): void {
  const appSource = fs.readFileSync(APP_FILE, 'utf8');
  const rawRoutes = extractRoutesFromApp(appSource);
  const baseUrl = resolveBaseUrl();
  const lastmod = new Date().toISOString().split('T')[0];

  const finalPaths: string[] = [];
  const seen = new Set<string>();

  for (const rawRoute of rawRoutes) {
    if (EXCLUDED_ROUTES.has(rawRoute)) continue;

    for (const expandedPath of expandDynamicRoute(rawRoute)) {
      const normalized = expandedPath.startsWith('/') ? expandedPath : `/${expandedPath}`;
      if (!seen.has(normalized)) {
        seen.add(normalized);
        finalPaths.push(normalized);
      }
    }
  }

  const urlNodes = finalPaths
    .map((routePath) => {
      const { priority, changefreq } = getRuleForPath(routePath);
      const loc = escapeXml(`${baseUrl}${routePath}`);
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlNodes,
    '</urlset>',
    '',
  ].join('\n');

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, xml, 'utf8');

  console.log(
    `[sitemap] Crawled ${rawRoutes.length} route definitions in src/App.tsx -> generated ${finalPaths.length} URLs in public/sitemap.xml`
  );
}

generateSitemap();
