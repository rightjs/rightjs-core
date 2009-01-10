/**
 * this module contains the element unit styles related methods
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Element.Styles = {
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
    if (value) {
      eval('var hash = {"'+hash+'": value};');
    }
    var style = {};
    for (var key in hash) {
      style[key.camelize()] = hash[key];
    }
    Object.extend(this.style, style);
    return this;
  },
  
  /**
   * checks if the element has the given class name
   * 
   * @param String class name
   * @return boolean check result
   */
  hasClass: function(name) {
    return this.className.length > 0 && this.className.match(new RegExp('(^|\\s)'+ name + '(\\s|$)'));
  },

  /**
   * adds the given class name to the element
   *
   * @param String class name
   * @return Element self
   */
  addClass: function(name) {
    if (!this.hasClass(name)) {
      this.className += (this.className.length > 0 ? ' ' : '') + name;
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
    this.className = this.className.replace(new RegExp('(^|\\s)'+ name + '(?:\\s|$)'), '$1');
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
   }
};