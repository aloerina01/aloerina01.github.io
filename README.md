# aloerina01.github.io

[![CircleCI](https://circleci.com/gh/aloerina01/aloerina01.github.io/tree/development.svg?style=svg)](https://circleci.com/gh/aloerina01/aloerina01.github.io/tree/development)


## What's this
[mille-feuille code](https://aloerina01.github.io/)

This is a blog written about some technical topics, by [Aloerina](https://twitter.com/aloerina_).


## Powered by

* [Github Pages](https://pages.github.com/) - Hosting service
* [jekyll](https://jekyllrb.com/) - Static web site generator
* [centrarium](https://github.com/bencentra/centrarium) - Design template


## Constitution

### development branch
jekyllベースの構成ファイル(markdownによる記事、_config.yml等)を持つ。このブランチのソースをjekyll publishすることでブログの静的ファイル群が生成される。

記事の追加、修正、ブログのデザイン修正など、何か手を加える際は必ずこのブランチで(もしくはここからトピックブランチを切り)行う。

`git push`するとCircleCIによって自動でpublishされる。

### master branch

publishされたものがmasterブランチにpushされ、それがGithub Pagesとして公開される。

#### rake task
publishはrake taskによって行われている。

`Jekyll::new`によってdeployされた`_site`ディレクトリが生成されるが、それをmasterに反映するためには`git init`が必要で、そのためにmasterブランチにコミットが積まれない問題がある。

See: [Using Jekyll plugins on GitHub Pages](http://ixti.net/software/2013/01/28/using-jekyll-plugins-on-github-pages.html)