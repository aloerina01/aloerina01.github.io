require 'rake-jekyll'

Rake::Jekyll::GitDeployTask.new(:deploy) do |t|
    
  # Deploy the built site into remote branch named 'gh-pages', or 'master' if
  # the remote repository URL matches `#{gh_user}.github.io.git`.
  # It will be automatically created if not exist yet.
  t.deploy_branch = 'master'

  # The commit message will contain hash of the source commit.
  t.commit_message = -> {
    "[CI skip]Built from #{`git rev-parse --short HEAD`.strip}"
  }

  # Use URL of the 'origin' remote to fetch/push the built site into. If env.
  # variable GH_TOKEN is set, then it adds it as a userinfo to the URL.
  t.remote_url = -> {
    url = `git config remote.origin.url`.strip.gsub(/^git:/, 'https:')
    next url.gsub(%r{^https://([^/]+)/(.*)$}, 'git@\1:\2') if ssh_key_file?
    next url.gsub(%r{^https://}, "https://#{ENV['GH_TOKEN']}@") if ENV.key? 'GH_TOKEN'
    next url
  }

end
