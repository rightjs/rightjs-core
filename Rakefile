#
# Here are some ruby based building tasks
#

require 'rake'
require 'fileutils'
require File.dirname(__FILE__)+'/lib/front_compiler/init.rb'

BUILD_DIR = 'build'
BUILD_FILE = 'right.js'

JS_SOURCES = %w{
  src/core/util.js
  src/core/browser.js
  src/native/object.js
  src/native/math.js
  src/native/array.js
  src/native/string.js
  src/native/function.js
  src/native/number.js
  src/core/class.js
  src/core/class/util.js
  src/core/class/methods.js
  src/util/cookie.js
  src/dom/element.js
  src/dom/element/commons.js
  src/dom/element/structs.js
  src/dom/element/styles.js
  src/dom/element/events.js
  src/dom/selector.js
  src/dom/extend.js
}

task :default => :build

task :build do
  puts ' * Creating the build dir'
  FileUtils.rm_rf BUILD_DIR
  Dir.mkdir BUILD_DIR
  
  puts ' * Compiling the sources'
  
  File.open(BUILD_DIR + "/" + BUILD_FILE, "w") do |file|
    file.write File.open('src/HEADER.js', 'r').read
    
    file.write FrontCompiler.new.compact_js(
      JS_SOURCES.collect do |file_name|
        File.open(file_name).read
      end.join("\n")
    ).create_self_build
  end
end

task :test do
  @compiler = FrontCompiler::JSCompactor.new
  @source = File.open('src/native/string.js').read
  @compiler.remove_comments(@source)
end