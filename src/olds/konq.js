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
      var element = this._, left = element.offsetLeft, top = element.offsetTop,
        position = this.getStyle('position'),
        parent = RightJS.$(element.parentNode), body = element.ownerDocument.body;
      
      // getting the parent node position
      while (parent && parent instanceof Element) {
        if (parent._ === body || parent.getStyle('position') !== 'static') {
          if (parent._ !== body || position !== 'absolute') {
            var subset = parent.position();
            left += subset.x;
            top  += subset.y;
          }
          break;
        }
        parent = $(parent.parentNode);
      }
      
      return {x: left, y: top};
    }
  });
}
