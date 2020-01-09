#!/usr/bin/env bash
# ubuntu は /bin/sh が dash ...

text_bold="\e[34;47;1m"
text_color_red="\e[37;41;1m"
text_color_green="\e[37;42;1m"
text_color_reset="\e[m"

algolia_token=$1
github_token=$2
trigger_sha=$GITHUB_SHA # GitHub Actions default env
github_commit_api="https://api.github.com/repos/aloerina01/aloerina01.github.io/commits"

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
  [[ -z "$1" ]] && err "Algolia API key is NOT found." && exit 1
  [[ -z "$2" ]] && err "GitHub API token is NOT found." && exit 1
}

check_force_publish () {
  [[ -z "$trigger_sha" ]] && message "'trigger_sha' is empty." && return 1
  
  is_force=$(curl "$github_commit_api/$trigger_sha" | jq -r .commit.message | grep -E "^.*\[indexing\].*$")
  if [[ -n "$is_force" ]]; then 
    message "Forced indexing." && return 0
  else
    message "Not execute forced indexing." && return 1
  fi
}

check_diff () {
  latest_sha=$(curl "$github_commit_api?sha=development" | jq -r .[1].sha)
  message "Revisions: $trigger_sha...$latest_sha"
  [[ -z "$trigger_sha" || -z "$latest_sha" || "$latest_sha" = "null" ]] && err "Revisions could not be found." && exit 1
  diff=$(git diff --name-only $trigger_sha...$latest_sha | grep -E "^.*_posts.*$")
  if [[ -z "$diff" ]]; then
    success "No diff in /_posts/" && exit 0
  else
    message "Posts are modified." && return 0
  fi
}

publish_algolia () {
  success "Start indexing." && ALGOLIA_API_KEY=$algolia_token bundle exec jekyll algolia --config ./_config.algolia.yml
}

# main
validate "$algolia_token" "$github_token"
check_force_publish && publish_algolia | exit 0
check_diff && publish_algolia
