import { test, expect } from '@playwright/test';

/**
 * ビジュアルリグレッションテスト
 * 主要ページのスクリーンショットを比較してレイアウト崩れを検知
 */

// ビューポートサイズ
const viewports = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
];

// テスト対象ページ
const pages = [
  { name: 'Top Page', url: '/' },
  { name: 'Blogs List', url: '/blogs.html' },
  { name: 'Tips List', url: '/tips.html' },
  { name: 'Archives', url: '/archives.html' },
  { name: 'Profile', url: '/profile.html' },
  { name: 'Category - JavaScript', url: '/category/javascript/' },
  { name: 'Category - CSS', url: '/category/css/' },
  { name: 'Post - Jekyll Blog', url: '/jekyll/2016/10/02/2.html' },
  { name: 'Post - React', url: '/javascript/react/2017/07/25/1.html' },
];

test.describe('Visual Regression Tests', () => {
  // デスクトップビューのみでテスト（速度重視）
  test.use({ viewport: { width: 1280, height: 720 } });

  for (const page of pages) {
    test(`should match screenshot: ${page.name}`, async ({ page: p }) => {
      // ページに移動
      await p.goto(page.url);

      // ページの読み込み完了を待機
      await p.waitForLoadState('networkidle');

      // 動的コンテンツ（アニメーション等）の安定化のため少し待機
      await p.waitForTimeout(500);

      // フルページスクリーンショット
      await expect(p).toHaveScreenshot(`${page.name.replace(/[^a-zA-Z0-9]/g, '-')}.png`, {
        fullPage: true,
        // 許容する差分（ピクセル単位）
        maxDiffPixels: 100,
        // アンチエイリアシングの差異を許容
        threshold: 0.2,
      });
    });
  }
});

test.describe('Visual Regression Tests - Responsive', () => {
  // レスポンシブテスト（主要ページのみ）
  const responsivePages = [
    { name: 'Top Page', url: '/' },
    { name: 'Post - Jekyll Blog', url: '/jekyll/2016/10/02/2.html' },
  ];

  for (const viewport of viewports) {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      for (const page of responsivePages) {
        test(`should match screenshot: ${page.name}`, async ({ page: p }) => {
          await p.goto(page.url);
          await p.waitForLoadState('networkidle');
          await p.waitForTimeout(500);

          await expect(p).toHaveScreenshot(
            `${page.name.replace(/[^a-zA-Z0-9]/g, '-')}-${viewport.name}.png`,
            {
              fullPage: true,
              maxDiffPixels: 100,
              threshold: 0.2,
            }
          );
        });
      }
    });
  }
});

test.describe('Component Visual Tests', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test('navigation header should be consistent', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // ヘッダーのスクリーンショット
    const header = page.locator('header.navigation');
    await expect(header).toHaveScreenshot('navigation-header.png', {
      threshold: 0.2,
    });
  });

  test('post list items should have consistent layout', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 最初の記事カードのスクリーンショット
    const firstPost = page.locator('.posts .post-teaser').first();
    if (await firstPost.count() > 0) {
      await expect(firstPost).toHaveScreenshot('post-teaser-item.png', {
        threshold: 0.2,
      });
    }
  });
});
