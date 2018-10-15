#!/usr/bin/env bash
# ubuntu は /bin/sh が dash ... 

text_color_red="\e[37;41;1m"
text_color_green="\e[37;42;1m"
text_color_reset="\e[m"

ci_token=$1
algolia_token=$2

success () {
  printf "${text_color_green}Success${text_color_reset} $1"
}

err () {
  printf "${text_color_red}Failed${text_color_reset} $1"
}

validate () {
  [[ -z "$1" ]] && err "CircleCI API token is NOT found." && exit 1
  [[ -z "$2" ]] && err "Algolia API key is NOT found." && exit 1
}

fetch_revisions () {
  api_path="https://circleci.com/api/v1.1/project/github/aloerina01/aloerina01.github.io?circle-token=$ci_token&limit=1&filter=completed"
  cuerrent_result="offset=0"
  latest_result="offset=2" # build と indexing で2回分のCI結果が積まれるため
  current_revision=$(curl "$api_path&$cuerrent_result" | jq -r .[0].vcs_revision)
  latest_revision=$(curl "$api_path&$latest_result" | jq -r .[0].vcs_revision)
  [[ -z "$current_revision" || -z "$latest_revision" ]] && err "vcs_revision is empty." && exit 1
  echo "$latest_revision...$current_revision" 
}

check_diff () {
  revisions=$(cat -)
  echo $(git diff --name-only $revisions | grep -E "^.*_posts.*$")
}

publish_algolia () {
  diff=$(cat -)
  if [[ -z "$diff" ]]; then
    success "No diff in /_posts/" && exit 0
  else
    success "Start indexing." && ALGOLIA_API_KEY=$algolia_token bundle exec jekyll algolia --config ./_config.algolia.yml
  fi
}

# main
validate "$ci_token" "$algolia_token"
fetch_revisions | check_diff | publish_algolia
