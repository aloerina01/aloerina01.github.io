#!/bin/sh

text_color_red="\033[37;41;1m"
text_color_green="\033[37;42;1m"
text_color_reset="\033[0m"

[ -z "$1" ] && echo "${text_color_red}Failed${text_color_reset} CircleCI API token is NOT found." && exit 1
[ -z "$2" ] && echo "${text_color_red}Failed${text_color_reset} Algolia API key is NOT found." && exit 1

api_path="https://circleci.com/api/v1.1/project/github/aloerina01/aloerina01.github.io?circle-token=$1&limit=1&offset=0&filter=completed"

revision=$(curl "$api_path" | jq .[0].vcs_revision)

[ -z "$revision" ] && echo "${text_color_red}Failed${text_color_reset} vcs_revision is empty." && exit 1

diffs=$(git diff --name-only $(eval echo $revision)... | grep -E "^.*_posts.*$")

if [ -z "$diffs" ]; then
  echo "${text_color_green}Success${text_color_reset} No diff in /_posts/" && exit 0
else
  echo "$diffs"
  echo "${text_color_green}Success${text_color_reset} Start indexing." && ALGOLIA_API_KEY=$2 bundle exec jekyll algolia
fi