/**
 * This is a simple mix-in module to be included in other classes
 *
 * Basically it privdes the <tt>setOptions</tt> method which processes
 * an instance options assigment and merging with the default options
 *
 * Credits:
 *   The idea of the module is inspired by
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
var Options = {
  /**
   * assigns the options by merging them with the default ones
   *
   * @param Object options
   * @return Object current instance
   */
  setOptions: function(options) {
    var names = $w('OPTIONS Options options'),
      objects = [this, this.constructor].concat(this.constructor.ancestors),
      OPTIONS = objects.map(function(object) {
        return names.map(function(name) { return object[name]; });
      }).flatten().first(function(i) { return !!i; });
    
    this.options = Object.merge({}, OPTIONS, options);
    
    // hooking up the observer options
    if (isFunction(this.on)) {
      var match;
      for (var key in this.options) {
        if (match = key.match(/on([A-Z][a-z]+)/)) {
          this.on(match[1].toLowerCase(), this.options[key]);
          delete(this.options[key]);
        }
      }
    }
    
    return this;
  }
};