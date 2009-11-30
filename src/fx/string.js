/**
 * There are the String unit extensions for the effects library
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
String.COLORS = {
  maroon:  '#800000',
  red:     '#ff0000',
  orange:  '#ffA500',
  yellow:  '#ffff00',
  olive:   '#808000',
  purple:  '#800080',
  fuchsia: '#ff00ff',
  white:   '#ffffff',
  lime:    '#00ff00',
  green:   '#008000',
  navy:    '#000080',
  blue:    '#0000ff',
  aqua:    '#00ffff',
  teal:    '#008080',
  black:   '#000000',
  silver:  '#c0c0c0',
  gray:    '#808080',
  brown:   '#a52a2a'
};

$ext(String.prototype, {
  /**
   * converts a #XXX or rgb(X, X, X) sring into standard #XXXXXX color string
   *
   * @return String hex color
   */
  toHex: function() {
    var match = /^#(\w)(\w)(\w)$/.exec(this);
    
    if (match) {
      match = "#"+ match[1]+match[1]+match[2]+match[2]+match[3]+match[3];
    } else if (match = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(this)) {
      match = "#"+ match.slice(1).map(function(bit) {
        bit = (bit-0).toString(16);
        return bit.length == 1 ? '0'+bit : bit;
      }).join('');
    } else {
      match = String.COLORS[this] || this;
    }
    
    return match;
  },
  
  /**
   * converts a hex string into an rgb array
   *
   * @param boolean flag if need an array
   * @return String rgb(R,G,B) or Array [R,G,B]
   */
  toRgb: function(array) {
    var match = /#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(this.toHex()||'');
    
    if (match) {
      match = match.slice(1).map('toInt', 16);
      match = array ? match : match.toRgb();
    }
    
    return match;
  }
});