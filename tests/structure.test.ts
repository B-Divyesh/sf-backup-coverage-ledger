import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('release structure', () => {
  it('maps every declared claim to exactly one tagged browser test', () => {
    const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Array<{ id: string; test: string }>;
    const source = readFileSync('tests/e2e/claims.spec.ts', 'utf8');
    expect(new Set(claims.map((claim) => claim.id)).size).toBe(claims.length);
    for (const claim of claims) {
      expect(claim.test).toContain(`@claim:${claim.id}`);
      expect(source.match(new RegExp(`@claim:${claim.id}(?![a-z-])`, 'g'))).toHaveLength(1);
    }
    expect([...source.matchAll(/@claim:([a-z-]+)/g)].map((match) => match[1]).sort()).toEqual(claims.map((claim) => claim.id).sort());
  });

  it('ships a real static 404 override without an invalid rewrite/status route', () => {
    const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8'));
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
    expect(config.navigationFallback).toBeUndefined();
    expect(config.routes.filter((route: { rewrite?: string }) => route.rewrite).map((route: { route: string }) => route.route)).toEqual([
      '/drill', '/privacy', '/terms',
    ]);
    expect(config.routes.some((route: { rewrite?: string; statusCode?: number }) => route.rewrite && route.statusCode)).toBe(false);
    const page = readFileSync('public/404.html', 'utf8');
    expect(page).toContain('<title>Page not found — Backup Coverage Ledger</title>');
    expect(page).toContain('<main id="main">');
    expect(page.match(/<h1/g)).toHaveLength(1);
  });

  it('keeps static 404 chrome in parity with application routes', () => {
    const staticPage = readFileSync('public/404.html', 'utf8');
    const application = readFileSync('src/main.ts', 'utf8');
    for (const label of ['Backup Coverage Ledger home', '>Ledger<', '>Demo<', '>Restore drill<', '>Privacy<', '>Terms<', 'Source on GitHub (external)', 'Track backup owners, locations, and restore proof.', 'Built by Param Factory', 'Original generative artwork']) {
      expect(staticPage).toContain(label);
      expect(application).toContain(label);
    }
    expect(staticPage).toContain('v1.1.1 · polish-2');
  });

  it('lists every route and supplies complete base metadata', () => {
    const sitemap = readFileSync('public/sitemap.xml', 'utf8');
    for (const route of ['/?demo=1', '/drill', '/privacy', '/terms']) expect(sitemap).toContain(route);
    const html = readFileSync('index.html', 'utf8');
    for (const field of ['rel="canonical"', 'property="og:title"', 'property="og:image"', 'name="twitter:card"', 'rel="apple-touch-icon"']) expect(html).toContain(field);
  });

  it('keeps the catalog sentence verb-first and within 120 characters', () => {
    const description = readFileSync('.factory/catalog-description.txt', 'utf8').trim();
    expect(description.startsWith('Track ')).toBe(true);
    expect(description.length).toBeLessThanOrEqual(120);
  });
});
