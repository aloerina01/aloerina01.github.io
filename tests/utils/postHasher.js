import { createHash } from 'crypto';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

/**
 * 記事ファイルのハッシュ値を計算
 */
export const calculatePostHash = (filePath) => {
  const content = readFileSync(filePath, 'utf8');
  const { content: markdown } = matter(content);

  // 本文のみのハッシュを計算（frontmatterは除外）
  return createHash('md5').update(markdown).digest('hex');
};

/**
 * 全記事のハッシュマップを生成
 * @returns {Object} { 'slug': 'hash', ... }
 */
export const generatePostHashMap = () => {
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
};

/**
 * HTMLファイルパスから対応する記事スラッグを取得
 * 新URL形式: _test_build/blog/2024-12-20-1.html -> 2024-12-20-1
 * 旧URL形式: _test_build/jekyll/2016/10/02/2.html -> 2016-10-02-2
 */
export const getSlugFromHtmlPath = (htmlPath) => {
  // 新しいURL形式: /blog/YYYY-MM-DD-N.html
  const newFormatMatch = htmlPath.match(/\/(?:blog|tip)\/(\d{4}-\d{2}-\d{2}-\d+)\.html$/);
  if (newFormatMatch) {
    return newFormatMatch[1];
  }

  // 古いURL形式: /category/YYYY/MM/DD/N.html
  const oldFormatMatch = htmlPath.match(/(\d{4})\/(\d{2})\/(\d{2})\/(\d+)\.html$/);
  if (oldFormatMatch) {
    const [, year, month, day, number] = oldFormatMatch;
    return `${year}-${month}-${day}-${number}`;
  }

  return null;
};
