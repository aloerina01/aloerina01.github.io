import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { globSync } from 'glob';
import { JSDOM } from 'jsdom';
import { normalizeHtml, excludeArticleContent } from './utils/normalizeHtml.js';
import { generatePostHashMap, getSlugFromHtmlPath } from './utils/postHasher.js';
import { classifyPage, PageType } from './utils/pageClassifier.js';

// 全HTMLファイルを収集（アセットやサードパーティHTMLを除外）
const htmlFiles = globSync('_test_build/**/*.html', {
  ignore: [
    '_test_build/feed.xml',
    '_test_build/assets/**',
    '_test_build/dist/**'
  ]
});

// 記事ハッシュマップを生成
const postHashMap = generatePostHashMap();

console.log(`Found ${htmlFiles.length} HTML files to test`);
console.log(`Generated hash map for ${Object.keys(postHashMap).length} posts`);

describe('HTML Structure Snapshot Tests', () => {
  // 各HTMLファイルに対してテストを生成
  it('should have HTML files to test', () => {
    expect(htmlFiles.length).toBeGreaterThan(0);
  });

  describe('Page structure snapshots', () => {
    htmlFiles.forEach((filePath) => {
      it(`should match snapshot: ${filePath.replace('_test_build/', '')}`, () => {
        // HTMLファイルを読み込み
        if (!existsSync(filePath)) {
          throw new Error(`File not found: ${filePath}`);
        }

        const html = readFileSync(filePath, 'utf8');
        const pageType = classifyPage(filePath);

        let normalizedHtml = normalizeHtml(html);

        // 記事ページの場合、本文更新を検知
        if (pageType === PageType.POST) {
          const slug = getSlugFromHtmlPath(filePath);

          if (slug && postHashMap[slug]) {
            // 記事本文エリアを除外してスナップショット比較
            // これにより記事更新時にテストが失敗しない
            normalizedHtml = excludeArticleContent(normalizedHtml);
          }
        }

        // アーカイブページは動的なリスト部分を正規化
        if (pageType === PageType.ARCHIVE) {
          // リストアイテムの数だけ確認（内容は不問）
          const dom = new JSDOM(normalizedHtml);
          const listItems = dom.window.document.querySelectorAll('.posts li, .post-list li, article');
          normalizedHtml = normalizedHtml.replace(
            /<li[^>]*class="[^"]*post[^"]*"[^>]*>[\s\S]*?<\/li>/gi,
            '<li class="post-item">{{POST_ITEM}}</li>'
          );
        }

        // スナップショット比較
        expect(normalizedHtml).toMatchSnapshot();
      });
    });
  });

  describe('Common structure validation', () => {
    it('all pages should have proper HTML structure', async () => {
      const errors = [];

      for (const filePath of htmlFiles) {
        const html = readFileSync(filePath, 'utf8');
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        // 基本構造チェック
        if (!doc.querySelector('html')) {
          errors.push(`${filePath}: Missing <html> tag`);
        }
        if (!doc.querySelector('head')) {
          errors.push(`${filePath}: Missing <head> tag`);
        }
        if (!doc.querySelector('body')) {
          errors.push(`${filePath}: Missing <body> tag`);
        }
        if (!doc.querySelector('title')) {
          errors.push(`${filePath}: Missing <title> tag`);
        }

        // OGPタグチェック
        if (!doc.querySelector('meta[property="og:title"]')) {
          errors.push(`${filePath}: Missing OGP title`);
        }
      }

      expect(errors).toEqual([]);
    });

    it('all pages should have navigation header', async () => {
      const errors = [];

      for (const filePath of htmlFiles) {
        const html = readFileSync(filePath, 'utf8');
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        if (!doc.querySelector('header.navigation')) {
          errors.push(`${filePath}: Missing navigation header`);
        }
      }

      expect(errors).toEqual([]);
    });
  });
});
