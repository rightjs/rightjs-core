#
# Here are some ruby based building tasks
#
#
#  You can pass options with the building script to exclude some blocks, like that
#
#  rake build OPTIONS=no-form,no-fx,no-xhr,no-cookie
#
#  See the JS_SOURCES list keys for the options
#

require 'rake'
require 'fileutils'
require File.dirname(__FILE__)+'/lib/front_compiler/init.rb'

RIGHTJS_VERSION = '1.5.0'

BUILD_DIR   = 'build'
BUILD_FILE  = 'right'

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
    fx/fx/scroll.js
    fx/element.js
  },
  
  :olds => %w{
    olds/ie.js
    olds/konq.js
    olds/css.js
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
  
  # filtering the modules
  %w(core form cookie xhr fx olds).each do |package|
    unless options.include?("no-#{package}")
      JS_SOURCES[package.to_sym].each do |file|
        source += File.open("src/#{file}", "r").read + "\n\n"
      end
      modules << package
    end
  end
  
  # hooking up the olds patch loader if necessary
  if options.include?('no-olds')
    source += File.open("src/olds/loader.js", "r").read
  end
    
  desc = File.open('src/right.js', 'r').read
  desc.gsub! '#{version}', RIGHTJS_VERSION
  desc.gsub! '#{modules}', modules.join('", "')
  
  source = desc + source
  
  minified = FrontCompiler.new.compact_js(source)
  
  
  ### writting the files
  
  puts ' * Writting files'
  header = File.open('src/HEADER.js', 'r').read
  header.gsub! "* Copyright", "* Custom build with options: #{options.join(", ")}\n *\n * Copyright" unless options.empty?
  
  File.open("#{BUILD_DIR}/#{BUILD_FILE}-src.js", "w") do |file|
    file.write header
    file.write source
  end
  
  File.open("#{BUILD_DIR}/#{BUILD_FILE}-min.js", "w") do |file|
    file.write header
    file.write minified
  end
  
  File.open("#{BUILD_DIR}/#{BUILD_FILE}.js", "w") do |file|
    file.write header
    file.write minified.create_self_build
  end
  
  ### building the olds patch file
  puts ' * Building the olds patch file'
  
  olds_source = ''
  JS_SOURCES[:olds].each do |file|
    olds_source += File.open("src/#{file}", "r").read + "\n\n"
  end
  
  olds_header = File.open("src/HEADER.olds.js", 'r').read
  olds_minified = FrontCompiler.new.compact_js(olds_source)
  
  File.open("#{BUILD_DIR}/#{BUILD_FILE}-olds-src.js", "w") do |file|
    file.write olds_header
    file.write olds_source
  end
  
  File.open("#{BUILD_DIR}/#{BUILD_FILE}-olds-min.js", "w") do |file|
    file.write olds_header
    file.write olds_minified
  end
  
  File.open("#{BUILD_DIR}/#{BUILD_FILE}-olds.js", "w") do |file|
    file.write olds_header
    file.write olds_minified.create_self_build
  end
  
end
