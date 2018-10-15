#!/usr/bin/env bash
# ubuntu は /bin/sh が dash ... 

text_bold="\e[34;47;1m"
text_color_red="\e[37;41;1m"
text_color_green="\e[37;42;1m"
text_color_reset="\e[m"

ci_token=$1
algolia_token=$2
github_token=$3

success () {
  printf "${text_color_green}Success${text_color_reset} $1\n"
}

err () {
  printf "${text_color_red}Failed${text_color_reset} $1\n"
}

message () {
  printf "${text_bold}Log${text_color_reset} $1\n"
}

validate () {
  [[ -z "$1" ]] && err "CircleCI API token is NOT found." && exit 1
  [[ -z "$2" ]] && err "Algolia API key is NOT found." && exit 1
  [[ -z "$3" ]] && err "GitHub API token is NOT found." && exit 1
}

check_force_publish () {
  [[ -z "$CIRCLE_SHA1" ]] && message "'CIRCLE_SHA1' is empty." && return 1
  
  api_path="https://api.github.com/repos/aloerina01/aloerina01.github.io/commits/$CIRCLE_SHA1?token=$github_token"
  is_force=$(curl "$api_path" | jq -r .commit.message | grep -E "^.*\[indexing\].*$")
  if [[ -n "$is_force" ]]; then 
    message "Forced indexing." && return 0
  else
    message "Not execute forced indexing." return 1
  fi
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
  message "revisions: $revisions"
  diff=$(git diff --name-only $revisions | grep -E "^.*_posts.*$")
  if [[ -z "$diff" ]]; then
    success "No diff in /_posts/" && return 1
  else
    message "Posts are modified." && return 0
  fi
}

publish_algolia () {
  success "Start indexing." && ALGOLIA_API_KEY=$algolia_token bundle exec jekyll algolia --config ./_config.algolia.yml
}

# main
validate "$ci_token" "$algolia_token" "$github_token"
check_force_publish && publish_algolia
fetch_revisions | check_diff && publish_algolia
