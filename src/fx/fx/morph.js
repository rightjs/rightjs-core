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

  // parepares the effect
  prepare: function(style) {
    var before = this._cloneStyle(this.element),
        after  = this._endStyle(style);
    
    this._cleanStyles(before, after);
    
    this.before = this._parse(before);
    this.after  = this._parse(after);
  },
  
  render: function(delta) {
    var before, after;
    for (var key in this.after) {
      before = this.before[key];
      after  = this.after[key];
      
      for (var i=0, len=after.length, value; i < len; i++) {
        value = before[i] + (after[i] - before[i]) * delta;
        if (after.t[0] === 'rgb(') value = Math.round(value);
        after.t[i*2+1] = value;
      }
      this.element.style[key] = after.t.join('');
    }
  },
  
  /**
   * Parses out the numericals out of the style values and nukes non-processables
   *
   * It kinda splits the values onto tokens and creates a list of numeric values
   * that will be later processed inserted into the list of tokens and joined back
   *
   * @param Object raw styles
   * @return Object parsed values
   */
  _parse: function(values) {
    var result = {}, re = /[\d\.\-]+/g, m;
    
    for (var key in values) {
      if (m = values[key].match(re)) {
        var value = m.map('toFloat');
        value.t = values[key].split(re);
        if (/^\d/.test(values[key]) && !value.t[0] !== '') value.t.unshift('');
        for (var i=0; i < value.length; i++) {
          value.t.splice(i*2+1, 0, value[i]);
        }
        result[key] = value;
      }
    }
    
    return result;
  },
    
  /**
   * fast clone for element's styles
   * NOTE: don't do anything fancy in here, it supposed to work as fast a possible
   *
   * @param Element element
   * @return Object style
   */
  _cloneStyle: function(element) {
    var style = element.computedStyles(), clean = {};
    
    if (style.length && style[0]) {
      for (var i=0, len=style.length, key; i < len; i++) {
        key = style[i];
        if (key.slice(0,1) !== '-') {
          key = key.replace(/\-[a-z]/g, function(m) { return m[1].toUpperCase() });
          clean[key] = style[key];
        }
      }
    } else {
      for (var key in style) {
        if (typeof style[key] === 'string' && key.slice(0,3) !== 'Moz')
          clean[key] = style[key];
      }
    }
    
    return clean;
  },
  
  /**
   * Returns a hash of the end style
   *
   * @param Object style
   * @return Object end style
   */
  _endStyle: function(style) {
    var parent = this.element.parentNode,
        dummy  = $(this.element.cloneNode(true)).setStyle(style);
        
    // swapping the element with the dummy and getting the new styles
    if (parent) parent.replaceChild(dummy, this.element);
    var after  = this._cloneStyle(dummy);
    if (parent) parent.replaceChild(this.element, dummy);
    
    return after;
  },
  
  /**
   * cleans up and optimizies the styles
   *
   * @param Object before
   * @param Object after
   * @return void
   */
  _cleanStyles: function(before, after) {
    var remove = ['outline'];
    
    for (var key in after) {
      // getting directional options together so they were processed faster
      if (key.includes('Top')) {
        var top = key,
            left = key.replace('Top', 'Left'),
            right = key.replace('Top', 'Right'),
            bottom = key.replace('Top', 'Bottom'),
            common = key.replace('Top', '');
            
        if (after[top] === after[left] && after[top] === after[right] &&  after[top] === after[bottom] &&
            before[top] === before[left] && before[top] === before[right] && before[top] === before[bottom]
        ) {
          after[common]  = after[top];
          before[common] = before[top];
          
          remove = remove.concat([top, left, right, bottom]);
        }
      }
      
      // checking the height/width options
      if (key === 'width' || key === 'height') {
        if (before[key] == 'auto') before[key] = this.element['offset'+key.capitalize()] + 'px';
      }
    }
    
    // IE opacity filter fix
    if (after.filter && !before.filter) before.filter = 'alpha(opacity=100)';
    
    // adjusting the border style
    if (before.borderStyle != after.borderStyle) {
      if (before.borderStyle == 'none') {
        this.element.style.borderWidth =  '0px';
      }
      this.element.style.borderStyle = after.borderStyle;
      if (this._transp(before.borderColor)) {
        this.element.style.borderColor = this.element.getStyle('color');
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
      
      if (after[key] === before[key] || remove.includes(key) || !/\d/.test(before[key]) || !/\d/.test(after[key])) {
        delete(after[key]);
        delete(before[key]);
      }
    }
  },
  
  // looking for the visible background color of the element
  _getBGColor: function(element) {
    return [element].concat(element.parents()).map(function(node) {
      var bg = node.getStyle('backgroundColor');
      return (bg && !this._transp(bg)) ? bg : null; 
    }, this).compact().first() || '#FFF';
  },
  
  
  // checks if the color is transparent
  _transp: function(color) {
    return color === 'transparent' || color === 'rgba(0, 0, 0, 0)';
  }
  
});