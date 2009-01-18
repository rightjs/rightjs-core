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
  src/dom/element/styles.js
  src/dom/element/events.js
  src/dom/util.js
}

task :default => :build

task :build do
  puts ' * Creating the build dir'
  FileUtils.rm_rf BUILD_DIR
  Dir.mkdir BUILD_DIR
  
  puts ' * Compiling the sources'
  @compiler = FrontCompiler.new
  File.open(BUILD_DIR + "/" + BUILD_FILE, "w") do |file|
    file.write File.open('src/HEADER.js', 'r').read
    
    file.write @compiler.compact_files(JS_SOURCES)
  end
end

task :test do
  @compiler = FrontCompiler::JSCompactor.new
  @source = File.open('src/native/string.js').read
  @compiler.remove_comments(@source)
end