/**
 * This class provides the basic effect for styles manipulation
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Fx.Morph = new Class(Fx, {
  extend: {
    STYLES: $w('width height lineHeight opacity borderWidth borderColor padding margin color fontSize backgroundColor marginTop marginLeft marginRight marginBottom top left right bottom')
  },

// protected
  
  /**
   * starts the effect
   *
   * @param mixed an Object with an end style or a string with the end class-name(s)
   * @return Fx this
   */
  prepare: function(style) {
    this.endStyle   = this._findStyle(style);
    this.startStyle = this._getStyle(this.element, Object.keys(this.endStyle));

    this._cleanStyles(this.startStyle, this.endStyle);
    
    return Object.empty(this.endStyle) ? this.finish() : this.$super();
  },
  
  render: function(delta) {
    var style = {}, value;
    
    for (var key in this.endStyle) {
      value = this._calcStyle(key, delta);
      if (key == 'opacity') {
        this.element.setOpacity(value);
      } else {
        this.element.style[key] = value;
      }
    }
  },
  
// private

  // calculates the current style value
  _calcStyle: function(key, delta) {
    var start = this.startStyle[key], end = this.endStyle[key];
    
    if (typeof(start) == 'number') {
      // handling floats like opacity
      return start + (end - start) * delta;
      
    } else if(start.length == 2) {
      // handling usual sizes with dimensions
      return (start[0] + (end[0] - start[0]) * delta) + end[1];
      
    } else if(start.length == 3) {
      // calculating colors
      return end.map(function(value, i) {
        return start[i] + (value - start[i]) * delta;
      }).toRgb();
    }
  },

  // finds the style definition by a css-selector string
  _findStyle: function(style) {
    var a_class = isString(style);
    
    Fx.Morph.$c = Fx.Morph.$c || $E('div', {style: "visibility:hidden;overflow:hidden;height:0;width:0"})
    Fx.Morph.$c.insertTo(this.element, 'after');
    
    var element = $(this.element.cloneNode(false)).insertTo(Fx.Morph.$c)[a_class ? 'addClass' : 'setStyle'](style);
    var result  = this._getStyle(element, a_class ? Fx.Morph.STYLES : Object.keys(style));
    
    if (a_class && ('width' in result || 'height' in result) ) {
      // fixing the width and heights
      var styles = element.computedStyles();
      var width  = element._getStyle(styles, 'width');
      var height = element._getStyle(styles, 'height');
      
      if (!width  || width == 'auto')  delete(result['width']);
      if (!height || height == 'auto') delete(result['height']);
    }
    
    // assigning the border style if the end style has a border
    var border_style = element.getStyle('borderTopStyle');
    var element_border_style = this.element.getStyle('borderTopStyle');
    if (border_style != element_border_style) {
      if (element_border_style  == 'none') {
        this.element.style.borderWidth =  '0px';
      }
      this.element.style.borderStyle = border_style;
      if (this.element.getStyle('borderColor') == 'transparent') {
        this.element.style.borderColor = this.element.getStyle('color');
      }
    }
    
    element.remove();
    
    return result;
  },
  
  // grabs computed styles with the given keys out of the element
  _getStyle: function(element, keys) {
    var style = {}, styles = element.computedStyles(), name;
    if (isString(keys)) { name = keys, keys = [keys]; }
    
    // keys preprocessing
    keys.map(function(key) {
      switch (key) {
        case 'background': return 'backgroundColor';
        case 'border':     return ['borderWidth', 'borderColor'];
        default:           return key;
      }
    }).flatten().each(function(key) {
      key = key.camelize();
      style[key] = element._getStyle(styles, key);
      
      if (style[key] == 'transparent' || style[key] == 'rgba(0, 0, 0, 0)') {
        style[key] = this._getBGColor(element);
      }
      
      if (!style[key] || style[key] == 'auto') {
        style[key] = key == 'width'  ? element.offsetWidth  + 'px' :
                     key == 'height' ? element.offsetHeight + 'px' : '';
      }
    }, this);
    
    return name ? style[name] : style;
  },
  
  // looking for the visible background color of the element
  _getBGColor: function(element) {
    return [element].concat(element.parents()).map(function(node) {
      var bg = node.getStyle('backgroundColor');
      return (bg && bg != 'transparent' && bg != 'rgba(0, 0, 0, 0)') ? bg : null; 
    }).compact().first() || 'rgb(255,255,255)';
  },
  
  // prepares the style values to be processed correctly
  _cleanStyles: function() {
    // filling up missing styles
    for (var key in this.endStyle) {
      if (this.startStyle[key] === '' && this.endStyle[key].match(/^[\d\.\-]+[a-z]+$/)) {
        this.startStyle[key] = '0px';
      }
    }
    
    $A(arguments).each(this._cleanStyle, this);
    
    // removing duplications between start and end styles
    for (var key in this.endStyle) {
      if (this.endStyle[key] instanceof Array ?
         this.endStyle[key].join() === this.startStyle[key].join() :
         this.endStyle[key] === this.startStyle[key]) {
        delete(this.endStyle[key]);
        delete(this.startStyle[key]);
      }
    }
  },
  
  // cleans up a style object
  _cleanStyle: function(style) {
    var match;
    for (var key in style) {
      if (Fx.Morph.STYLES.includes(key) && style[key] !== '') {
        style[key] = String(style[key]);
        
        if (key.match(/color/i)) {
          // preparing the colors
          style[key] = style[key].toRgb(true);
          if (!style[key]) delete(style[key]);
        } else if (style[key].match(/^[\d\.]+$/)) {
          // preparing numberic values
          style[key] = style[key].toFloat();
        } else if (match = style[key].match(/^([\d\.\-]+)([a-z]+)$/i)) {
          // preparing values with dimensions
          style[key] = [match[1].toFloat(), match[2]];
        }
        
      } else {
        delete(style[key]);
      }
    }
  }
});