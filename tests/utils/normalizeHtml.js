/**
 * HTML正規化ユーティリティ
 * スナップショット比較のため、動的な値をマスクし、空白を正規化する
 */

export function normalizeHtml(html) {
  let normalized = html;

  // 現在の年をマスク（copyright表示など）
  const currentYear = new Date().getFullYear();
  normalized = normalized.replace(new RegExp(currentYear, 'g'), '{{YEAR}}');

  // Google Analytics のページパラメータをマスク
  normalized = normalized.replace(
    /'page':\s*'[^']+'/g,
    "'page': '{{GA_PAGE}}'"
  );
  normalized = normalized.replace(
    /'title':\s*'[^']+'/g,
    "'title': '{{GA_TITLE}}'"
  );

  // タイムスタンプやビルド時刻をマスク
  normalized = normalized.replace(
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/g,
    '{{TIMESTAMP}}'
  );

  // 空白の正規化
  normalized = normalized
    .replace(/\s+/g, ' ') // 複数の空白を1つに
    .replace(/>\s+</g, '><') // タグ間の空白を削除
    .trim();

  return normalized;
}

/**
 * 記事本文エリアを除外したHTMLを取得
 * 記事更新時にレイアウトのみをテストするため
 */
export function excludeArticleContent(html) {
  // article タグの内容を置き換え
  const articleRegex = /<article[^>]*>[\s\S]*?<\/article>/gi;
  return html.replace(articleRegex, '<article>{{ARTICLE_CONTENT}}</article>');
}

/**
 * 動的リスト要素（関連記事など）を構造のみに変換
 */
export function normalizeRelatedPosts(html) {
  // 関連記事リストのアイテムを構造のみに変換
  // 具体的なパターンは実際のHTMLを見て調整
  return html;
}
