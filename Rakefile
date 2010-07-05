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
#  See the JS_SOURCES list keys for the options
#

require 'rake'
require 'fileutils'

RIGHTJS_VERSION = '2.0.0-beta'

BUILD_DIR   = 'build'
BUILD_FILE  = 'right'

BUILD_OPTIONS = %w(core dom form cookie xhr fx olds)

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
    core/options
    core/observer
    core/break
  },
  
  :dom => %w{
    dom/browser
    dom/wrapper
    
    dom/document
    dom/window
    
    dom/event
    dom/event/delegation

    dom/element
    dom/element/structs
    dom/element/styles
    dom/element/commons
    dom/element/dimensions
    dom/element/events
    
    dom/ready
    dom/selector
  },
  
  :cookie => %w{
    dom/cookie
  },
  
  :form => %w{
    dom/form
  },
  
  :xhr => %w{
    xhr/xhr
    xhr/form
    xhr/element
    xhr/xhr/dummy
    xhr/xhr/iframed
    xhr/xhr/jsonp
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
  
  def write_and_compress(file_name, header, source)
    # writting the source file
    File.open(file_name, "w") do |f|
      f.write header
      f.write source
    end
    
    # creating the compressed version
    min_file_name = file_name.gsub('-src', '');
    File.open(min_file_name, "w") do |f|
      f.write header
    end
    
    system "java -jar lib/google-compiler.jar --js=#{file_name} >> #{min_file_name}"
  end
  
  ### parsing the options
  options = ((ENV['OPTIONS'] || '').split('=').last || '').split(/\s*,\s*/)
  options.reject!{ |o| o == 'no-olds'} if options.include?('safe')
  
  ### preparing the directories
  unless options == ['server'] or !File.exists?(BUILD_DIR)
    puts ' * Creating the build dir'
    FileUtils.rm_rf BUILD_DIR
    Dir.mkdir BUILD_DIR
  end
  
  
  ### compiling the source code
  
  puts ' * Composing the final file'
  build = ''
  source = ''
  modules = []
  
  # filtering the modules
  BUILD_OPTIONS.each do |package|
    unless options.include?("no-#{package}")
      JS_SOURCES[package.to_sym].each do |file|
        source += File.read("src/#{file}.js") + "\n\n"
      end
      modules << package
    end
  end
    
  desc = File.read('src/right.js')
  desc.gsub! '#{version}', RIGHTJS_VERSION
  desc.gsub! '#{modules}', modules.join('", "')
  
  source = desc + source
  
  # loading up the layout
  layout = File.read('src/layout.js').split('#{source_code}')
  source = layout[0] + source + layout[1]
  
  # hooking up the olds patch loader if necessary
  if options.include?('no-olds')
    source << "\n\n"+ File.read("src/olds/loader.js")
    
    # using the namespaced $ and $$ calls so that they could be
    # overwritten in the olds module patch
    source.gsub!(/([^a-z\d\_\.\$])(\${1,2}\()/, '\1RightJS.\2')
  end
  
  
  ### writting the files
  puts ' * Creating the basic build'
  header = File.read('src/HEADER.js')
  if !options.empty? && options != ['no-olds']
    header.gsub! "* Copyright", "* Custom build with options: #{options.join(", ")}\n *\n * Copyright" unless options.empty?
  end
  
  write_and_compress("#{BUILD_DIR}/#{BUILD_FILE}-src.js", header, source)
  
  
  ### creating the safe-mode build
  if options.include?('safe')
    puts ' * Creating the safe-mode build'
    header = File.read('src/HEADER.safe.js')
    source = File.read("#{BUILD_DIR}/#{BUILD_FILE}.js")
    layout = File.read('src/layout.safe.js').split('#{source_code}')
    
    source = source.gsub(/\A\s*\/\*.*?\*\/\s*/m, '').strip
    source = layout[0] + "'#{source.gsub("\\","\\\\\\\\").gsub("'","\\\\'").gsub("\n", " '+\n'")}'" + layout[1]
    
    write_and_compress("#{BUILD_DIR}/#{BUILD_FILE}-safe-src.js", header, source)
  end
  
  
  ### building the olds patch file
  if options.include?('no-olds')
    puts ' * Building the olds patch file'
  
    olds_source = JS_SOURCES[:olds].collect do |file|
      File.read("src/#{file}.js")
    end.join("\n\n")
    
    write_and_compress(
      "#{BUILD_DIR}/#{BUILD_FILE}-olds-src.js",
      File.read("src/HEADER.olds.js"),
      olds_source
    )
  end

  ### creating the server build
  if options.include?('server')
    puts ' * Creating the server-side build'
    
    source = File.read("src/right.js") + JS_SOURCES[:core].collect do |file|
      File.read("src/#{file}.js")
    end.join("\n\n")
    
    source.gsub! '#{version}', RIGHTJS_VERSION
    source.gsub! '#{modules}', 'core'
    
    # removing dom related util methods and hacks
    source.gsub! /\n\/\/\s+!#server:begin.+?\/\/\s+!#server:end\n/m, ''
    source.gsub! /\/\*\*\s+!#server.+?(?=\/\*\*)/m, ''
    source.gsub! /\n[^\n]+\/\/\s*!#server\s*\n/m, ''
    
    # loading up the layout
    layout = File.read('src/layout.server.js').split('#{source_code}')
    source = layout[0] + source + layout[1]
    
    File.open("#{BUILD_DIR}/#{BUILD_FILE}-server.js", "w") do |file|
      file.write File.read("src/HEADER.server.js")
      file.write source
    end
  end

end
