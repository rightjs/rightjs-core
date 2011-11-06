/**
 * this module handles the work with cookies
 *
 * Credits:
 *   Most things in the unit are take from
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov
 */
var Cookie = RightJS.Cookie = new Class({
  include: Options,

  extend: {
    // sets the cookie
    set: function(name, value, options) {
      return new this(name, options).set(value);
    },
    // gets the cookie
    get: function(name, options) {
      return new this(name, options).get();
    },
    // deletes the cookie
    remove: function(name, options) {
      return new this(name, options).remove();
    },

    // checks if the cookies are enabled
    enabled: function() {
      document.cookie = "__t=1";
      return document.cookie.indexOf("__t=1")!=-1;
    },

    // some basic options
    Options: {
      secure:   false,
      document: document
    }
  },

  /**
   * constructor
   * @param String cookie name
   * @param Object options
   * @return void
   */
  initialize: function(name, options) {
    this.name = name;
    this.setOptions(options);
  },

  /**
   * sets the cookie with the name
   *
   * @param mixed value
   * @return Cookie this
   */
  set: function(data) {
    if (!isString(data)) { data = JSON.stringify(data); }

    var value = encodeURIComponent(data), options = this.options;

    if (options.domain) { value += '; domain=' + options.domain; }
    if (options.path)   { value += '; path=' + options.path; }
    if (options.duration) {
      var date = new Date();
      date.setTime(date.getTime() + options.duration * 24 * 60 * 60 * 1000);
      value += '; expires=' + date.toGMTString();
    }
    if (options.secure) { value += '; secure'; }
    options.document.cookie = this.name + '=' + value;
    return this;
  },

  /**
   * searches for a cookie with the name
   *
   * @return mixed saved value or null if nothing found
   */
  get: function() {
    var value = this.options.document.cookie.match(
      '(?:^|;)\\s*' + RegExp.escape(this.name) + '=([^;]*)'
    );
    if (value) {
      value = decodeURIComponent(value[1]);
      try { value = JSON.parse(value); }
      catch (e) {}
    }
    return value || null;
  },

  /**
   * removes the cookie
   *
   * @return Cookie this
   */
  remove: function() {
    this.options.duration = -1;
    return this.set('');
  }
});
