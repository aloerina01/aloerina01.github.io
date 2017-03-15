require "rubygems"
require "tmpdir"

require "bundler/setup"
require "jekyll"


# Change your GitHub reponame
GITHUB_REPONAME = "aloerina01/aloerina01.github.io"


desc "Generate blog files"
task :generate do
  Jekyll::Site.new(Jekyll.configuration({
    "source"      => ".",
    "destination" => "_site"
  })).process
end


desc "Generate and publish blog to gh-pages"
task :publish do
  system "git fetch origin"
  system "git checkout -B deploy origin/development"
  system "git reset --hard origin/development"
  
  Dir.mktmpdir do |tmp|
    cp_r "_site/.", tmp

    pwd = Dir.pwd
    Dir.chdir tmp

    [:generate]

    system "git init"
    system "git add ."
    system "git config --local user.name aloerina01"
    system "git config --local user.email kiss_mint27@yahoo.co.jp"
    message = "Site updated at #{Time.now.utc}"
    system "git commit -m #{message.inspect}"
    system "git remote add origin git@github.com:#{GITHUB_REPONAME}.git"
    system "git push origin deploy --force"

    Dir.chdir pwd
  end
end