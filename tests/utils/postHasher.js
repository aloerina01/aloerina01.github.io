import { createHash } from 'crypto';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

/**
 * 記事ファイルのハッシュ値を計算
 */
export function calculatePostHash(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const { content: markdown } = matter(content);

  // 本文のみのハッシュを計算（frontmatterは除外）
  return createHash('md5').update(markdown).digest('hex');
}

/**
 * 全記事のハッシュマップを生成
 * @returns {Object} { 'slug': 'hash', ... }
 */
export function generatePostHashMap() {
  const postDirs = ['_posts/blog', '_posts/tip'];
  const hashMap = {};

  for (const dir of postDirs) {
    try {
      const files = readdirSync(dir);

      for (const file of files) {
        if (!file.endsWith('.md')) continue;

        const filePath = join(dir, file);
        if (!statSync(filePath).isFile()) continue;

        // ファイル名からスラッグを抽出（例: 2016-10-02-2.md -> 2016-10-02-2）
        const slug = file.replace(/\.md$/, '');
        hashMap[slug] = calculatePostHash(filePath);
      }
    } catch (error) {
      console.warn(`Warning: Could not read directory ${dir}:`, error.message);
    }
  }

  return hashMap;
}

/**
 * HTMLファイルパスから対応する記事スラッグを取得
 * 例: _test_build/jekyll/2016/10/02/2.html -> 2016-10-02-2
 */
export function getSlugFromHtmlPath(htmlPath) {
  // パスから日付とファイル名を抽出
  const match = htmlPath.match(/(\d{4})\/(\d{2})\/(\d{2})\/(\d+)\.html$/);
  if (!match) return null;

  const [, year, month, day, number] = match;
  return `${year}-${month}-${day}-${number}`;
}
