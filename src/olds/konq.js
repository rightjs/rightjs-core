/**
 * Konqueror browser fixes
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */

/**
 * manual position calculator, it works for Konqueror and also
 * for old versions of Opera and FF
 */
if (!$E('p').getBoundingClientRect) {
  Element.include({
    position: function() {
      var left = this.offsetLeft, top = this.offsetTop, position = this.getStyle('position'),
        parent = this.parentNode, body = this.ownerDocument.body;
      
      // getting the parent node position
      while (parent && parent.tagName) {
        if (parent === body || parent.getStyle('position') != 'static') {
          if (parent !== body || position != 'absolute') {
            var subset = parent.position();
            left += subset.x;
            top  += subset.y;
          }
          break;
        }
        parent = parent.parentNode;
      }
      
      return {x: left, y: top};
    }
  });
}
