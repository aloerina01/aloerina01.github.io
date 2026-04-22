<p align="center">
  <a href="https://aloerina01.github.io/" rel="nofollow">
    <img width="150" src="https://aloerina01.github.io/assets/logo.png" alt="mf-code">
  </a>
</p>
<h1 align="center">Feel and Code</h1>

<p align="center">
  <a href="https://github.com/aloerina01/aloerina01.github.io/actions">
    <img src="https://github.com/aloerina01/aloerina01.github.io/workflows/DEPLOY/badge.svg?branch=development" alt="build status">
  </a>
</p>

## What's this
[Feel and Code](https://aloerina01.github.io/)

This is a blog written about some technical topics, by [Aloerina](https://twitter.com/aloerina_).


## Powered by

* [Github Pages](https://pages.github.com/) - Hosting service
* [jekyll](https://jekyllrb.com/) - Static web site generator
* [Algolia](https://www.algolia.com/) - Indexing & Search engine


## Setup

1. `git clone https://github.com/aloerina01/aloerina01.github.io.git`
2. install gsl (use brew, yum or something)
2. `bundle install`
3. `npm start`


## Testing

このプロジェクトには、生成されたHTMLの構造とビジュアルのリグレッションテストが含まれています。

### Requirements

* Node.js 18.x or later

### Test Types

#### Structure Tests (Vitest)
全157ページのHTML構造をスナップショット比較します。
- HTMLの正規化（空白、動的な値のマスク）を行い、ユーザーが気づくレベルのデグレのみ検知
- 記事本文の更新は除外され、レイアウト・構造のみをテスト
- 記事ページ、一覧ページ、固定ページすべてを対象

#### Visual Tests (Playwright)
主要ページのスクリーンショット比較を行います。
- メインページ（トップ、一覧、プロフィールなど）
- 特殊な記事（古いURL、iframe埋め込み、目次付きなど）
- レスポンシブ対応（デスクトップ、タブレット、モバイル）

### Run Tests

```bash
# すべてのテストを実行
npm test

# 構造テストのみ
npm run test:structure

# ビジュアルテストのみ
npm run test:visual

# スナップショットを更新
npm run test:update
```

### Update Snapshots

意図的な変更後にスナップショットを更新する場合:

```bash
# 構造テストのスナップショットを更新
npm run test:structure -- -u

# ビジュアルテストのスナップショットを更新
npm run test:visual -- --update-snapshots

# または一括更新
npm run test:update
```

## Branch rules

### development branch
jekyllベースの構成ファイル(markdownによる記事、_config.yml等)を持つ。記事、Template、デザインなどの追加修正等を行う場合は、必ずこのブランチで(もしくはここからトピックブランチを切り)行う。

`push`をトリガーにCIがrake taskを実行すると、静的ページがGenerateされ master にpushされる。



### master branch

Github Pagesとして公開される原本。原則CIからのPushのみ。


## How to work LSI(潜在意味解析)

* To generate related posts list, use `lsi` option in jekyll config.
* [Classifier Reborn](https://jekyll.github.io/classifier-reborn/) allows you to execute LSI.
* Optionally, to speed up LSI classification by at least 10x consider installing following libraries.
  * [GSL - GNU Scientific Library](https://www.gnu.org/software/gsl/)
  * [Ruby/GSL Gem(rb-gsl)](https://rubygems.org/gems/gsl)
  * 💡Check GSL dependencies at [Debian packages](https://packages.debian.org/search?searchon=sourcenames&keywords=gsl)

## Copyright

Copyright since 2016 [aloerina](https://twitter.com/aloerina_) All Rights Reserved.
