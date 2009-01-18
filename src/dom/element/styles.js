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
      var style = {}; style[hash] = value; hash = style;
    }
    $ext(this.style, Object.eachKey(hash, function(key) {
      return key.camelize();
    }));
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
    return this.getOwnStyle(key) || this.getViewStyle(key);
  },
  
  // returns the element own style value
  getOwnStyle: function(key) {
    return this._cleanStyle(this.style[key.camelize()]);
  },
  
  // returns the view level computed style
  getViewStyle: function(key) {
    return this._cleanStyle((document.defaultView ?
      document.defaultView.getComputedStyle(this, null) : this.currentStyle
    )[key.camelize()]);
  },
  
  // cleans up the style value
  _cleanStyle: function(value) {
    return (value && value != '') ? value : null;
  },
  
  /**
   * checks if the element has the given class name
   * 
   * @param String class name
   * @return boolean check result
   */
  hasClass: function(name) {
    return this.className.length && this.className.match(new RegExp('(^|\\s)'+ name + '(\\s|$)'));
  },

  /**
   * adds the given class name to the element
   *
   * @param String class name
   * @return Element self
   */
  addClass: function(name) {
    if (!this.hasClass(name)) {
      this.className += (this.className.length ? ' ' : '') + name;
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