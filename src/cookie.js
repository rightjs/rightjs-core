/**
 * this module handles the work with cookies
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
var Cookie = new Class({
  extend: {
    // sets the cookie
    set: function(name, value, options) {
      return new Cookie(name, options).set(value);
    },
    // gets the cookie
    get: function(name) {
      return new Cookie(name).get();
    },
    // deletes the cookie
    delete: function(name) {
      return new Cookie(name).delete();
    }
  },
  
  name: null,
  
  // some basic options
  options: {
    path: null,
    doman: null,
    duration: null,
    secure: false,
    document: document
  },
  
  /**
   * constructor
   * @param String cookie name
   * @param Object options
   * @return void
   */
  initialize: function(name, options) {
    this.name = name;
    this.options = Object.extend(this.options, options || {});
  },
  
  /**
   * sets the cookie with the name
   *
   * @param mixed value
   * @return Cookie this
   */
  set: function(value) {
    return this;
  },
  
  /**
   * searches for a cookie with the name
   *
   * @return mixed saved value or undefined if nothing found
   */
  get: function() {
  },
  
  delete: function() {
    this.options.duration = -1;
    this.write(null);
    return this;
  }
});