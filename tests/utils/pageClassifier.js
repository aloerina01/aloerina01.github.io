/**
 * ページタイプの分類ユーティリティ
 */

export const PageType = {
  POST: 'post',           // 記事詳細ページ
  INDEX: 'index',         // トップページ
  ARCHIVE: 'archive',     // カテゴリ・タグアーカイブ
  STATIC: 'static',       // 固定ページ（profile, blogs, tipsなど）
};

/**
 * HTMLファイルパスからページタイプを判定
 */
export const classifyPage = (htmlPath) => {
  // 記事詳細ページ
  // 新URL形式: /blog/YYYY-MM-DD-N.html または /tip/YYYY-MM-DD-N.html
  if (/\/(?:blog|tip)\/\d{4}-\d{2}-\d{2}-\d+\.html$/.test(htmlPath)) {
    return PageType.POST;
  }

  // 旧URL形式: /category/YYYY/MM/DD/N.html
  if (/\d{4}\/\d{2}\/\d{2}\/\d+\.html$/.test(htmlPath)) {
    return PageType.POST;
  }

  // トップページ
  if (htmlPath.endsWith('_test_build/index.html')) {
    return PageType.INDEX;
  }

  // カテゴリ・タグアーカイブ
  if (htmlPath.includes('/category/') || htmlPath.includes('/tag/')) {
    return PageType.ARCHIVE;
  }

  // 固定ページ
  return PageType.STATIC;
};

/**
 * ビジュアルテスト対象ページか判定
 */
export const shouldVisualTest = (htmlPath) => {
  const visualTestPages = [
    '_test_build/index.html',
    '_test_build/blogs.html',
    '_test_build/tips.html',
    '_test_build/archives.html',
    '_test_build/profile.html',
    '_test_build/category/javascript/index.html',
    '_test_build/category/css/index.html',
  ];

  // 記事詳細ページは2-3個サンプルを選択
  const samplePosts = [
    '_test_build/jekyll/2016/10/02/2.html',
    '_test_build/javascript/react/2017/07/25/1.html',
  ];

  return visualTestPages.some(page => htmlPath.endsWith(page)) ||
         samplePosts.some(post => htmlPath.includes(post));
};
