/**
 * Various scripts loading tools
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
var

// figuring out the current environment
current_location = document.location.toString().replace(/#.*?$/, ''),

in_safe_mode   = current_location.toString().match(/(\?|&)safe/),
testing_builds = current_location.toString().match(/(\?|&)build/),

javascripts = document.getElementsByTagName('script'),
current_src = javascripts[0].getAttribute('src'),
root_path   = current_src.split('util/tools')[0];


// automatically loading up the core if asked
if (current_src.match(/\?core$/)) {
  initialize_core_test_page();
}


/**
 * Includes the filename on the page
 *
 * @param String filename (without the '.js' suffix)
 * @return void
 */
function include_js(filename) {
  document.write('<scr'+'ipt type="text/javascript" src="'+root_path + filename+'.js"></scr'+'ipt>');
};

/**
 * Includes a stylesheet file on the page
 *
 * @param String filename (without the '.css' suffix)
 * @return void
 */
function include_css(filename) {
  document.write('<li'+'nk rel="stylesheet" type="text/css" href="'+ root_path + filename +'.css" />');
};

/**
 * Includes the rightjs build and optional modules
 *
 * @param String module name
 * ..............
 * @return void
 */
function include_right_js() {
  include_js('util/right' + (in_safe_mode ? '-safe' : ''));

  for (var i=0; i < arguments.length; i++) {
    include_js('util/right-'+ arguments[i]);
  }
};

/**
 * Builds a basic test-page structure
 *
 * @param String mode-switching links
 * @return void
 */
function build_test_page(links) {
  include_css('util/test-page');

  if (!links) {
    var no_safe_location  = current_location.replace(/(\?|&)safe=[^?&]+/,  '');
    var no_build_location = current_location.replace(/(\?|&)build=[^?&]+/, '');

    links = '' +
      '<a href="'+ (no_safe_location + (in_safe_mode ? '' :
        (no_safe_location.indexOf('?') < 0 ? '?' : '&') + 'safe=1')
      )+ '" class="safe">'+ (in_safe_mode ? 'Normal Mode' : 'Safe Mode') + '</a>' +
      '<a href="'+ (no_build_location + (testing_builds ? '' :
        (no_build_location.indexOf('?') < 0 ? '?' : '&') + 'build=1')
      )+ '" class="build">'+ (testing_builds ? 'Test Source' : 'Test Builds') + '</a>'
    ;
  }

  if (in_safe_mode)   document.title += ' / Safe Mode';
  if (testing_builds) document.title += ' / Builds';

  document.write('<h1 id="header">'+ document.title + links +'</h1>');
};

/**
 * Initializes the core test-page
 *
 * @return void
 */
function initialize_core_test_page() {
  include_js('util/testcase');


  if (in_safe_mode) {
    include_js("build/right-safe-src");
  } else if (testing_builds) {
    include_js("build/right");
  } else {
    include_js("src/__init__");
  }

  var clean_link = current_location.replace(/\?.*?$/, '');

  build_test_page('<ul id="modes">' +
    '<li'+(!in_safe_mode && !testing_builds ? ' class="current"':'')+'><a href="'+ clean_link + '">Source Mode</a></li>' +
    '<li'+(testing_builds ? ' class="current"':'')+'><a href="'+ clean_link + '?build=1">Build Mode</a></li>' +
    '<li'+(in_safe_mode ? ' class="current"':'')+'><a href="'+ clean_link + '?safe=1">Safe Mode</a></li>' +
  '</ul>');
};

/**
 * Builds the page structure with headers and stuff
 *
 * @return void
 */
function initialize_test_page() {
  include_js('util/testcase');
  include_right_js();

  build_test_page();
};

/**
 * Initializes an UI module test-page
 *
 * @param String module name
 * .....
 * @return void
 */
function initialize_ui_test_page() {
  include_right_js.apply(this, arguments);
  include_shared_js('widget');
  build_test_page();
};

/**
 * Loads up the modules
 *
 * @param String module name
 * ....
 * @return void
 */
var modules_queue = [];
function load_modules() {
  if (testing_builds) {
    for (var i=0; i < arguments.length; i++) {
      include_js('build/right-'+ arguments[i].replace(/_/g, '-'));
    }
  } else {
    for (var i=0; i < arguments.length; i++) {
      modules_queue.push(arguments[i]);
      include_js('src/'+ arguments[i] + '/__init__');
    }
  }
};

/**
 * Loads up the ui-modules
 * basically the same as `load_modules` but also
 * hooks up the module css files
 *
 * @param String module name
 * .......
 * @return void
 */
function load_ui_modules() {
  load_modules.apply(this, arguments);

  if (!testing_builds) {
    for (var i=0; i < arguments.length; i++) {
      include_css('src/'+ arguments[i] + '/' + arguments[i]);
    }
  }
};

/**
 * Hooks up the currently loading module file
 *
 * @param String file name
 * .....
 * @return void
 */
function include_module_files() {
  var module = modules_queue.shift();

  for (var i=0; i < arguments.length; i++) {
    include_js('src/'+ module + '/' + arguments[i]);
  }
};

/**
 * Hooks up a list of files from the 'src/' directory
 *
 * @param String file name
 * ........
 * @return void
 */
function include_sources() {
  for (var i=0; i < arguments.length; i++) {
    include_js('src/'+ arguments[i]);
  }
};

/**
 * Includes the sourcefiles organized in a hash of
 * modules
 *
 * @param Object hash of modules
 * @return void
 */
function include_sources_by_modules(modules) {
  for (var name in modules) {
    include_sources.apply(this, modules[name]);
  }
};

/**
 * Includes a shared piece of javascript from the 'lib/' directory
 *
 * @param String file name
 * .....
 * @return void
 */
function include_shared_js() {
  for (var i=0; i < arguments.length; i++) {
    include_js('lib/'+ arguments[i]);
  }
};

/**
 * Includes a shared css-file out of the 'lib/css/' directory
 *
 * @param String file name
 * ............
 * @return void
 */
function include_shared_css() {
  for (var i=0; i < arguments.length; i++) {
    include_css('lib/css/'+ arguments[i]);
  }
};

/**
 * Loads up and initializes the tests
 *
 * @param Object test definition
 * @return void
 */
function run_tests(tests) {
  var names = [];

  for (var name in tests) {
    names.push(name);
    include_js('test/'+ tests[name] + '_test');
  }

  window.onload = function() {
    setTimeout(function() {
      eval('new TestSuite('+names.join(',')+').run()');
    }, 50);
  };
};