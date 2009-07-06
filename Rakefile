#
# Here are some ruby based building tasks
#
#
#  You can pass options with the building script to exclude some blocks, like that
#
#  rake build OPTIONS=no-form,no-fx,no-xhr
#
#  See the JS_SOURCES list keys for the options
#
#  to create simply compressed non-self build script pass 'no-build' with the options
#

require 'rake'
require 'fileutils'
require File.dirname(__FILE__)+'/lib/front_compiler/init.rb'

RIGHTJS_VERSION = '1.1.0'

BUILD_DIR   = 'build'
BUILD_FILE  = 'right.js'
SOURCE_FILE = 'right-src.js'

JS_SOURCES = {
  :core => %w{
    core/browser.js
    core/util.js

    lang/object.js
    lang/math.js
    lang/array.js
    lang/string.js
    lang/function.js
    lang/number.js
    lang/regexp.js

    core/class.js
    core/class/util.js
    core/class/methods.js

    util/options.js
    util/observer.js
    util/break.js
    
    dom/event.js
    dom/event/custom.js

    dom/element.js
    dom/element/structs.js
    dom/element/styles.js
    dom/element/commons.js
    dom/element/dimensions.js
    dom/element/events.js

    dom/selector.js
    dom/selector/atom.js
    dom/selector/manual.js
    dom/selector/native.js
    dom/selector/multiple.js
    
    dom/window.js
    dom/ready.js
  },
  
  :cookie => %w{
    util/cookie.js
  },
  
  :form => %w{
    dom/form.js
    dom/form/element.js
  },
  
  :xhr => %w{
    xhr/xhr.js
    xhr/form.js
    xhr/element.js
    xhr/iframed.js
  },
  
  :fx => %w{
    fx/fx.js
    fx/array.js
    fx/string.js
    fx/fx/morph.js
    fx/fx/highlight.js
    fx/fx/twin.js
    fx/fx/slide.js
    fx/fx/fade.js
    fx/element.js
  }
}

task :default => :build

task :build do
  ### parsing the options
  options = ((ENV['OPTIONS'] || '').split('=').last || '').split(/\s*,\s*/)
  
  ### preparing the directories
  
  puts ' * Creating the build dir'
  FileUtils.rm_rf BUILD_DIR
  Dir.mkdir BUILD_DIR
  
  
  ### compiling the source code
  
  puts ' * Compiling the sources'
  build = ''
  source = ''
  modules = []
  
  %w(core form cookie xhr fx).each do |package|
    unless options.include?("no-#{package}")
      JS_SOURCES[package.to_sym].each do |file|
        source += File.open("src/#{file}", "r").read + "\n\n"
      end
      modules << package
    end
  end
  
  desc = File.open('src/right.js', 'r').read
  desc.gsub! '#{version}', RIGHTJS_VERSION
  desc.gsub! '#{modules}', modules.join('", "')
  
  source = desc + source
  
  build = FrontCompiler.new.compact_js(source)
  build = build.create_self_build unless options.include?("no-build")
  
  
  ### writting the files
  
  puts ' * Writting files'
  header = File.open('src/HEADER.js', 'r').read
  header.gsub! "* Copyright", "* Custom build with options: #{options.join(", ")}\n *\n * Copyright" unless options.empty?
  
  
  File.open(BUILD_DIR + "/" + BUILD_FILE, "w") do |file|
    file.write header
    file.write build
  end
  
  File.open(BUILD_DIR + "/" + SOURCE_FILE, "w") do |file|
    file.write header
    file.write source
  end
end
