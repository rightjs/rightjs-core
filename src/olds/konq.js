/**
 * Konqueror browser fixes
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */

/**
 * manual position calculator, it works for Konqueror and also
 * for old versions of Opera and FF
 */
if (!RightJS.$E('p').getBoundingClientRect) {
  RightJS.Element.include({
    position: function() {
      var element  = this._,
          top      = element.offsetTop,
          left     = element.offsetLeft, 
          position = this.getStyle('position'),
          parent   = this.parent(),
          body     = element.ownerDocument.body;
      
      // getting the parent node position
      while (parent && parent._.tagName) {
        if (parent._ === body   || parent.getStyle('position') !== 'static') {
          if (parent._ !== body || (position !== 'absolute' && position !== 'relative')) {
            var subset = parent.position();
            left += subset.x;
            top  += subset.y;
          }
          break;
        }
        parent = parent.parent();
      }
      
      return {x: left, y: top};
    }
  });
}
