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
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Options = {
  /**
   * assigns the options by merging them with the default ones
   *
   * @param Object options
   * @return Object current instance
   */
  setOptions: function(options) {
    var options = this.options = Object.merge(Class.findSet(this, 'options'), options), match, key;
    
    // hooking up the observer options
    if (isFunction(this.on)) {
      for (key in options) {
        if (match = key.match(/on([A-Z][A-Za-z]+)/)) {
          this.on(match[1].toLowerCase(), options[key]);
          delete(options[key]);
        }
      }
    }
    
    return this;
  },
  
  /**
   * Cuts of an options hash from the end of the arguments list
   * assigns them using the #setOptions method and then
   * returns the list of other arguments as an Array instance
   *
   * @param mixed iterable
   * @return Array of the arguments
   */
  cutOptions: function(args) {
    var args = $A(args);
    this.setOptions(isHash(args.last()) ? args.pop() : {});
    return args;
  }
};