/**
 * This class provides the basic effect for styles manipulation
 *
 * Credits:
 *   The idea is inspired by the Morph effect from
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Fx.Morph = new Class(Fx, (function() {
  // a list of common style names to compact the code a bit
  var Top = 'Top', Left = 'Left', Right = 'Right', Bottom = 'Bottom', Color = 'Color', Style = 'Style',
      Width = 'Width', Bg = 'background', Border = 'border', Pos = 'Position', BgColor = Bg + Color,
      BdStyle = Border + Style, BdColor = Border + Color, BdWidth = Border + Width;
  
  
  // adds variants to the style names list
  var add_variants = function(keys, key, variants) {
    for (var i=0; i < variants.length; i++)
      keys.push(key + variants[i]);
  };
  
  // parses the style hash into a processable format
  var parse_style = function(values) {
    var result = {}, re = /[\d\.\-]+/g, m;
    
    for (var key in values) {
      m = values[key].match(re);
      var value = m.map('toFloat');
      value.t = values[key].split(re);
      if (/^\d/.test(values[key]) && value.t[0] !== '') value.t.unshift('');
      for (var i=0; i < value.length; i++) {
        value.t.splice(i*2+1, 0, value[i]);
      }
      result[key] = value;
    }
    
    return result;
  };
  
return {

// protected  

  // parepares the effect
  prepare: function(style) {
    var keys   = this._styleKeys(style),
        before = this._cloneStyle(this.element, keys),
        after  = this._endStyle(style, keys);
    
    this._cleanStyles(before, after);
    
    this.before = parse_style(before);
    this.after  = parse_style(after);
  },
  
  render: function(delta) {
    var before, after, value, style = this.element.style;
    for (var key in this.after) {
      before = this.before[key];
      after  = this.after[key];
      
      for (var i=0; i < after.length; i++) {
        value = before[i] + (after[i] - before[i]) * delta;
        if (after.t[0] === 'rgb(') value = Math.round(value);
        after.t[i*2+1] = ''+value;
      }
      style[key] = after.t.join('');
    }
  },
  
  /**
   * Returns a hash of the end style
   *
   * @param Object style
   * @return Object end style
   */
  _endStyle: function(style, keys) {
    var parent = this.element.parentNode,
        dummy  = $(this.element.cloneNode(true)).setStyle(style);
        
    // swapping the element with the dummy and getting the new styles
    if (parent) parent.replaceChild(dummy, this.element);
    var after  = this._cloneStyle(dummy, keys);
    if (parent) parent.replaceChild(this.element, dummy);
    
    return after;
  },
  
  /**
   * Fast styles cloning
   *
   * @param Element element
   * @param Array style keys
   * @return Hash of styles
   */
  _cloneStyle: function(element, keys) {
    for (var i=0, len = keys.length, style = element.computedStyles(), clean = {}; i < len; i++)
      clean[keys[i]] = style[keys[i]];
    
    return clean;
  },
  
  /**
   * creates an appropriate style-keys list out of the user styles
   *
   * @param Object the style hash
   * @return Array of clean style keys list
   */
  _styleKeys: function(style) {
    var keys = [], border_types = [Style, Color, Width], directions = [Top, Left, Right, Bottom];
      
    for (var key in style) {
      if (key.startsWith(Border))
        for (var i=0; i < border_types.length; i++)
          for (var j=0; j < directions.length; j++)
            keys.push(Border + directions[j] + border_types[i]);
      else if (key === 'margin' || key === 'padding')
        add_variants(keys, key, directions);
      else if (key.startsWith(Bg))
        add_variants(keys, Bg, [Color, Pos, Pos+'X', Pos+'Y']);
      else if (key === 'opacity' && Browser.IE)
        keys.push('filter');
      else
        keys.push(key);
    }
    
    return keys;
  },
  
  /**
   * cleans up and optimizies the styles
   *
   * @param Object before
   * @param Object after
   * @return void
   */
  _cleanStyles: function(before, after) {
    var remove = [];
    
    for (var key in after) {
      // getting directional options together so they were processed faster
      if (key.includes(Top)) {
        var top = key,
            left = key.replace(Top, Left),
            right = key.replace(Top, Right),
            bottom = key.replace(Top, Bottom),
            common = key.replace(Top, '');
            
        if (after[top] === after[left] && after[top] === after[right] &&  after[top] === after[bottom] &&
            before[top] === before[left] && before[top] === before[right] && before[top] === before[bottom]
        ) {
          after[common]  = after[top];
          before[common] = before[top];
          
          remove = remove.concat([top, left, right, bottom]);
        }
      }
      
      // checking the height/width options
      if (key === Width || key === 'height') {
        if (before[key] == 'auto') before[key] = this.element['offset'+key.capitalize()] + 'px';
      }
    }
    
    // IE opacity filter fix
    if (after.filter && !before.filter) before.filter = 'alpha(opacity=100)';
    
    // adjusting the border style
    if (before[BdStyle] != after[BdStyle]) {
      var style = this.element.style;
      
      if (before[BdStyle] == 'none') {
        style[BdWidth] = '0px';
      }
      
      style[BdStyle] = after[BdStyle];
      if (this._transp(before[BdColor])) {
        style[BdColor] = this.element.getStyle(Color);
      }
    }
    
    // cleaing up the list
    for (var key in after) {
      // proprocessing colors
      if (after[key] !== before[key] && !remove.includes(key) && /color/i.test(key)) {
        if (Browser.Opera) {
          after[key] = after[key].replace(/"/g, '');
          before[key] = before[key].replace(/"/g, '');
        }

        if (!this._transp(after[key]))  after[key]  = after[key].toRgb();
        if (!this._transp(before[key])) before[key] = before[key].toRgb();

        if (!after[key] || !before[key]) after[key] = before[key] = '';
      }
      
      // filling up the missing sizes
      if (/\d/.test(after[key]) && !/\d/.test(before[key])) before[key] = after[key].replace(/[\d\.\-]+/g, '0');
      
      // removing unprocessable keys
      if (after[key] === before[key] || remove.includes(key) || !/\d/.test(before[key]) || !/\d/.test(after[key])) {
        delete(after[key]);
        delete(before[key]);
      }
    }
  },
  
  // looking for the visible background color of the element
  _getBGColor: function(element) {
    return [element].concat(element.parents()).map(function(node) {
      var bg = node.getStyle(BgColor);
      return (bg && !this._transp(bg)) ? bg : null; 
    }, this).compact().first() || '#FFF';
  },
  
  
  // checks if the color is transparent
  _transp: function(color) {
    return color === 'transparent' || color === 'rgba(0, 0, 0, 0)';
  }
  
}})());

