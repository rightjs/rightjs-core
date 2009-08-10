/**
 * this module contains the element unit styles related methods
 *
 * Credits:
 *   Some of the functionality is inspired by 
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *     - Dojo      (www.dojotoolkit.org)      Copyright (C) The Dojo Foundation
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
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
    else if(isString(hash)) {
      var style = {};
      hash.split(';').each(function(option) {
        var els = option.split(':').map('trim');
        if (els[0] && els[1]) {
          style[els[0]] = els[1];
        }
      });
      hash = style;
    }
    
    var c_key;
    for (var key in hash) {
      c_key = key.indexOf('-') != -1 ? key.camelize() : key;
      
      if (key == 'opacity') {
        this.setOpacity(hash[key]);
      } else if (key == 'float') {
        c_key = Browser.IE ? 'styleFloat' : 'cssFloat';
      }
      
      this.style[c_key] = hash[key];
    }
    
    return this;
  },
  
  /**
   * handles the opacity setting
   *
   * @param Float opacity value between 0 and 1
   * @return Element self
   */
  setOpacity: function(value) {
    var key = 'opacity';
    if (Browser.IE) {
      key = 'filter';
      value = 'alpha(opacity='+ value * 100 +')';
    }
    this.style[key] = value;
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
    return this._getStyle(this.style, key) || this._getStyle(this.computedStyles(), key);
  },
  
  /**
   * returns the hash of computed styles for the element
   *
   * @return Object/CSSDefinition computed styles
   */
  computedStyles: function() {
    //     old IE,              IE8,                 W3C
    return this.currentStyle || this.runtimeStyle || this.ownerDocument.defaultView.getComputedStyle(this, null) || {};
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
        if (style[key]) {
          value = style[key];
        } else {
          var values = $w('top right bottom left').map(function(name) {
            var tokens = key.underscored().split('_'); tokens.splice(1, 0, name);
            return style[tokens.join('_').camelize()];
          }).uniq();

          if (values.length == 1) {
            value = values[0];
          }
        }
        
        // Opera returns named colors with quotes
        if (value && Browser.Opera && key.match(/color/i)) {
          var match = value.match(/"(.+?)"/);
          value = match ? match[1] : value;
        }
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
    return (' '+this.className+' ').indexOf(' '+name+' ') != -1;
    
    return this.className && this.className.match(new RegExp('(^|\\s)'+ name + '(\\s|$)'));
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
    if ((' '+this.className+' ').indexOf(' '+name+' ') == -1) {
      this.className += (this.className ? ' ' : '') + name;
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
    this.className = (' '+this.className+' ').replace(' '+name+' ', ' ').trim();
    //this.className = this.className.replace(new RegExp('(^|\\s)' + name + '(?:\\s|$)'), '$1');
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