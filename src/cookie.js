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
    var value = encodeURIComponent(value);
    if (this.options.domain) value += '; domain=' + this.options.domain;
    if (this.options.path) value += '; path=' + this.options.path;
    if (this.options.duration){
      var date = new Date();
      date.setTime(date.getTime() + this.options.duration * 24 * 60 * 60 * 1000);
      value += '; expires=' + date.toGMTString();
    }
    if (this.options.secure) value += '; secure';
    this.options.document.cookie = this.key + '=' + value;
    return this;
  },
  
  /**
   * searches for a cookie with the name
   *
   * @return mixed saved value or null if nothing found
   */
  get: function() {
    var value = this.options.document.cookie.match('(?:^|;)\\s*' + this.key.escapeRegExp() + '=([^;]*)');
    return (value) ? decodeURIComponent(value[1]) : null;
  },
  
  /** 
   * removes the cookie
   *
   * @return Cookie this
   */
  delete: function() {
    this.options.duration = -1;
    this.write('');
    return this;
  }
});