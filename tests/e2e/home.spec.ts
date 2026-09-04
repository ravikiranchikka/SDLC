import { expect, test, type Page } from '@playwright/test';

/** Mobile reference viewport required by AC-2. */
const MOBILE_VIEWPORT = { width: 360, height: 800 } as const;

/** Desktop reference viewport used for the above-the-fold CTA checks (AC-3). */
const DESKTOP_VIEWPORT = { width: 1280, height: 800 } as const;

/** The nine site links that must be reachable from the mobile menu (AC-2). */
const EXPECTED_NAV_HREFS: readonly string[] = [
  '/',
  '/about',
  '/services',
  '/online-consultation',
  '/success-stories',
  '/gallery',
  '/blog',
  '/faqs',
  '/contact',
];

/** Routes that must all render the shared header/main/footer shell (AC-1). */
const SHELL_ROUTES: readonly string[] = ['/', '/online-consultation'];

/**
 * Horizontal overflow of the document in CSS pixels.
 * A value greater than 1 (allowing for sub-pixel rounding) means the page
 * scrolls sideways, which AC-2 forbids.
 */
async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(() => {
    const doc = document.documentElement;

    return Math.max(
      doc.scrollWidth - doc.clientWidth,
      document.body.scrollWidth - doc.clientWidth,
    );
  });
}

test.describe('Home page - shared layout shell (AC-1)', () => {
  for (const route of SHELL_ROUTES) {
    test(`renders the header, main landmark and footer on ${route}`, async ({ page }) => {
      await page.goto(route);

      await expect(page.getByTestId('site-header')).toBeVisible();
      await expect(page.locator('main#main-content')).toHaveCount(1);
      await expect(page.getByTestId('site-footer')).toBeVisible();
      await expect(page.getByTestId('skip-link')).toHaveAttribute('href', '#main-content');
    });
  }

  test('renders every Home page section', async ({ page }) => {
    await page.goto('/');

    for (const section of [
      'hero',
      'services-teaser',
      'why-choose-us',
      'testimonial-teaser',
      'cta-band',
    ]) {
      await expect(page.getByTestId(section)).toHaveCount(1);
    }

    await expect(page.locator('h1')).toHaveCount(1);
  });
});

test.describe('Home page - 360px mobile viewport (AC-2)', () => {
  test.use({ viewport: MOBILE_VIEWPORT });

  test('does not scroll horizontally', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);

    // Also check after scrolling to the bottom, so lazily rendered sections
    // cannot introduce overflow.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('collapses the navigation into a mobile menu', async ({ page }) => {
    await page.goto('/');

    const toggle = page.getByTestId('mobile-menu-toggle');

    await expect(toggle).toBeVisible();
    await expect(page.getByTestId('desktop-nav')).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAttribute('aria-controls', 'mobile-menu');
    await expect(page.getByTestId('mobile-menu')).toHaveCount(0);
  });

  test('exposes all nine site links from the mobile menu', async ({ page }) => {
    await page.goto('/');

    const toggle = page.getByTestId('mobile-menu-toggle');
    await toggle.click();

    const menu = page.getByTestId('mobile-menu');
    await expect(menu).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toHaveAttribute('role', 'dialog');

    const links = page.getByTestId('mobile-nav-link');
    await expect(links).toHaveCount(EXPECTED_NAV_HREFS.length);

    const hrefs = await links.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('href')),
    );
    expect(hrefs).toEqual([...EXPECTED_NAV_HREFS]);

    const count = await links.count();
    for (let index = 0; index < count; index += 1) {
      const link = links.nth(index);
      await link.scrollIntoViewIfNeeded();
      await expect(link).toBeVisible();
    }

    // The menu itself must not introduce horizontal overflow.
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('closes the mobile menu with the Escape key', async ({ page }) => {
    await page.goto('/');

    const toggle = page.getByTestId('mobile-menu-toggle');
    await toggle.click();
    await expect(page.getByTestId('mobile-menu')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByTestId('mobile-menu')).toHaveCount(0);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('navigates from the mobile menu and closes it', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('mobile-menu-toggle').click();
    await page
      .getByTestId('mobile-nav-link')
      .filter({ hasText: 'Online Consultation' })
      .first()
      .click();

    await expect(page).toHaveURL(/\/online-consultation$/);
    await expect(page.getByTestId('mobile-menu')).toHaveCount(0);
    await expect(page.getByTestId('site-header')).toBeVisible();
  });

  test('shows both hero calls-to-action above the fold', async ({ page }) => {
    await page.goto('/');

    const primary = page.getByTestId('hero-cta-primary');
    const whatsapp = page.getByTestId('hero-cta-whatsapp');

    await expect(primary).toBeVisible();
    await expect(whatsapp).toBeVisible();

    for (const cta of [primary, whatsapp]) {
      const box = await cta.boundingBox();
      expect(box).not.toBeNull();
      expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(MOBILE_VIEWPORT.height);
    }
  });
});

test.describe('Home page - hero calls-to-action (AC-3)', () => {
  test.use({ viewport: DESKTOP_VIEWPORT });

  test('shows both hero calls-to-action above the fold on desktop', async ({ page }) => {
    await page.goto('/');

    const primary = page.getByTestId('hero-cta-primary');
    const whatsapp = page.getByTestId('hero-cta-whatsapp');

    await expect(primary).toBeVisible();
    await expect(whatsapp).toBeVisible();

    for (const cta of [primary, whatsapp]) {
      const box = await cta.boundingBox();
      expect(box).not.toBeNull();
      expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(DESKTOP_VIEWPORT.height);
    }
  });

  test('primary CTA routes to the Online Consultation page', async ({ page }) => {
    await page.goto('/');

    const primary = page.getByTestId('hero-cta-primary');
    await expect(primary).toHaveAttribute('href', '/online-consultation');

    await primary.click();

    await expect(page).toHaveURL(/\/online-consultation$/);
    await expect(page.locator('main#main-content')).toBeVisible();
  });

  test('secondary CTA points at a WhatsApp click-to-chat link', async ({ page }) => {
    await page.goto('/');

    const whatsapp = page.getByTestId('hero-cta-whatsapp');
    const href = await whatsapp.getAttribute('href');

    expect(href).toBeTruthy();
    expect(href ?? '').toMatch(/^https:\/\/wa\.me\/\d{8,15}\?text=.+/);
    await expect(whatsapp).toHaveAttribute('target', '_blank');
    await expect(whatsapp).toHaveAttribute('rel', /noopener/);
    await expect(whatsapp).toHaveAttribute('rel', /noreferrer/);
  });

  test('repeats both conversion paths in the closing CTA band', async ({ page }) => {
    await page.goto('/');

    const band = page.getByTestId('cta-band');
    await band.scrollIntoViewIfNeeded();

    await expect(band).toBeVisible();
    await expect(band.getByRole('link', { name: /book online consultation/i })).toHaveAttribute(
      'href',
      '/online-consultation',
    );
    await expect(band.getByRole('link', { name: /whatsapp/i })).toHaveAttribute(
      'href',
      /^https:\/\/wa\.me\//,
    );
  });
});

test.describe('Home page - images are optimised (AC-4)', () => {
  test('serves every Home page image through next/image', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForLoadState('networkidle');

    const images = page.locator('main img');
    const count = await images.count();

    expect(count).toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      const image = images.nth(index);
      const src = (await image.getAttribute('src')) ?? '';
      const alt = await image.getAttribute('alt');

      expect(alt, 'every image needs alt text').not.toBeNull();
      expect(src).toMatch(/^\/_next\/image\?/);
    }
  });
});
