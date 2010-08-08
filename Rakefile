#
# Here are some ruby based building tasks
#
#
#  You can pass options with the building script to exclude some blocks, like that
#
#  rake build OPTIONS=no-dom,no-form,no-fx,no-xhr,no-cookie
#
#  Use the 'server' option to build the server version
#
#  rake build OPTIONS=server
#
#  See the $js_sources list keys for the options
#

require 'rake'
require 'fileutils'
require 'util/build/rutil'

RIGHTJS_VERSION = '2.0.0-rc'

BUILD_DIR     = 'build'
BUILD_FILE    = 'right'

## getting the sources list
initializer = File.read("src/__init__.js")[/\{.+\}/m]

$build_options = []
$js_sources    = {}

initializer.scan(/([a-z]+):\s*\[([^\]]+?)\]/).each do |item|
  $build_options << item[0]
  $js_sources[item[0].to_sym] = item[1].scan(/('|")([\w\d\_\/]+)\1/).collect{ |match|
    match[1]
  }
end

$options = ((ENV['OPTIONS'] || '').split('=').last || '').split(/\s*,\s*/)
$options.reject!{ |o| o == 'no-olds'} if $options.include?('safe')

######################################################################
#  Cleaning up the build directory
######################################################################
desc "Cleans up the build directory"
task :clean do
  unless $options == ['server'] or !File.exists?(BUILD_DIR)
    puts ' * Creating the build dir'
    FileUtils.rm_rf BUILD_DIR
    Dir.mkdir BUILD_DIR
  end
end

######################################################################
#  Packing the souce code
######################################################################
desc "Packs the source code"
task :pack do
  Rake::Task['clean'].invoke
  
  puts " * Composing the source file"
  
  modules  = []
  files    = []
  
  $build_options.each do |package|
    unless $options.include?("no-#{package}")
      files   += $js_sources[package.to_sym].collect{ |f| "src/#{f}.js" }
      modules << package
    end
  end
  
  # hooking up the olds patch loader if necessary
  files << "src/olds/loader.js" if $options.include?('no-olds')
  
  # initializing the packing utility
  $rutil = RUtil.new("dist/header.js", "dist/layout.js", {
    :version => RIGHTJS_VERSION, :modules => modules.join('", "')
  })
  $rutil.pack(files)
  $rutil.write("#{BUILD_DIR}/#{BUILD_FILE}.js")
end

######################################################################
#  Running the syntax check
######################################################################
desc "Runs JSLint on the source code"
task :check do
  Rake::Task['pack'].invoke
  puts " * Running the jslint check"
  $rutil.check "dist/lint.js"
end

######################################################################
#  Creating a standard build
######################################################################
desc "Builds the source code"
task :build do
  if $options.include?('safe')
    Rake::Task['build:safe'].invoke
  elsif $options.include?('server')
    Rake::Task['build:server'].invoke
  else
    Rake::Task['pack'].invoke
    puts " * Compressing the source code"
    $rutil.compile
    
    if $options.include?('no-olds')
      Rake::Task['build:olds'].invoke
    end
  end
end

######################################################################
#  Creating the olds module
######################################################################
desc "Builds the old browsers support module"
task 'build:olds' do
  puts " * Creating the old browsers support module"
  
  @util = RUtil.new("dist/header.olds.js")
  @util.pack($js_sources[:olds].collect{|f| "src/#{f}.js"})
  @util.write("#{BUILD_DIR}/#{BUILD_FILE}-olds.js")
  @util.compile
end

######################################################################
#  Creating the safemode build
######################################################################
desc "Builds the safe-mode version"
task 'build:safe' do
  # creating a normal build
  Rake::Task['pack'].invoke
  puts " * Compressing the source code"
  $rutil.compile
  
  # creating the safe-mode build
  puts " * Creating the safe-mode build"
  @rutil = RUtil.new("dist/header.safe.js", "dist/layout.safe.js")
  @rutil.pack(["#{BUILD_DIR}/#{BUILD_FILE}.js"]) do |source|
    source = source.gsub!(/\A\s*\/\*.*?\*\/\s*/m, '').strip
    "'#{source.gsub("\\","\\\\\\\\").gsub("'","\\\\'").gsub("\n", " '+\n'")}'"
  end
  @rutil.write("#{BUILD_DIR}/#{BUILD_FILE}-safe.js")
  @rutil.compile
end

######################################################################
#  Creating the server-side build
######################################################################
desc "Bulds the server-side version"
task 'build:server' do
  puts " * Creating the server side version"
  
  @util = RUtil.new("dist/header.server.js", "dist/layout.server.js")
  @util.pack($js_sources[:core].collect{|f| "src/#{f}.js"}) do |source|
    # removing dom related util methods and hacks
    source.gsub! /\n\/\/\s+!#server:begin.+?\/\/\s+!#server:end\n/m, ''
    source.gsub! /\/\*\*\s+!#server.+?(?=\/\*\*)/m, ''
    source.gsub! /\n[^\n]+\/\/\s*!#server\s*(\n)/m, '\1'
    source
  end
  @util.write("#{BUILD_DIR}/#{BUILD_FILE}-server.js")
end