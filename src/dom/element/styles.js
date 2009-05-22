/**
 * this module contains the element unit styles related methods
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Element.addMethods({
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
    if (value) { var style = {}; style[hash] = value; hash = style; }
    
    var c_key;
    for (var key in hash) {
      c_key = key.indexOf('-') != -1 ? key.camelize() : key;
      
      if (key == 'opacity' && Browser.IE) {
        c_key = 'filter';
        hash[key] = 'alpha(opacity='+ hash[key] * 100 +')';
      } else if (key == 'float') {
        c_key = Browser.IE ? 'styleFloat' : 'cssFloat';
      }
      
      this.style[c_key] = hash[key];
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
    return this._getStyle(this.style, key) || this._getStyle((document.defaultView ?
      document.defaultView.getComputedStyle(this, null) : this.currentStyle || {}
    ), key);
  },
  
  // cleans up the style value
  _getStyle: function(style, key) {
    var value, key = key.camelize();
    
    switch (key) {
      case 'opacity':
        value = !Browser.IE ? style[key] :
          (((style['filter'] || '').match(/opacity=(\d+)/i) || ['', '100'])[1].toInt() / 100)+'';
        break;
        
      case 'float':
        key   = Browser.IE ? 'styleFloat' : 'cssFloat';
      default:
        value = style[key];
    }
    
    return value ? value : null;
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
   * sets the whole class-name string for the element
   *
   * @param String class-name
   * @return Element self
   */
  setClass: function(class_name) {
    this.className = class_name;
    return this;
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
    this.className = this.className.replace(new RegExp('(^|\\s)' + name + '(?:\\s|$)'), '$1');
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