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
require 'rubygems'
require 'front_compiler'

RIGHTJS_VERSION = '1.5.3'

BUILD_DIR   = 'build'
BUILD_FILE  = 'right'

JS_SOURCES = {
  :core => %w{
    core/util

    lang/object
    lang/math
    lang/array
    lang/string
    lang/function
    lang/number
    lang/regexp

    core/class
    core/class/methods

    core/options
    core/observer
    core/break
  },
  
  :dom => %w{
    dom/browser
    
    dom/event
    dom/event/custom
    dom/event/delegation

    dom/element
    dom/element/structs
    dom/element/styles
    dom/element/commons
    dom/element/dimensions
    dom/element/events

    dom/selector
    
    dom/window
    dom/ready
  },
  
  :cookie => %w{
    dom/cookie
  },
  
  :form => %w{
    dom/form
    dom/form/element
  },
  
  :xhr => %w{
    xhr/xhr
    xhr/form
    xhr/element
    xhr/iframed
  },
  
  :fx => %w{
    fx/fx
    fx/string
    fx/fx/morph
    fx/fx/highlight
    fx/fx/twin
    fx/fx/slide
    fx/fx/fade
    fx/fx/scroll
    fx/element
  },
  
  :olds => %w{
    olds/ie
    olds/konq
    olds/css
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
  %w(core dom form cookie xhr fx olds).each do |package|
    unless options.include?("no-#{package}")
      JS_SOURCES[package.to_sym].each do |file|
        source += File.open("src/#{file}.js", "r").read + "\n\n"
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
  
  # joining muli-lined strings
  source.gsub!(/('|")\s*\+\s*?\n\s*\1/, '')
  
  
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
  if options.include?('no-olds')
    puts ' * Building the olds patch file'
  
    olds_source = ''
    JS_SOURCES[:olds].each do |file|
      olds_source += File.open("src/#{file}", "r").read + "\n\n"
    end
    
    olds_source.gsub!(/('|")\s*\+\s*?\n\s*\1/, '')
  
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
  
end
