/**
 * This is a simple mix-in module to be included in other classes
 *
 * Basically it privdes the <tt>setOptions</tt> method which processes
 * an instance options assigment and merging with the default options
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
    var OPTIONS = this.OPTIONS || this.constructor.OPTIONS, ancestor;
    
    if (!OPTIONS && (ancestor = this.constructor.ancestors.any('OPTIONS'))) {
      OPTIONS = ancestor.OPTIONS;
    }
    
    this.options = Object.merge({}, OPTIONS, options);
    
    return this;
  }
};