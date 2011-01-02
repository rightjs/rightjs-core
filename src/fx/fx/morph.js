/**
 * This class provides the basic effect for styles manipulation
 *
 * Copyright (C) 2008-2010 Nikolay Nemshilov
 */

// NOTE: OPERA needs those attributes camelized
//       and as the darn thing is pretty buggy we won't
//       use their css-transitions for now
var native_fx_prefix = ['-webkit-', '-o-', '-moz-', '-ms-', ''].first(function(name) {
  return name + 'transition' in HTML.style;
}),
native_fx_transition = native_fx_prefix     + 'transition',
native_fx_property   = native_fx_transition + '-property',
native_fx_duration   = native_fx_transition + '-duration',
native_fx_function   = native_fx_transition + '-timing-function',

// basic transition algorithm replacements
native_fx_functions  = {
  Sin: 'cubic-bezier(.3,0,.6,1)',
  Cos: 'cubic-bezier(0,.3,.6,0)',
  Log: 'easy-out',
  Exp: 'easy-in',
  Lin: 'linear'
};

Fx.Morph = new Class(Fx, {

  prepare: function(style) {
    var old_style = Object.only(
      this.element.computedStyles(),
      native_fx_property,
      native_fx_duration,
      native_fx_function
    ), element_style = this.element._.style;

    function reset() {
      for (var key in old_style) {
        element_style[key] = old_style[key];
      }
    }

    this
      .onFinish(reset)
      .onCancel(function() { reset();
        element_style[native_fx_property] = 'none';
      });

    // setting up the transition
    element_style[native_fx_property] = 'all';
    element_style[native_fx_duration] = this.duration +'ms';
    element_style[native_fx_function] = native_fx_functions[this.options.transition] || this.options.transition;

    this.element.setStyle(style);
  }
});

if (native_fx_prefix === undefined) {

// a list of common style names to compact the code a bit
var directions = $w('Top Left Right Bottom');

// adds variants to the style names list
function add_variants(keys, key, variants) {
  for (var i=0; i < variants.length; i++) {
    keys.push(key + variants[i]);
  }
}

// checks if the color is transparent
function is_transparent(color) {
  return color === 'transparent' || color === 'rgba(0, 0, 0, 0)';
}

// adjusts the border-styles
function check_border_styles(element, before, after) {
  for (var i=0; i < 4; i++) {
    var direction = directions[i],
      bd_style = 'border' + direction + 'Style',
      bd_width = 'border' + direction + 'Width',
      bd_color = 'border' + direction + 'Color';

    if (bd_style in before && before[bd_style] != after[bd_style]) {
      var style = element._.style;

      if (before[bd_style] == 'none') {
        style[bd_width] = '0px';
      }

      style[bd_style] = after[bd_style];
      if (is_transparent(before[bd_color])) {
        style[bd_color] = element.getStyle('Color');
      }
    }
  }
}

// parses the style hash into a processable format
function parse_style(values) {
  var result = {}, re = /[\d\.\-]+/g, m, key, value, i;

  for (key in values) {
    m = values[key].match(re);
    value = m.map('toFloat');
    value.t = values[key].split(re);
    value.r = value.t[0] === 'rgb(';

    if (value.t.length == 1) { value.t.unshift(''); }

    for (i=0; i < value.length; i++) {
      value.t.splice(i*2 + 1, 0, value[i]);
    }
    result[key] = value;
  }

  return result;
}

// cleans up and optimizies the styles
function clean_styles(element, before, after) {
  var remove = [], key;

  for (key in after) {
    // checking the height/width options
    if ((key == 'width' || key == 'height') && before[key] == 'auto') {
      before[key] = element._['offset'+key.capitalize()] + 'px';
    }
  }

  // IE opacity filter fix
  if (after.filter && !before.filter) {
    before.filter = 'alpha(opacity=100)';
  }

  // adjusting the border style
  check_border_styles(element, before, after);

  // cleaing up the list
  for (key in after) {
    // proprocessing colors
    if (after[key] !== before[key] && !remove.include(key) && /color/i.test(key)) {
      if (Browser.Opera) {
        after[key] = after[key].replace(/"/g, '');
        before[key] = before[key].replace(/"/g, '');
      }

      if (!is_transparent(after[key]))  { after[key]  = after[key].toRgb(); }
      if (!is_transparent(before[key])) { before[key] = before[key].toRgb(); }

      if (!after[key] || !before[key]) {  after[key] = before[key] = ''; }
    }

    // filling up the missing size
    if (/\d/.test(after[key]) && !/\d/.test(before[key])) {
      before[key] = after[key].replace(/[\d\.\-]+/g, '0');
    }

    // removing unprocessable keys
    if (after[key] === before[key] || remove.include(key) || !/\d/.test(before[key]) || !/\d/.test(after[key])) {
      delete(after[key]);
      delete(before[key]);
    }
  }
}

/**
 * creates an appropriate style-keys list out of the user styles
 *
 * @param Object the style hash
 * @return Array of clean style keys list
 */
function style_keys(style) {
  var keys = [], border_types = ['Style', 'Color', 'Width'], key, i, j;

  for (key in style) {
    if (key.startsWith('border')) {
      for (i=0; i < border_types.length; i++) {
        for (j=0; j < directions.length; j++) {
          keys.push('border' + directions[j] + border_types[i]);
        }
      }
    } else if (key == 'margin' || key == 'padding') {
      add_variants(keys, key, directions);
    } else if (key.startsWith('background')) {
      add_variants(keys, 'background', ['Color', 'Position', 'PositionX', 'PositionY']);
    } else if (key == 'opacity' && Browser.IE) {
      keys.push('filter');
    } else {
      keys.push(key);
    }
  }

  return keys;
}

Fx.Morph = new Class(Fx, {

// protected

  // parepares the effect
  prepare: function(style) {
    var keys   = style_keys(style),
        before = this._cloneStyle(this.element, keys),
        after  = this._endStyle(style, keys);

    clean_styles(this.element, before, after);

    this.before = parse_style(before);
    this.after  = parse_style(after);
  },

  render: function(delta) {
    var before, after, value, style = this.element._.style, key, i, l;
    for (key in this.after) {
      before = this.before[key];
      after  = this.after[key];

      for (i=0, l = after.length; i < l; i++) {
        value = before[i] + (after[i] - before[i]) * delta;
        if (after.r) {
          value = Math.round(value);
        }
        after.t[i*2 + 1] = value;
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
    var element = this.element,
        dummy   = element.clone()
        .setStyle('position:absolute;z-index:-1;visibility:hidden')
        .setWidth(element.size().x)
        .setStyle(style);

    if (element.parent()) {
      element.insert(dummy, 'before');
    }

    var after  = this._cloneStyle(dummy, keys);

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
    for (var i=0, len = keys.length, style = element.computedStyles(), clean = {}, key; i < len; i++) {
      key = keys[i];
      if (key in style) {
        clean[key] = ''+ style[key];
      }

      // libwebkit bug fix for in case of languages pack applied
      if (key === 'opacity') {
        clean[key] = clean[key].replace(',', '.');
      }
    }

    return clean;
  }
});

}