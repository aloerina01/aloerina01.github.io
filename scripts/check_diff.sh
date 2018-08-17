#!/bin/sh

[ -z "$1" ] && echo "Failed: CircleCI API token is NOT found." && exit 1

api_path="https://circleci.com/api/v1.1/project/github/aloerina01/aloerina01.github.io?circle-token=$1&limit=1&offset=0&filter=completed"

revision=$(curl "$api_path" | jq .[0].vcs_revision)

[ -z "$revision" ] && echo "Failed: vcs_revision is empty." && exit 1

diffs=$(git diff --name-only $(eval echo $revision)... | grep -E "^.*_posts.*$")

if [ -z "$diffs" ]; then
  echo "No diff in /_posts/" && exit 1
else
  echo "$diff" && exit 0
fi