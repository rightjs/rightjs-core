/**
 * This class provides the basic effect for styles manipulation
 *
 * Credits:
 *   The idea is inspired by the Morph effect from
 *     - MooTools  (http://mootools.net)      Copyright (C) Valerio Proietti
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
Fx.Morph = new Class(Fx, (function() {
  // a list of common style names to compact the code a bit
  var Color = 'Color', Style = 'Style', Width = 'Width', Bg = 'background',
      Border = 'border', Pos = 'Position', BgColor = Bg + Color,
      directions = $w('Top Left Right Bottom');
  
  
  // adds variants to the style names list
  function add_variants(keys, key, variants) {
    for (var i=0; i < variants.length; i++)
      keys.push(key + variants[i]);
  };
  
  // adjusts the border-styles
  function check_border_styles(before, after) {
    for (var i=0; i < 4; i++) {
      var direction = directions[i],
        bd_style = Border + direction + Style,
        bd_width = Border + direction + Width,
        bd_color = Border + direction + Color;
      
      if (before[bd_style] != after[bd_style]) {
        var style = this.element.style;

        if (before[bd_style] == 'none') {
          style[bd_width] = '0px';
        }

        style[bd_style] = after[bd_style];
        if (this._transp(before[bd_color])) {
          style[bd_color] = this.element.getStyle(Color);
        }
      }
    }
  };
  
  // parses the style hash into a processable format
  function parse_style(values) {
    var result = {}, re = /[\d\.\-]+/g, m, key, value, i;
    
    for (key in values) {
      m = values[key].match(re);
      value = m.map('toFloat');
      value.t = values[key].split(re);
      value.r = value.t[0] === 'rgb(';
      if (value.t[0] === '' || value.r) value.t.shift();
      for (i=0; i < value.length; i++) {
        value.t.splice(i*2, 0, value[i]);
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
    var before, after, value, style = this.element.style, key, i;
    for (key in this.after) {
      before = this.before[key];
      after  = this.after[key];
      
      for (i=0; i < after.length; i++) {
        value = before[i] + (after[i] - before[i]) * delta;
        if (after.r) value = Math.round(value);
        after.t[i*2] = value;
      }
      value = after.t.join('');
      if (after.r) value = 'rgb('+value;
      style[key] = value;
    }
  },
  
  /**
   * Returns a hash of the end style
   *
   * @param Object style
   * @return Object end style
   */
  _endStyle: function(style, keys) {
    var dummy  = $(this.element.cloneNode(true))
        .setStyle('position:absolute;z-index:-1;visibility:hidden')
        .insertTo(this.element, 'before')
        .setWidth(this.element.sizes().x)
        .setStyle(style),
    
    after  = this._cloneStyle(dummy, keys);
    
    dummy.remove();
    
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
    var keys = [], border_types = [Style, Color, Width], key, i, j;
      
    for (key in style) {
      if (key.startsWith(Border))
        for (i=0; i < border_types.length; i++)
          for (j=0; j < directions.length; j++)
            keys.push(Border + directions[j] + border_types[i]);
      else if (key == 'margin' || key == 'padding')
        add_variants(keys, key, directions);
      else if (key.startsWith(Bg))
        add_variants(keys, Bg, [Color, Pos, Pos+'X', Pos+'Y']);
      else if (key == 'opacity' && Browser.IE)
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
    var remove = [], key;
    
    for (key in after) {
      // checking the height/width options
      if ((key == 'width' || key == 'height') && before[key] == 'auto') {
        before[key] = this.element['offset'+key.capitalize()] + 'px';
      }
    }
    
    // IE opacity filter fix
    if (after.filter && !before.filter) before.filter = 'alpha(opacity=100)';
    
    // adjusting the border style
    check_border_styles.call(this, before, after);
    
    // cleaing up the list
    for (key in after) {
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

