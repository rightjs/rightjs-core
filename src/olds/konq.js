/**
 * Konqueror browser fixes
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */

/**
 * manual position calculator, it works for Konqueror and also
 * old versions of Opera and FF, so we use a feature check in here
 */
if (!$E('p').getBoundingClientRect) {
  Element.addMethods({
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
