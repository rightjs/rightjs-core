/**
 * This class provides the basic effect for styles manipulation
 *
 * Credits:
 *   The idea is inspired by the Morph effect from
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Fx.Morph = new Class(Fx, {

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
    
    this._cleanStyles();
    
    return this.$super();
  },
  
  render: function(delta) {
    var value, start, end;
    
    for (var key in this.endStyle) {
      start = this.startStyle[key];
      end   = this.endStyle[key];

      if (typeof(start) == 'number') {
        // handling floats like opacity
        value = start + (end - start) * delta;
        
      } else if(start.length == 2) {
        // handling usual sizes with dimensions
        value = (start[0] + (end[0] - start[0]) * delta) + end[1];

      } else if(start.length == 3) {
        // calculating colors
        value = end.map(function(value, i) {
          return start[i] + (value - start[i]) * delta;
        }).toRgb();
      }
      
      if (key == 'opacity') {
        this.element.setOpacity(value);
      } else {
        this.element.style[key] = value;
      }
    }
  },
  
// private

  // finds the style definition by a css-selector string
  _findStyle: function(style) {
    var a_class = isString(style);
    
    // a container for the styles extraction element
    var container = Fx.Morph.$c = (Fx.Morph.$c || $E('div', {style: "visibility:hidden;float:left;height:0;width:0"}));
    if (this.element.parentNode) this.element.parentNode.insertBefore(container, this.element);
    
    // a dummy node to calculate the end styles
    var element = $(this.element.cloneNode(false)).insertTo(container).setStyle(style);
    
    // grabbing the computed styles
    var element_styles      = element.computedStyles();
    var this_element_styles = this.element.computedStyles();
    
    // grabbing the element style
    var end_style = this._getStyle(element, Object.keys(style), element_styles);
    
    // assigning the border style if the end style has a border
    var border_style = element_styles.borderTopStyle, element_border_style = this_element_styles.borderTopStyle;
    if (border_style != element_border_style) {
      if (element_border_style  == 'none') {
        this.element.style.borderWidth =  '0px';
      }
      this.element.style.borderStyle = border_style;
      if (this._transp(this_element_styles.borderTopColor)) {
        this.element.style.borderColor = this_element_styles.color;
      }
    }
    
    element.remove();
    
    return end_style;
  },
  
  // grabs computed styles with the given keys out of the element
  _getStyle: function(element, keys, styles) {
    var style = {}, styles = styles || element.computedStyles(), name;
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
      
      if (this._transp(style[key])) {
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
      return (bg && !this._transp(bg)) ? bg : null; 
    }, this).compact().first() || 'rgb(255,255,255)';
  },
  
  // prepares the style values to be processed correctly
  _cleanStyles: function() {
    var end = this.endStyle, start = this.startStyle;
    
    // filling up missing styles
    for (var key in end) {
      if (start[key] === '' && /^[\d\.\-]+[a-z]+$/.test(end[key])) {
        start[key] = '0px';
      }
    }
    
    [end, start].each(this._cleanStyle, this);
    
    // removing duplications between start and end styles
    for (var key in end) {
      if (!defined(start[key]) || (end[key] instanceof Array ? end[key].join() === start[key].join() : end[key] === start[key])) {
        delete(end[key]);
        delete(start[key]);
      }
    }
  },
  
  // cleans up a style object
  _cleanStyle: function(style) {
    var match;
    for (var key in style) {
      style[key] = String(style[key]);
        
      if (/color/i.test(key)) {
        // preparing the colors
        style[key] = style[key].toRgb(true);
        if (!style[key]) delete(style[key]);
      } else if (/^[\d\.]+$/.test(style[key])) {
        // preparing numberic values
        style[key] = style[key].toFloat();
      } else if (match = style[key].match(/^([\d\.\-]+)([a-z]+)$/i)) {
        // preparing values with dimensions
        style[key] = [match[1].toFloat(), match[2]];
        
      } else {
        delete(style[key]);
      }
    }
  },
  
  // checks if the color is transparent
  _transp: function(color) {
    return color == 'transparent' || color == 'rgba(0, 0, 0, 0)';
  }
});