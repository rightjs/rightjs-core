/**
 * Nake is a 'make' or 'rake' like tasks manager for NodeJS
 *
 * Copyright (C) 2011 Nikolay Nemshilov
 */
var Nake = exports;

Nake.Version = '0.1.2';
Nake.Tasks   = {};
Nake.Default = null;  // default task to run
Nake.Quiet   = false; // log out the messages

var Scope    = '';    // current scope
var Colors   = Nake.Colors = {
  red:   31,
  green: 32,
  blue:  36
};
var LogIndent = '';   // used for nested task calls
var LogIndentStep = '  ';

/**
 * The entry point for the tasks
 *
 * @return void
 */
Nake.start = function() {
  var args = process.ARGV.slice(2);

  if (args.length === 0) {
    args = [Nake.Default];
  }

  switch (args[0]) {
    case '-l':
    case '--list':
      return Nake.printList();
    case '-h':
    case '--help':
      return Nake.printHelp();

    case '-q':
    case '--quiet':
      return Nake.Quiet = true;
  }

  for (var i=0; i < args.length; i++) {
    if (args[i] in Nake.Tasks) {
      Nake.Tasks[args[i]].run();
    }
  }
};



/**
 * The basic nake task unit
 *
 * @param {String} task name
 * @param {String} task description (optional)
 * @param {Function} the task callback function
 * @return void
 */
function Task(name, description, callback) {
  this.name = name;

  if (typeof(description) === 'function') {
    this.description = null;
    this.callback    = description;
  } else {
    this.description = description;
    this.callback    = callback;
  }

  Nake.Tasks[Scope + name] = this;
};

/**
 * Runs the task
 *
 * @param {Boolean} optional quiet run flag
 * @return {Task} this
 */
Task.prototype.run = function(quiet) {
  var old_quiet = Nake.Quiet;
  Nake.Quiet = quiet === undefined ? old_quiet : quiet;

  if (this.description) {
    this.title(this.description);
  }

  var old_log_indent = LogIndent;
  LogIndent += LogIndentStep;

  this.callback();

  LogIndent = old_log_indent;

  if (this.description) {
    this.done();
  }

  Nake.Quiet = old_quiet;

  return this;
};

/**
 * Prints out the task title
 *
 *
 * @param {String} title text
 * @param {String} optional color
 * @return {Task} this
 */
Task.prototype.title = function(text, color) {
  print(ljust("== "+ text +" ", 80 - LogIndent.length, '='), color || 'blue');
  return this;
};

/**
 * Prints out the step the task currently working on
 *
 * @param {String} step name
 * @param {String} optional color
 * @return {Task} this
 */
Task.prototype.step = function(text, color) {
  print("\r - "+ text, color);
  return this;
};

/**
 * Prints out the task-complete sign
 *
 * @param {String} optional text ('DONE' by default)
 * @param {String} optional label color ('green' by default)
 * @return {Task} this
 */
Task.prototype.done = function(text, color) {
  print(text || 'DONE', color || 'green');
  return this;
};


/**
 * A procedural style task creation
 *
 * @param {String} task name
 * @param {String} task description
 * @param {Function} the task callback function
 * @return {Task} new task object
 */
Nake.task = function(name, description, callback) {
  return new Task(name, description, callback);
};

/**
 * All the tasks that are defined inside of the
 * callback will be defined in the given scope
 *
 * @param {String} scope name
 * @param {Function} callback
 * @return void
 */
Nake.namespace = function(name, callback) {
  var old_scope = Scope;
  Scope += name + ':';

  callback();

  Scope = old_scope;
};

/**
 * Runs a task by name
 *
 * @param {String} task name
 * @param {Boolean} optional quiet run flag
 * @return {Task} the run task
 */
Nake.run = function(name, quiet) {
  if (!name in Nake.Tasks) {
    throw new Error("Nake: don't know a task named '"+ name + "'");
  }

  return Nake.Tasks[name].run(quiet);
};

/**
 * Prints the list of registered tasks
 *
 * @return void
 */
Nake.printList = function() {
  var tasks = {}, max_size = 0;

  for (var key in Nake.Tasks) {
    tasks[key] = Nake.Tasks[key];

    if (key.length > max_size) {
      max_size = key.length;
    }
  }

  Task.prototype.title("REGISTERED TASKS");

  for (var key in tasks) {
    console.log(
      'nake ' + ljust(key, max_size) + (
        Nake.Tasks[key].description ?
          colorize('  // ' + Nake.Tasks[key].description, '33') : ''
      )
    );
  }
};

/**
 * Prints out the help text
 *
 * @return void
 */
Nake.printHelp = function() {
  console.log(
    "nake [-f filename] {options} tasknames...       \n\n" +
    "Options are ...                                   \n" +
    "  -f, --file [FILE]      Use FILE as the nakefile \n" +
    "  -q, --quiet            No default log messages  \n" +
    "  -l, --list             List the known tasks     \n" +
    "  -h, --help             Display this help          "
  );
};



///////////////////////////////////////////////////////////////////////////////
//
// All sorts of private stuff
//
///////////////////////////////////////////////////////////////////////////////

/**
 * Prints out the text with the color and according to the log indents
 *
 * @param {String} text
 * @param {String} optional color
 * @return void
 */
function print(text, color) {
  if (!Nake.Quiet) {
    console.log(LogIndent + colorize(text, color));
  }
}

/**
 * Packs the given string to the given size
 *
 * @param {String} string
 * @param {Numeric} size
 * @return {String} result
 */
function ljust(str, size, filler) {
  filler = filler || ' ';

  while (str.length < size) {
    str += filler;
  }

  return str;
}

/**
 * Colorizes the string
 *
 * @param {String} the string
 * @param {String} color name or ASCII code
 * @return {String} with colors
 */
function colorize(str, color) {
  color = Colors[color] || color;

  return color ? "\u001B["+color+"m" + str + "\u001B[0m" : str;
}