/**
 * Konqueror browser fixes
 *
 * Copyright (C) 2009-2011 Nikolay V. Nemshilov
 */

/**
 * manual position calculator, it works for Konqueror and also
 * for old versions of Opera and FF
 */
if (!RightJS.$E('p')._.getBoundingClientRect) {
  RightJS.Element.include({
    position: function() {
      var element  = this._,
          top      = element.offsetTop,
          left     = element.offsetLeft,
          parent   = element.offsetParent;

      while (parent) {
        top  += parent.offsetTop;
        left += parent.offsetLeft;

        parent = parent.offsetParent;
      }

      return {x: left, y: top};
    }
  });
}
