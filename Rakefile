require "rubygems"
require "tmpdir"

require "bundler/setup"
require "jekyll"


# Change your GitHub reponame
GITHUB_REPONAME = "aloerina01/aloerina01.github.io"


desc "Generate blog files"
task :generate do
  system "git fetch origin"
  system "git checkout -B staging origin/master"
  system "git reset --hard origin/development"

  Jekyll::Site.new(Jekyll.configuration({
    "source"      => ".",
    "destination" => "."
  })).process
end


desc "Generate and publish blog to gh-pages"
task :publish => [:generate] do
  # Dir.mktmpdir do |tmp|
  #   cp_r "_site/.", tmp

  #   pwd = Dir.pwd
  #   Dir.chdir tmp

    # system "git init"
    system "git add ."
    system "git status"
    system "git config --local user.name aloerina01"
    system "git config --local user.email kiss_mint27@yahoo.co.jp"
    message = "Site updated at #{Time.now.utc}"
    system "git commit -m #{message.inspect}"
    # system "git remote add origin git@github.com:#{GITHUB_REPONAME}.git"
    # system "git checkout -b staging"
    system "git push origin staging --force"

    # Dir.chdir pwd
  end
end
