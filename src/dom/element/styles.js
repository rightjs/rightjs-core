/**
 * this module contains the element unit styles related methods
 *
 * Credits:
 *   Some of the functionality is inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *     - Dojo      (www.dojotoolkit.org)      Copyright (C) The Dojo Foundation
 *
 * Copyright (C) 2008-2011 Nikolay V. Nemshilov
 */
Element.include({
  /**
   * assigns styles out of the hash to the element
   *
   * NOTE: the style keys might be camelized or dasherized, both cases should work
   *
   * @param Object styles list or String style name
   * @param String style value in case of the first param a string style name
   * @return Element self
   */
  setStyle: function(hash, value) {
    var key, c_key, style = {}, element_style = this._.style;

    if (value !== undefined) { style[hash] = value; hash = style; }
    else if(isString(hash)) {
      hash.split(';').each(function(option) {
        var els = option.split(':').map('trim');
        if (els[0] && els[1]) {
          style[els[0]] = els[1];
        }
      });
      hash = style;
    }


    for (key in hash) {
      c_key = key.indexOf('-') < 0 ? key : key.camelize();

      if (key === 'opacity') {
        if (Browser_IE) {
          element_style.filter = 'alpha(opacity='+ hash[key] * 100 +')';
        } else {
          element_style.opacity = hash[key];
        }
      } else if (key === 'float') {
        c_key = Browser_IE ? 'styleFloat' : 'cssFloat';
      }

      element_style[c_key] = hash[key];
    }

    return this;
  },

  /**
   * returns style of the element
   *
   * NOTE: will include the CSS level definitions
   *
   * @param String style key
   * @return String style value or null if not set
   */
  getStyle: function(key) {
    return clean_style(this._.style, key) || clean_style(this.computedStyles(), key);
  },

  /**
   * returns the hash of computed styles for the element
   *
   * @return Object/CSSDefinition computed styles
   */
  computedStyles: HTML.currentStyle ? function() {
    return this._.currentStyle;
  } : HTML.runtimeStyle ? function() {
    return this._.runtimeStyle;
  } : function() {
    return this._.ownerDocument.defaultView.getComputedStyle(this._, null);
  },

  /**
   * checks if the element has the given class name
   *
   * @param String class name
   * @return boolean check result
   */
  hasClass: function(name) {
    return (' '+this._.className+' ').indexOf(' '+name+' ') != -1;
  },

  /**
   * sets the whole class-name string for the element
   *
   * @param String class-name
   * @return Element self
   */
  setClass: function(class_name) {
    this._.className = class_name;
    return this;
  },

  /**
   * Returns the current class-name
   *
   * @return String class-name
   */
  getClass: function() {
    return this._.className;
  },

  /**
   * adds the given class name to the element
   *
   * @param String class name
   * @return Element self
   */
  addClass: function(name) {
    var testee = ' '+this._.className+' ';
    if (testee.indexOf(' '+name+' ') == -1) {
      this._.className += (testee === '  ' ? '' : ' ') + name;
    }
    return this;
  },

  /**
   * removes the given class name
   *
   * @param String class name
   * @return Element self
   */
  removeClass: function(name) {
    this._.className = (' '+this._.className+' ').replace(' '+name+' ', ' ').trim();
    return this;
  },

  /**
   * toggles the given class name on the element
   *
   * @param String class name
   * @return Element self
   */
   toggleClass: function(name) {
     return this[this.hasClass(name) ? 'removeClass' : 'addClass'](name);
   },

   /**
    * adds the given class-name to the element
    * and removes it from all the element siblings
    *
    * @param String class name
    * @return Element self
    */
   radioClass: function(name) {
     this.siblings().each('removeClass', name);
     return this.addClass(name);
   }
});

/**
 * cleans up a style value
 *
 * @param Object styles hash
 * @param String style-key
 * @return String clean style
 */
function clean_style(style, key) {
  key = key.camelize();

  if (key === 'opacity') {
    return Browser_IE ? (
      (/opacity=(\d+)/i.exec(style.filter || '') ||
      ['', '100'])[1].toInt() / 100
    )+'' :style[key].replace(',', '.');
  }

  if (key === 'float') {
    key = Browser_IE ? 'styleFloat' : 'cssFloat';
  }

  var value = style[key];

  // Opera returns named colors with quotes
  if (Browser_Opera && /color/i.test(key) && value) {
    value = value.replace(/"/g, '');
  }

  return value;
}
