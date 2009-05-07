#
# Here are some ruby based building tasks
#

require 'rake'
require 'fileutils'
require File.dirname(__FILE__)+'/lib/front_compiler/init.rb'

BUILD_DIR = 'build'
BUILD_FILE = 'right.js'

JS_SOURCES = %w{
  core/util.js
  core/browser.js
  
  native/object.js
  native/math.js
  native/array.js
  native/string.js
  native/function.js
  native/number.js
  native/regexp.js
  
  core/class.js
  core/class/util.js
  core/class/methods.js
  
  util/observer.js
  util/cookie.js
  util/break.js
  
  dom/event.js
  dom/event/base.js
  dom/event/mouse.js
  dom/event/keyboard.js
  dom/event/custom.js
  
  dom/element.js
  dom/element/styles.js
  dom/element/commons.js
  dom/element/structs.js
  dom/element/dimensions.js
  dom/element/events.js
  
  dom/selector.js
  dom/selector/atom.js
  dom/selector/manual.js
  dom/selector/native.js
  dom/selector/multiple.js
  
  xhr/xhr.js
  xhr/element.js
  
  dom/extend.js
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
        File.open('src/'+file_name).read
      end.join("\n")
    ).create_self_build
  end
end

task :test do
  @compiler = FrontCompiler::JSCompactor.new
  @source = File.open('src/native/string.js').read
  @compiler.remove_comments(@source)
end